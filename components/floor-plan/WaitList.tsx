'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface WaitingParty {
  id: string;
  name: string;
  size: number;
  phone: string;
  notes?: string;
  waitingSince: string;
  estimatedWait: number;
  status: 'WAITING' | 'SEATED' | 'CANCELLED';
}

interface WaitListProps {
  selectedTable: string | null;
}

export default function WaitList({ selectedTable }: WaitListProps) {
  const [parties, setParties] = useState<WaitingParty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitList();
  }, []);

  const fetchWaitList = async () => {
    try {
      const response = await fetch('/api/floor-plan/wait-list');
      if (!response.ok) throw new Error('Failed to fetch wait list');
      const data = await response.json();
      setParties(data);
    } catch (error) {
      console.error('Error fetching wait list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/floor-plan/wait-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          size: parseInt(formData.get('size') as string),
          phone: formData.get('phone'),
          notes: formData.get('notes'),
          estimatedWait: parseInt(formData.get('estimatedWait') as string),
        }),
      });

      if (!response.ok) throw new Error('Failed to add party');
      
      const newParty = await response.json();
      setParties([...parties, newParty]);
      setShowAddForm(false);
      form.reset();
    } catch (error) {
      console.error('Error adding party:', error);
    }
  };

  const handleStatusChange = async (partyId: string, status: WaitingParty['status']) => {
    try {
      const response = await fetch(`/api/floor-plan/wait-list/${partyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update party status');
      
      setParties(parties.map(party =>
        party.id === partyId ? { ...party, status } : party
      ));
    } catch (error) {
      console.error('Error updating party status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Party</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Party to Wait List
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddParty} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Party Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Party Size
                </label>
                <input
                  type="number"
                  name="size"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Wait (minutes)
                </label>
                <input
                  type="number"
                  name="estimatedWait"
                  min="0"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {parties
          .filter((party) => party.status === 'WAITING')
          .map((party) => (
            <div
              key={party.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {party.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Party of {party.size}
                  </p>
                  <p className="text-sm text-gray-500">
                    Waiting since:{' '}
                    {format(new Date(party.waitingSince), 'h:mm a')}
                  </p>
                  {party.notes && (
                    <p className="text-sm text-gray-500 mt-2">{party.notes}</p>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleStatusChange(party.id, 'SEATED')}
                    disabled={!selectedTable}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Seat
                  </button>
                  <button
                    onClick={() => handleStatusChange(party.id, 'CANCELLED')}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}

        {parties.filter((party) => party.status === 'WAITING').length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No parties waiting
          </p>
        )}
      </div>
    </div>
  );
}