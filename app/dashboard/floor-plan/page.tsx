'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import FloorPlanEditor from '@/components/floor-plan/FloorPlanEditor';
import TableStatusList from '@/components/floor-plan/TableStatusList';
import WaitList from '@/components/floor-plan/WaitList';

export default function FloorPlanPage() {
  const { data: session } = useSession();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Floor Plan Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your restaurant layout and track table status
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
        {/* Floor Plan */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <FloorPlanEditor
                selectedTable={selectedTable}
                onTableSelect={setSelectedTable}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Table Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Table Status
              </h2>
              <TableStatusList
                selectedTable={selectedTable}
                onTableSelect={setSelectedTable}
              />
            </div>
          </div>

          {/* Wait List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Wait List
              </h2>
              <WaitList selectedTable={selectedTable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}