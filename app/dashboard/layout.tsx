'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Sidebar } from '../component/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, checkSession, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      await checkSession();
      if (!useAuthStore.getState().user) {
        router.push('/auth/login');
      }
    };

    initAuth();
  }, [checkSession, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#634AFF]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={` font-main bg-[#634AFF]/10 antialiased`}>
      <div className="h-screen flex overflow-hidden">
        <div className="overflow-hidden">
          <Sidebar />
        </div>
        <div className="overflow-auto flex-1 p-4 m-2 bg-white rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
