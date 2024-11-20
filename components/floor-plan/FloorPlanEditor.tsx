'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import {
  PlusIcon,
  TrashIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  shape: 'round' | 'rectangle';
  position: { x: number; y: number };
  rotation: number;
  waitTime?: number;
}

interface FloorPlanEditorProps {
  selectedTable: string | null;
  onTableSelect: (tableId: string | null) => void;
}

export default function FloorPlanEditor({
  selectedTable,
  onTableSelect,
}: FloorPlanEditorProps) {
  const { data: session } = useSession();
  const [tables, setTables] = useState<Table[]>([]);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleAddTable = async () => {
    try {
      const response = await fetch('/api/floor-plan/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: tables.length + 1,
          seats: 4,
          shape: 'rectangle',
          position: { x: 100, y: 100 },
          rotation: 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to add table');
      const newTable = await response.json();
      setTables([...tables, newTable]);
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleTableDrag = async (tableId: string, position: { x: number; y: number }) => {
    try {
      await fetch(`/api/floor-plan/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position }),
      });

      setTables(tables.map(table =>
        table.id === tableId ? { ...table, position } : table
      ));
    } catch (error) {
      console.error('Error updating table position:', error);
    }
  };

  const handleTableRotate = async (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newRotation = (table.rotation + 90) % 360;

    try {
      await fetch(`/api/floor-plan/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotation: newRotation }),
      });

      setTables(tables.map(t =>
        t.id === tableId ? { ...t, rotation: newRotation } : t
      ));
    } catch (error) {
      console.error('Error rotating table:', error);
    }
  };

  const handleTableDelete = async (tableId: string) => {
    try {
      await fetch(`/api/floor-plan/tables/${tableId}`, {
        method: 'DELETE',
      });

      setTables(tables.filter(t => t.id !== tableId));
      if (selectedTable === tableId) {
        onTableSelect(null);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {session?.user?.role === 'MANAGER' && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Done Editing' : 'Edit Layout'}
              </button>
              {isEditing && (
                <button
                  onClick={handleAddTable}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className="relative w-full h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
        onClick={() => onTableSelect(null)}
      >
        {tables.map((table) => (
          <Draggable
            key={table.id}
            position={table.position}
            onStop={(_, data) => handleTableDrag(table.id, { x: data.x, y: data.y })}
            disabled={!isEditing}
          >
            <div
              className={`absolute cursor-pointer ${
                table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
              } ${
                selectedTable === table.id
                  ? 'ring-2 ring-blue-500'
                  : ''
              } ${
                table.status === 'AVAILABLE'
                  ? 'bg-green-100 border-green-500'
                  : table.status === 'OCCUPIED'
                  ? 'bg-red-100 border-red-500'
                  : table.status === 'RESERVED'
                  ? 'bg-yellow-100 border-yellow-500'
                  : 'bg-blue-100 border-blue-500'
              } border-2`}
              style={{
                width: table.shape === 'round' ? '80px' : `${table.seats * 20}px`,
                height: '80px',
                transform: `rotate(${table.rotation}deg)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTableSelect(table.id);
              }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="font-bold text-gray-900">T{table.number}</span>
              </div>

              {isEditing && selectedTable === table.id && (
                <div className="absolute top-0 right-0 -mr-2 -mt-2 space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTableRotate(table.id);
                    }}
                    className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTableDelete(table.id);
                    }}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}