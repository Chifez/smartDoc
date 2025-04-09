import { cn } from '@/lib/utils';
import { FileText, FileSpreadsheet, DollarSign, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  title: string;
  lastEdited: string;
  type: 'document' | 'spreadsheet' | 'finance' | 'report';
  className?: string;
  onClick: () => void;
}

export function DocumentCard({
  title,
  lastEdited,
  type,
  className,
  onClick,
}: DocumentCardProps) {
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

  return (
    <div className={cn('document-card rounded-md p-4 bg-[#f9fafb]', className)}>
      <div className="mb-2 document-icon">{getIcon()}</div>
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Last edited {lastEdited}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          className="bg-[#634AFF] text-white text-xs h-8 px-3 rounded-md"
          onClick={onClick}
        >
          Open
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8 px-3 rounded-md"
        >
          Share
        </Button>
      </div>
    </div>
  );
}
