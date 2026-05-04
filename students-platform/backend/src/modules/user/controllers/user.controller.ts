import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService,getProfile,RegisterDTO,LoginDTO} from '../services';
import type { UserDoc } from '../models';
import { env } from '../../../config/env';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';

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

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const user = await userService.registerLocal({
        type: type as any,
        name,
        username,
        email,
        password,
      });


      const safeUser = userService.toSafeUser(user);

      return res.status(201).json({ message: 'Account created successfully ' });
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({ message: 'Email already in use' });
      }
      if (err.message === 'USERNAME_ALREADY_EXISTS') {
        return res.status(409).json({ message: 'Username already in use' });
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
          return res
            .status(400)
            .json({ message: 'Email and password are required' });
        }

        const user = await userService.validateLocalLogin({ email, password });

        const token = this.createToken(user);
        this.attachAuthCookie(res,token);
        const safeUser = userService.toSafeUser(user);

        return res.status(200).json({ message: 'Successfully' });
      } catch (err: any) {
        if (err.message === 'INVALID_CREDENTIALS') {
          return res.status(401).json({ message: 'Invalid email or password' });
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



}

export const userController = new UserController();
