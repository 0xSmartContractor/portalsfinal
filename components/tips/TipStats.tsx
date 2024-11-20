'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TipStats {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  lastSevenDays: Array<{
    date: string;
    amount: number;
  }>;
  topEarners?: Array<{
    name: string;
    position: string;
    total: number;
  }>;
}

interface TipStatsProps {
  refreshKey: number;
}

export default function TipStats({ refreshKey }: TipStatsProps) {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TipStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tips/stats');
      if (!response.ok) throw new Error('Failed to fetch tip stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching tip stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Daily Average
          </h3>
          <p className="mt-2 text-2xl font-semibold text-blue-900 dark:text-blue-100">
            ${stats.dailyAverage.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-400">
            Weekly Total
          </h3>
          <p className="mt-2 text-2xl font-semibold text-green-900 dark:text-green-100">
            ${stats.weeklyTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Monthly Total
          </h3>
          <p className="mt-2 text-2xl font-semibold text-purple-900 dark:text-purple-100">
            ${stats.monthlyTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            Yearly Total
          </h3>
          <p className="mt-2 text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
            ${stats.yearlyTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Last 7 Days Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Last 7 Days
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.lastSevenDays}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Earners (Managers Only) */}
      {session?.user?.role === 'MANAGER' && stats.topEarners && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Earners
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Tips
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.topEarners.map((earner, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {earner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {earner.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${earner.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}