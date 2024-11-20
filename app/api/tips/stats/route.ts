import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import {
  startOfDay,
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
} from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const where = session.user.role === 'MANAGER' ? {} : { userId: session.user.id };

    // Calculate various date ranges
    const today = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);

    // Fetch all required statistics
    const [
      dailyAverage,
      weeklyTotal,
      monthlyTotal,
      yearlyTotal,
      lastSevenDays,
      topEarners,
    ] = await Promise.all([
      // Daily Average
      prisma.tipEntry.aggregate({
        where,
        _avg: {
          amount: true,
        },
      }),

      // Weekly Total
      prisma.tipEntry.aggregate({
        where: {
          ...where,
          date: {
            gte: weekStart,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Monthly Total
      prisma.tipEntry.aggregate({
        where: {
          ...where,
          date: {
            gte: monthStart,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Yearly Total
      prisma.tipEntry.aggregate({
        where: {
          ...where,
          date: {
            gte: yearStart,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Last 7 Days
      prisma.tipEntry.groupBy({
        by: ['date'],
        where: {
          ...where,
          date: {
            gte: subDays(today, 6),
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Top Earners (Managers Only)
      session.user.role === 'MANAGER'
        ? prisma.tipEntry.groupBy({
            by: ['userId'],
            where: {
              date: {
                gte: monthStart,
              },
            },
            _sum: {
              amount: true,
            },
            orderBy: {
              _sum: {
                amount: 'desc',
              },
            },
            take: 5,
          })
        : Promise.resolve([]),
    ]);

    // Format last seven days data
    const lastSevenDaysFormatted = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, i);
      const entry = lastSevenDays.find(
        (d) => format(new Date(d.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      return {
        date: format(date, 'MMM d'),
        amount: entry?._sum.amount || 0,
      };
    }).reverse();

    // Get user details for top earners
    let topEarnersWithDetails = [];
    if (session.user.role === 'MANAGER') {
      const userIds = topEarners.map((e) => e.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, position: true },
      });

      topEarnersWithDetails = topEarners.map((earner) => {
        const user = users.find((u) => u.id === earner.userId);
        return {
          name: user?.name || 'Unknown',
          position: user?.position || 'Unknown',
          total: earner._sum.amount || 0,
        };
      });
    }

    return NextResponse.json({
      dailyAverage: dailyAverage._avg.amount || 0,
      weeklyTotal: weeklyTotal._sum.amount || 0,
      monthlyTotal: monthlyTotal._sum.amount || 0,
      yearlyTotal: yearlyTotal._sum.amount || 0,
      lastSevenDays: lastSevenDaysFormatted,
      ...(session.user.role === 'MANAGER' && { topEarners: topEarnersWithDetails }),
    });
  } catch (error) {
    console.error('Error fetching tip stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tip statistics' },
      { status: 500 }
    );
  }
}