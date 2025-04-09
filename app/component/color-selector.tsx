'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ColorSelectorProps {
  className?: string;
}

export function ColorSelector({ className }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string>('grape');

  const colors = [
    { name: 'Old Banani', value: '#1E1E1E', textColor: 'text-white' },
    { name: 'Grape', value: '#634AFF', textColor: 'text-white' },
    { name: 'Blueberry', value: '#3B82F6', textColor: 'text-white' },
    { name: 'Kiwi', value: '#10B981', textColor: 'text-white' },
  ];

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-sm font-medium">Color</h3>
      <div className="space-y-1.5">
        {colors.map((color) => (
          <div
            key={color.name}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
              selectedColor === color.name.toLowerCase().replace(' ', '-')
                ? 'bg-secondary'
                : 'hover:bg-secondary/50'
            )}
            onClick={() =>
              setSelectedColor(color.name.toLowerCase().replace(' ', '-'))
            }
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center',
                color.textColor
              )}
              style={{ backgroundColor: color.value }}
            >
              {selectedColor === color.name.toLowerCase().replace(' ', '-') && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span className="text-sm">{color.name}</span>
            {color.name === 'Grape' && (
              <span className="ml-auto text-xs text-muted-foreground">
                #634AFF
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
