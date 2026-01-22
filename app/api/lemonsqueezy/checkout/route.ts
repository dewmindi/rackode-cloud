import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyClient } from '@/lib/lemonsqueezy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cartItems, 
      customerEmail, 
      customerName,
      productId, // You'll need to create products in Lemon Squeezy dashboard
      variantId, // Optional: for different pricing tiers
      customPrice,
      testMode = process.env.NODE_ENV === 'development'
    } = body;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const lemonSqueezy = new LemonSqueezyClient();

    // Create checkout session
    const checkout = await lemonSqueezy.createCheckout({
      productId: productId || process.env.LEMONSQUEEZY_DEFAULT_PRODUCT_ID || '',
      variantId,
      customPrice,
      checkoutData: {
        email: customerEmail,
        name: customerName,
        custom: {
          // Pass cart items and config to be used after payment
          cartItems: JSON.stringify(cartItems),
          timestamp: new Date().toISOString(),
        },
      },
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
        desc: true,
        discount: true,
        dark: false,
        subscriptionPreview: true,
      },
      testMode,
    });

    if (!checkout.success) {
      return NextResponse.json(
        { 
          success: false,
          error: checkout.error || 'Failed to create checkout session' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      message: 'Checkout session created successfully',
    });

  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
