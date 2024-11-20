'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface TimeOffRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    name: string;
    position: string;
  };
}

export default function TimeOffRequestList() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/time-off');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching time off requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/time-off/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update request');
      fetchRequests();
    } catch (error) {
      console.error('Error updating time off request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Employee:</strong> {request.user.name} ({request.user.position})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Dates:</strong>{' '}
                {format(new Date(request.startDate), 'MMM d, yyyy')} -{' '}
                {format(new Date(request.endDate), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Reason:</strong> {request.reason}
              </p>
              <p className="text-sm font-semibold mt-2">
                Status: {request.status}
              </p>
            </div>

            {session?.user?.role === 'MANAGER' && request.status === 'PENDING' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestAction(request.id, 'APPROVED')}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequestAction(request.id, 'REJECTED')}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          No time off requests to display
        </p>
      )}
    </div>
  );
}