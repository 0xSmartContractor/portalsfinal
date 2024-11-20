'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LocationDetails from './LocationDetails';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Location {
  id: string;
  name: string;
  address: string;
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
  users: Array<{
    id: string;
    name: string;
    position: string;
  }>;
}

export default function LocationList() {
  const { data: session } = useSession();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <div
          key={location.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {location.name}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {location.address}
            </p>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Staff Count
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {location.users.length} employees
              </p>
            </div>

            <button
              onClick={() => setSelectedLocation(location.id)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Manage Location
            </button>
          </div>
        </div>
      ))}

      {selectedLocation && (
        <LocationDetails
          locationId={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {locations.length === 0 && (
        <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
          No locations found. Add your first location to get started.
        </div>
      )}
    </div>
  );
}