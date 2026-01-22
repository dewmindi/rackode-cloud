import { NextRequest, NextResponse } from 'next/server';
import { SolusVMv2Client } from '@/lib/solusvm-v2';

// GET - Get available resources (plans, locations, OS images)
export async function GET(request: NextRequest) {
  try {
    const solusvm = new SolusVMv2Client();

    const [plans, locations, osImages, osImageVersions, projects] = await Promise.all([
      solusvm.listPlans(),
      solusvm.listLocations(),
      solusvm.listOSImages(),
      solusvm.listOSImageVersions(),
      solusvm.listProjects().catch(() => ({ data: [] })),
    ]);

    return NextResponse.json({
      success: true,
      resources: {
        plans: plans.data,
        locations: locations.data,
        osImages: osImages.data,
        osImageVersions: osImageVersions.data,
        projects: projects.data,
      }
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
