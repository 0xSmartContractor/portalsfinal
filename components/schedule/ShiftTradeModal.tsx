'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ShiftTradeModalProps {
  shift: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    user: {
      name: string;
    };
  };
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShiftTradeModal({
  shift,
  onClose,
  onConfirm,
}: ShiftTradeModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/shifts/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: shift.id,
          reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to request trade');

      onConfirm();
    } catch (error) {
      console.error('Error requesting trade:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Request Shift Trade
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Date:</strong>{' '}
              {format(new Date(shift.date), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Time:</strong> {shift.startTime} - {shift.endTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Current Assignment:</strong> {shift.user.name}
            </p>
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason for Trade (Optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Requesting...' : 'Request Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}