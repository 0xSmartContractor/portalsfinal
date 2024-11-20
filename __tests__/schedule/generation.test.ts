import { generateSchedule } from '@/lib/schedule/generator';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('Schedule Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates schedule based on employee availability', async () => {
    const mockEmployees = [
      {
        id: '1',
        name: 'John Doe',
        position: 'Server',
        availability: [
          {
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '17:00',
          },
        ],
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockEmployees);

    const schedule = await generateSchedule(new Date());
    expect(schedule).toBeDefined();
    expect(schedule.length).toBeGreaterThan(0);
  });

  it('handles time off requests when generating schedule', async () => {
    const mockTimeOff = [
      {
        userId: '1',
        startDate: new Date(),
        endDate: new Date(),
        status: 'APPROVED',
      },
    ];

    (prisma.timeOffRequest.findMany as jest.Mock).mockResolvedValueOnce(mockTimeOff);

    const schedule = await generateSchedule(new Date());
    expect(schedule).toBeDefined();
    expect(schedule.some(shift => shift.userId === '1')).toBeFalsy();
  });

  it('respects minimum staffing requirements', async () => {
    const schedule = await generateSchedule(new Date());
    
    // Group shifts by day and time
    const staffingLevels = schedule.reduce((acc, shift) => {
      const key = `${shift.date}_${shift.startTime}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Check minimum staffing levels
    Object.values(staffingLevels).forEach(level => {
      expect(level).toBeGreaterThanOrEqual(2); // Minimum 2 staff per shift
    });
  });
});