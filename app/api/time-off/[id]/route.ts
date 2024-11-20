import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.role === 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    const timeOff = await prisma.timeOffRequest.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            position: true,
          },
        },
      },
    });

    return NextResponse.json(timeOff);
  } catch (error) {
    console.error('Error updating time off request:', error);
    return NextResponse.json(
      { error: 'Failed to update time off request' },
      { status: 500 }
    );
  }
}