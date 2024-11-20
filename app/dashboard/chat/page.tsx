'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { PaperAirplaneIcon, PhotoIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import io from 'socket.io-client';

interface User {
  id: string;
  name: string;
}

interface Reaction {
  emoji: string;
  user: {
    name: string;
  };
}

interface ReadReceipt {
  user: {
    name: string;
  };
  readAt: string;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  user: {
    name: string;
  };
  createdAt: string;
  isImage?: boolean;
  reactions: Reaction[];
  readReceipts: ReadReceipt[];
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      path: '/api/socket',
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      markAsRead(message.id);
    });

    newSocket.on('reaction', ({ messageId, reaction }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, reactions: [...msg.reactions, reaction] }
            : msg
        )
      );
    });

    newSocket.on('reactionRemoved', ({ messageId, emoji, userId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: msg.reactions.filter(
                  (r) => !(r.emoji === emoji && r.user.id === userId)
                ),
              }
            : msg
        )
      );
    });

    newSocket.on('readReceipt', ({ messageId, readReceipt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, readReceipts: [...msg.readReceipts, readReceipt] }
            : msg
        )
      );
    });

    setSocket(newSocket);
    fetchMessages();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
      // Mark all messages as read
      data.forEach((message: Message) => markAsRead(message.id));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch('/api/chat/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch('/api/chat/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, emoji }),
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
    setShowEmojiPicker(null);
  };

  const removeReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/chat/reaction?messageId=${messageId}&emoji=${emoji}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  // Rest of the component implementation remains the same...
  
  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Chat
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Chat with your team members and share memes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === session?.user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="relative">
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.userId === session?.user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{message.user.name}</span>
                    <span className="text-sm opacity-75">
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </span>
                  </div>
                  
                  {message.isImage ? (
                    <Image
                      src={message.content}
                      alt="Shared image"
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                  ) : (
                    <p>{message.content}</p>
                  )}

                  {/* Reactions */}
                  {message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(
                        message.reactions.reduce((acc, { emoji, user }) => {
                          acc[emoji] = [...(acc[emoji] || []), user];
                          return acc;
                        }, {} as Record<string, { name: string }[]>)
                      ).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => removeReaction(message.id, emoji)}
                          className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-sm"
                          title={users.map((u) => u.name).join(', ')}
                        >
                          {emoji} {users.length}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Read Receipts */}
                  {message.userId === session?.user?.id && (
                    <div className="text-xs mt-1 opacity-75">
                      {message.readReceipts.length > 0
                        ? `Read by ${message.readReceipts.length} people`
                        : 'Delivered'}
                    </div>
                  )}
                </div>

                {/* Emoji Picker */}
                <button
                  onClick={() => setShowEmojiPicker(message.id)}
                  className="absolute -right-8 top-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>

                {showEmojiPicker === message.id && (
                  <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                    <div className="flex gap-1">
                      {EMOJI_LIST.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <PhotoIcon className="h-6 w-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </form>
      </div>
    </div>
  );
}