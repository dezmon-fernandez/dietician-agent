import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://MY_APP_NAME.com',
    'https://www.MY_APP_NAME.com',
    'https://MY_APP_NAME.pages.dev',
    'https://api.MY_APP_NAME.com',
    'https://accounts.google.com',
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async profile => {
        return {
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
          emailVerified: profile.email_verified,
        };
      },
    },
  },
});
