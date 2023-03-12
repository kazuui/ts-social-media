export const DAY_IN_SECONDS = 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES_IN_SECONDS = 5 * 60 * 1000
export const SERVER_PORT = process.env.SERVER_PORT as string || 3001
export const SECRET_KEY = process.env.JWT_SECRET || "asecret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"