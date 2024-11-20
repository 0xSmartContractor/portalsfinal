'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import OperatingHoursForm from '@/components/settings/OperatingHoursForm';

export default function SettingsPage() {
  const { data: session } = useSession();

  if (!session?.user || session.user.role !== 'MANAGER') {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Restaurant Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your restaurant's operating hours and other settings.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <OperatingHoursForm />
        </div>
      </div>
    </div>
  );
}