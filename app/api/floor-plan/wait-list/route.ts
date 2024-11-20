import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const waitList = await prisma.waitingParty.findMany({
      orderBy: { waitingSince: 'asc' },
    });
    return NextResponse.json(waitList);
  } catch (error) {
    console.error('Error fetching wait list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wait list' },
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
    const party = await prisma.waitingParty.create({
      data: {
        ...data,
        waitingSince: new Date(),
        status: 'WAITING',
      },
    });

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error creating waiting party:', error);
    return NextResponse.json(
      { error: 'Failed to create waiting party' },
      { status: 500 }
    );
  }
}