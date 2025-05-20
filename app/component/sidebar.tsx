'use client';

import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  Share2,
  Star,
  Clock,
  Plus,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect, useRef } from 'react';
import { Logo } from './logo';
import { useAuthStore } from '@/store/auth-store';
import { useDocumentStore } from '@/store/document-store';
import { useRouter } from 'next/navigation';
import Draggable from 'react-draggable';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { createDocument } = useDocumentStore();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load saved position from localStorage on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('menuButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else if (nodeRef.current && buttonRef.current) {
      // Calculate initial position based on container and button dimensions
      const container = nodeRef.current.getBoundingClientRect();
      const button = buttonRef.current.getBoundingClientRect();

      // Position in bottom right with some padding
      const x = container.width - button.width - 20;
      const y = container.height - button.height - 20;

      setPosition({ x, y });
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('menuButtonPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setIsDragging(false);
    setPosition({ x: data.x, y: data.y });
  };

  const handleNewDocument = async () => {
    const newDocId = await createDocument({
      title: 'Untitled Document',
      content: '',
    });
    router.push(`/dashboard/document/${newDocId}`);
  };

  const routes = [
    {
      label: 'Home',
      icon: Home,
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'My Documents',
      icon: FileText,
      href: '/dashboard/documents',
      active: pathname === '/dashboard/documents',
    },
    {
      label: 'Shared',
      icon: Share2,
      href: '/dashboard/shared',
      active: pathname === '/dashboard/shared',
    },
    {
      label: 'Favorites',
      icon: Star,
      href: '/dashboard/favorites',
      active: pathname === '/dashboard/favorites',
    },
    {
      label: 'Recent',
      icon: Clock,
      href: '/dashboard/recent',
      active: pathname === '/dashboard/recent',
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full w-full flex-col space-y-2 py-2 bg-white">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center justify-center mb-6">
          <Logo />
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:text-primary hover:bg-secondary',
                route.active
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <Link href="/dashboard/documents" className="space-y-1">
          <Button
            variant="ghost"
            onClick={handleNewDocument}
            className="hover:bg-muted text-black w-full justify-start gap-2 text-xs font-medium"
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>
      <div className="mt-auto px-3 py-2">
        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 text-xs rounded-lg px-3 py-2 font-medium transition-all hover:text-primary',
              pathname === '/dashboard/settings'
                ? 'bg-secondary text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-xs font-medium text-muted-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="fixed inset-0 pointer-events-none">
            <Draggable
              position={position}
              onStart={handleDragStart}
              onStop={handleDragStop}
              bounds="parent"
              defaultPosition={{ x: 0, y: 0 }}
              nodeRef={nodeRef as React.RefObject<HTMLElement>}
            >
              <div
                className="fixed z-50 md:hidden pointer-events-auto"
                style={{ touchAction: 'none' }}
                ref={nodeRef}
              >
                <Button
                  ref={buttonRef}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-12 w-12 rounded-full bg-[#634AFF] hover:bg-[#5239E0] shadow-lg transition-all duration-200',
                    isDragging ? 'scale-110' : 'scale-100'
                  )}
                  style={{
                    cursor: 'grab',
                    touchAction: 'none',
                  }}
                >
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </div>
            </Draggable>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#1E1E1E] text-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex h-screen w-64 flex-col border-r',
          className
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
