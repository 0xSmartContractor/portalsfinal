import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const hours = await prisma.operatingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error fetching operating hours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operating hours' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (session?.user?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dayOfWeek, openTime, closeTime, isOpen } = await request.json();

    const hours = await prisma.operatingHours.upsert({
      where: { dayOfWeek_unique: { dayOfWeek } },
      update: { openTime, closeTime, isOpen },
      create: { dayOfWeek, openTime, closeTime, isOpen },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error('Error updating operating hours:', error);
    return NextResponse.json(
      { error: 'Failed to update operating hours' },
      { status: 500 }
    );
  }
}