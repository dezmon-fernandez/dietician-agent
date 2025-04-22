import { fromNodeHeaders } from 'better-auth/node';
import { RequestHandler } from 'express';
import { auth } from '../lib/auth';
import { User } from '@prisma/client';

const authMiddleware: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(400).json({
      message: 'unauthorized',
    });

    return;
  }

  req.user = session.user as User;
  next();
};

export default authMiddleware;
