import { cn } from '@/lib/utils';
import {
  FileText,
  FileSpreadsheet,
  DollarSign,
  BarChart,
  Share,
  Star,
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
import { useDocumentStore } from '@/store/document-store';

interface DocumentCardProps {
  title: string;
  lastEdited: string;
  type: 'document' | 'spreadsheet' | 'finance' | 'report';
  className?: string;
  onClick: () => void;
  documentId: string;
  isFavorite?: boolean;
}

export function DocumentCard({
  title,
  lastEdited,
  type,
  className,
  onClick,
  documentId,
  isFavorite = false,
}: DocumentCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const { user } = useAuthStore();
  const { document } = useDocument(documentId);
  const { toggleFavorite } = useDocumentStore();
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

  const handleFavorite = async (e: React.MouseEvent) => {
    // e.stopPropagation();
    setIsBouncing(true);
    await toggleFavorite(documentId);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const handleDelete = async () => {
    await deleteDocument();
  };

  return (
    <>
      <div
        className={cn(
          'document-card rounded-md pb-4 px-4 pt-2 bg-[#f9fafb]',
          className
        )}
      >
        <div className="h-fit flex justify-between items-center">
          <div className="mb-2 document-icon">{getIcon()}</div>
          <p>{isFavorite}</p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn('mb-2')}
              onClick={handleFavorite}
            >
              <Star
                className={cn(
                  'h-5 w-5 transition-all duration-200 scale-110',
                  isBouncing && 'animate-jelly',
                  isFavorite
                    ? 'text-yellow-500 [&>path]:fill-yellow-500'
                    : 'text-gray-400 [&>path]:fill-none'
                )}
              />
            </Button>
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
