'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface ShiftTrade {
  id: string;
  shift: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    user: {
      name: string;
    };
  };
  requester: {
    name: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default function ShiftTradeList() {
  const { data: session } = useSession();
  const [trades, setTrades] = useState<ShiftTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/shifts/trade');
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeAction = async (tradeId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/shifts/trade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradeId, approved }),
      });

      if (!response.ok) throw new Error('Failed to update trade');
      fetchTrades();
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Date:</strong>{' '}
                {format(new Date(trade.shift.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Time:</strong> {trade.shift.startTime} -{' '}
                {trade.shift.endTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>From:</strong> {trade.shift.user.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>To:</strong> {trade.requester.name}
              </p>
              <p className="text-sm font-semibold mt-2">
                Status: {trade.status}
              </p>
            </div>

            {session?.user?.role === 'MANAGER' && trade.status === 'PENDING' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTradeAction(trade.id, true)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleTradeAction(trade.id, false)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {trades.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          No shift trades to display
        </p>
      )}
    </div>
  );
}