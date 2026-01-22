import { NextRequest, NextResponse } from 'next/server';
import { SolusVMClient, mapOSToTemplate, mapLocationToNode, generateSecurePassword } from '@/lib/solusvm';

export async function POST(request: NextRequest) {
  // NOTE: This endpoint requires ADMIN API access
  // Current configuration uses CLIENT API which cannot create new VPS
  // See IMPORTANT_CLIENT_API_NOTE.md for details
  
  return NextResponse.json(
    { 
      error: 'VPS creation requires Admin API access',
      message: 'Your current API credentials are for the Client API, which cannot create new VPS instances. Please contact RackNerd for Admin API access or see IMPORTANT_CLIENT_API_NOTE.md for alternative solutions.',
      documentation: '/IMPORTANT_CLIENT_API_NOTE.md'
    },
    { status: 403 }
  );

  /* Original code - Requires Admin API
  try {
    const body = await request.json();
    
    const {
      planId,
      hostname,
      os,
      location,
      customerEmail,
      customerName,
      extraIps = 1,
    } = body;

    // Validate required fields
    if (!planId || !hostname || !os || !location || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize SolusVM client
    const solusvm = new SolusVMClient();

    // Test connection first
    const isConnected = await solusvm.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Unable to connect to SolusVM. Please check API credentials.' },
        { status: 500 }
      );
    }

    // Generate secure root password
    const rootPassword = generateSecurePassword(16);

    // Map location to node/nodegroup
    const nodeConfig = mapLocationToNode(location);

    // Map OS to SolusVM template
    const template = mapOSToTemplate(os);

    // Generate username from email
    const username = customerEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // Create VPS parameters
    const vpsParams = {
      type: 'kvm' as const, // or 'xen', 'openvz' depending on your setup
      node: nodeConfig.node || '',
      nodegroup: nodeConfig.nodegroup,
      hostname: hostname,
      password: rootPassword,
      username: username,
      plan: planId, // This should match your SolusVM plan name
      template: template,
      ips: extraIps,
      customemail: customerEmail,
      custusername: customerName || username,
    };

    // Create the VPS
    const response = await solusvm.createVPS(vpsParams);

    if (response.status === 'error') {
      return NextResponse.json(
        { 
          error: 'Failed to create VPS', 
          details: response.statusmsg || 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Return success with VPS details
    return NextResponse.json({
      success: true,
      vpsId: response.vserverid,
      ipAddress: response.mainipaddress,
      rootPassword: response.rootpassword || rootPassword,
      extraIPs: response.extraipaddress || [],
      message: 'VPS created successfully',
    });

  } catch (error) {
    console.error('Error creating VPS:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
  */
}
