'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<{
    user: {
      id: string;
      name: string;
    };
  }>;
  messages: Array<{
    content: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
}

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const [directResponse, groupResponse] = await Promise.all([
        fetch('/api/chat/direct'),
        fetch('/api/chat/group'),
      ]);

      const directChats = await directResponse.json();
      const groupChats = await groupResponse.json();

      setChats([...directChats, ...groupChats]);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`w-full p-3 rounded-lg text-left transition-colors ${
            selectedChatId === chat.id
              ? 'bg-blue-50 dark:bg-blue-900/50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            {chat.isGroup ? (
              <UserGroupIcon className="h-8 w-8 text-gray-400" />
            ) : (
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {chat.isGroup
                  ? chat.name
                  : chat.members.find(
                      (m) => m.user.id !== session?.user?.id
                    )?.user.name}
              </p>
              {chat.messages[0] && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.messages[0].user.name}: {chat.messages[0].content}
                  </p>
                  <span className="text-xs text-gray-400">
                    {format(new Date(chat.messages[0].createdAt), 'h:mm a')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}

      {chats.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No conversations yet
        </p>
      )}
    </div>
  );
}