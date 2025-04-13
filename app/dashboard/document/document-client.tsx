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
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/app/component/sidebar';
import { useRouter } from 'next/navigation';
import CollaborativeEditor from '@/app/component/collboarative-editor';
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
import { useDocument } from '@/app/hooks/use-document';
import { useAuthStore } from '@/store/auth-store';

export default function DocumentClient({ id }: { id: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string>('{"type":"doc","content":[]}');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    document,
    isLoading,
    error,
    isOwner,
    updateDocument,
    deleteDocument,
    isSaving,
  } = useDocument(id);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const canManage = isOwner || isAdmin;

  // Update local state when document data changes
  if (document && title !== document.title) {
    setTitle(document.title);
    setContent(document.content || '{"type":"doc","content":[]}');
  }

  const handleSave = async () => {
    if (!document) return;
    updateDocument(title, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleDelete = async () => {
    await deleteDocument();
    router.push('/dashboard/documents');
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#634AFF]"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{error.message}</p>
        </div>
      ) : (
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
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsShareDialogOpen(true)}
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${
                    canManage
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      : ''
                  }`}
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  {canManage ? 'Delete' : 'Remove Access'}
                </Button>
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
                    {canManage && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => setIsShareDialogOpen(true)}
                      >
                        <Share className="h-4 w-4" />
                        Share
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full justify-start gap-2 ${
                        canManage
                          ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                          : ''
                      }`}
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {canManage ? 'Delete' : 'Remove Access'}
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

              <div className="min-h-[300px] prose prose-sm max-w-none placeholder:text-muted-foreground">
                <CollaborativeEditor
                  key={id}
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
                <AlertDialogTitle>
                  {canManage ? 'Delete Document' : 'Remove Access'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {canManage
                    ? 'This action cannot be undone. This will permanently delete the document and remove it from our servers.'
                    : 'This will remove your access to this document. You will no longer be able to view or edit it.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={canManage ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  {canManage ? 'Delete' : 'Remove Access'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
