import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGO_URI: process.env.MONGO_URI ?? '',
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? 'changeme',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
  API_URL:
      process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
  COS_USER_ID: process.env.COS_USER_ID ?? '',
  COS_API_TOKEN: process.env.COS_API_TOKEN ?? '',
  UNIVERSITY_API_URL: process.env.UNIVERSITY_API_URL ?? 'http://universities.hipolabs.com/search',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',
  SMTP_HOST: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASS: process.env.SMTP_PASS ?? '',
  SMTP_FROM: process.env.SMTP_FROM ?? 'noreply@students-platform.com',
};
