'use client';

import type React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/auth-store';
import {
  createDocumentChannel,
  trackDocumentUsers,
  type UserPresence,
  updateCursorPosition,
} from '@/lib/realtime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent: string | any;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function CollaborativeEditor({
  documentId,
  initialContent,
  onChange,
  placeholder = 'Start writing or paste your text...',
}: CollaborativeEditorProps) {
  const { user } = useAuthStore();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [activeUsers, setActiveUsers] = useState<Record<string, UserPresence>>(
    {}
  );
  const [isMounted, setIsMounted] = useState(false);
  const isLocalUpdate = useRef(false);

  // Parse initial content if needed
  const getParsedContent = useCallback(() => {
    if (!initialContent) return { type: 'doc', content: [] };

    try {
      if (typeof initialContent === 'string') {
        return JSON.parse(initialContent);
      }
      return initialContent;
    } catch (error) {
      console.error('Error parsing content:', error);
      return { type: 'doc', content: [] };
    }
  }, [initialContent]);

  // Create a debounced version of onChange that doesn't trigger for local updates
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      isLocalUpdate.current = true;
      onChange(content);
      // Reset the flag after a short delay to prevent issues with other async operations
      setTimeout(() => {
        isLocalUpdate.current = false;
      }, 50);
    }, 300),
    [onChange]
  );

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: getParsedContent(),
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      debouncedOnChange(json);

      // Broadcast changes to other users
      if (channel && user) {
        channel.send({
          type: 'broadcast',
          event: 'document:update',
          payload: {
            content: json,
            user_id: user.id,
          },
        });
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  // Handle initial content and updates
  useEffect(() => {
    if (editor && !isLocalUpdate.current) {
      const content = getParsedContent();

      // Only update if content actually changed (string comparison to avoid unnecessary rerenders)
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);

      if (currentContent !== newContent) {
        const { from, to } = editor.state.selection;

        // Update content and restore selection
        editor.commands.setContent(content, false);

        // Try to restore cursor position if possible
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // If restoring selection fails, place cursor at end
          editor.commands.setTextSelection(editor.state.doc.content.size);
        }
      }
    }
  }, [editor, getParsedContent]);

  // Set up the realtime channel and handle updates
  useEffect(() => {
    if (!user || !documentId || !editor || !isMounted) return;

    const newChannel = createDocumentChannel(documentId, user);
    if (newChannel) {
      setChannel(newChannel);

      // Track users in the document
      const cleanup = trackDocumentUsers(newChannel, user, (users) => {
        setActiveUsers(users);
      });

      // Handle document updates from other users
      const handleUpdate = (payload: any) => {
        // Skip updates from the current user
        if (payload.payload?.user_id === user?.id) return;

        try {
          if (!editor || isLocalUpdate.current) return;

          const update = JSON.parse(payload.payload.content);

          // Save current selection
          const { from, to } = editor.state.selection;

          // Only update if content is different
          const currentContent = JSON.stringify(editor.getJSON());
          const newContent = JSON.stringify(update);

          if (currentContent !== newContent) {
            // Update content and restore selection
            editor.commands.setContent(update, false);

            try {
              editor.commands.setTextSelection({ from, to });
            } catch (e) {
              // If restoring selection fails, just let it be
            }
          }
        } catch (error) {
          console.error('Error handling remote update:', error);
        }
      };

      newChannel.on('broadcast', { event: 'document:update' }, handleUpdate);

      return () => {
        cleanup();
        newChannel.unsubscribe();
      };
    }
  }, [documentId, user, editor, isMounted]);

  // Update cursor position on mouse move
  const handleMouseMove = debounce((e: React.MouseEvent) => {
    if (!channel || !editor) return;

    const view = editor.view;
    const pos = view.posAtCoords({ left: e.clientX, top: e.clientY });

    if (pos) {
      updateCursorPosition(channel, {
        x: e.clientX,
        y: e.clientY,
        selection: {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
        },
      });
    }
  }, 50);

  if (!editor) {
    return (
      <div className="border rounded-md p-4 min-h-[300px] animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-b pb-2 mb-4 flex items-center gap-2 overflow-x-auto">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code Block"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <div className="ml-auto flex items-center gap-1">
          <TooltipProvider>
            {Object.values(activeUsers)
              .filter((u) => u.id !== user?.id)
              .map((activeUser) => (
                <Tooltip key={activeUser.id}>
                  <TooltipTrigger
                    asChild
                    key={activeUser.id}
                    className="cursor-pointer"
                  >
                    <Avatar
                      className={cn('h-6 w-6 border-2', {
                        'border-green-500':
                          Date.now() - activeUser.lastActive < 60000, // Active in the last minute
                        'border-yellow-500':
                          Date.now() - activeUser.lastActive >= 60000 &&
                          Date.now() - activeUser.lastActive < 300000, // Active in the last 5 minutes
                        'border-gray-300':
                          Date.now() - activeUser.lastActive >= 300000, // Inactive for more than 5 minutes
                      })}
                      style={{ borderColor: activeUser.color }}
                    >
                      <AvatarImage src={activeUser.avatar_url || ''} />
                      <AvatarFallback
                        style={{ backgroundColor: activeUser.color }}
                      >
                        {activeUser.name?.substring(0, 2) ||
                          activeUser.email?.substring(0, 2) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {activeUser.name || activeUser.email || 'Anonymous User'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </TooltipProvider>
        </div>
      </div>

      <div onMouseMove={handleMouseMove} className="prose prose-sm max-w-none">
        <EditorContent
          editor={editor}
          className="min-h-[300px] focus:outline-none"
        />
      </div>
    </div>
  );
}
