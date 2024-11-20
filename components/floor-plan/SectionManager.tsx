'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Section {
  id: string;
  name: string;
  color: string;
}

interface SectionManagerProps {
  sections: Section[];
  onSectionChange: (sections: Section[]) => void;
}

export default function SectionManager({
  sections,
  onSectionChange,
}: SectionManagerProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColor, setNewSectionColor] = useState('#ff0000');

  const handleAddSection = async () => {
    try {
      const response = await fetch('/api/floor-plan/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSectionName,
          color: newSectionColor,
        }),
      });

      if (!response.ok) throw new Error('Failed to create section');
      const newSection = await response.json();
      
      onSectionChange([...sections, newSection]);
      setNewSectionName('');
      setNewSectionColor('#ff0000');
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleUpdateSection = async (id: string, updates: Partial<Section>) => {
    try {
      const response = await fetch(`/api/floor-plan/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update section');
      const updatedSection = await response.json();
      
      onSectionChange(
        sections.map((section) =>
          section.id === id ? { ...section, ...updatedSection } : section
        )
      );
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      const response = await fetch(`/api/floor-plan/sections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete section');
      onSectionChange(sections.filter((section) => section.id !== id));
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          placeholder="New section name"
          className="flex-1 rounded-md border-gray-300"
        />
        <div className="relative">
          <button
            onClick={() => setShowColorPicker('new')}
            className="w-8 h-8 rounded-md border border-gray-300"
            style={{ backgroundColor: newSectionColor }}
          />
          {showColorPicker === 'new' && (
            <div className="absolute z-10 mt-2">
              <HexColorPicker
                color={newSectionColor}
                onChange={setNewSectionColor}
              />
            </div>
          )}
        </div>
        <button
          onClick={handleAddSection}
          disabled={!newSectionName}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Add Section
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between p-2 bg-white rounded-md shadow"
          >
            <span>{section.name}</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(section.id)}
                  className="w-6 h-6 rounded-md border border-gray-300"
                  style={{ backgroundColor: section.color }}
                />
                {showColorPicker === section.id && (
                  <div className="absolute right-0 z-10 mt-2">
                    <HexColorPicker
                      color={section.color}
                      onChange={(color) =>
                        handleUpdateSection(section.id, { color })
                      }
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="text-red-600 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}