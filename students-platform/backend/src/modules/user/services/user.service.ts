import { User, type UserDoc } from '../models';
import type { UserType } from '../../../shared/types/domain';
import crypto from 'crypto';
import { emailService } from '../../../shared/services/email.service';
import { env } from '../../../config/env';

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

export interface UpdateProfileDTO {
  userId: string;
  name?: string;
  bio?: string;
  location?: string;
  avatar?: string;
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
  isVerified: boolean;
};

export type PublicUser = {
  id: string;
  type: UserType;
  name: string;
  username: string;
  avatar: string;
  bio: string;
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

    async updateProfile({ userId, name, bio, location, avatar }: UpdateProfileDTO): Promise<UserDoc> {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      if (name !== undefined) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (location !== undefined) user.location = location;
      if (avatar !== undefined) user.avatar = avatar;

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
      isVerified: user.isVerified,
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
    };
  }

  async searchUsers(query: string): Promise<PublicUser[]> {
    if (!query || !query.trim()) return [];
    const users = await User.find({
      $or: [
        { name: { $regex: query.trim(), $options: 'i' } },
        { username: { $regex: query.trim(), $options: 'i' } },
      ],
    })
      .limit(20)
      .select('_id name username avatar bio type');
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
}

export const userService = new UserService();
