import { universityService } from '../../../modules/university/services';

const API_BASE_URL = process.env.UNIVERSITY_API_URL;

describe('UniversityService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUniversities', () => {
    const mockApiResponse = [
      {
        name: 'Technical University of Munich',
        country: 'Germany',
        alpha_two_code: 'DE',
        'state-province': 'Bavaria',
        web_pages: ['https://www.tum.de'],
        domains: ['tum.de'],
      },
      {
        name: 'Munich University of Applied Sciences',
        country: 'Germany',
        alpha_two_code: 'DE',
        'state-province': 'Bavaria',
        web_pages: ['https://www.hm.edu'],
        domains: ['hm.edu'],
      },
    ];

    describe('Validation', () => {
      it('should throw error when validation fails', async () => {
        await expect(
          universityService.searchUniversities({})
        ).rejects.toThrow('At least one search parameter (name or country) is required');
      });
    });

    describe('Successful searches', () => {
      beforeEach(() => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        });
      });

      it('should search universities by name', async () => {
        const result = await universityService.searchUniversities({ name: 'Munich' });

        expect(global.fetch).toHaveBeenCalledWith(
          `${API_BASE_URL}?name=Munich`
        );
        expect(result.universities).toHaveLength(2);
        expect(result.page).toBe(1);
        expect(result.perPage).toBe(10);
        expect(result.total).toBe(2);
        expect(result.totalPages).toBe(1);
      });

      it('should search universities by country', async () => {
        const result = await universityService.searchUniversities({ country: 'Germany' });

        expect(global.fetch).toHaveBeenCalledWith(
          `${API_BASE_URL}?country=Germany`
        );
        expect(result.universities).toHaveLength(2);
      });

      it('should search universities by name and country', async () => {
        const result = await universityService.searchUniversities({
          name: 'Munich',
          country: 'Germany',
        });

        expect(global.fetch).toHaveBeenCalledWith(
          `${API_BASE_URL}?name=Munich&country=Germany`
        );
        expect(result.universities).toHaveLength(2);
      });

      it('should correctly transform API response to DTOs', async () => {
        const result = await universityService.searchUniversities({ name: 'Munich' });

        expect(result.universities[0]).toEqual({
          name: 'Technical University of Munich',
          country: 'Germany',
          countryCode: 'DE',
          stateProvince: 'Bavaria',
          website: 'https://www.tum.de',
          domain: 'tum.de',
        });
      });

      it('should handle universities with null state-province', async () => {
        const mockResponseWithNull = [
          {
            name: 'Test University',
            country: 'Test',
            alpha_two_code: 'TS',
            'state-province': null,
            web_pages: ['https://test.edu'],
            domains: ['test.edu'],
          },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponseWithNull,
        });

        const result = await universityService.searchUniversities({ name: 'Test' });

        expect(result.universities[0].stateProvince).toBeNull();
      });

      it('should handle universities with empty web_pages array', async () => {
        const mockResponseEmptyArrays = [
          {
            name: 'Test University',
            country: 'Test',
            alpha_two_code: 'TS',
            'state-province': null,
            web_pages: [],
            domains: [],
          },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponseEmptyArrays,
        });

        const result = await universityService.searchUniversities({ name: 'Test' });

        expect(result.universities[0].website).toBeNull();
        expect(result.universities[0].domain).toBeNull();
      });

      it('should use only the first website and domain when multiple are present', async () => {
        const mockResponseMultiple = [
          {
            name: 'Test University',
            country: 'Test',
            alpha_two_code: 'TS',
            'state-province': null,
            web_pages: ['https://main.edu', 'https://secondary.edu'],
            domains: ['main.edu', 'secondary.edu'],
          },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockResponseMultiple,
        });

        const result = await universityService.searchUniversities({ name: 'Test' });

        expect(result.universities[0].website).toBe('https://main.edu');
        expect(result.universities[0].domain).toBe('main.edu');
      });
    });

    describe('Pagination', () => {
      const createMockUniversities = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
          name: `University ${i + 1}`,
          country: 'Test Country',
          alpha_two_code: 'TC',
          'state-province': null,
          web_pages: [`https://uni${i + 1}.edu`],
          domains: [`uni${i + 1}.edu`],
        }));
      };

      it('should return first page by default', async () => {
        const mockUniversities = createMockUniversities(25);

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockUniversities,
        });

        const result = await universityService.searchUniversities({ name: 'University' });

        expect(result.page).toBe(1);
        expect(result.perPage).toBe(10);
        expect(result.total).toBe(25);
        expect(result.totalPages).toBe(3);
        expect(result.universities).toHaveLength(10);
        expect(result.universities[0].name).toBe('University 1');
        expect(result.universities[9].name).toBe('University 10');
      });

      it('should return second page when requested', async () => {
        const mockUniversities = createMockUniversities(25);

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockUniversities,
        });

        const result = await universityService.searchUniversities({
          name: 'University',
          page: 2,
        });

        expect(result.page).toBe(2);
        expect(result.universities).toHaveLength(10);
        expect(result.universities[0].name).toBe('University 11');
        expect(result.universities[9].name).toBe('University 20');
      });

      it('should return remaining results on last page', async () => {
        const mockUniversities = createMockUniversities(25);

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockUniversities,
        });

        const result = await universityService.searchUniversities({
          name: 'University',
          page: 3,
        });

        expect(result.page).toBe(3);
        expect(result.universities).toHaveLength(5);
        expect(result.universities[0].name).toBe('University 21');
        expect(result.universities[4].name).toBe('University 25');
      });

      it('should return empty array for page beyond total pages', async () => {
        const mockUniversities = createMockUniversities(5);

        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockUniversities,
        });

        const result = await universityService.searchUniversities({
          name: 'University',
          page: 10,
        });

        expect(result.page).toBe(10);
        expect(result.universities).toHaveLength(0);
        expect(result.total).toBe(5);
        expect(result.totalPages).toBe(1);
      });

      it('should return totalPages of 1 when results are empty', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => [],
        });

        const result = await universityService.searchUniversities({ name: 'Nonexistent' });

        expect(result.totalPages).toBe(1);
        expect(result.total).toBe(0);
        expect(result.universities).toHaveLength(0);
      });
    });

    describe('Error handling', () => {
      it('should throw error when API call fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: false,
          status: 500,
        });

        await expect(
          universityService.searchUniversities({ name: 'Munich' })
        ).rejects.toThrow('Failed to fetch universities from external API');
      });

      it('should throw error when fetch throws an exception', async () => {
        const error = new Error('Network error');
        (global.fetch as jest.Mock).mockRejectedValue(error);

        await expect(
          universityService.searchUniversities({ name: 'Munich' })
        ).rejects.toThrow('Network error');
      });

      it('should throw error when JSON parsing fails', async () => {
        const error = new Error('Invalid JSON');
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => {
            throw error;
          },
        });

        await expect(
          universityService.searchUniversities({ name: 'Munich' })
        ).rejects.toThrow('Invalid JSON');
      });
    });
  });
});
