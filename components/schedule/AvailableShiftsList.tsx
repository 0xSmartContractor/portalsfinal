'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AvailableShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    name: string;
    position: string;
  };
  trades: Array<{
    id: string;
    status: 'PENDING';
  }>;
}

export default function AvailableShiftsList() {
  const [shifts, setShifts] = useState<AvailableShift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableShifts();
  }, []);

  const fetchAvailableShifts = async () => {
    try {
      const response = await fetch('/api/shifts/available');
      if (!response.ok) throw new Error('Failed to fetch available shifts');
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error('Error fetching available shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickupRequest = async (shiftId: string) => {
    try {
      const response = await fetch('/api/shifts/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId }),
      });

      if (!response.ok) throw new Error('Failed to request shift');
      fetchAvailableShifts();
    } catch (error) {
      console.error('Error requesting shift:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                {format(new Date(shift.date), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {shift.startTime} - {shift.endTime}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Posted by: {shift.user.name} ({shift.user.position})
              </p>
              {shift.trades.length > 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  {shift.trades.length} pending request(s)
                </p>
              )}
            </div>
            <button
              onClick={() => handlePickupRequest(shift.id)}
              disabled={shift.trades.some((t) => t.status === 'PENDING')}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Request Pickup
            </button>
          </div>
        </div>
      ))}

      {shifts.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No shifts available for pickup
        </p>
      )}
    </div>
  );
}