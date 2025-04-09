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
import { useState } from 'react';
import { Logo } from './logo';
import { useAuthStore } from '@/store/auth-store';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const [open, setOpen] = useState(false);

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
        <Link href="/document/new" className="space-y-1">
          <Button
            variant="ghost"
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
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#1E1E1E] text-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex h-screen w-64 flex-col border-r bg-[#1E1E1E] text-white',
          className
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
