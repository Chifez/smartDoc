import type React from 'react';
import type { Metadata } from 'next';
import Header from './components/header';
import Footer from './components/footer';
// Configure the Inter font

export const metadata: Metadata = {
  title: 'Syncro - Real-time Document Collaboration',
  description: 'Collaborate on documents in real-time with Syncro',
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
