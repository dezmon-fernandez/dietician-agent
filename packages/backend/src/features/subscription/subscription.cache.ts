import { createClient } from 'redis';
import { prisma } from '../../lib/prisma';
import { SubscriptionStatus } from '@prisma/client';
// import dotenv from 'dotenv';

// dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis when the service starts
redis.connect().catch(console.error);

const CACHE_TTL = 60 * 5; // 5 minutes
const SUBSCRIPTION_KEY_PREFIX = 'coach:subscription:';

export class SubscriptionCache {
  static async getStatus(coachId: string): Promise<SubscriptionStatus | null> {
    const cacheKey = `${SUBSCRIPTION_KEY_PREFIX}${coachId}`;

    try {
      // Try to get from cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached as SubscriptionStatus;
      }

      // If not in cache, get from database
      const subscription = await prisma.subscription.findUnique({
        where: { coachId },
      });

      if (subscription) {
        // Cache the result
        await redis.setEx(cacheKey, CACHE_TTL, subscription.status);
        return subscription.status;
      }

      return null;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // On cache error, fallback to database
      const subscription = await prisma.subscription.findUnique({
        where: { coachId },
      });
      return subscription?.status || null;
    }
  }

  static async invalidate(coachId: string): Promise<void> {
    const cacheKey = `${SUBSCRIPTION_KEY_PREFIX}${coachId}`;
    try {
      await redis.del(cacheKey);
    } catch (error) {
      console.error('Error invalidating subscription cache:', error);
    }
  }

  static async updateStatus(
    coachId: string,
    status: SubscriptionStatus
  ): Promise<void> {
    const cacheKey = `${SUBSCRIPTION_KEY_PREFIX}${coachId}`;
    try {
      await redis.setEx(cacheKey, CACHE_TTL, status);
    } catch (error) {
      console.error('Error updating subscription cache:', error);
    }
  }
}
