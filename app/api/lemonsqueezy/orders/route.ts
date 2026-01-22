import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyClient } from '@/lib/lemonsqueezy';

/**
 * List orders from your Lemon Squeezy store
 * GET /api/lemonsqueezy/orders
 * 
 * Query params:
 * - email: Filter by customer email
 * - status: Filter by order status (paid, pending, refunded)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    const lemonSqueezy = new LemonSqueezyClient();
    
    const filter: Record<string, string> = {};
    if (email) filter.user_email = email;
    if (status) filter.status = status;

    const orders = await lemonSqueezy.listOrders({ filter });

    return NextResponse.json({
      success: true,
      orders: orders?.data || [],
      count: orders?.data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
