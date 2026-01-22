import { NextRequest, NextResponse } from 'next/server';
import { SolusVMv2Client } from '@/lib/solusvm-v2';

export async function GET(request: NextRequest) {
  try {
    const solusvm = new SolusVMv2Client();
    
    console.log('Testing SolusVM v2 API connection...');
    const isConnected = await solusvm.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unable to connect to SolusVM v2 API',
          message: 'Please check your API credentials in .env file'
        },
        { status: 500 }
      );
    }

    // Get available resources
    const [servers, plans, locations, osImages] = await Promise.all([
      solusvm.listServers().catch(() => ({ data: [] })),
      solusvm.listPlans().catch(() => ({ data: [] })),
      solusvm.listLocations().catch(() => ({ data: [] })),
      solusvm.listOSImages().catch(() => ({ data: [] })),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to SolusVM v2 API',
      connected: true,
      apiVersion: 'v2',
      capabilities: [
        'List/Create/Delete Servers',
        'Start/Stop/Restart Servers',
        'Console Access',
        'Backups Management',
        'User Management',
        'Statistics & Bandwidth',
        'Full Automation'
      ],
      resources: {
        servers: servers.data.length,
        plans: plans.data.length,
        locations: locations.data.length,
        osImages: osImages.data.length,
      },
      serversList: servers.data,
    });

  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
