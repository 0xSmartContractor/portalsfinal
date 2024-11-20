'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ClockIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  waitTime?: number;
  shape: 'round' | 'rectangle';
  position: { x: number; y: number };
  section: string;
}

const sections = [
  { id: 1, name: 'Main Dining', color: '#4A90E2' },
  { id: 2, name: 'Bar Area', color: '#F5A623' },
  { id: 3, name: 'Patio', color: '#7ED321' },
];

const initialTables: Table[] = [
  { id: 1, number: 1, seats: 2, status: 'occupied', shape: 'round', position: { x: 50, y: 50 }, section: 'Main Dining' },
  { id: 2, number: 2, seats: 4, status: 'available', shape: 'rectangle', position: { x: 150, y: 50 }, section: 'Main Dining' },
  { id: 3, number: 3, seats: 6, status: 'reserved', waitTime: 15, shape: 'rectangle', position: { x: 50, y: 150 }, section: 'Main Dining' },
  { id: 4, number: 4, seats: 4, status: 'available', shape: 'rectangle', position: { x: 150, y: 150 }, section: 'Bar Area' },
  { id: 5, number: 5, seats: 2, status: 'occupied', shape: 'round', position: { x: 250, y: 50 }, section: 'Bar Area' },
  { id: 6, number: 6, seats: 4, status: 'cleaning', shape: 'rectangle', position: { x: 250, y: 150 }, section: 'Bar Area' },
  { id: 7, number: 7, seats: 6, status: 'available', shape: 'rectangle', position: { x: 350, y: 50 }, section: 'Patio' },
  { id: 8, number: 8, seats: 4, status: 'reserved', shape: 'rectangle', position: { x: 350, y: 150 }, section: 'Patio' },
];

const statusColors = {
  available: 'bg-green-100 border-green-500 text-green-700',
  occupied: 'bg-red-100 border-red-500 text-red-700',
  reserved: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  cleaning: 'bg-blue-100 border-blue-500 text-blue-700',
};

function StaticTable({ table }: { table: Table }) {
  const width = table.shape === 'round' ? 60 : table.seats * 20;
  const height = 60;

  return (
    <div
      className={`absolute cursor-pointer ${
        table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
      } ${statusColors[table.status]} border-2`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${table.position.x}px`,
        top: `${table.position.y}px`,
      }}
    >
      <div className="flex items-center justify-center h-full">
        <span className="font-bold">T{table.number}</span>
      </div>
    </div>
  );
}

export function FloorPlanDemo() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredTables = selectedSection
    ? initialTables.filter((table) => table.section === selectedSection)
    : initialTables;

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Floor Planning
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Design your restaurant layout and manage table status in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(selectedSection === section.name ? null : section.name)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSection === section.name
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      style={{
                        borderLeft: `4px solid ${section.color}`,
                      }}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative w-full h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                {filteredTables.map((table) => (
                  <StaticTable key={table.id} table={table} />
                ))}
              </div>
            </div>
          </div>

          {/* Table Info */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status Legend
              </h3>
              <div className="space-y-2">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center">
                    <div className={`w-4 h-4 rounded ${color} border-2 mr-2`}></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Tables:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Available:</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Occupied:</span>
                  <span className="font-semibold text-red-600">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="/demo"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span className="mr-2">See how Portal can transform your restaurant layout</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}