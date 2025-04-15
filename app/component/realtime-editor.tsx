'use client';

import React, { useState, memo } from 'react';
import { EditorContent } from '@tiptap/react';
import { type UserPresence } from '@/lib/realtime';
import { WifiOff } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useRealtimeCollaboration } from '../hooks/use-realtime-collaborator';
import { useDocumentEditor } from '../hooks/use-document-editor';
import EditorLoading from './editor-loader';
import EditorToolbar from './editor-toolbar';
import ConnectionIndicator from './connection-info';
import ActiveUsers from './active-users';

// Interface definitions
interface CollaborativeEditorProps {
  documentId: string;
  initialContent: string | any;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Main CollaborativeEditor component
const CollaborativeEditor = memo(
  ({
    documentId,
    initialContent,
    onChange,
    placeholder = 'Start writing or paste your text...',
  }: CollaborativeEditorProps) => {
    const { user } = useAuthStore();
    const [activeUsers, setActiveUsers] = useState<
      Record<string, UserPresence>
    >({});
    const [connectionStatus, setConnectionStatus] = useState<
      'connected' | 'disconnected'
    >('connected');

    // Set up realtime collaboration
    const { channel, connected } = useRealtimeCollaboration({
      documentId,
      user,
      onUserUpdate: setActiveUsers,
      onConnectionChange: setConnectionStatus,
    });

    // Initialize document editor
    const { editor, handleMouseMove } = useDocumentEditor({
      initialContent,
      onChange,
      placeholder,
      channel,
      user,
    });

    // Show loading state if editor isn't ready
    if (!editor) {
      return <EditorLoading />;
    }

    return (
      <div className="flex flex-col">
        <div className="border-b pb-2 mb-4 flex items-center gap-2 overflow-x-auto">
          <EditorToolbar editor={editor} />
          <div className="ml-auto flex items-center gap-2">
            <ConnectionIndicator connected={connected} />
            <ActiveUsers activeUsers={activeUsers} currentUserId={user?.id} />
          </div>
        </div>

        <div
          onMouseMove={handleMouseMove}
          className="prose prose-sm max-w-none relative"
        >
          {!connected && (
            <div className="absolute inset-0 bg-gray-50 bg-opacity-70 flex items-center justify-center z-10">
              <div className="bg-white p-4 rounded-md shadow-md text-center">
                <WifiOff className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-gray-700">
                  Connection lost. Reconnecting...
                </p>
              </div>
            </div>
          )}
          <EditorContent
            editor={editor}
            className="min-h-[300px] focus:outline-none"
          />
        </div>

        {/* Activity indicator at the bottom */}
        <div className="mt-2 text-xs text-gray-500 text-right">
          {Object.values(activeUsers).length > 1
            ? `${Object.values(activeUsers).length} people viewing`
            : '1 person viewing'}
        </div>
      </div>
    );
  }
);

CollaborativeEditor.displayName = 'CollaborativeEditor';

export default CollaborativeEditor;

// Missing import fix - added at the end to avoid confusion
