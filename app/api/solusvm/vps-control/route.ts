import { NextRequest, NextResponse } from 'next/server';
import { SolusVMClient } from '@/lib/solusvm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    // Client API doesn't need VPS ID - the key/hash is tied to one VPS
    const solusvm = new SolusVMClient();
    let response;

    // Only these actions work with Client API
    const allowedActions = ['boot', 'reboot', 'shutdown', 'status'];
    
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { 
          error: 'Invalid action for Client API',
          message: `Client API only supports: ${allowedActions.join(', ')}`,
          requestedAction: action
        },
        { status: 400 }
      );
    }

    switch (action) {
      case 'boot':
        response = await solusvm.clientBootVPS();
        break;
      case 'reboot':
        response = await solusvm.clientRebootVPS();
        break;
      case 'shutdown':
        response = await solusvm.clientShutdownVPS();
        break;
      case 'status':
        response = await solusvm.getClientVPSStatus();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Check for error in response
    if (response.status === 'error' || response.statusmsg?.toLowerCase().includes('error')) {
      return NextResponse.json(
        { 
          error: 'Action failed', 
          details: response.statusmsg || response.status || 'Unknown error',
          response: response
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully`,
      data: response,
    });

  } catch (error) {
    console.error('Error controlling VPS:', error);
    return NextResponse.json(
      { 
        error: 'Failed to control VPS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
