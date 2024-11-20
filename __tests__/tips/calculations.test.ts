import { calculateTipStats } from '@/lib/tips/calculator';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('Tip Calculations', () => {
  const mockTipEntries = [
    { amount: 50, date: new Date('2023-09-01') },
    { amount: 75, date: new Date('2023-09-01') },
    { amount: 100, date: new Date('2023-09-02') },
  ];

  beforeEach(() => {
    (prisma.tipEntry.findMany as jest.Mock).mockResolvedValue(mockTipEntries);
  });

  it('calculates daily average correctly', async () => {
    const stats = await calculateTipStats(new Date('2023-09-01'));
    expect(stats.dailyAverage).toBe(75); // (50 + 75 + 100) / 3
  });

  it('calculates weekly totals correctly', async () => {
    const stats = await calculateTipStats(new Date('2023-09-01'));
    expect(stats.weeklyTotal).toBe(225); // 50 + 75 + 100
  });

  it('groups tips by employee correctly', async () => {
    const mockEmployeeTips = [
      { userId: '1', amount: 50, user: { name: 'John' } },
      { userId: '1', amount: 75, user: { name: 'John' } },
      { userId: '2', amount: 100, user: { name: 'Jane' } },
    ];

    (prisma.tipEntry.groupBy as jest.Mock).mockResolvedValue(mockEmployeeTips);

    const stats = await calculateTipStats(new Date('2023-09-01'));
    expect(stats.byEmployee).toEqual({
      'John': 125,
      'Jane': 100,
    });
  });

  it('handles empty tip entries', async () => {
    (prisma.tipEntry.findMany as jest.Mock).mockResolvedValue([]);

    const stats = await calculateTipStats(new Date('2023-09-01'));
    expect(stats.dailyAverage).toBe(0);
    expect(stats.weeklyTotal).toBe(0);
    expect(stats.byEmployee).toEqual({});
  });
});