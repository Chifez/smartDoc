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
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/app/component/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { useDocumentStore } from '@/store/document-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CollaborativeEditor } from '@/app/component/collboarative-editor';
import { ShareDocumentDialog } from '@/app/component/share-document-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DocumentClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    fetchDocument,
    currentDocument,
    isLoading,
    error,
    updateDocument,
    deleteDocument,
  } = useDocumentStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocument(id);
    }
  }, [id, user, fetchDocument]);

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title);
      setContent(JSON.parse(currentDocument.content) || '');
    }
  }, [currentDocument]);

  const handleSave = async () => {
    if (!user || !currentDocument) return;

    setIsSaving(true);
    try {
      await updateDocument(id, {
        title,
        content,
      });
      toast.success('Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(id);
      toast.success('Document deleted successfully');
      router.push('/dashboard/documents');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
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

  const isOwner = currentDocument?.user_id === user?.id;

  return (
    <div className="flex flex-col">
      <header className="bg-white isolate sticky top-0 flex items-center justify-between border-b p-4">
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
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
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
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
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

          <div className="min-h-[300px] prose prose-sm max-w-none placeholder:text-muted-foreground">
            <CollaborativeEditor
              placeholder="Start writing or paste your text..."
              initialContent={content}
              documentId={id}
              onChange={handleContentChange}
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

      <ShareDocumentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        documentId={id}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
