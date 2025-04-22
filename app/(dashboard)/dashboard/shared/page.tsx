import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  FileText,
  FileSpreadsheet,
  DollarSign,
  BarChart,
} from 'lucide-react';
import { Sidebar } from '../../component/sidebar';

export default function SharedPage() {
  const sharedDocuments = [
    {
      id: 1,
      title: 'Team Budget',
      lastEdited: '2 days ago',
      sharedBy: 'Alex',
      type: 'finance',
      collaborators: 3,
    },
    {
      id: 2,
      title: 'Marketing Plan',
      lastEdited: '5 days ago',
      sharedBy: 'Jamie',
      type: 'document',
      collaborators: 5,
    },
    {
      id: 3,
      title: 'Product Metrics',
      lastEdited: '1 week ago',
      sharedBy: 'Taylor',
      type: 'spreadsheet',
      collaborators: 2,
    },
    {
      id: 4,
      title: 'Design System',
      lastEdited: '2 weeks ago',
      sharedBy: 'Morgan',
      type: 'document',
      collaborators: 4,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Shared with me</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex" size="sm">
            New
          </Button>
          <Button className="md:hidden" size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="mb-2">
                  {doc.type === 'document' && (
                    <FileText className="h-6 w-6 text-blue-500" />
                  )}
                  {doc.type === 'spreadsheet' && (
                    <FileSpreadsheet className="h-6 w-6 text-green-500" />
                  )}
                  {doc.type === 'finance' && (
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  )}
                  {doc.type === 'report' && (
                    <BarChart className="h-6 w-6 text-orange-500" />
                  )}
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, doc.collaborators) }).map(
                    (_, i) => (
                      <Avatar
                        key={i}
                        className="h-6 w-6 border-2 border-background"
                      >
                        <AvatarFallback className="text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    )
                  )}
                  {doc.collaborators > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      +{doc.collaborators - 3}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-medium text-lg mb-1">{doc.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Shared by {doc.sharedBy} • {doc.lastEdited}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-primary text-white"
                >
                  Open
                </Button>
                <Button size="sm" variant="outline">
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
