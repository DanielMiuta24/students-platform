import { validateSearchParams, parsePage } from '../../../modules/scholarship/validators';

describe('Scholarship Validation', () => {
  describe('validateSearchParams', () => {
    it('should return true when query is provided', () => {
      const result = validateSearchParams('nursing');
      expect(result).toBe(true);
    });

    it('should return true when both query and location are provided', () => {
      const result = validateSearchParams('nursing', 'Minnesota');
      expect(result).toBe(true);
    });

    it('should return false when query is not provided', () => {
      const result = validateSearchParams();
      expect(result).toBe(false);
    });

    it('should return false when query is empty string', () => {
      const result = validateSearchParams('  ');
      expect(result).toBe(false);
    });

    it('should return true when query has whitespace but is not empty', () => {
      const result = validateSearchParams('  computer science  ');
      expect(result).toBe(true);
    });

    it('should return false when query is undefined and location is provided', () => {
      const result = validateSearchParams(undefined, 'California');
      expect(result).toBe(false);
    });

    it('should return false when query is empty and location is provided', () => {
      const result = validateSearchParams('   ', 'Texas');
      expect(result).toBe(false);
    });

    it('should return true when query is provided and location is undefined', () => {
      const result = validateSearchParams('business');
      expect(result).toBe(true);
    });

    it('should return true when query is provided and location is empty', () => {
      const result = validateSearchParams('engineering', '');
      expect(result).toBe(true);
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
