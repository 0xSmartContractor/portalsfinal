import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get shifts that are up for trade
    const availableShifts = await prisma.shift.findMany({
      where: {
        status: 'TRADING',
        NOT: {
          userId: session.user.id,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            position: true,
          },
        },
        trades: {
          where: {
            status: 'PENDING',
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(availableShifts);
  } catch (error) {
    console.error('Error fetching available shifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available shifts' },
      { status: 500 }
    );
  }
}