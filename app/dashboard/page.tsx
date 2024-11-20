'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';
import ScheduleControls from '@/components/schedule/ScheduleControls';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Schedule Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {session?.user?.role === 'MANAGER'
            ? 'Manage and generate schedules for your team.'
            : 'View your schedule and manage your shifts.'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <ScheduleControls
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
          />
          <ScheduleGrid currentWeek={currentWeek} />
        </div>
      </div>
    </div>
  );
}