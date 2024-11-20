'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  position: string;
}

interface NewChatModalProps {
  onClose: () => void;
  onCreateChat: () => void;
}

export default function NewChatModal({ onClose, onCreateChat }: NewChatModalProps) {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isGroup ? '/api/chat/group' : '/api/chat/direct';
      const body = isGroup
        ? { name: groupName, memberIds: selectedUsers }
        : { recipientId: selectedUsers[0] };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to create chat');

      onCreateChat();
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isGroup ? 'Create Group Chat' : 'New Conversation'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isGroup"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label
              htmlFor="isGroup"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Create a group chat
            </label>
          </div>

          {isGroup && (
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required={isGroup}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isGroup ? 'Add Members' : 'Select User'}
            </label>
            <div className="mt-1 space-y-2">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type={isGroup ? 'checkbox' : 'radio'}
                    name="users"
                    value={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (isGroup) {
                        setSelectedUsers(
                          e.target.checked
                            ? [...selectedUsers, user.id]
                            : selectedUsers.filter((id) => id !== user.id)
                        );
                      } else {
                        setSelectedUsers([user.id]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.name} ({user.position})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0 || (isGroup && !groupName)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}