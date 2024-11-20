'use client';

import { useSession } from 'next-auth/react';
import { addWeeks, subWeeks, format } from 'date-fns';

interface ScheduleControlsProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

export default function ScheduleControls({ 
  currentWeek, 
  onWeekChange 
}: ScheduleControlsProps) {
  const { data: session } = useSession();
  const isManager = session?.user?.role === 'MANAGER';

  const generateSchedule = async () => {
    try {
      const response = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weekStart: currentWeek }),
      });
      
      if (!response.ok) throw new Error('Failed to generate schedule');
      
      // Refresh the schedule display
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onWeekChange(subWeeks(currentWeek, 1))}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Previous Week
        </button>
        <span className="font-semibold">
          {format(currentWeek, 'MMMM d, yyyy')}
        </span>
        <button
          onClick={() => onWeekChange(addWeeks(currentWeek, 1))}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Next Week
        </button>
      </div>
      
      {isManager && (
        <div className="flex space-x-4">
          <button
            onClick={generateSchedule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Schedule
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Publish Schedule
          </button>
        </div>
      )}
    </div>
  );
}