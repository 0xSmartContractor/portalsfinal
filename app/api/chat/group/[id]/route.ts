import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Get messages for a specific group chat
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a member of the chat
    const membership = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this chat' },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        readReceipts: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching group messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a message to a group chat
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    // Verify user is a member of the chat
    const membership = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this chat' },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        userId: session.user.id,
        chatId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Emit through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.to(params.id).emit('groupMessage', message);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending group message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}