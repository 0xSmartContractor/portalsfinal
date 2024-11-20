'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, ArrowsRightLeftIcon, BellIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const messages = [
  {
    id: 1,
    user: 'John Davis',
    avatar: '/avatars/john.jpg',
    content: "Hey everyone, I need to swap my Saturday night shift. I've got a wedding to attend. Anyone able to cover?",
    time: '2:30 PM',
    likes: 0
  },
  {
    id: 2,
    user: 'Sarah Miller',
    avatar: '/avatars/sarah.jpg',
    content: "I can take your shift! I'm free that night.",
    time: '2:32 PM',
    likes: 1
  },
  {
    id: 3,
    user: 'John Davis',
    avatar: '/avatars/john.jpg',
    content: "That would be amazing, Sarah! I'll send a trade request right now. 🙏",
    time: '2:33 PM',
    likes: 2
  }
];

const notifications = [
  {
    id: 1,
    title: 'Shift Trade Request',
    content: 'John D. wants to trade Saturday night shift with Sarah M.',
    time: 'Just now',
    type: 'swap',
    status: 'pending'
  }
];

export function CommunicationDemo() {
  const [showTradeRequest, setShowTradeRequest] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [tradeApproved, setTradeApproved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTradeRequest(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    setTradeApproved(true);
    setShowApproval(true);
  };

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
            Seamless Team Communication
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Keep your team connected and coordinated
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chat Messages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-4 bg-blue-600">
              <div className="flex items-center text-white">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold">Team Chat</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.5 }}
                  className="flex space-x-3"
                >
                  <div className="flex-shrink-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={message.avatar}
                        alt={message.user}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {message.user}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{message.content}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {message.likes} likes
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trade Request and Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {showTradeRequest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <ArrowsRightLeftIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Shift Trade Request
                  </h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src="/avatars/john.jpg"
                          alt="John D."
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">
                        John D. wants to trade Saturday night shift (5 PM - 11 PM) with Sarah M.
                      </p>
                    </div>
                  </div>
                  {!tradeApproved ? (
                    <button
                      onClick={handleApprove}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Approve Trade
                    </button>
                  ) : (
                    <div className="text-green-600 dark:text-green-400 text-center font-semibold">
                      Trade Approved ✓
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {showApproval && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <BellIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        Shift Trade Approved
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-500">
                        Just now
                      </span>
                    </div>
                    <p className="text-green-600 dark:text-green-300">
                      The shift trade between John D. and Sarah M. has been approved.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
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
            <span className="mr-2">Discover how Portal streamlines team communication</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}