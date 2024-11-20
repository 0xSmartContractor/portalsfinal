'use client';

import { useState, useEffect } from 'react';
import { format, addMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  validUntil: string | null;
}

export default function AvailabilityForm() {
  const { data: session } = useSession();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const isManager = session?.user?.role === 'MANAGER';

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      if (!response.ok) throw new Error('Failed to fetch availability');
      const data = await response.json();

      // Initialize with existing data or defaults
      const initialAvailabilities = daysOfWeek.map((_, index) => {
        const existing = data.find((a: Availability) => a.dayOfWeek === index);
        return {
          dayOfWeek: index,
          startTime: existing?.startTime || '09:00',
          endTime: existing?.endTime || '17:00',
          validUntil: existing?.validUntil || null,
        };
      });

      setAvailabilities(initialAvailabilities);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const availability of availabilities) {
        await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(availability),
        });
      }
      toast.success('Availability updated successfully');
      fetchAvailability(); // Refresh the data
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {availabilities.map((day, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="w-32">
              <span className="text-gray-700 dark:text-gray-300">
                {daysOfWeek[index]}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => {
                    const newAvailabilities = [...availabilities];
                    newAvailabilities[index].startTime = e.target.value;
                    setAvailabilities(newAvailabilities);
                  }}
                  className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => {
                    const newAvailabilities = [...availabilities];
                    newAvailabilities[index].endTime = e.target.value;
                    setAvailabilities(newAvailabilities);
                  }}
                  className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                />
              </div>

              {isManager && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valid Until (Optional)
                  </label>
                  <input
                    type="date"
                    value={day.validUntil || ''}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addMonths(new Date(), 12), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const newAvailabilities = [...availabilities];
                      newAvailabilities[index].validUntil = e.target.value || null;
                      setAvailabilities(newAvailabilities);
                    }}
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Availability'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Note: Your availability will remain valid until explicitly changed{isManager ? ' or until the specified end date' : ''}.</p>
      </div>
    </form>
  );
}