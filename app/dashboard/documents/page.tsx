'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DocumentCard } from '../../component/document-card';
import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/store/document-store';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const { createDocument } = useDocumentStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewDocument = async () => {
    setIsCreating(true);
    try {
      const newDoc = {
        title: 'Untitled Document',
        content: '',
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

  const myDocuments = [
    {
      id: 1,
      title: 'Project Proposal',
      lastEdited: '2 hours ago',
      type: 'document',
    },
    {
      id: 2,
      title: 'Meeting Notes',
      lastEdited: 'yesterday',
      type: 'document',
    },
    {
      id: 3,
      title: 'Product Roadmap',
      lastEdited: '3 days ago',
      type: 'spreadsheet',
    },
    { id: 4, title: 'Q3 Report', lastEdited: '1 week ago', type: 'report' },
    {
      id: 5,
      title: 'Design System',
      lastEdited: '1 week ago',
      type: 'document',
    },
    {
      id: 6,
      title: 'User Research',
      lastEdited: '2 weeks ago',
      type: 'document',
    },
    {
      id: 7,
      title: 'Sales Metrics',
      lastEdited: '2 weeks ago',
      type: 'spreadsheet',
    },
    {
      id: 8,
      title: 'Annual Review',
      lastEdited: '1 month ago',
      type: 'report',
    },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.title}
              lastEdited={doc.lastEdited}
              type={doc.type as any}
              onClick={() => router.push(`/dashboard/document/${doc.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
