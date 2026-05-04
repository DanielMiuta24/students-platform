import type { Request, Response, NextFunction } from 'express';
import { universityController } from '../../../modules/university/controllers';
import { universityService } from '../../../modules/university/services';

jest.mock('../../../modules/university/services', () => ({
  universityService: {
    searchUniversities: jest.fn(),
  },
}));

describe('UniversityController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockSearchResult = {
    universities: [
      {
        name: 'Technical University of Munich',
        country: 'Germany',
        countryCode: 'DE',
        stateProvince: 'Bavaria',
        website: 'https://www.tum.de',
        domain: 'tum.de',
      },
    ],
    page: 1,
    perPage: 10,
    total: 1,
    totalPages: 1,
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

    (universityService.searchUniversities as jest.Mock).mockResolvedValue(mockSearchResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HTTP Request Processing', () => {
    it('should trim whitespace from query parameters', async () => {
      mockRequest.query = { name: '  Munich  ', country: '  Germany  ' };

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(universityService.searchUniversities).toHaveBeenCalledWith({
        name: 'Munich',
        country: 'Germany',
        page: undefined,
      });
    });

    it('should pass trimmed parameters to service', async () => {
      mockRequest.query = { name: 'Munich', country: 'Germany', page: '2' };

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(universityService.searchUniversities).toHaveBeenCalledWith({
        name: 'Munich',
        country: 'Germany',
        page: '2',
      });
    });

    it('should handle undefined query parameters', async () => {
      mockRequest.query = {};

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(universityService.searchUniversities).toHaveBeenCalledWith({
        name: undefined,
        country: undefined,
        page: undefined,
      });
    });
  });

  describe('HTTP Response Handling', () => {
    it('should return 200 status with service result on success', async () => {
      mockRequest.query = { name: 'Munich' };

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockSearchResult);
    });

    it('should return 400 when service throws validation error', async () => {
      mockRequest.query = {};
      (universityService.searchUniversities as jest.Mock).mockRejectedValue(
        new Error('At least one search parameter (name or country) is required')
      );

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Please provide at least a "name" or a "country" parameter.',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 502 status when service throws API error', async () => {
      mockRequest.query = { name: 'Munich' };
      (universityService.searchUniversities as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch universities from external API')
      );

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(502);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to fetch universities from external API',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass non-API/non-validation errors to next middleware', async () => {
      mockRequest.query = { name: 'Munich' };
      const error = new Error('Unexpected error');
      (universityService.searchUniversities as jest.Mock).mockRejectedValue(error);

      await universityController.search(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
