import dotenv from 'dotenv';

dotenv.config();

const configuredSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production' && (!configuredSecret || configuredSecret.length < 32)) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production.');
}

export const JWT_SECRET = configuredSecret ?? 'local-development-only-jwt-secret';
