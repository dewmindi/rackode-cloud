import { NextRequest, NextResponse } from 'next/server';
import { SolusVMv2Client } from '@/lib/solusvm-v2';

// GET - Get server details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  try {
    const serverId = parseInt(id); 

    if (isNaN(serverId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid server ID' },
        { status: 400 }
      );
    }

    const solusvm = new SolusVMv2Client();
    const result = await solusvm.getServer(serverId);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch server details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete server
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serverId = parseInt(params.id);

    if (isNaN(serverId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid server ID' },
        { status: 400 }
      );
    }

    const solusvm = new SolusVMv2Client();
    await solusvm.deleteServer(serverId);

    return NextResponse.json({
      success: true,
      message: 'Server deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting server:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete server',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
