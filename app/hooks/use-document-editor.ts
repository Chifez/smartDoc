// src/components/collaborative-editor/hooks/useDocumentEditor.ts
import { useEditor } from '@tiptap/react';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { debounce } from 'lodash';
import { type RealtimeChannel } from '@supabase/supabase-js';
import { updateCursorPosition } from '@/lib/realtime';

export interface DocumentEditorOptions {
  initialContent: string | any;
  onChange: (content: string) => void;
  placeholder?: string;
  channel: RealtimeChannel | null;
  user: any;
}

export interface EditorUpdate {
  content: string;
  user_id: string;
  version?: number; // For potential version control
}

export function useDocumentEditor({
  initialContent,
  onChange,
  placeholder = 'Start writing or paste your text...',
  channel,
  user,
}: DocumentEditorOptions) {
  const isLocalUpdate = useRef(false);
  const isDestroyed = useRef(false);
  const pendingUpdates = useRef<EditorUpdate[]>([]);
  const documentVersion = useRef(0);

  // Parse initial content safely
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

  // Create optimized debounced onChange handler
  const debouncedOnChange = useMemo(
    () =>
      debounce(
        (content: string) => {
          if (isDestroyed.current) return;

          isLocalUpdate.current = true;
          onChange(content);
          documentVersion.current++; // Increment version on change

          // Reset the flag after a delay
          setTimeout(() => {
            isLocalUpdate.current = false;
          }, 50);
        },
        300,
        { maxWait: 1000 }
      ), // Add maxWait to ensure updates happen
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
            version: documentVersion.current,
          },
        });
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
      handleDOMEvents: {
        focus: () => false,
        blur: () => false,
      },
    },
  });

  // Handle receiving updates from remote users
  const handleRemoteUpdate = useCallback(
    (payload: any) => {
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
    },
    [user, editor, isLocalUpdate]
  );

  // Set up channel listener for remote updates
  useEffect(() => {
    if (!channel) return;

    const handler = (payload: any) => handleRemoteUpdate(payload);
    channel.on('broadcast', { event: 'document:update' }, handler);

    // channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [channel, handleRemoteUpdate]);

  const processUpdates = useCallback(() => {
    if (
      pendingUpdates.current.length === 0 ||
      !editor ||
      isLocalUpdate.current
    ) {
      return;
    }

    // Take the next update
    const update = pendingUpdates.current.shift();
    if (!update) return;

    try {
      const parsedContent = JSON.parse(update.content);

      // Save current selection
      const { from, to } = editor.state.selection;

      // Only update if content is different
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(parsedContent);

      if (currentContent !== newContent) {
        // Apply the update
        editor.commands.setContent(parsedContent, false);

        // Try to preserve selection
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // If position is invalid, don't worry about it
        }
      }

      // Process next update if any
      if (pendingUpdates.current.length > 0) {
        setTimeout(processUpdates, 0);
      }
    } catch (error) {
      console.error('Error processing update:', error);
      // Continue with next update even if this one failed
      if (pendingUpdates.current.length > 0) {
        setTimeout(processUpdates, 0);
      }
    }
  }, [editor]);

  // Handle cursor position update with optimized debounce
  const handleMouseMove = useMemo(
    () =>
      debounce(
        (e: React.MouseEvent) => {
          if (!channel || !editor || !editor.view) return;

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
        },
        100,
        { leading: false, trailing: true }
      ),
    [channel, editor]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isDestroyed.current = true;
      debouncedOnChange.cancel();
      pendingUpdates.current = [];
    };
  }, [debouncedOnChange]);

  // Handle content updates when initialContent changes
  useEffect(() => {
    if (editor && !isLocalUpdate.current) {
      const content = getParsedContent();

      // Only update if content actually changed
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);

      if (currentContent !== newContent) {
        const { from, to } = editor.state.selection;

        // Update content
        editor.commands.setContent(content, false);

        // Try to restore cursor position
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // If restoring selection fails, place cursor at end
          try {
            editor.commands.setTextSelection(editor.state.doc.content.size);
          } catch (e) {
            // If even this fails, don't crash
          }
        }
      }
    }
  }, [initialContent, editor, getParsedContent]);

  return {
    editor,
    handleMouseMove,
  };
}
