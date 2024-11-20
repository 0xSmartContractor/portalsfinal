import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tableId } = await request.json();

    // Reset all tables merged with this one
    await prisma.table.updateMany({
      where: { mergedWith: tableId },
      data: {
        mergedWith: null,
        status: 'AVAILABLE',
      },
    });

    // Reset the main table
    const table = await prisma.table.update({
      where: { id: tableId },
      data: {
        seats: table.originalSeats, // You'll need to add this field
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unmerging tables:', error);
    return NextResponse.json(
      { error: 'Failed to unmerge tables' },
      { status: 500 }
    );
  }
}