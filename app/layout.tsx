import type React from 'react';
import type { Metadata, Viewport } from 'next';
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

// Viewport metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#634AFF',
  colorScheme: 'light dark',
};

// Comprehensive metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://syncro.app'),
  title: {
    default: 'Syncro - Real-time Document Collaboration Platform',
    template: '%s | Syncro',
  },
  description:
    'Syncro is a powerful real-time document collaboration platform that enables teams to work together seamlessly. Create, edit, and share documents with instant updates and powerful collaboration features.',
  keywords: [
    'document collaboration',
    'real-time editing',
    'team collaboration',
    'document sharing',
    'online document editor',
    'cloud documents',
    'collaborative workspace',
    'document management',
    'team productivity',
    'remote collaboration',
  ],
  authors: [{ name: 'Syncro Team' }],
  creator: 'Syncro',
  publisher: 'Syncro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syncro.app',
    siteName: 'Syncro',
    title: 'Syncro - Real-time Document Collaboration Platform',
    description:
      'Create, edit, and share documents in real-time with your team. Powerful collaboration features for modern teams.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Syncro - Real-time Document Collaboration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syncro - Real-time Document Collaboration Platform',
    description:
      'Create, edit, and share documents in real-time with your team. Powerful collaboration features for modern teams.',
    creator: '@syncroapp',
    images: ['/twitter-image.jpg'],
    site: '@syncroapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
  alternates: {
    canonical: 'https://syncro.app',
    languages: {
      'en-US': 'https://syncro.app',
      'es-ES': 'https://syncro.app/es',
      'fr-FR': 'https://syncro.app/fr',
    },
  },
  category: 'productivity',
  classification: 'Document Collaboration Software',
  referrer: 'origin-when-cross-origin',
  applicationName: 'Syncro',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Syncro',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#634AFF',
    'msapplication-TileImage': '/mstile-144x144.png',
    'msapplication-config': '/browserconfig.xml',
  },
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
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
