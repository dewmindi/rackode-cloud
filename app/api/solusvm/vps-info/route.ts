import { NextRequest, NextResponse } from 'next/server';
import { SolusVMClient } from '@/lib/solusvm';

/**
 * Get VPS Information
 * Client API endpoint - returns detailed info about the VPS
 * Documentation: https://docs.solusvm.com/v1/api/admin/virtual-server-functions/Virtual+Server+Information.html
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vserverid = searchParams.get('vserverid');
    const reboot = searchParams.get('reboot');

    const solusvm = new SolusVMClient();

    // Build request parameters
    const params: any = {};
    
    // vserverid is optional - if not provided, returns info for the VPS tied to the API credentials
    if (vserverid) {
      params.vserverid = vserverid;
    }

    // Optional reboot parameter
    if (reboot) {
      params.reboot = reboot;
    }

    const result = await solusvm.makeRequest('vserver-info', params);

    return NextResponse.json({
      success: result.status === 'success',
      ...result
    });

  } catch (error) {
    console.error('Error getting VPS info:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get VPS information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST method support (SolusVM supports both GET and POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vserverid, reboot } = body;

    const solusvm = new SolusVMClient();

    // Build request parameters
    const params: any = {};
    
    if (vserverid) {
      params.vserverid = vserverid;
    }

    if (reboot) {
      params.reboot = reboot;
    }

    const result = await solusvm.makeRequest('vserver-info', params);

    return NextResponse.json({
      success: result.status === 'success',
      ...result
    });

  } catch (error) {
    console.error('Error getting VPS info:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get VPS information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
