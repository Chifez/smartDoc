import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './provider';
import { Toaster } from 'sonner';
import Header from './(landing)/components/header';
import Footer from './(landing)/components/footer';
// Configure the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Syncro - Real-time Document Collaboration',
  description: 'Collaborate on documents in real-time with Syncro',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
