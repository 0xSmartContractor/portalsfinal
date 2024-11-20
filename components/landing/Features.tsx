'use client';

import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CalendarIcon,
    title: 'Smart Scheduling',
    description: 'AI-powered scheduling that considers employee availability and preferences.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Team Communication',
    description: 'Built-in chat system for seamless team coordination and shift trading.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Tip Management',
    description: 'Effortlessly track and manage tips for fair distribution.',
  },
  {
    icon: TableCellsIcon,
    title: 'Floor Planning',
    description: 'Interactive floor plans for optimal table management and wait times.',
  },
];

export function Features() {
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
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful features designed specifically for restaurant operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}