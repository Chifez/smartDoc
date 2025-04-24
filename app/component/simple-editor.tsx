'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import EditorToolbar from './editor-toolbar';
import EditorLoading from './editor-loader';

interface SimpleEditorProps {
  initialContent: string | any;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimpleEditor({
  initialContent,
  onChange,
  placeholder = 'Start writing or paste your text...',
}: SimpleEditorProps) {
  const isLocalUpdate = useRef(false);

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
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      isLocalUpdate.current = true;
      onChange(content);
      // Reset the flag after a delay
      setTimeout(() => {
        isLocalUpdate.current = false;
      }, 50);
    }, 300),
    [onChange]
  );

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
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  if (!editor) {
    return <EditorLoading />;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
