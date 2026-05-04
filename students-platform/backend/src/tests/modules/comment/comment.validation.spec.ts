import {
  validateCommentContent,
  validateObjectId,
  parsePaginationParams,
} from '../../../modules/comment/validators';

describe('Comment Validation', () => {
  describe('validateCommentContent', () => {
    it('should return true for valid content', () => {
      const result = validateCommentContent('This is a valid comment');
      expect(result).toBe(true);
    });

    it('should return true for content with maximum length (2000 chars)', () => {
      const content = 'a'.repeat(2000);
      const result = validateCommentContent(content);
      expect(result).toBe(true);
    });

    it('should return false for content exceeding 2000 characters', () => {
      const content = 'a'.repeat(2001);
      const result = validateCommentContent(content);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = validateCommentContent('');
      expect(result).toBe(false);
    });

    it('should return false for whitespace only', () => {
      const result = validateCommentContent('   ');
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = validateCommentContent(undefined);
      expect(result).toBe(false);
    });

    it('should return true for content with leading/trailing whitespace', () => {
      const result = validateCommentContent('  Valid content  ');
      expect(result).toBe(true);
    });

    it('should return true for single character', () => {
      const result = validateCommentContent('a');
      expect(result).toBe(true);
    });

    it('should return true for content with special characters', () => {
      const result = validateCommentContent('Hello! @#$%^&*()');
      expect(result).toBe(true);
    });

    it('should return true for content with emojis', () => {
      const result = validateCommentContent('Great post! 👍😊');
      expect(result).toBe(true);
    });

    it('should return true for multiline content', () => {
      const result = validateCommentContent('Line 1\nLine 2\nLine 3');
      expect(result).toBe(true);
    });
  });

  describe('validateObjectId', () => {
    it('should return true for valid 24-character hex ObjectId', () => {
      const result = validateObjectId('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('should return true for ObjectId with uppercase hex characters', () => {
      const result = validateObjectId('507F1F77BCF86CD799439011');
      expect(result).toBe(true);
    });

    it('should return true for ObjectId with mixed case', () => {
      const result = validateObjectId('507f1F77BcF86cD799439011');
      expect(result).toBe(true);
    });

    it('should return false for ObjectId with invalid characters', () => {
      const result = validateObjectId('507f1f77bcf86cd79943901g');
      expect(result).toBe(false);
    });

    it('should return false for ObjectId that is too short', () => {
      const result = validateObjectId('507f1f77bcf86cd7994390');
      expect(result).toBe(false);
    });

    it('should return false for ObjectId that is too long', () => {
      const result = validateObjectId('507f1f77bcf86cd799439011a');
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = validateObjectId('');
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = validateObjectId(undefined);
      expect(result).toBe(false);
    });

    it('should return false for non-hex characters', () => {
      const result = validateObjectId('xxxxxxxxxxxxxxxxxxxxxxxx');
      expect(result).toBe(false);
    });

    it('should return false for special characters', () => {
      const result = validateObjectId('507f1f77-bcf8-6cd7-9943-9011');
      expect(result).toBe(false);
    });

    it('should return false for spaces', () => {
      const result = validateObjectId('507f1f77 bcf86cd799439011');
      expect(result).toBe(false);
    });
  });

  describe('parsePaginationParams', () => {
    it('should return default values when no params provided', () => {
      const result = parsePaginationParams();
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should parse valid page and limit', () => {
      const result = parsePaginationParams('5', '20');
      expect(result).toEqual({ page: 5, limit: 20 });
    });

    it('should return default page when invalid page provided', () => {
      const result = parsePaginationParams('invalid', '20');
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should return default limit when invalid limit provided', () => {
      const result = parsePaginationParams('5', 'invalid');
      expect(result).toEqual({ page: 5, limit: 10 });
    });

    it('should return default page when page is zero', () => {
      const result = parsePaginationParams('0', '20');
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should return default page when page is negative', () => {
      const result = parsePaginationParams('-5', '20');
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should return default limit when limit is zero', () => {
      const result = parsePaginationParams('5', '0');
      expect(result).toEqual({ page: 5, limit: 10 });
    });

    it('should return default limit when limit is negative', () => {
      const result = parsePaginationParams('5', '-10');
      expect(result).toEqual({ page: 5, limit: 10 });
    });

    it('should cap limit at 100', () => {
      const result = parsePaginationParams('1', '150');
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should allow limit of exactly 100', () => {
      const result = parsePaginationParams('1', '100');
      expect(result).toEqual({ page: 1, limit: 100 });
    });

    it('should truncate decimal page numbers', () => {
      const result = parsePaginationParams('3.7', '15.9');
      expect(result).toEqual({ page: 3, limit: 15 });
    });

    it('should handle page with leading zeros', () => {
      const result = parsePaginationParams('007', '020');
      expect(result).toEqual({ page: 7, limit: 20 });
    });

    it('should handle empty strings', () => {
      const result = parsePaginationParams('', '');
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should handle very large page numbers', () => {
      const result = parsePaginationParams('999999', '50');
      expect(result).toEqual({ page: 999999, limit: 50 });
    });

    it('should handle limit at upper boundary', () => {
      const result = parsePaginationParams('1', '101');
      expect(result).toEqual({ page: 1, limit: 10 });
    });
  });
});
