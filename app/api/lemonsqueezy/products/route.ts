import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyClient } from '@/lib/lemonsqueezy';

/**
 * List all products in your Lemon Squeezy store
 * GET /api/lemonsqueezy/products
 */
export async function GET(request: NextRequest) {
  try {
    const lemonSqueezy = new LemonSqueezyClient();
    const products = await lemonSqueezy.listProducts();

    return NextResponse.json({
      success: true,
      products: products?.data || [],
      count: products?.data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
