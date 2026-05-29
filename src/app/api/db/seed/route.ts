import { NextResponse } from 'next/server';
import { seedDatabase } from '../../../../lib/seed';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with premium mock data!',
      data: result
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database seeding failed.'
      },
      { status: 500 }
    );
  }
}
