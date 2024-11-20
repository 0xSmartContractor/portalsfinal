import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (session?.user?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tableId, serverId } = await request.json();

    const table = await prisma.table.update({
      where: { id: tableId },
      data: { serverId },
      include: {
        server: {
          select: {
            name: true,
            position: true,
          },
        },
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error assigning server:', error);
    return NextResponse.json(
      { error: 'Failed to assign server' },
      { status: 500 }
    );
  }
}