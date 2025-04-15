// src/components/collaborative-editor/components/EditorToolbar.tsx
import React, { memo } from 'react';
import { Toggle } from '@/components/ui/toggle';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: any;
}

// Memoized toolbar component to prevent unnecessary re-renders
const EditorToolbar = memo(({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const toggleCommands = [
    {
      active: editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: <Bold className="h-4 w-4" />,
      label: 'Bold',
    },
    {
      active: editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: <Italic className="h-4 w-4" />,
      label: 'Italic',
    },
    {
      active: editor.isActive('heading', { level: 1 }),
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: <Heading1 className="h-4 w-4" />,
      label: 'Heading 1',
    },
    {
      active: editor.isActive('heading', { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <Heading2 className="h-4 w-4" />,
      label: 'Heading 2',
    },
    {
      active: editor.isActive('bulletList'),
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: <List className="h-4 w-4" />,
      label: 'Bullet List',
    },
    {
      active: editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: <ListOrdered className="h-4 w-4" />,
      label: 'Ordered List',
    },
    {
      active: editor.isActive('codeBlock'),
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      icon: <Code className="h-4 w-4" />,
      label: 'Code Block',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {toggleCommands.map((item) => (
        <Toggle
          key={item.label}
          size="sm"
          pressed={item.active}
          onPressedChange={() => item.command()}
          aria-label={item.label}
        >
          {item.icon}
        </Toggle>
      ))}
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;
