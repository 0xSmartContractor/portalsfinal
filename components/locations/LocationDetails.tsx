'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OperatingHoursForm from '@/components/settings/OperatingHoursForm';
import StaffList from './StaffList';

interface LocationDetailsProps {
  locationId: string;
  onClose: () => void;
}

export default function LocationDetails({
  locationId,
  onClose,
}: LocationDetailsProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'hours' | 'settings'>(
    'staff'
  );
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationDetails();
  }, [locationId]);

  const fetchLocationDetails = async () => {
    try {
      const response = await fetch(`/api/locations/${locationId}`);
      if (!response.ok) throw new Error('Failed to fetch location details');
      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {location.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'hours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Operating Hours
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'staff' && (
            <StaffList locationId={locationId} />
          )}
          {activeTab === 'hours' && (
            <OperatingHoursForm locationId={locationId} />
          )}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Location Settings
              </h4>
              {/* Add location settings form here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}