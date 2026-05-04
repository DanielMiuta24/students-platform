import { validateSearchParams, parsePage } from '../../../modules/university/validators';

describe('University Validation', () => {
  describe('validateSearchParams', () => {
    it('should return true when name is provided', () => {
      const result = validateSearchParams('Munich');
      expect(result).toBe(true);
    });

    it('should return true when country is provided', () => {
      const result = validateSearchParams(undefined, 'Germany');
      expect(result).toBe(true);
    });

    it('should return true when both name and country are provided', () => {
      const result = validateSearchParams('Munich', 'Germany');
      expect(result).toBe(true);
    });

    it('should return false when neither name nor country is provided', () => {
      const result = validateSearchParams();
      expect(result).toBe(false);
    });

    it('should return false when both parameters are empty strings', () => {
      const result = validateSearchParams('  ', '  ');
      expect(result).toBe(false);
    });

    it('should return true when name has whitespace but is not empty', () => {
      const result = validateSearchParams('  Munich  ');
      expect(result).toBe(true);
    });

    it('should return true when country has whitespace but is not empty', () => {
      const result = validateSearchParams(undefined, '  Germany  ');
      expect(result).toBe(true);
    });

    it('should return false when name is undefined and country is empty string', () => {
      const result = validateSearchParams(undefined, '   ');
      expect(result).toBe(false);
    });

    it('should return false when name is empty string and country is undefined', () => {
      const result = validateSearchParams('   ', undefined);
      expect(result).toBe(false);
    });
  });

  describe('parsePage', () => {
    it('should return 1 when no page parameter is provided', () => {
      const result = parsePage();
      expect(result).toBe(1);
    });

    it('should return the parsed page number when valid', () => {
      const result = parsePage('5');
      expect(result).toBe(5);
    });

    it('should return 1 when page is invalid string', () => {
      const result = parsePage('invalid');
      expect(result).toBe(1);
    });

    it('should return 1 when page is zero', () => {
      const result = parsePage('0');
      expect(result).toBe(1);
    });

    it('should return 1 when page is negative', () => {
      const result = parsePage('-5');
      expect(result).toBe(1);
    });

    it('should handle decimal numbers by truncating', () => {
      const result = parsePage('3.7');
      expect(result).toBe(3);
    });

    it('should return 1 when page is empty string', () => {
      const result = parsePage('');
      expect(result).toBe(1);
    });

    it('should handle very large page numbers', () => {
      const result = parsePage('999999');
      expect(result).toBe(999999);
    });

    it('should return 1 for special characters', () => {
      const result = parsePage('!@#$');
      expect(result).toBe(1);
    });

    it('should handle page numbers with leading zeros', () => {
      const result = parsePage('007');
      expect(result).toBe(7);
    });
  });
});
