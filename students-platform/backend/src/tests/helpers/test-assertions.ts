import { Response } from 'express';

export const expectErrorResponse = (
  mockResponse: Partial<Response>,
  status: number,
  message: string
) => {
  expect(mockResponse.status).toHaveBeenCalledWith(status);
  expect(mockResponse.json).toHaveBeenCalledWith({ message });
};

export const expectSuccessResponse = (
  mockResponse: Partial<Response>,
  status: number,
  data: any
) => {
  expect(mockResponse.status).toHaveBeenCalledWith(status);
  expect(mockResponse.json).toHaveBeenCalledWith(data);
};

export const expectJsonResponse = (
  mockResponse: Partial<Response>,
  data: any
) => {
  expect(mockResponse.json).toHaveBeenCalledWith(data);
};
