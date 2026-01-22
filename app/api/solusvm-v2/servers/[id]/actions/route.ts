import { NextRequest, NextResponse } from 'next/server';
import { SolusVMv2Client } from '@/lib/solusvm-v2';

// POST - Perform server action
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const serverId = parseInt(id);
    const { action } = body;

    if (isNaN(serverId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid server ID' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    const solusvm = new SolusVMv2Client();
    let result;

    switch (action) {
      case 'start':
      case 'boot':
        await solusvm.startServer(serverId);
        result = { message: 'Server started successfully' };
        break;

      case 'stop':
      case 'shutdown':
        await solusvm.stopServer(serverId);
        result = { message: 'Server stopped successfully' };
        break;

      case 'restart':
      case 'reboot':
        await solusvm.restartServer(serverId);
        result = { message: 'Server restarted successfully' };
        break;

      case 'status':
        result = await solusvm.getServerStatus(serverId);
        break;

      case 'console':
        result = await solusvm.getConsoleUrl(serverId);
        break;

      case 'reset-password':
        result = await solusvm.resetPassword(serverId);
        break;

      case 'reinstall':
        const { os_image_version_id } = body;
        if (!os_image_version_id) {
          return NextResponse.json(
            { success: false, error: 'os_image_version_id is required for reinstall' },
            { status: 400 }
          );
        }
        await solusvm.reinstallServer(serverId, parseInt(os_image_version_id));
        result = { message: 'Server reinstall initiated' };
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            validActions: ['start', 'stop', 'restart', 'status', 'console', 'reset-password', 'reinstall']
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      ...result
    });

  } catch (error) {
    console.error('Error performing server action:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to perform action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
