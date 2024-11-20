import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Request a shift trade
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shiftId } = await request.json();

    // Create shift trade request
    const trade = await prisma.shiftTrade.create({
      data: {
        shiftId,
        requesterId: session.user.id,
        status: 'PENDING',
      },
      include: {
        shift: {
          include: {
            user: true,
          },
        },
      },
    });

    // Update shift status to TRADING
    await prisma.shift.update({
      where: { id: shiftId },
      data: { status: 'TRADING' },
    });

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error creating shift trade:', error);
    return NextResponse.json(
      { error: 'Failed to create shift trade' },
      { status: 500 }
    );
  }
}

// Approve or reject a shift trade
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tradeId, approved } = await request.json();

    const trade = await prisma.shiftTrade.update({
      where: { id: tradeId },
      data: {
        status: approved ? 'ACCEPTED' : 'REJECTED',
      },
      include: {
        shift: true,
      },
    });

    if (approved) {
      // Update shift with new user
      await prisma.shift.update({
        where: { id: trade.shiftId },
        data: {
          userId: trade.requesterId,
          status: 'COVERED',
        },
      });
    } else {
      // Reset shift status
      await prisma.shift.update({
        where: { id: trade.shiftId },
        data: {
          status: 'SCHEDULED',
        },
      });
    }

    return NextResponse.json(trade);
  } catch (error) {
    console.error('Error updating shift trade:', error);
    return NextResponse.json(
      { error: 'Failed to update shift trade' },
      { status: 500 }
    );
  }
}

// Get all pending trades
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trades = await prisma.shiftTrade.findMany({
      where: {
        OR: [
          { requesterId: session.user.id },
          { shift: { userId: session.user.id } },
          ...(session.user.role === 'MANAGER' ? [{}] : []),
        ],
      },
      include: {
        shift: {
          include: {
            user: true,
          },
        },
        requester: true,
      },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching shift trades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shift trades' },
      { status: 500 }
    );
  }
}