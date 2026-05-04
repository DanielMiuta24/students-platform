import type { Request, Response, NextFunction } from 'express';
import { scholarshipController } from '../../../modules/scholarship/controllers';

describe('ScholarshipController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let getScholarshipsMock: jest.Mock;

  const mockScholarshipResult = {
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
    ],
  };

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      query: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();

    getScholarshipsMock = jest.fn().mockResolvedValue(mockScholarshipResult);
    (scholarshipController as any).scholarshipService = {
      getScholarships: getScholarshipsMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HTTP Request Processing', () => {
    it('should pass query and location parameters to service', async () => {
      mockRequest.query = { q: 'nursing', location: 'Minnesota' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('nursing', 'Minnesota');
    });

    it('should use default location when not provided', async () => {
      mockRequest.query = { q: 'nursing' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('nursing', '0');
    });

    it('should handle query with whitespace', async () => {
      mockRequest.query = { q: '  computer science  ' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockScholarshipResult);
    });

    it('should handle both query and location parameters', async () => {
      mockRequest.query = { q: 'business', location: 'California' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('business', 'California');
    });
  });

  describe('HTTP Response Handling', () => {
    it('should return 200 status with service result on success', async () => {
      mockRequest.query = { q: 'nursing' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockScholarshipResult);
    });

    it('should return 400 when query parameter is missing', async () => {
      mockRequest.query = {};

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Query parameter is required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 when query parameter is empty string', async () => {
      mockRequest.query = { q: '   ' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Query parameter is required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 504 when service throws timeout error', async () => {
      mockRequest.query = { q: 'nursing' };
      getScholarshipsMock.mockRejectedValue(
        new Error('Request to scholarship API timed out')
      );

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(504);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'The scholarship service is currently unavailable. Please try again later.',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when service throws invalid credentials error', async () => {
      mockRequest.query = { q: 'nursing' };
      getScholarshipsMock.mockRejectedValue(
        new Error('Invalid API credentials')
      );

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Authentication failed with scholarship service',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 when service throws invalid parameters error', async () => {
      mockRequest.query = { q: 'nursing' };
      getScholarshipsMock.mockRejectedValue(
        new Error('Invalid request parameters')
      );

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid search parameters',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 502 when service throws fetch error', async () => {
      mockRequest.query = { q: 'nursing' };
      getScholarshipsMock.mockRejectedValue(
        new Error('Failed to fetch scholarships')
      );

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch scholarships from external service',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass unexpected errors to next middleware', async () => {
      mockRequest.query = { q: 'nursing' };
      const error = new Error('Unexpected error');
      getScholarshipsMock.mockRejectedValue(error);

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle location parameter with empty string', async () => {
      mockRequest.query = { q: 'nursing', location: '' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('nursing', '0');
    });

    it('should handle special characters in query', async () => {
      mockRequest.query = { q: 'computer & science' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('computer & science', '0');
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('should handle numeric location values', async () => {
      mockRequest.query = { q: 'nursing', location: '55401' };

      await scholarshipController.fetchScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getScholarshipsMock).toHaveBeenCalledWith('nursing', '55401');
    });
  });
});
