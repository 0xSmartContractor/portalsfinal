import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Get direct messages with a specific user
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          {
            senderId: session.user.id,
            recipientId: otherUserId,
          },
          {
            senderId: otherUserId,
            recipientId: session.user.id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a direct message
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, content } = await request.json();

    const message = await prisma.directMessage.create({
      data: {
        content,
        senderId: session.user.id,
        recipientId,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });

    // Emit through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.to(recipientId).emit('directMessage', message);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending direct message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}