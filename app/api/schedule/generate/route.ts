import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { startOfWeek, addDays, format, isWithinInterval } from 'date-fns';

interface ShiftTemplate {
  startTime: string;
  endTime: string;
  requiredRoles: { [key: string]: number };
}

const shiftTemplates: ShiftTemplate[] = [
  {
    startTime: '07:00',
    endTime: '15:00',
    requiredRoles: {
      'Chef': 1,
      'Line Cook': 2,
      'Dishwasher': 1,
    },
  },
  {
    startTime: '11:00',
    endTime: '19:00',
    requiredRoles: {
      'Server': 3,
      'Host': 1,
      'Bartender': 1,
      'Line Cook': 2,
      'Dishwasher': 1,
    },
  },
  {
    startTime: '15:00',
    endTime: '23:00',
    requiredRoles: {
      'Chef': 1,
      'Server': 4,
      'Host': 1,
      'Bartender': 2,
      'Line Cook': 2,
      'Dishwasher': 1,
    },
  },
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { weekStart } = await request.json();
    const start = startOfWeek(new Date(weekStart));

    // Get operating hours
    const operatingHours = await prisma.operatingHours.findMany({
      where: { isOpen: true },
    });

    // Get all employees and their availability
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      include: {
        availability: {
          where: {
            OR: [
              { validUntil: null },
              { validUntil: { gt: new Date() } },
            ],
          },
        },
      },
    });

    // Get time off requests for the week
    const timeOffRequests = await prisma.timeOffRequest.findMany({
      where: {
        status: 'APPROVED',
        startDate: { lte: addDays(start, 6) },
        endDate: { gte: start },
      },
    });

    // Delete existing shifts for the week
    await prisma.shift.deleteMany({
      where: {
        date: {
          gte: start,
          lt: addDays(start, 7),
        },
      },
    });

    const shifts = [];

    // Generate shifts for each day
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(start, day);
      const dayOfWeek = currentDate.getDay();
      const dayOperatingHours = operatingHours.find(h => h.dayOfWeek === dayOfWeek);

      if (!dayOperatingHours) continue;

      // For each shift template
      for (const template of shiftTemplates) {
        // Check if shift falls within operating hours
        if (template.startTime >= dayOperatingHours.openTime &&
            template.endTime <= dayOperatingHours.closeTime) {
          
          // For each role in the template
          for (const [role, count] of Object.entries(template.requiredRoles)) {
            // Get available employees for this role
            const availableEmployees = employees.filter(employee => {
              // Check position matches
              if (employee.position !== role) return false;

              // Check availability for this day and time
              const dayAvailability = employee.availability.find(
                a => a.dayOfWeek === dayOfWeek
              );
              if (!dayAvailability) return false;
              if (template.startTime < dayAvailability.startTime ||
                  template.endTime > dayAvailability.endTime) return false;

              // Check time off requests
              const hasTimeOff = timeOffRequests.some(request =>
                request.userId === employee.id &&
                isWithinInterval(currentDate, {
                  start: new Date(request.startDate),
                  end: new Date(request.endDate),
                })
              );
              if (hasTimeOff) return false;

              return true;
            });

            // Randomly assign shifts to available employees
            for (let i = 0; i < count; i++) {
              if (availableEmployees.length === 0) break;
              
              const randomIndex = Math.floor(Math.random() * availableEmployees.length);
              const employee = availableEmployees.splice(randomIndex, 1)[0];

              shifts.push({
                userId: employee.id,
                date: currentDate,
                startTime: template.startTime,
                endTime: template.endTime,
              });
            }
          }
        }
      }
    }

    // Create all shifts in database
    await prisma.shift.createMany({
      data: shifts,
    });

    return NextResponse.json({ success: true, shiftsCreated: shifts.length });
  } catch (error) {
    console.error('Schedule generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}