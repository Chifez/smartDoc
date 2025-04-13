import { cn } from '@/lib/utils';
import {
  FileText,
  FileSpreadsheet,
  DollarSign,
  BarChart,
  Share,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatLastEdited } from '@/lib/utils/date';
import { ShareDocumentDialog } from '@/app/component/share-document-dialog';
import { useState } from 'react';
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
import { useDocument } from '../hooks/use-document';
import { useAuthStore } from '@/store/auth-store';

interface DocumentCardProps {
  title: string;
  lastEdited: string;
  type: 'document' | 'spreadsheet' | 'finance' | 'report';
  className?: string;
  onClick: () => void;
  documentId: string;
}

export function DocumentCard({
  title,
  lastEdited,
  type,
  className,
  onClick,
  documentId,
}: DocumentCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuthStore();
  const { document } = useDocument(documentId);
  const isOwner = document?.user_id === user?.id;
  const isAdmin = user?.role === 'admin';
  const canManage = isOwner || isAdmin;

  const { deleteDocument } = useDocument(documentId);

  const getIcon = () => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'finance':
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      case 'report':
        return <BarChart className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleDelete = async () => {
    await deleteDocument();
  };

  return (
    <>
      <div
        className={cn('document-card rounded-md p-4 bg-[#f9fafb]', className)}
      >
        <div className="flex justify-between items-start">
          <div className="mb-2 document-icon">{getIcon()}</div>
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShareDialogOpen(true)}
              className="mb-2"
            >
              <Share />
            </Button>
          )}
        </div>
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Last edited {formatLastEdited(lastEdited)}
        </p>
        <div className="flex w-full gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-[#634AFF] text-white text-xs flex-1 h-8 px-3 rounded-md"
            onClick={onClick}
          >
            Open
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`text-xs h-8 px-3 rounded-md flex-1 ${
              canManage ? 'hover:bg-red-400 hover:text-white' : ''
            }`}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            {canManage ? 'Delete' : 'Remove Access'}
          </Button>
        </div>
      </div>

      <ShareDocumentDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        documentId={documentId}
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
    </>
  );
}
