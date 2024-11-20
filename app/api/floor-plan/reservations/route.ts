import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { addMinutes, parseISO } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const reservations = await prisma.tableReservation.findMany({
      where: {
        date: date ? parseISO(date) : undefined,
      },
      include: {
        table: true,
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Check if table is available
    const conflictingReservations = await prisma.tableReservation.findMany({
      where: {
        tableId: data.tableId,
        date: data.date,
        time: {
          gte: data.time,
          lte: addMinutes(parseISO(`${data.date}T${data.time}`), data.duration).toISOString(),
        },
        status: 'CONFIRMED',
      },
    });

    if (conflictingReservations.length > 0) {
      return NextResponse.json(
        { error: 'Table is already reserved for this time' },
        { status: 400 }
      );
    }

    const reservation = await prisma.tableReservation.create({
      data,
      include: {
        table: true,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}