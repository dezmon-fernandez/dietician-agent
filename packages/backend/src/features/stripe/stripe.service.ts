import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';
import { User } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const PRICE_ID = process.env.STRIPE_PRICE_ID!;

export class StripeService {
  static async createCustomer(user: User) {
    const coach = await prisma.coach.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!coach) {
      throw new Error('Coach profile not found');
    }

    if (coach.stripeCustomerId) {
      return coach.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email: coach.user.email!,
      name: `${coach.user.firstName} ${coach.user.lastName}` || undefined,
      metadata: {
        userId: user.id,
        coachId: coach.id,
      },
    });

    await prisma.coach.update({
      where: { id: coach.id },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  static async createCheckoutSession(userId: string) {
    const coach = await prisma.coach.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!coach) {
      throw new Error('Coach profile not found');
    }

    const customerId = await this.createCustomer(coach.user);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    return session;
  }

  static async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log('Webhook event received:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          console.log('Processing checkout.session.completed:', {
            sessionId: session.id,
            subscriptionId: subscription.id,
            userId: session.metadata?.userId,
          });

          const userId = session.metadata?.userId as string;
          const coach = await prisma.coach.findUnique({
            where: { userId },
          });

          if (!coach) {
            throw new Error('Coach not found');
          }

          const existingSubscription = await prisma.subscription.findUnique({
            where: { coachId: coach.id },
          });

          if (existingSubscription) {
            // Update existing subscription
            await prisma.subscription.update({
              where: { coachId: coach.id },
              data: {
                stripeSubscriptionId: subscription.id,
                status: 'ACTIVE',
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            });
            console.log('Existing subscription updated');
          } else {
            // Create new subscription
            await prisma.subscription.create({
              data: {
                coachId: coach.id,
                stripeSubscriptionId: subscription.id,
                status: 'ACTIVE',
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            });
            console.log('New subscription created');
          }

          console.log('Subscription created successfully');
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(
              invoice.subscription as string
            );
            await prisma.subscription.update({
              where: { stripeSubscriptionId: subscription.id },
              data: {
                status: 'ACTIVE',
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: invoice.subscription as string },
              data: { status: 'PAST_DUE' },
            });
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: 'CANCELED' },
          });
          break;
        }
      }

      return { received: true };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  static async getSubscription(userId: string) {
    const coach = await prisma.coach.findUnique({
      where: { userId },
    });

    if (!coach) {
      throw new Error('Coach not found');
    }

    return prisma.subscription.findUnique({
      where: { coachId: coach.id },
    });
  }

  static async cancelSubscription(userId: string) {
    const coach = await prisma.coach.findUnique({
      where: { userId },
    });

    if (!coach) {
      throw new Error('Coach not found');
    }

    const subscription = await prisma.subscription.findUnique({
      where: { coachId: coach.id },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    await prisma.subscription.update({
      where: { coachId: coach.id },
      data: { status: 'CANCELED' },
    });

    return { success: true };
  }
}
