'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  waitTime?: number;
}

interface TableStatusListProps {
  selectedTable: string | null;
  onTableSelect: (tableId: string | null) => void;
}

export default function TableStatusList({
  selectedTable,
  onTableSelect,
}: TableStatusListProps) {
  const { data: session } = useSession();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/floor-plan/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId: string, status: Table['status']) => {
    try {
      const response = await fetch(`/api/floor-plan/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update table status');
      
      setTables(tables.map(table =>
        table.id === tableId ? { ...table, status } : table
      ));
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const handleWaitTimeChange = async (tableId: string, waitTime: number) => {
    try {
      const response = await fetch(`/api/floor-plan/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waitTime }),
      });

      if (!response.ok) throw new Error('Failed to update wait time');
      
      setTables(tables.map(table =>
        table.id === tableId ? { ...table, waitTime } : table
      ));
    } catch (error) {
      console.error('Error updating wait time:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`p-4 rounded-lg border ${
            selectedTable === table.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Table {table.number}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {table.seats} seats
              </p>
            </div>
            <select
              value={table.status}
              onChange={(e) => handleStatusChange(table.id, e.target.value as Table['status'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
              <option value="CLEANING">Cleaning</option>
            </select>
          </div>

          {table.status === 'OCCUPIED' && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Wait Time (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={table.waitTime || 0}
                onChange={(e) => handleWaitTimeChange(table.id, parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      ))}

      {tables.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No tables found
        </p>
      )}
    </div>
  );
}