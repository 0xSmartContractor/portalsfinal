import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tableIds } = await request.json();
    if (!tableIds || tableIds.length < 2) {
      return NextResponse.json(
        { error: 'At least two tables are required' },
        { status: 400 }
      );
    }

    // Update all tables to be merged with the first table
    await prisma.table.updateMany({
      where: {
        id: { in: tableIds.slice(1) },
      },
      data: {
        mergedWith: tableIds[0],
        status: 'MERGED',
      },
    });

    // Update the main table's seat count
    const tables = await prisma.table.findMany({
      where: { id: { in: tableIds } },
    });
    
    const totalSeats = tables.reduce((sum, table) => sum + table.seats, 0);
    
    await prisma.table.update({
      where: { id: tableIds[0] },
      data: { seats: totalSeats },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error merging tables:', error);
    return NextResponse.json(
      { error: 'Failed to merge tables' },
      { status: 500 }
    );
  }
}