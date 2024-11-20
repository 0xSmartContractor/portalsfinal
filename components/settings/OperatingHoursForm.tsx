'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface OperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export default function OperatingHoursForm() {
  const [hours, setHours] = useState<OperatingHours[]>(
    daysOfWeek.map((_, index) => ({
      dayOfWeek: index,
      openTime: '09:00',
      closeTime: '22:00',
      isOpen: true,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOperatingHours();
  }, []);

  const fetchOperatingHours = async () => {
    try {
      const response = await fetch('/api/operating-hours');
      if (!response.ok) throw new Error('Failed to fetch hours');
      const data = await response.json();
      
      if (data.length > 0) {
        setHours(data);
      }
    } catch (error) {
      console.error('Error fetching operating hours:', error);
      toast.error('Failed to load operating hours');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const day of hours) {
        await fetch('/api/operating-hours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(day),
        });
      }
      toast.success('Operating hours updated successfully');
    } catch (error) {
      console.error('Error saving operating hours:', error);
      toast.error('Failed to update operating hours');
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (index: number, updates: Partial<OperatingHours>) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], ...updates };
    setHours(newHours);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {hours.map((day, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="w-32">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={day.isOpen}
                  onChange={(e) =>
                    updateHours(index, { isOpen: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {daysOfWeek[index]}
                </span>
              </label>
            </div>

            {day.isOpen && (
              <div className="flex items-center space-x-4">
                <div>
                  <label
                    htmlFor={`openTime-${index}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Open
                  </label>
                  <input
                    type="time"
                    id={`openTime-${index}`}
                    value={day.openTime}
                    onChange={(e) =>
                      updateHours(index, { openTime: e.target.value })
                    }
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`closeTime-${index}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Close
                  </label>
                  <input
                    type="time"
                    id={`closeTime-${index}`}
                    value={day.closeTime}
                    onChange={(e) =>
                      updateHours(index, { closeTime: e.target.value })
                    }
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Operating Hours'}
        </button>
      </div>
    </form>
  );
}