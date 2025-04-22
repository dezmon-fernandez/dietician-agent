import cors from 'cors';

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        'https://MY_APP_NAME.com',
        'https://www.MY_APP_NAME.com',
        'https://MY_APP_NAME.pages.dev',
        'https://api.MY_APP_NAME.com',
        'https://accounts.google.com',
      ]
    : 'http://localhost:5173';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log('origin', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if it's an OAuth callback
    if (origin.includes('accounts.google.com')) {
      return callback(null, true);
    }

    // Check against allowed origins
    if (typeof allowedOrigins === 'string') {
      // Development mode
      if (origin === allowedOrigins) {
        return callback(null, true);
      }
    } else {
      // Production mode
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  exposedHeaders: ['Set-Cookie'],
});
