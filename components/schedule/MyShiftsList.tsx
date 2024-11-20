'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ShiftTradeModal from './ShiftTradeModal';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'TRADING' | 'COVERED';
  trades: Array<{
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    requester: {
      name: string;
      position: string;
    };
  }>;
}

export default function MyShiftsList() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts/my');
      if (!response.ok) throw new Error('Failed to fetch shifts');
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeRequest = async (shift: Shift) => {
    setSelectedShift(shift);
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
                Status: {shift.status}
              </p>
              {shift.trades.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Trade Requests:
                  </p>
                  {shift.trades.map((trade) => (
                    <p
                      key={trade.id}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {trade.requester.name} ({trade.status.toLowerCase()})
                    </p>
                  ))}
                </div>
              )}
            </div>
            {shift.status === 'SCHEDULED' && (
              <button
                onClick={() => handleTradeRequest(shift)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Trade Shift
              </button>
            )}
          </div>
        </div>
      ))}

      {shifts.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No upcoming shifts found
        </p>
      )}

      {selectedShift && (
        <ShiftTradeModal
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
          onConfirm={() => {
            setSelectedShift(null);
            fetchShifts();
          }}
        />
      )}
    </div>
  );
}