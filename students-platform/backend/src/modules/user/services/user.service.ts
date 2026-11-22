import { User, type UserDoc } from '../models';
import type { UserType } from '../../../shared/types/domain';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { emailService } from '../../../shared/services/email.service';
import { env } from '../../../config/env';
import { universityService } from '../../university/services/university.service';

export interface RegisterDTO {
  type: UserType;       // 'Student' | 'StudySeeker' | 'Admin'
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface getProfile{
    user_id:string;
}

export interface getUserByUsername{
    username:string;
}

export interface ChangePasswordDTO {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface VerifyPasswordResetOtpDTO {
  email: string;
  otp: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileDTO {
  userId: string;
  name?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  country?: string;
  fieldOfStudy?: string;
  destinationCountry?: string;
  isAlumni?: boolean;
}



export type SafeUser = {
  id: string;
  type: UserType;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  country: string;
  fieldOfStudy: string;
  destinationCountry: string;
  hasOnboarded: boolean;
  isAlumni: boolean;
  isVerified: boolean;
  universityEmail: string | null;
};

export type PublicUser = {
  id: string;
  type: UserType;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  country: string;
  destinationCountry: string;
  fieldOfStudy: string;
};

export interface SavedUniversity {
  name: string;
  country: string;
  website: string;
}

export interface SavedScholarship {
  programName: string;
  schoolName: string;
  city: string;
  state: string;
  website: string;
}

export class UserService {
  async registerLocal(data: RegisterDTO): Promise<UserDoc> {
    const existingEmail = await User.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const existingUsername = await User.findOne({
      username: data.username.toLowerCase(),
    });
    if (existingUsername) {
      throw new Error('USERNAME_ALREADY_EXISTS');
    }

    const user = new User({
      ...data,
      provider: 'local',
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
    });

    const token = crypto.randomBytes(32).toString('hex');
    (user as any).activationToken = token;
    (user as any).activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    try {
      const activationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
      await emailService.sendActivationEmail({
        recipientEmail: user.email,
        recipientName: user.name,
        activationUrl,
      });
    } catch {
      // Email failure doesn't block registration
    }

    return user;
  }

  async validateLocalLogin({ email, password }: LoginDTO): Promise<UserDoc> {
      const user = await User.findByEmail(email);
      if (!user || !user.password) {
        throw new Error('INVALID_CREDENTIALS');
      }

      const ok = await user.comparePassword(password);
      if (!ok) {
        throw new Error('INVALID_CREDENTIALS');
      }

      if (!user.isVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      return user;
    }

   async validateGetProfile({ user_id }: getProfile): Promise<UserDoc> {
          const user = await User.findById(user_id);
             if (!user) {
                throw new Error('USER_NOT_FOUND');
              }
           return user;
    }

    async getUserByUsername({ username }: getUserByUsername): Promise<UserDoc> {
          const user = await User.findOne({ username: username.toLowerCase() });
             if (!user) {
                throw new Error('USER_NOT_FOUND');
              }
           return user;
    }

    async changePassword({ userId, currentPassword, newPassword, confirmPassword }: ChangePasswordDTO): Promise<void> {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      if (!user.password) {
        throw new Error('PASSWORD_NOT_SET');
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('INCORRECT_CURRENT_PASSWORD');
      }

      user.password = newPassword;
      await user.save();
    }

    async updateProfile({ userId, name, bio, location, avatar, country, fieldOfStudy, destinationCountry, isAlumni }: UpdateProfileDTO): Promise<UserDoc> {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      if (name !== undefined) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (location !== undefined) user.location = location;
      if (avatar !== undefined) user.avatar = avatar;
      if (country !== undefined) (user as any).country = country;
      if (fieldOfStudy !== undefined) (user as any).fieldOfStudy = fieldOfStudy;
      if (destinationCountry !== undefined) (user as any).destinationCountry = destinationCountry;
      if (isAlumni !== undefined) (user as any).isAlumni = isAlumni;

      await user.save();
      return user;
    }


  toSafeUser(user: UserDoc): SafeUser {
    return {
      id: user._id.toString(),
      type: user.type as UserType,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      country: (user as any).country || '',
      fieldOfStudy: (user as any).fieldOfStudy || '',
      destinationCountry: (user as any).destinationCountry || '',
      hasOnboarded: (user as any).hasOnboarded || false,
      isAlumni: (user as any).isAlumni || false,
      isVerified: user.isVerified,
      universityEmail: user.universityEmail ?? null,
    };
  }

  toPublicUser(user: any): PublicUser {
    return {
      id: user._id.toString(),
      type: user.type as UserType,
      name: user.name,
      username: user.username,
      avatar: user.avatar || '',
      bio: user.bio || '',
      country: user.country || '',
      destinationCountry: user.destinationCountry || '',
      fieldOfStudy: user.fieldOfStudy || '',
    };
  }

  async searchUsers(query: string, filters?: { country?: string; destinationCountry?: string }): Promise<PublicUser[]> {
    const conditions: any[] = [];

    if (query && query.trim()) {
      conditions.push({
        $or: [
          { name: { $regex: query.trim(), $options: 'i' } },
          { username: { $regex: query.trim(), $options: 'i' } },
        ],
      });
    }

    if (filters?.country) {
      conditions.push({ country: { $regex: filters.country.trim(), $options: 'i' } });
    }

    if (filters?.destinationCountry) {
      conditions.push({ destinationCountry: { $regex: filters.destinationCountry.trim(), $options: 'i' } });
    }

    if (conditions.length === 0) return [];

    const mongoQuery = conditions.length === 1 ? conditions[0] : { $and: conditions };

    const users = await User.find(mongoQuery)
      .limit(30)
      .select('_id name username avatar bio type country destinationCountry fieldOfStudy');
    return users.map((u) => this.toPublicUser(u));
  }

  async getSavedUniversities(userId: string): Promise<SavedUniversity[]> {
    const user = await User.findById(userId).select('savedUniversities');
    if (!user) throw new Error('USER_NOT_FOUND');
    return (user as any).savedUniversities || [];
  }

  async saveUniversity(userId: string, data: SavedUniversity): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const saved: SavedUniversity[] = (user as any).savedUniversities || [];
    const alreadySaved = saved.some(
      (u) => u.name === data.name && u.country === data.country
    );
    if (alreadySaved) throw new Error('ALREADY_SAVED');
    await User.findByIdAndUpdate(userId, {
      $push: { savedUniversities: data },
    });
  }

  async unsaveUniversity(userId: string, name: string, country: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    await User.findByIdAndUpdate(userId, {
      $pull: { savedUniversities: { name, country } },
    });
  }

  async getSavedScholarships(userId: string): Promise<SavedScholarship[]> {
    const user = await User.findById(userId).select('savedScholarships');
    if (!user) throw new Error('USER_NOT_FOUND');
    return (user as any).savedScholarships || [];
  }

  async saveScholarship(userId: string, data: SavedScholarship): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const saved: SavedScholarship[] = (user as any).savedScholarships || [];
    const alreadySaved = saved.some(
      (s) => s.programName === data.programName && s.schoolName === data.schoolName
    );
    if (alreadySaved) throw new Error('ALREADY_SAVED');
    await User.findByIdAndUpdate(userId, {
      $push: { savedScholarships: data },
    });
  }

  async unsaveScholarship(userId: string, programName: string, schoolName: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    await User.findByIdAndUpdate(userId, {
      $pull: { savedScholarships: { programName, schoolName } },
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      activationToken: token,
      activationTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('INVALID_OR_EXPIRED_TOKEN');
    user.isVerified = true;
    (user as any).activationToken = undefined;
    (user as any).activationTokenExpires = undefined;
    await user.save();
  }

  async resendVerification(email: string): Promise<void> {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('USER_NOT_FOUND');
    if (user.isVerified) throw new Error('ALREADY_VERIFIED');
    const token = crypto.randomBytes(32).toString('hex');
    (user as any).activationToken = token;
    (user as any).activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    const activationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
    await emailService.sendActivationEmail({
      recipientEmail: user.email,
      recipientName: user.name,
      activationUrl,
    });
  }

  async submitStudentEmail(userId: string, email: string): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }

    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    if (user.type === 'Student' || user.universityEmail) {
      throw new Error('ALREADY_STUDENT_VERIFIED');
    }

    const domain = email.split('@')[1].toLowerCase();

    let domains: string[];
    try {
      domains = await universityService.getUniversityDomains(domain);
    } catch {
      throw new Error('UNIVERSITY_API_ERROR');
    }

    const isValid = domains.some(d => {
      const ud = d.toLowerCase();
      return domain === ud || domain.endsWith('.' + ud);
    });

    if (!isValid) {
      throw new Error('DOMAIN_NOT_UNIVERSITY');
    }

    const token = crypto.randomBytes(32).toString('hex');
    (user as any).pendingUniversityEmail = email.toLowerCase();
    (user as any).studentVerificationToken = token;
    (user as any).studentVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verificationUrl = `${env.FRONTEND_URL}/verify-student-email/${token}`;
    emailService.sendStudentVerificationEmail({
      recipientEmail: email,
      recipientName: user.name,
      verificationUrl,
    }).catch(() => {});
  }

  async verifyStudentEmail(token: string): Promise<void> {
    const user = await User.findOne({
      studentVerificationToken: token,
      studentVerificationTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('INVALID_OR_EXPIRED_TOKEN');

    user.universityEmail = (user as any).pendingUniversityEmail;
    user.type = 'Student';
    (user as any).pendingUniversityEmail = undefined;
    (user as any).studentVerificationToken = undefined;
    (user as any).studentVerificationTokenExpires = undefined;
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findByEmail(email);
    if (!user || !user.isVerified || !user.password) {
      return;
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    (user as any).passwordResetOtp = otpHash;
    (user as any).passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    (user as any).passwordResetToken = undefined;
    (user as any).passwordResetExpires = undefined;
    await user.save();

    emailService.sendPasswordResetOtpEmail({
      recipientEmail: user.email,
      recipientName: user.name,
      otp,
    }).catch(() => {});
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<string> {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('INVALID_OTP');

    const otpHash: string | undefined = (user as any).passwordResetOtp;
    const otpExpires: Date | undefined = (user as any).passwordResetOtpExpires;

    if (!otpHash || !otpExpires || otpExpires < new Date()) {
      throw new Error('INVALID_OTP');
    }

    const isMatch = await bcrypt.compare(otp, otpHash);
    if (!isMatch) throw new Error('INVALID_OTP');

    const resetToken = crypto.randomBytes(32).toString('hex');
    (user as any).passwordResetOtp = undefined;
    (user as any).passwordResetOtpExpires = undefined;
    (user as any).passwordResetToken = resetToken;
    (user as any).passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('INVALID_OR_EXPIRED_TOKEN');

    user.password = newPassword;
    (user as any).passwordResetToken = undefined;
    (user as any).passwordResetExpires = undefined;
    await user.save();
  }

  async completeOnboarding(userId: string, data: { country: string; fieldOfStudy: string; destinationCountry: string }): Promise<UserDoc> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    (user as any).country = data.country;
    (user as any).fieldOfStudy = data.fieldOfStudy;
    (user as any).destinationCountry = data.destinationCountry;
    (user as any).hasOnboarded = true;
    await user.save();
    return user;
  }

  async getApplicationTracker(userId: string): Promise<any[]> {
    const user = await User.findById(userId).select('applicationTracker');
    if (!user) throw new Error('USER_NOT_FOUND');
    return (user as any).applicationTracker || [];
  }

  async addToTracker(userId: string, entry: { universityName: string; country?: string; website?: string }): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const item = { ...entry, status: 'Interested', notes: '', addedAt: new Date() };
    (user as any).applicationTracker.push(item);
    await user.save();
    const tracker = (user as any).applicationTracker;
    return tracker[tracker.length - 1];
  }

  async updateTrackerStatus(userId: string, entryId: string, status: string, notes?: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const entry = (user as any).applicationTracker.id(entryId);
    if (!entry) throw new Error('ENTRY_NOT_FOUND');
    entry.status = status;
    if (notes !== undefined) entry.notes = notes;
    await user.save();
    return entry;
  }

  async removeFromTracker(userId: string, entryId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    (user as any).applicationTracker.pull(entryId);
    await user.save();
  }
}

export const userService = new UserService();
