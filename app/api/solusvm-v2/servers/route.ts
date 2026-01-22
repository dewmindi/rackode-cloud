import { NextRequest, NextResponse } from 'next/server';
import { SolusVMv2Client } from '@/lib/solusvm-v2';

// GET - List all servers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const perPage = searchParams.get('per_page');

    const solusvm = new SolusVMv2Client();
    const result = await solusvm.listServers({
      page: page ? parseInt(page) : undefined,
      per_page: perPage ? parseInt(perPage) : undefined,
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error listing servers:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to list servers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new server
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      plan_id,
      os_image_version_id,
      location_id,
      project_id,
      ssh_keys,
      user_data,
      backup_enabled
    } = body;

    // Validate required fields
    if (!name || !plan_id || !os_image_version_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          required: ['name', 'plan_id', 'os_image_version_id']
        },
        { status: 400 }
      );
    }

    const solusvm = new SolusVMv2Client();
    
    const serverParams = {
      name,
      plan_id: parseInt(plan_id),
      os_image_version_id: parseInt(os_image_version_id),
      location_id: location_id ? parseInt(location_id) : undefined,
      project_id: project_id ? parseInt(project_id) : undefined,
      ssh_keys: ssh_keys || [],
      user_data: user_data || undefined,
      backup_settings: backup_enabled ? { enabled: true } : undefined,
    };

    const result = await solusvm.createServer(serverParams);

    return NextResponse.json({
      success: true,
      message: 'Server created successfully',
      ...result
    });

  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create server',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
