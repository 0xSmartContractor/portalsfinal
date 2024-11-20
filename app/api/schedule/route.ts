import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekStart = new Date(searchParams.get('weekStart') || new Date());
    
    const start = startOfWeek(weekStart);
    const end = endOfWeek(weekStart);

    const shifts = await prisma.shift.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        ...(session.user.role === 'EMPLOYEE' ? { userId: session.user.id } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}