'use client';

// ... (previous imports and code remain the same)

export function ScheduleDemo() {
  // ... (previous code remains the same until the end)

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-800">
      {/* ... (previous JSX remains the same) */}

      {/* Add subtle CTA at the bottom */}
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
          <span className="mr-2">Experience the power of AI-driven scheduling</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </motion.div>
    </div>
  );
}