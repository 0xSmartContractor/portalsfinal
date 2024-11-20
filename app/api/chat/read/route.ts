import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId } = await request.json();

    const readReceipt = await prisma.readReceipt.upsert({
      where: {
        userId_messageId: {
          userId: session.user.id,
          messageId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        messageId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Emit read receipt through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.emit('readReceipt', { messageId, readReceipt });
    }

    return NextResponse.json(readReceipt);
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark message as read' },
      { status: 500 }
    );
  }
}