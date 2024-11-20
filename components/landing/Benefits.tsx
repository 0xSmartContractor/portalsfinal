'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    title: '30%',
    description: 'Reduction in scheduling time',
  },
  {
    title: '25%',
    description: 'Increase in employee satisfaction',
  },
  {
    title: '40%',
    description: 'More efficient table management',
  },
  {
    title: '20%',
    description: 'Improvement in team communication',
  },
];

export function Benefits() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real Results for Real Restaurants
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join hundreds of restaurants already benefiting from Portal
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}