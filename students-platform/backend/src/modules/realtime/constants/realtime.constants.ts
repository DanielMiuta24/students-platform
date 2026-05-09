export const REALTIME_ERROR = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_ROOM: 'INVALID_ROOM',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
} as const;

export const REALTIME_CONFIG = {
  CORS: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  PING_TIMEOUT: 60000,
  PING_INTERVAL: 25000,
} as const;
