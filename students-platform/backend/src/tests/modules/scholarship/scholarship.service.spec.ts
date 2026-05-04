import axios from 'axios';
import { ScholarshipService } from '../../../modules/scholarship/services';
import { env } from '../../../config/env';

jest.mock('axios');
jest.mock('../../../config/env', () => ({
  env: {
    COS_USER_ID: 'test-user-id',
    COS_API_TOKEN: 'test-api-token',
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ScholarshipService', () => {
  let scholarshipService: ScholarshipService;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    scholarshipService = new ScholarshipService();
    jest.clearAllMocks();
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getScholarships', () => {
    const mockScholarshipResponse = {
      SchoolPrograms: [
        {
          ProgramName: 'Registered Nursing',
          SchoolName: 'Minnesota State College',
          City: 'Minneapolis',
          StateName: 'Minnesota',
          StateAbbr: 'MN',
          Address: '123 Education St',
          Phone: '555-0100',
          SchoolUrl: 'https://example.edu',
          ProgramLength: [{ Name: '2 years' }],
        },
        {
          ProgramName: 'Computer Science',
          SchoolName: 'California Tech Institute',
          City: 'San Francisco',
          StateName: 'California',
          StateAbbr: 'CA',
          Address: '456 Tech Ave',
          Phone: '555-0200',
          SchoolUrl: 'https://caltech.edu',
          ProgramLength: [{ Name: '4 years' }],
        },
      ],
      TotalResults: 2,
    };

    describe('Successful API calls', () => {
      beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
          data: mockScholarshipResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      });

      it('should fetch scholarships with query parameter', async () => {
        const result = await scholarshipService.getScholarships('nursing');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('nursing'),
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.COS_API_TOKEN}`,
            },
            timeout: 10000,
          })
        );
        expect(result).toHaveProperty('scholarships');
        expect(result).toHaveProperty('total');
      });

      it('should fetch scholarships with query and location parameters', async () => {
        const result = await scholarshipService.getScholarships('nursing', 'Minnesota');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('nursing'),
          expect.any(Object)
        );
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('Minnesota'),
          expect.any(Object)
        );
        expect(result).toHaveProperty('scholarships');
        expect(result).toHaveProperty('total');
      });

      it('should use default location when not provided', async () => {
        await scholarshipService.getScholarships('nursing');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('/0/');
      });

      it('should build correct URL with all parameters', async () => {
        await scholarshipService.getScholarships('computer science', 'California');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('https://api.careeronestop.org/v1/Training');
        expect(calledUrl).toContain(env.COS_USER_ID);
        expect(calledUrl).toContain('computer%20science');
        expect(calledUrl).toContain('California');
      });

      it('should encode special characters in query', async () => {
        await scholarshipService.getScholarships('computer & science');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('computer%20%26%20science');
      });

      it('should return transformed scholarship data', async () => {
        const result = await scholarshipService.getScholarships('nursing');

        expect(result).toHaveProperty('scholarships');
        expect(result).toHaveProperty('total');
        expect(result.scholarships).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.scholarships[0]).toMatchObject({
          programName: 'Registered Nursing',
          schoolName: 'Minnesota State College',
          city: 'Minneapolis',
          state: 'Minnesota',
          stateCode: 'MN',
        });
      });

      it('should set correct authorization header', async () => {
        await scholarshipService.getScholarships('nursing');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': `Bearer ${env.COS_API_TOKEN}`,
            }),
          })
        );
      });

      it('should set 10 second timeout', async () => {
        await scholarshipService.getScholarships('nursing');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            timeout: 10000,
          })
        );
      });
    });

    describe('Error handling', () => {
      it('should throw timeout error when request times out', async () => {
        const timeoutError = {
          code: 'ECONNABORTED',
          message: 'timeout of 10000ms exceeded',
        };
        mockedAxios.get.mockRejectedValue(timeoutError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Request to scholarship API timed out');
      });

      it('should throw timeout error when message includes timeout', async () => {
        const timeoutError = {
          message: 'Request timeout error',
        };
        mockedAxios.get.mockRejectedValue(timeoutError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Request to scholarship API timed out');
      });

      it('should throw invalid credentials error when API returns 401', async () => {
        const authError = {
          response: {
            status: 401,
            data: { message: 'Unauthorized' },
          },
          message: 'Request failed with status code 401',
        };
        mockedAxios.get.mockRejectedValue(authError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Invalid API credentials');
      });

      it('should throw invalid parameters error when API returns 400', async () => {
        const badRequestError = {
          response: {
            status: 400,
            data: { message: 'Bad Request' },
          },
          message: 'Request failed with status code 400',
        };
        mockedAxios.get.mockRejectedValue(badRequestError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Invalid request parameters');
      });

      it('should throw generic error for other HTTP errors', async () => {
        const serverError = {
          response: {
            status: 500,
            data: { message: 'Internal Server Error' },
          },
          message: 'Request failed with status code 500',
        };
        mockedAxios.get.mockRejectedValue(serverError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Failed to fetch scholarships');
      });

      it('should throw generic error for network errors', async () => {
        const networkError = new Error('Network Error');
        mockedAxios.get.mockRejectedValue(networkError);

        await expect(
          scholarshipService.getScholarships('nursing')
        ).rejects.toThrow('Failed to fetch scholarships');
      });

      it('should log error details when error occurs', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = {
          message: 'Test error',
          response: { data: 'Error details' },
        };
        mockedAxios.get.mockRejectedValue(error);

        try {
          await scholarshipService.getScholarships('nursing');
        } catch (e) {
          // Expected to throw
        }

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching scholarships:', 'Test error');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error details:', 'Error details');

        consoleErrorSpy.mockRestore();
      });

      it('should log error code when no response data available', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = {
          message: 'Test error',
          code: 'ENOTFOUND',
        };
        mockedAxios.get.mockRejectedValue(error);

        try {
          await scholarshipService.getScholarships('nursing');
        } catch (e) {
          // Expected to throw
        }

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error details:', 'ENOTFOUND');

        consoleErrorSpy.mockRestore();
      });
    });

    describe('Edge cases', () => {
      beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
          data: mockScholarshipResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });
      });

      it('should handle empty string location', async () => {
        await scholarshipService.getScholarships('nursing', '');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('nursing');
      });

      it('should handle numeric location (ZIP code)', async () => {
        await scholarshipService.getScholarships('nursing', '55401');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('55401');
      });

      it('should handle query with multiple words', async () => {
        await scholarshipService.getScholarships('computer science engineering');

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('computer%20science%20engineering');
      });

      it('should handle empty API response', async () => {
        mockedAxios.get.mockResolvedValue({
          data: { SchoolPrograms: [] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        });

        const result = await scholarshipService.getScholarships('nonexistent');

        expect(result.scholarships).toHaveLength(0);
        expect(result.total).toBe(0);
      });
    });
  });
});
