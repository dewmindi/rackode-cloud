/**
 * Lemon Squeezy Payment Gateway Integration
 * Handles checkout, subscriptions, and webhook processing
 */

import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  webhookSecret: string;
}

export interface CheckoutOptions {
  productId: string;
  variantId?: string;
  customPrice?: number;
  checkoutData?: {
    email?: string;
    name?: string;
    billingAddress?: any;
    taxNumber?: string;
    discountCode?: string;
    custom?: Record<string, any>;
  };
  checkoutOptions?: {
    embed?: boolean;
    media?: boolean;
    logo?: boolean;
    desc?: boolean;
    discount?: boolean;
    dark?: boolean;
    subscriptionPreview?: boolean;
  };
  expiresAt?: string;
  preview?: boolean;
  testMode?: boolean;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
  data?: any;
}

export interface WebhookPayload {
  meta: {
    event_name: string;
    custom_data?: Record<string, any>;
  };
  data: {
    id: string;
    type: string;
    attributes: any;
  };
}

/**
 * Lemon Squeezy Client
 */
export class LemonSqueezyClient {
  private config: LemonSqueezyConfig;

  constructor(config?: LemonSqueezyConfig) {
    this.config = config || {
      apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
      storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
      webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
    };

    if (!this.config.apiKey) {
      console.warn('Lemon Squeezy API key not configured. Payment features will be disabled.');
    }

    // Initialize Lemon Squeezy SDK
    if (this.config.apiKey) {
      lemonSqueezySetup({ apiKey: this.config.apiKey });
    }
  }

  /**
   * Create a checkout session
   */
  async createCheckout(options: CheckoutOptions): Promise<CheckoutResponse> {
    try {
      if (!this.config.apiKey) {
        throw new Error('Lemon Squeezy API key is not configured');
      }

      const {
        createCheckout,
      } = await import('@lemonsqueezy/lemonsqueezy.js');

      const checkout = await createCheckout(
        this.config.storeId,
        options.variantId || options.productId,
        {
          checkoutData: options.checkoutData,
          checkoutOptions: options.checkoutOptions,
          expiresAt: options.expiresAt,
          preview: options.preview,
          testMode: options.testMode,
        }
      );

      if (checkout.error) {
        return {
          success: false,
          error: checkout.error.message || 'Failed to create checkout',
        };
      }

      return {
        success: true,
        checkoutUrl: checkout.data?.data.attributes.url,
        data: checkout.data,
      };
    } catch (error) {
      console.error('Error creating checkout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get checkout details
   */
  async getCheckout(checkoutId: string) {
    try {
      const { getCheckout } = await import('@lemonsqueezy/lemonsqueezy.js');
      const checkout = await getCheckout(checkoutId);
      return checkout.data;
    } catch (error) {
      console.error('Error fetching checkout:', error);
      throw error;
    }
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string) {
    try {
      const { getOrder } = await import('@lemonsqueezy/lemonsqueezy.js');
      const order = await getOrder(orderId);
      return order.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * List all orders
   */
  async listOrders(params?: { filter?: Record<string, string> }) {
    try {
      const { listOrders } = await import('@lemonsqueezy/lemonsqueezy.js');
      const orders = await listOrders({ filter: params?.filter });
      return orders.data;
    } catch (error) {
      console.error('Error listing orders:', error);
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string) {
    try {
      const { getSubscription } = await import('@lemonsqueezy/lemonsqueezy.js');
      const subscription = await getSubscription(subscriptionId);
      return subscription.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      const { cancelSubscription } = await import('@lemonsqueezy/lemonsqueezy.js');
      const result = await cancelSubscription(subscriptionId);
      return result.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', this.config.webhookSecret);
      const digest = hmac.update(payload).digest('hex');
      return digest === signature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Process webhook payload
   */
  async processWebhook(payload: WebhookPayload) {
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;

    switch (eventName) {
      case 'order_created':
        console.log('Order created:', payload.data.id);
        // Handle order creation - provision VPS
        return { status: 'order_created', orderId: payload.data.id };

      case 'order_refunded':
        console.log('Order refunded:', payload.data.id);
        // Handle refund - suspend/terminate VPS
        return { status: 'order_refunded', orderId: payload.data.id };

      case 'subscription_created':
        console.log('Subscription created:', payload.data.id);
        // Handle subscription creation
        return { status: 'subscription_created', subscriptionId: payload.data.id };

      case 'subscription_updated':
        console.log('Subscription updated:', payload.data.id);
        // Handle subscription update
        return { status: 'subscription_updated', subscriptionId: payload.data.id };

      case 'subscription_cancelled':
        console.log('Subscription cancelled:', payload.data.id);
        // Handle subscription cancellation
        return { status: 'subscription_cancelled', subscriptionId: payload.data.id };

      case 'subscription_resumed':
        console.log('Subscription resumed:', payload.data.id);
        // Handle subscription resumption
        return { status: 'subscription_resumed', subscriptionId: payload.data.id };

      case 'subscription_expired':
        console.log('Subscription expired:', payload.data.id);
        // Handle subscription expiration
        return { status: 'subscription_expired', subscriptionId: payload.data.id };

      case 'subscription_paused':
        console.log('Subscription paused:', payload.data.id);
        // Handle subscription pause
        return { status: 'subscription_paused', subscriptionId: payload.data.id };

      case 'subscription_unpaused':
        console.log('Subscription unpaused:', payload.data.id);
        // Handle subscription unpause
        return { status: 'subscription_unpaused', subscriptionId: payload.data.id };

      case 'subscription_payment_success':
        console.log('Subscription payment success:', payload.data.id);
        // Handle successful payment
        return { status: 'payment_success', subscriptionId: payload.data.id };

      case 'subscription_payment_failed':
        console.log('Subscription payment failed:', payload.data.id);
        // Handle failed payment - notify user
        return { status: 'payment_failed', subscriptionId: payload.data.id };

      case 'subscription_payment_recovered':
        console.log('Subscription payment recovered:', payload.data.id);
        // Handle recovered payment
        return { status: 'payment_recovered', subscriptionId: payload.data.id };

      default:
        console.log('Unhandled webhook event:', eventName);
        return { status: 'unhandled', event: eventName };
    }
  }

  /**
   * Create a product (for setup)
   */
  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    interval?: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
  }) {
    try {
      const { createProduct } = await import('@lemonsqueezy/lemonsqueezy.js');
      const product = await createProduct(this.config.storeId, data);
      return product.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * List all products
   */
  async listProducts() {
    try {
      const { listProducts } = await import('@lemonsqueezy/lemonsqueezy.js');
      const products = await listProducts({ filter: { storeId: this.config.storeId } });
      return products.data;
    } catch (error) {
      console.error('Error listing products:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lemonSqueezy = new LemonSqueezyClient();
