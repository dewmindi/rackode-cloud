import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyClient } from '@/lib/lemonsqueezy';
import { SolusVMClient } from '@/lib/solusvm';

/**
 * Lemon Squeezy Webhook Handler
 * 
 * Setup instructions:
 * 1. Go to Lemon Squeezy Dashboard > Settings > Webhooks
 * 2. Add a new webhook with URL: https://yourdomain.com/api/lemonsqueezy/webhook
 * 3. Select events: order_created, subscription_created, subscription_payment_success, etc.
 * 4. Copy the signing secret and add to .env as LEMONSQUEEZY_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature');
    const rawBody = await request.text();

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    const lemonSqueezy = new LemonSqueezyClient();

    // Verify webhook signature
    const isValid = lemonSqueezy.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    console.log(`Processing webhook event: ${eventName}`);

    // Process the webhook
    const result = await lemonSqueezy.processWebhook(payload);

    // Handle order creation - provision VPS
    if (eventName === 'order_created') {
      await handleOrderCreated(payload);
    }

    // Handle subscription events
    if (eventName === 'subscription_payment_success') {
      await handleSubscriptionPayment(payload);
    }

    // Handle refunds - suspend/terminate VPS
    if (eventName === 'order_refunded') {
      await handleOrderRefunded(payload);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      result,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle order creation - Provision VPS instances
 */
async function handleOrderCreated(payload: any) {
  try {
    const customData = payload.meta.custom_data;
    const orderAttributes = payload.data.attributes;

    if (!customData?.cartItems) {
      console.log('No cart items in order, skipping VPS provisioning');
      return;
    }

    const cartItems = JSON.parse(customData.cartItems);
    const customerEmail = orderAttributes.user_email;
    const customerName = orderAttributes.user_name;

    console.log(`Provisioning ${cartItems.length} VPS instances for ${customerEmail}`);

    const solusvm = new SolusVMClient();

    // Provision each VPS
    for (const item of cartItems) {
      try {
        console.log(`Creating VPS: ${item.config.hostname}`);
        
        // Create VPS using SolusVM
        const vpsResult = await solusvm.createVPS({
          type: 'kvm',
          node: '',
          hostname: item.config.hostname,
          password: generateSecurePassword(),
          username: customerEmail,
          plan: item.planId,
          template: item.config.os,
          ips: item.config.extraIp === 'none' ? 1 : parseInt(item.config.extraIp.split('-')[0]) || 1,
          customemail: customerEmail,
          custusername: customerName,
        });

        if (vpsResult.status === 'success') {
          console.log(`VPS created successfully: ${vpsResult.vserverid}`);
          
          // TODO: Store VPS details in your database
          // await saveVPSToDatabase({
          //   orderId: payload.data.id,
          //   vpsId: vpsResult.vserverid,
          //   ipAddress: vpsResult.mainipaddress,
          //   password: vpsResult.rootpassword,
          //   customerEmail,
          // });

          // TODO: Send email with VPS credentials
          // await sendVPSCredentialsEmail(customerEmail, vpsResult);
        } else {
          console.error(`Failed to create VPS: ${vpsResult.statusmsg}`);
        }
      } catch (error) {
        console.error(`Error provisioning VPS for ${item.config.hostname}:`, error);
      }
    }

    console.log('VPS provisioning completed');
  } catch (error) {
    console.error('Error in handleOrderCreated:', error);
    throw error;
  }
}

/**
 * Handle subscription payment success
 */
async function handleSubscriptionPayment(payload: any) {
  try {
    const subscriptionId = payload.data.id;
    const customData = payload.meta.custom_data;

    console.log(`Subscription payment received: ${subscriptionId}`);

    // TODO: Update subscription status in database
    // TODO: Unsuspend VPS if it was suspended for non-payment
    
  } catch (error) {
    console.error('Error in handleSubscriptionPayment:', error);
  }
}

/**
 * Handle order refund - Suspend/terminate VPS
 */
async function handleOrderRefunded(payload: any) {
  try {
    const orderId = payload.data.id;

    console.log(`Order refunded: ${orderId}`);

    // TODO: Find VPS instances associated with this order
    // TODO: Suspend or terminate the VPS instances
    // const solusvm = new SolusVMClient();
    // await solusvm.suspendVPS(vpsId);

  } catch (error) {
    console.error('Error in handleOrderRefunded:', error);
  }
}

/**
 * Generate secure random password
 */
function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}
