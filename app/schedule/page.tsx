'use client';

import { useState } from 'react';
import ScheduleGrid from '@/components/schedule/ScheduleGrid';
import ScheduleControls from '@/components/schedule/ScheduleControls';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Schedule Management</h1>
      <ScheduleControls 
        currentWeek={currentWeek} 
        onWeekChange={setCurrentWeek}
      />
      <ScheduleGrid currentWeek={currentWeek} />
    </div>
  );
}