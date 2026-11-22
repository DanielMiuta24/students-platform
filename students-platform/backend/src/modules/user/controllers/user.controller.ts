import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService, getProfile, getUserByUsername, RegisterDTO, LoginDTO, ChangePasswordDTO, UpdateProfileDTO, ForgotPasswordDTO, VerifyPasswordResetOtpDTO, ResetPasswordDTO } from '../services';
import type { UserDoc } from '../models';
import { env } from '../../../config/env';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import type { UploadRequest } from '../../image/services/image.types';
import { imageService } from '../../image/services/image.service';

const JWT_SECRET = env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '7d';




class UserController {
  private createToken(user: UserDoc): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      type: user.type,
      provider: user.provider,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  private attachAuthCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  private clearAuthCookie(res: Response) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',

      });
    }



  register = async (
    req: Request<unknown, unknown, RegisterDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { type, name, username, email, password } = req.body;

      if (!name || !username || !email || !password) {
        return res.status(200).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const user = await userService.registerLocal({
        type: type as any,
        name,
        username,
        email,
        password,
      });


      const safeUser = userService.toSafeUser(user);

      return res.status(200).json({
        success: true,
        message: 'Account created successfully '
      });
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(200).json({
          success: false,
          message: 'Email already in use'
        });
      }
      if (err.message === 'USERNAME_ALREADY_EXISTS') {
        return res.status(200).json({
          success: false,
          message: 'Username already in use'
        });
      }
      return next(err);
    }
  };
  login = async (
      req: Request<unknown, unknown, LoginDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(200).json({
            success: false,
            message: 'Email and password are required'
          });
        }

        const user = await userService.validateLocalLogin({ email, password });

        const token = this.createToken(user);
        this.attachAuthCookie(res,token);
        const safeUser = userService.toSafeUser(user);

        return res.status(200).json({
          success: true,
          message: 'Successfully'
        });
      } catch (err: any) {
        if (err.message === 'INVALID_CREDENTIALS') {
          return res.status(200).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
        if (err.message === 'EMAIL_NOT_VERIFIED') {
          return res.status(200).json({
            success: false,
            message: 'Please verify your email address before logging in.'
          });
        }
        return next(err);
      }
    };

   logout = async (
       req: Request,
       res: Response,
       _next: NextFunction
     ) => {

       this.clearAuthCookie(res);
       return res.status(200).json({ message: 'Logged out successfully' });
     };


    getProfile = async (
          req:AuthenticatedRequest,
          res: Response,
          next: NextFunction
        ) => {
          try {
            if (!req.user) {
              return res.status(401).json({ message: 'Unauthorized' });
            }

            const payload: getProfile = {
                  user_id: req.user.id,
            };

            const user = await userService.validateGetProfile(payload);
            const safeUser = userService.toSafeUser(user);

            return res.status(200).json(safeUser);
          } catch (err: any) {
            if (err.message === 'USER_NOT_FOUND') {
              return res.status(401).json({ message: 'User not found' });
            }
            return next(err);
          }
        };

    getUserByUsername = async (
          req: Request,
          res: Response,
          next: NextFunction
        ) => {
          try {
            const { username } = req.params;

            if (!username) {
              return res.status(400).json({ message: 'Username is required' });
            }

            const payload: getUserByUsername = {
                  username,
            };

            const user = await userService.getUserByUsername(payload);
            const safeUser = userService.toSafeUser(user);

            return res.status(200).json(safeUser);
          } catch (err: any) {
            if (err.message === 'USER_NOT_FOUND') {
              return res.status(404).json({ message: 'User not found' });
            }
            return next(err);
          }
        };

  changePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;

      const payload: ChangePasswordDTO = {
        userId: req.user.id,
        currentPassword,
        newPassword,
        confirmPassword,
      };

      await userService.changePassword(payload);

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ message: 'User not found' });
      }
      if (err.message === 'INCORRECT_CURRENT_PASSWORD') {
        return res.status(403).json({ message: 'Current password is incorrect' });
      }
      if (err.message === 'PASSWORD_NOT_SET') {
        return res.status(400).json({ message: 'Password is not set for this account' });
      }
      return next(err);
    }
  };

  updateProfile = async (
    req: AuthenticatedRequest & UploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, bio, location, removeAvatar, country, fieldOfStudy, destinationCountry, isAlumni } = req.body;
      let avatarUrl: string | undefined;

      if (removeAvatar === 'true' || removeAvatar === true) {
        avatarUrl = '';
      } else if (req.files && req.files.length > 0) {
        const uploadResult = await imageService.uploadImageForAvatar(req.files[0]);
        avatarUrl = uploadResult.url;
      }

      const payload: UpdateProfileDTO = {
        userId: req.user.id,
        name,
        bio,
        location,
        avatar: avatarUrl,
        country,
        fieldOfStudy,
        destinationCountry,
        isAlumni: isAlumni !== undefined ? isAlumni === 'true' || isAlumni === true : undefined,
      };

      const updatedUser = await userService.updateProfile(payload);
      const safeUser = userService.toSafeUser(updatedUser);

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: safeUser
      });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ message: 'User not found' });
      }
      return next(err);
    }
  };

  searchUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query.q as string;
      if (!query || !query.trim()) {
        return res.status(200).json({ users: [] });
      }
      const users = await userService.searchUsers(query);
      return res.status(200).json(users);
    } catch (err: any) {
      return next(err);
    }
  };

  getSavedUniversities = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const universities = await userService.getSavedUniversities(req.user.id);
      return res.status(200).json(universities);
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      return next(err);
    }
  };

  saveUniversity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { name, country, website } = req.body;
      if (!name) return res.status(400).json({ message: 'University name is required' });
      await userService.saveUniversity(req.user.id, { name, country: country || '', website: website || '' });
      return res.status(200).json({ message: 'University saved' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      if (err.message === 'ALREADY_SAVED') return res.status(200).json({ message: 'Already saved' });
      return next(err);
    }
  };

  unsaveUniversity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { name, country } = req.body;
      if (!name) return res.status(400).json({ message: 'University name is required' });
      await userService.unsaveUniversity(req.user.id, name, country || '');
      return res.status(200).json({ message: 'University removed from saved' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      return next(err);
    }
  };

  getSavedScholarships = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const scholarships = await userService.getSavedScholarships(req.user.id);
      return res.status(200).json(scholarships);
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      return next(err);
    }
  };

  saveScholarship = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { programName, schoolName, city, state, website } = req.body;
      if (!programName) return res.status(400).json({ message: 'Program name is required' });
      await userService.saveScholarship(req.user.id, {
        programName,
        schoolName: schoolName || '',
        city: city || '',
        state: state || '',
        website: website || '',
      });
      return res.status(200).json({ message: 'Scholarship saved' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      if (err.message === 'ALREADY_SAVED') return res.status(200).json({ message: 'Already saved' });
      return next(err);
    }
  };

  unsaveScholarship = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { programName, schoolName } = req.body;
      if (!programName) return res.status(400).json({ message: 'Program name is required' });
      await userService.unsaveScholarship(req.user.id, programName, schoolName || '');
      return res.status(200).json({ message: 'Scholarship removed from saved' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      return next(err);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) return res.status(400).json({ message: 'Token is required' });
      await userService.verifyEmail(token);
      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (err: any) {
      if (err.message === 'INVALID_OR_EXPIRED_TOKEN') {
        return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired' });
      }
      return next(err);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required' });
      await userService.resendVerification(email);
      return res.status(200).json({ success: true, message: 'Verification email sent' });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'No account found with that email' });
      if (err.message === 'ALREADY_VERIFIED') return res.status(400).json({ message: 'This account is already verified' });
      return next(err);
    }
  };

  submitStudentEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { email } = req.body;
      await userService.submitStudentEmail(req.user.id, email);
      return res.status(200).json({ message: 'Verification email sent to your university address' });
    } catch (err: any) {
      if (err.message === 'INVALID_EMAIL_FORMAT') return res.status(400).json({ message: 'Invalid email format' });
      if (err.message === 'ALREADY_STUDENT_VERIFIED') return res.status(400).json({ message: 'Student email already verified' });
      if (err.message === 'DOMAIN_NOT_UNIVERSITY') return res.status(400).json({ message: 'Email domain is not a recognized university domain' });
      if (err.message === 'UNIVERSITY_API_ERROR') return res.status(502).json({ message: 'Unable to verify university domain, please try again' });
      if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
      return next(err);
    }
  };

  verifyStudentEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) return res.status(400).json({ message: 'Token is required' });
      await userService.verifyStudentEmail(token);
      return res.status(200).json({ success: true, message: 'Student email verified successfully' });
    } catch (err: any) {
      if (err.message === 'INVALID_OR_EXPIRED_TOKEN') {
        return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired' });
      }
      return next(err);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await userService.forgotPassword(email);
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.',
      });
    } catch (err: any) {
      return next(err);
    }
  };

  verifyPasswordResetOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const resetToken = await userService.verifyPasswordResetOtp(email, otp);
      return res.status(200).json({ success: true, resetToken });
    } catch (err: any) {
      if (err.message === 'INVALID_OTP') {
        return res.status(200).json({ success: false, message: 'Invalid or expired verification code.' });
      }
      return next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await userService.resetPassword(token, newPassword);
      return res.status(200).json({ success: true, message: 'Password reset successfully.' });
    } catch (err: any) {
      if (err.message === 'INVALID_OR_EXPIRED_TOKEN') {
        return res.status(200).json({ success: false, message: 'Reset session expired. Please start over.' });
      }
      return next(err);
    }
  };

  completeOnboarding = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { country, fieldOfStudy, destinationCountry } = req.body;
      if (!country || !fieldOfStudy || !destinationCountry) {
        return res.status(400).json({ message: 'country, fieldOfStudy and destinationCountry are required' });
      }
      const user = await userService.completeOnboarding(req.user.id, { country, fieldOfStudy, destinationCountry });
      return res.status(200).json(userService.toSafeUser(user));
    } catch (err) { return next(err); }
  };

  getTracker = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const tracker = await userService.getApplicationTracker(req.user.id);
      return res.status(200).json(tracker);
    } catch (err) { return next(err); }
  };

  addToTracker = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { universityName, country, website } = req.body;
      if (!universityName) return res.status(400).json({ message: 'universityName is required' });
      const entry = await userService.addToTracker(req.user.id, { universityName, country, website });
      return res.status(201).json(entry);
    } catch (err) { return next(err); }
  };

  updateTrackerEntry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { entryId } = req.params;
      const { status, notes } = req.body;
      const entry = await userService.updateTrackerStatus(req.user.id, entryId, status, notes);
      return res.status(200).json(entry);
    } catch (err: any) {
      if (err.message === 'ENTRY_NOT_FOUND') return res.status(404).json({ message: 'Entry not found' });
      return next(err);
    }
  };

  removeFromTracker = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const { entryId } = req.params;
      await userService.removeFromTracker(req.user.id, entryId);
      return res.status(200).json({ success: true });
    } catch (err) { return next(err); }
  };

}

export const userController = new UserController();
