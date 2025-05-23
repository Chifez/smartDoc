'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/store/document-store';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DocumentCard } from '@/app/component/document-card';

export default function DocumentsPage() {
  const router = useRouter();
  const { fetchDocuments, createDocument } = useDocumentStore();
  const {
    data: documents = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      await fetchDocuments();
      return useDocumentStore.getState().documents;
    },
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleNewDocument = async () => {
    setIsCreating(true);
    try {
      const newDoc = {
        title: 'Untitled Document',
        is_public: false,
      };
      const docId = await createDocument(newDoc);
      if (docId) {
        router.push(`/dashboard/document/${docId}`);
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-white isolate sticky top-0 flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">My Documents</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-[#634AFF] hover:bg-[#5338FF] text-white rounded-md h-9 px-4 text-sm font-medium"
            onClick={handleNewDocument}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" />
                New Document
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full p-4 md:p-6 max-w-6xl mx-auto">
        {isPending && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#634AFF]"></div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-full">
            <p>Error loading documents</p>
          </div>
        )}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                lastEdited={doc.updated_at}
                type="document"
                onClick={() => router.push(`/dashboard/document/${doc.id}`)}
                documentId={doc.id}
                isFavorite={doc.is_favorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
