import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, date } = await request.json();

    const tipEntry = await prisma.tipEntry.create({
      data: {
        amount,
        date: new Date(date),
        userId: session.user.id,
      },
    });

    return NextResponse.json(tipEntry);
  } catch (error) {
    console.error('Error creating tip entry:', error);
    return NextResponse.json(
      { error: 'Failed to create tip entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = session.user.role === 'MANAGER' ? {} : { userId: session.user.id };

    const [tips, total] = await Promise.all([
      prisma.tipEntry.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              position: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.tipEntry.count({ where }),
    ]);

    return NextResponse.json({
      tips,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tips' },
      { status: 500 }
    );
  }
}