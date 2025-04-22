'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { DocumentCard } from '../component/document-card';
import { Logo } from '../component/logo';
import { useDocumentStore } from '@/store/document-store';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { fetchDocuments, documents, createDocument } = useDocumentStore();

  // Use React Query to fetch documents
  const { data, isPending, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      await fetchDocuments();
      return useDocumentStore.getState().documents;
    },
  });

  // Filter documents by type
  const myDocuments = documents.filter((doc: any) => !doc.permission_level);
  const sharedDocuments = documents.filter((doc: any) => doc.permission_level);
  const favoriteDocuments = documents.filter((doc: any) => doc.is_favorite);

  // Create a new document and navigate to it
  const handleCreateDocument = async () => {
    console.log('Starting document creation...');
    try {
      // Check if user is authenticated
      const user = useAuthStore.getState().user;
      if (!user) {
        console.error('User not authenticated');
        router.push('/auth/login');
        return;
      }

      console.log('User authenticated:', user.id);

      const newDocId = await createDocument({
        title: 'Untitled Document',
        is_public: false,
      });

      console.log('Document creation result:', newDocId);

      if (newDocId) {
        console.log('Navigating to new document:', newDocId);
        router.push(`/dashboard/document/${newDocId}`);
      } else {
        const error = useDocumentStore.getState().error;
        console.error('Failed to create document:', error);
        toast.error('error creating document');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error in handleCreateDocument:', error);
      toast.error('error creating document, please try again');
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-[#634AFF] hover:bg-[#5338FF] text-white rounded-md h-9 px-4 text-sm font-medium"
            onClick={handleCreateDocument}
          >
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-6 border-b">
            <TabsList className="bg-transparent h-10">
              <TabsTrigger
                value="all"
                className="rounded-none w-fit data-[state=active]:border-b-2 data-[state=active]:border-b-[#634AFF] data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 h-10 text-sm font-medium"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="rounded-none w-fit data-[state=active]:border-b-2 data-[state=active]:border-b-[#634AFF] data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 h-10 text-sm font-medium"
              >
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="shared"
                className="rounded-none w-fit data-[state=active]:border-b-2 data-[state=active]:border-b-[#634AFF] data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 h-10 text-sm font-medium"
              >
                Shared
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="rounded-none w-fit data-[state=active]:border-b-2 data-[state=active]:border-b-[#634AFF] data-[state=active]:tab-active data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 h-10 text-sm font-medium"
              >
                Favorites
              </TabsTrigger>
            </TabsList>
          </div>

          {isPending ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#634AFF]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">
                Error loading documents. Please try again.
              </p>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-8 mt-6">
                {myDocuments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">My Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {myDocuments.map((doc: any) => (
                        <DocumentCard
                          key={doc.id}
                          title={doc.title}
                          lastEdited={doc.updated_at}
                          type="document"
                          onClick={() =>
                            router.push(`/dashboard/document/${doc.id}`)
                          }
                          documentId={doc.id}
                          isFavorite={doc.is_favorite}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {sharedDocuments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Shared with me
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {sharedDocuments.map((doc: any) => (
                        <DocumentCard
                          key={doc.id}
                          title={doc.title}
                          lastEdited={`Shared • ${doc.updated_at}`}
                          type="document"
                          onClick={() =>
                            router.push(`/dashboard/document/${doc.id}`)
                          }
                          documentId={doc.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {myDocuments.length === 0 && sharedDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <h2 className="text-lg font-semibold mb-2">
                      No documents yet
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Create your first document to get started
                    </p>
                    <Button
                      className="bg-[#634AFF] hover:bg-[#5338FF] text-white"
                      onClick={handleCreateDocument}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Document
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <div className="mt-6">
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[...documents]
                        .sort(
                          (a, b) =>
                            new Date(b.updated_at).getTime() -
                            new Date(a.updated_at).getTime()
                        )
                        .slice(0, 8)
                        .map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            title={doc.title}
                            lastEdited={doc.updated_at}
                            type="document"
                            onClick={() => router.push(`/document/${doc.id}`)}
                            documentId={doc.id}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-lg font-semibold mb-2">
                        No recent documents
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Create your first document to get started
                      </p>
                      <Button
                        className="bg-[#634AFF] hover:bg-[#5338FF] text-white"
                        onClick={handleCreateDocument}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Document
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="shared">
                <div className="mt-6">
                  {sharedDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {sharedDocuments.map((doc: any) => (
                        <DocumentCard
                          key={doc.id}
                          title={doc.title}
                          lastEdited={`Shared • ${doc.updated_at}`}
                          type="document"
                          onClick={() => router.push(`/document/${doc.id}`)}
                          documentId={doc.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-lg font-semibold mb-2">
                        No shared documents
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Documents shared with you will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="favorites">
                {favoriteDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {favoriteDocuments.map((doc: any) => (
                      <DocumentCard
                        key={doc.id}
                        title={doc.title}
                        lastEdited={doc.updated_at}
                        type="document"
                        onClick={() => router.push(`/document/${doc.id}`)}
                        documentId={doc.id}
                        isFavorite={doc.is_favorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 mt-6">
                    <h2 className="text-lg font-semibold mb-2">
                      No favorites yet
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Star documents to add them to your favorites
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </>
  );
}
