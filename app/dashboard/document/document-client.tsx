'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronLeft,
  Share,
  History,
  Wand2,
  Menu,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/app/component/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { useDocumentStore } from '@/store/document-store';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/navigation';

export default function DocumentClient({ id }: { id: string }) {
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const router = useRouter();
  const { fetchDocument, currentDocument, isLoading, error } =
    useDocumentStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: currentDocument?.content || '',
    editable: true,
    onUpdate: ({ editor }) => {
      // Handle content updates
    },
  });

  useEffect(() => {
    if (user) {
      fetchDocument(id);
    }
  }, [id, user, fetchDocument]);

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title);
      if (editor) {
        editor.commands.setContent(currentDocument.content);
      }
    }
  }, [currentDocument, editor]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await useDocumentStore.getState().updateDocument(id, {
        title,
        content: editor?.getJSON() as any,
      });
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/documents">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Edit Document</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <Button
                className="bg-[#634AFF] hover:bg-[#5338FF] text-white rounded-md h-9 px-4 text-sm font-medium"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save Document'
                )}
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Document Options</h2>
                </div>

                <div className="p-4 space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <History className="h-4 w-4" />
                    View History
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="md:hidden border-b">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-white h-12 p-0">
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full"
                >
                  AI Tools
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full"
                >
                  Comments
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-full"
                >
                  History
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Document title"
                className="w-full text-xl font-medium border-none focus:outline-none focus:ring-0 bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="min-h-[300px]">
              <textarea
                placeholder="Start writing or paste your text"
                className="w-full min-h-[300px] resize-none border-none focus:outline-none focus:ring-0 bg-transparent text-base"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mt-8 ai-assistant-bg rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Get real-time suggestions to improve your content
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs h-8 px-3 rounded-md"
                >
                  Get suggestions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 px-3 rounded-md bg-white"
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
