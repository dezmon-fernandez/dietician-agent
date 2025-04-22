import express from 'express';
import morgan from 'morgan';
import todoRoutes from './features/todo/todo.routes';
import { StripeController } from './features/stripe/stripe.controller';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { corsMiddleware } from './config/cors';
import authMiddleware from './middlewares/is-signed-in';

const app = express();

app.use(corsMiddleware);
app.use(morgan('dev'));

app.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.headers['stripe-signature'] as string;
    return StripeController.handleWebhook(req, res);
  }
);

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Routes
app.use('/api/todos', authMiddleware, todoRoutes);

export default app;
