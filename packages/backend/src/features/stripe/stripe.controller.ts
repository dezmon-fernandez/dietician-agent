import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

export class StripeController {
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const session = await StripeService.createCheckoutSession(userId);
      res.json({ url: session.url });
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'] as string;

    try {
      console.log('Received webhook request:', {
        signature: signature ? 'present' : 'missing',
        contentType: req.headers['content-type'],
        bodyType: typeof req.body,
        bodyLength: req.body?.length,
      });

      const result = await StripeService.handleWebhook(signature, req.body);
      console.log('Webhook processed successfully');
      res.json(result);
    } catch (error) {
      console.error('Webhook handling failed:', error);
      res.status(400).json({ error: 'Webhook handling failed' });
    }
  }

  static async getSubscriptionStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const subscription = await StripeService.getSubscription(userId);
      res.json({ subscription });
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  }

  static async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await StripeService.cancelSubscription(userId);
      res.json(result);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }
}
