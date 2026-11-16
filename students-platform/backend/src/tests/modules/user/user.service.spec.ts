import { UserService } from '../../../modules/user/services/user.service';
import { User } from '../../../modules/user/models/user.model';
import { universityService } from '../../../modules/university/services/university.service';
import { emailService } from '../../../shared/services/email.service';

jest.mock('../../../modules/user/models/user.model');
jest.mock('../../../modules/university/services/university.service', () => ({
  universityService: {
    getUniversityDomains: jest.fn(),
  },
}));
jest.mock('../../../shared/services/email.service', () => ({
  emailService: {
    sendActivationEmail: jest.fn(),
    sendStudentVerificationEmail: jest.fn(),
  },
}));
jest.mock('../../../config/env', () => ({
  env: {
    FRONTEND_URL: 'http://localhost:5173',
    JWT_SECRET: 'test-secret',
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('submitStudentEmail', () => {
    const userId = 'user123';
    const validEmail = 'student@cs.uni-mannheim.de';
    const universityDomains = ['uni-mannheim.de', 'dhbw-mannheim.de'];

    const mockUser = {
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      universityEmail: null,
      save: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
      (User.findById as jest.Mock).mockResolvedValue({ ...mockUser, save: mockUser.save });
      (universityService.getUniversityDomains as jest.Mock).mockResolvedValue(universityDomains);
      (emailService.sendStudentVerificationEmail as jest.Mock).mockResolvedValue(undefined);
    });

    it('should throw INVALID_EMAIL_FORMAT for malformed email', async () => {
      await expect(
        userService.submitStudentEmail(userId, 'not-an-email')
      ).rejects.toThrow('INVALID_EMAIL_FORMAT');
    });

    it('should throw USER_NOT_FOUND when user does not exist', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        userService.submitStudentEmail(userId, validEmail)
      ).rejects.toThrow('USER_NOT_FOUND');
    });

    it('should throw ALREADY_STUDENT_VERIFIED when universityEmail is already set', async () => {
      (User.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        universityEmail: 'existing@uni-mannheim.de',
        save: mockUser.save,
      });
      await expect(
        userService.submitStudentEmail(userId, validEmail)
      ).rejects.toThrow('ALREADY_STUDENT_VERIFIED');
    });

    it('should throw UNIVERSITY_API_ERROR when university service fails', async () => {
      (universityService.getUniversityDomains as jest.Mock).mockRejectedValue(
        new Error('UNIVERSITY_API_ERROR')
      );
      await expect(
        userService.submitStudentEmail(userId, validEmail)
      ).rejects.toThrow('UNIVERSITY_API_ERROR');
    });

    it('should throw DOMAIN_NOT_UNIVERSITY when domain does not match any university', async () => {
      (universityService.getUniversityDomains as jest.Mock).mockResolvedValue(universityDomains);
      await expect(
        userService.submitStudentEmail(userId, 'user@fakeuni-mannheim.de')
      ).rejects.toThrow('DOMAIN_NOT_UNIVERSITY');
    });

    it('should throw DOMAIN_NOT_UNIVERSITY for domain that appends university domain as suffix', async () => {
      await expect(
        userService.submitStudentEmail(userId, 'user@uni-mannheim.de.fake.com')
      ).rejects.toThrow('DOMAIN_NOT_UNIVERSITY');
    });

    it('should accept exact domain match', async () => {
      await expect(
        userService.submitStudentEmail(userId, 'student@uni-mannheim.de')
      ).resolves.toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should accept subdomain of university domain', async () => {
      await expect(
        userService.submitStudentEmail(userId, validEmail)
      ).resolves.toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should accept deep subdomain of university domain', async () => {
      await expect(
        userService.submitStudentEmail(userId, 'user@department.cs.uni-mannheim.de')
      ).resolves.toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should set pendingUniversityEmail, token, and expiry on user before saving', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findById as jest.Mock).mockResolvedValue(user);

      await userService.submitStudentEmail(userId, validEmail);

      expect(user.pendingUniversityEmail).toBe(validEmail.toLowerCase());
      expect(user.studentVerificationToken).toBeDefined();
      expect(typeof user.studentVerificationToken).toBe('string');
      expect(user.studentVerificationTokenExpires).toBeInstanceOf(Date);
      expect(user.save).toHaveBeenCalled();
    });

    it('should send student verification email after saving', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findById as jest.Mock).mockResolvedValue(user);

      await userService.submitStudentEmail(userId, validEmail);

      expect(emailService.sendStudentVerificationEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientEmail: validEmail.toLowerCase(),
          recipientName: mockUser.name,
          verificationUrl: expect.stringContaining('/verify-student-email/'),
        })
      );
    });

    it('should not throw when email sending fails', async () => {
      (emailService.sendStudentVerificationEmail as jest.Mock).mockRejectedValue(
        new Error('SMTP error')
      );
      await expect(
        userService.submitStudentEmail(userId, validEmail)
      ).resolves.toBeUndefined();
    });

    it('should be case-insensitive for domain comparison', async () => {
      (universityService.getUniversityDomains as jest.Mock).mockResolvedValue(['UNI-MANNHEIM.DE']);
      await expect(
        userService.submitStudentEmail(userId, 'student@CS.UNI-MANNHEIM.DE')
      ).resolves.toBeUndefined();
    });
  });

  describe('verifyStudentEmail', () => {
    const token = 'valid-token-hex';

    const mockUser = {
      _id: 'user123',
      name: 'Test User',
      type: 'StudySeeker',
      universityEmail: null,
      pendingUniversityEmail: 'student@uni-mannheim.de',
      studentVerificationToken: token,
      studentVerificationTokenExpires: new Date(Date.now() + 60_000),
      save: jest.fn().mockResolvedValue(undefined),
    };

    it('should throw INVALID_OR_EXPIRED_TOKEN when token not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      await expect(userService.verifyStudentEmail(token)).rejects.toThrow(
        'INVALID_OR_EXPIRED_TOKEN'
      );
    });

    it('should set universityEmail from pendingUniversityEmail', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findOne as jest.Mock).mockResolvedValue(user);

      await userService.verifyStudentEmail(token);

      expect(user.universityEmail).toBe('student@uni-mannheim.de');
    });

    it('should set type to Student', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findOne as jest.Mock).mockResolvedValue(user);

      await userService.verifyStudentEmail(token);

      expect(user.type).toBe('Student');
    });

    it('should clear token fields after verification', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findOne as jest.Mock).mockResolvedValue(user);

      await userService.verifyStudentEmail(token);

      expect(user.pendingUniversityEmail).toBeUndefined();
      expect(user.studentVerificationToken).toBeUndefined();
      expect(user.studentVerificationTokenExpires).toBeUndefined();
    });

    it('should save the user after verification', async () => {
      const user: any = { ...mockUser, save: jest.fn().mockResolvedValue(undefined) };
      (User.findOne as jest.Mock).mockResolvedValue(user);

      await userService.verifyStudentEmail(token);

      expect(user.save).toHaveBeenCalled();
    });

    it('should query by token AND expiry date', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.verifyStudentEmail(token)).rejects.toThrow(
        'INVALID_OR_EXPIRED_TOKEN'
      );

      expect(User.findOne).toHaveBeenCalledWith({
        studentVerificationToken: token,
        studentVerificationTokenExpires: { $gt: expect.any(Date) },
      });
    });
  });
});
