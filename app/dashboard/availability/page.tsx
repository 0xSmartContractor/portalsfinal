'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AvailabilityForm from '@/components/schedule/AvailabilityForm';
import TimeOffRequestForm from '@/components/schedule/TimeOffRequestForm';
import TimeOffRequestList from '@/components/schedule/TimeOffRequestList';

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Availability Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Set your weekly availability and manage time off requests.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Weekly Availability */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Availability
            </h2>
            <AvailabilityForm />
          </div>
        </div>

        {/* Time Off Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Time Off Requests
              </h2>
              <button
                onClick={() => setShowTimeOffModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Request Time Off
              </button>
            </div>
            <TimeOffRequestList />
          </div>
        </div>
      </div>

      {showTimeOffModal && (
        <TimeOffRequestForm
          onClose={() => setShowTimeOffModal(false)}
          onSubmit={() => {
            setShowTimeOffModal(false);
            // Refresh the list
          }}
        />
      )}
    </div>
  );
}