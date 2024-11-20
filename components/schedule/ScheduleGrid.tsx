'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useSession } from 'next-auth/react';

interface Shift {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export default function ScheduleGrid({ currentWeek }: { currentWeek: Date }) {
  const { data: session } = useSession();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const weekStart = startOfWeek(currentWeek);
  
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleShiftClick = (date: Date, time: string) => {
    if (session?.user?.role !== 'MANAGER') return;
    // Add shift editing logic here
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Time</th>
            {weekDays.map((day) => (
              <th key={day.toString()} className="border p-2">
                {format(day, 'EEE MM/dd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td className="border p-2 whitespace-nowrap">{time}</td>
              {weekDays.map((day) => (
                <td
                  key={`${day}-${time}`}
                  className="border p-2 min-w-[120px] h-8 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShiftClick(day, time)}
                >
                  {/* Render shifts here */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}