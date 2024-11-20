'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ShiftTradeList from '@/components/schedule/ShiftTradeList';
import { format } from 'date-fns';

export default function ShiftsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'my-shifts' | 'available' | 'trades'>('my-shifts');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Shift Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          View your shifts, trade requests, and available shifts.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('my-shifts')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'my-shifts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Shifts
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Shifts
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'trades'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Trade Requests
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'my-shifts' && <MyShifts />}
          {activeTab === 'available' && <AvailableShifts />}
          {activeTab === 'trades' && <ShiftTradeList />}
        </div>
      </div>
    </div>
  );
}

function MyShifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and display user's shifts
  return (
    <div>
      {/* Display user's upcoming shifts */}
    </div>
  );
}

function AvailableShifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and display available shifts
  return (
    <div>
      {/* Display shifts available for pickup */}
    </div>
  );
}