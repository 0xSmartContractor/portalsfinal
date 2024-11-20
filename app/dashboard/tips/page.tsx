'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import TipEntryForm from '@/components/tips/TipEntryForm';
import TipHistory from '@/components/tips/TipHistory';
import TipStats from '@/components/tips/TipStats';

export default function TipsPage() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTipAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tip Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {session?.user?.role === 'MANAGER'
            ? 'View and analyze tip data for your team'
            : 'Track and manage your tips'}
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Tip Entry Form */}
        {session?.user?.role !== 'MANAGER' && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Log New Tips
                </h2>
                <TipEntryForm onTipAdded={handleTipAdded} />
              </div>
            </div>
          </div>
        )}

        {/* Tip History */}
        <div className={session?.user?.role === 'MANAGER' ? 'lg:col-span-2' : 'lg:col-span-2'}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {session?.user?.role === 'MANAGER' ? 'Team Tip History' : 'Your Tip History'}
              </h2>
              <TipHistory refreshKey={refreshKey} />
            </div>
          </div>
        </div>

        {/* Tip Statistics */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tip Statistics
              </h2>
              <TipStats refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}