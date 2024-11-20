import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const partySize = parseInt(searchParams.get('partySize') || '2');
    const timeOfDay = searchParams.get('timeOfDay') || 'dinner';

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    // Get historical data for similar conditions
    const historicalData = await prisma.tableHistoricalData.findMany({
      where: {
        tableId,
        timeOfDay,
        partySize: {
          gte: partySize - 1,
          lte: partySize + 1,
        },
        date: {
          gte: subDays(startOfDay(new Date()), 30), // Last 30 days
          lte: endOfDay(new Date()),
        },
      },
    });

    // Calculate average turn time
    const totalTurnTime = historicalData.reduce((sum, data) => sum + data.turnTime, 0);
    const averageTurnTime = historicalData.length > 0
      ? Math.round(totalTurnTime / historicalData.length)
      : 60; // Default to 60 minutes if no historical data

    return NextResponse.json({ predictedTurnTime: averageTurnTime });
  } catch (error) {
    console.error('Error getting turn time prediction:', error);
    return NextResponse.json(
      { error: 'Failed to get prediction' },
      { status: 500 }
    );
  }
}