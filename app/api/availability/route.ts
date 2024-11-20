import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dayOfWeek, startTime, endTime, validUntil } = await request.json();

    // If updating existing availability for this day, mark it as expired
    await prisma.availability.updateMany({
      where: {
        userId: session.user.id,
        dayOfWeek,
        validUntil: null,
      },
      data: {
        validUntil: new Date(),
      },
    });

    // Create new availability
    const availability = await prisma.availability.create({
      data: {
        userId: session.user.id,
        dayOfWeek,
        startTime,
        endTime,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json(
      { error: 'Failed to create availability' },
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
    const userId = searchParams.get('userId') || session.user.id;

    // Only managers can view other users' availability
    if (userId !== session.user.id && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const availability = await prisma.availability.findMany({
      where: {
        userId,
        OR: [
          { validUntil: null },
          { validUntil: { gt: new Date() } },
        ],
      },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}