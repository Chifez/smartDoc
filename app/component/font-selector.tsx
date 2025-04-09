'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface FontSelectorProps {
  className?: string;
}

export function FontSelector({ className }: FontSelectorProps) {
  const [selectedFont, setSelectedFont] = useState<string>('inter');

  const fonts = [
    { name: 'Inter', value: 'font-sans' },
    { name: 'System UI', value: 'font-sans' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Monospace', value: 'font-mono' },
  ];

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-sm font-medium">Font</h3>
      <div className="space-y-1.5">
        {fonts.map((font) => (
          <div
            key={font.name}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer',
              selectedFont === font.name.toLowerCase().replace(' ', '-')
                ? 'bg-secondary'
                : 'hover:bg-secondary/50'
            )}
            onClick={() =>
              setSelectedFont(font.name.toLowerCase().replace(' ', '-'))
            }
          >
            {selectedFont === font.name.toLowerCase().replace(' ', '-') ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <div className="w-4 h-4" />
            )}
            <span className={cn('text-sm', font.value)}>{font.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
