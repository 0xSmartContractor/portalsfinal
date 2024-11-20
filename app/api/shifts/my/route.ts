import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfDay, addDays } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = startOfDay(new Date());
    const twoWeeksFromNow = addDays(today, 14);

    const shifts = await prisma.shift.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lte: twoWeeksFromNow,
        },
      },
      include: {
        trades: {
          include: {
            requester: {
              select: {
                name: true,
                position: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching user shifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}