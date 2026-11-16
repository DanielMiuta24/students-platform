import { universityService } from '../../../modules/university/services';

const API_BASE_URL = process.env.UNIVERSITY_API_URL;

describe('UniversityService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    (universityService as any).domainCache.clear();
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
          domains: ['tum.de'],
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

  describe('getUniversityDomains', () => {
    const mockTumResponse = [
      {
        name: 'Technical University of Munich',
        country: 'Germany',
        alpha_two_code: 'DE',
        'state-province': null,
        web_pages: ['https://www.tum.de'],
        domains: ['tum.de', 'mytum.de'],
      },
    ];

    const mockDhbwMosbachResponse = [
      {
        name: 'DHBW Mosbach',
        country: 'Germany',
        alpha_two_code: 'DE',
        'state-province': null,
        web_pages: [],
        domains: ['dhbw-mosbach.de', 'mosbach.dhbw.de'],
      },
    ];

    describe('Domain hierarchy walk', () => {
      it('should query exact domain for a 2-label domain', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockTumResponse,
        });

        await universityService.getUniversityDomains('tum.de');

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('domain=tum.de'), expect.objectContaining({ signal: expect.any(Object) }));
      });

      it('should try exact subdomain first, then parent when empty', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({ ok: true, json: async () => [] })
          .mockResolvedValueOnce({ ok: true, json: async () => mockTumResponse });

        await universityService.getUniversityDomains('cs.tum.de');

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('domain=cs.tum.de'), expect.objectContaining({ signal: expect.any(Object) }));
        expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('domain=tum.de'), expect.objectContaining({ signal: expect.any(Object) }));
      });

      it('should walk up multiple levels and stop at first match', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({ ok: true, json: async () => [] })
          .mockResolvedValueOnce({ ok: true, json: async () => mockDhbwMosbachResponse });

        const domains = await universityService.getUniversityDomains('lehre.mosbach.dhbw.de');

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(domains).toContain('mosbach.dhbw.de');
        expect(domains).toContain('dhbw-mosbach.de');
      });

      it('should return empty array when no level matches', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => [],
        });

        const domains = await universityService.getUniversityDomains('fake.xyz');
        expect(domains).toEqual([]);
      });
    });

    describe('Domain flattening', () => {
      it('should return all domains from all matching universities', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => [
            { name: 'U1', country: 'DE', alpha_two_code: 'DE', 'state-province': null, web_pages: [], domains: ['uni-mannheim.de'] },
            { name: 'U2', country: 'DE', alpha_two_code: 'DE', 'state-province': null, web_pages: [], domains: ['dhbw-mannheim.de', 'mannheim.dhbw.de'] },
          ],
        });

        const domains = await universityService.getUniversityDomains('cs.uni-mannheim.de');

        expect(domains).toContain('uni-mannheim.de');
        expect(domains).toContain('dhbw-mannheim.de');
        expect(domains).toContain('mannheim.dhbw.de');
      });

      it('should return lowercase domains', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => [
            { name: 'Test', country: 'DE', alpha_two_code: 'DE', 'state-province': null, web_pages: [], domains: ['TEST.EDU'] },
          ],
        });

        const domains = await universityService.getUniversityDomains('student.test.edu');
        expect(domains).toContain('test.edu');
        expect(domains).not.toContain('TEST.EDU');
      });
    });

    describe('Caching', () => {
      it('should return cached result on second call with same email domain', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockTumResponse,
        });

        await universityService.getUniversityDomains('cs.tum.de');
        await universityService.getUniversityDomains('cs.tum.de');

        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      it('should make a new fetch call when cache is expired', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: async () => mockTumResponse,
        });

        await universityService.getUniversityDomains('cs.tum.de');

        const cache = (universityService as any).domainCache;
        const [key, entry] = [...cache.entries()][0];
        cache.set(key, { ...entry, expires: Date.now() - 1 });

        await universityService.getUniversityDomains('cs.tum.de');

        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    describe('Error handling', () => {
      it('should throw UNIVERSITY_API_ERROR when API returns non-ok response', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503 });

        await expect(
          universityService.getUniversityDomains('cs.uni-mannheim.de')
        ).rejects.toThrow('UNIVERSITY_API_ERROR');
      });

      it('should return empty array when fetch throws (timeout or network error)', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const domains = await universityService.getUniversityDomains('cs.uni-mannheim.de');
        expect(domains).toEqual([]);
      });

      it('should fall through to next level when an intermediate fetch times out', async () => {
        (global.fetch as jest.Mock)
          .mockRejectedValueOnce(new Error('TimeoutError'))
          .mockResolvedValueOnce({ ok: true, json: async () => [
            { name: 'Test', country: 'DE', alpha_two_code: 'DE', 'state-province': null, web_pages: [], domains: ['uni-mannheim.de'] },
          ]});

        const domains = await universityService.getUniversityDomains('cs.uni-mannheim.de');
        expect(domains).toContain('uni-mannheim.de');
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
