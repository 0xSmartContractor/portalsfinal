'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Portal has completely transformed how we manage our restaurant. The scheduling feature alone has saved us countless hours every week.",
    author: "Sarah Johnson",
    role: "Restaurant Owner",
    restaurant: "The Rustic Spoon"
  },
  {
    quote: "The ability to quickly trade shifts and communicate with the team has improved our staff satisfaction significantly.",
    author: "Michael Chen",
    role: "General Manager",
    restaurant: "Asian Fusion"
  },
  {
    quote: "The floor planning and wait time tracking features have helped us optimize our seating and improve customer satisfaction.",
    author: "Lisa Rodriguez",
    role: "Operations Manager",
    restaurant: "Bella Italia"
  }
];

export function Testimonials() {
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
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join hundreds of satisfied restaurant owners and managers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="mb-4">
                <svg
                  className="h-8 w-8 text-blue-500 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{testimonial.quote}"
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
                <p className="text-blue-600 dark:text-blue-400">
                  {testimonial.restaurant}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}