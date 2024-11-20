'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LocationList from '@/components/locations/LocationList';
import LocationForm from '@/components/locations/LocationForm';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function LocationsPage() {
  const { data: session } = useSession();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!session?.user || session.user.role !== 'MANAGER') {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Location Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your restaurant locations and their settings
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Location
        </button>
      </div>

      <LocationList />

      {showAddForm && (
        <LocationForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}