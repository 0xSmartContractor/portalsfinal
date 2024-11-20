import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId, emoji } = await request.json();

    const reaction = await prisma.reaction.upsert({
      where: {
        userId_messageId_emoji: {
          userId: session.user.id,
          messageId,
          emoji,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        messageId,
        emoji,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Emit reaction through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.emit('reaction', { messageId, reaction });
    }

    return NextResponse.json(reaction);
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const emoji = searchParams.get('emoji');

    if (!messageId || !emoji) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await prisma.reaction.delete({
      where: {
        userId_messageId_emoji: {
          userId: session.user.id,
          messageId,
          emoji,
        },
      },
    });

    // Emit reaction removal through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.emit('reactionRemoved', { messageId, emoji, userId: session.user.id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json(
      { error: 'Failed to remove reaction' },
      { status: 500 }
    );
  }
}