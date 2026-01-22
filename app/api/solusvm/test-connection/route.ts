import { NextRequest, NextResponse } from 'next/server';
import { SolusVMClient } from '@/lib/solusvm';

export async function GET(request: NextRequest) {
  try {
    const solusvm = new SolusVMClient();
    
    console.log('Testing SolusVM Client API connection...');
    const isConnected = await solusvm.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unable to connect to SolusVM Client API',
          message: 'Please check your API credentials in .env file',
          note: 'Client API credentials are tied to ONE specific VPS and have limited functionality'
        },
        { status: 500 }
      );
    }

    // Get VPS status (Client API only manages one VPS per key/hash)
    const statusResponse = await solusvm.getClientVPSStatus();

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to SolusVM Client API',
      connected: true,
      apiType: 'Client API (Limited)',
      note: 'Client API credentials are tied to ONE specific VPS. Available actions: boot, reboot, shutdown, status',
      vpsStatus: statusResponse,
      availableActions: ['boot', 'reboot', 'shutdown', 'status']
    });

  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        note: 'Make sure you have SolusVM Client API credentials (key + hash) in your .env file'
      },
      { status: 500 }
    );
  }
}
