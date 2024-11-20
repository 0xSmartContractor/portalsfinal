import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const party = await prisma.waitingParty.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error updating waiting party:', error);
    return NextResponse.json(
      { error: 'Failed to update waiting party' },
      { status: 500 }
    );
  }
}