import Link from 'next/link';
import {
  Search,
  FileText,
  Book,
  Code,
  MessageSquare,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function DocumentationPage() {
  const categories = [
    {
      title: 'Getting Started',
      icon: <FileText className="h-6 w-6 text-[#634AFF]" />,
      description: 'Learn the basics of Syncro and get up and running quickly.',
      links: [
        { title: 'Quick Start Guide', href: '/documentation/quick-start' },
        {
          title: 'Creating Your First Document',
          href: '/documentation/first-document',
        },
        {
          title: 'Inviting Collaborators',
          href: '/documentation/inviting-collaborators',
        },
        {
          title: 'Understanding the Interface',
          href: '/documentation/interface',
        },
      ],
    },
    {
      title: 'Core Features',
      icon: <Book className="h-6 w-6 text-[#634AFF]" />,
      description: 'Explore the main features and capabilities of Syncro.',
      links: [
        { title: 'Document Editing', href: '/documentation/document-editing' },
        {
          title: 'Real-time Collaboration',
          href: '/documentation/real-time-collaboration',
        },
        { title: 'Version History', href: '/documentation/version-history' },
        { title: 'Comments and Feedback', href: '/documentation/comments' },
      ],
    },
    {
      title: 'Advanced Usage',
      icon: <Code className="h-6 w-6 text-[#634AFF]" />,
      description: 'Take your usage to the next level with advanced features.',
      links: [
        { title: 'Templates', href: '/documentation/templates' },
        { title: 'API Integration', href: '/documentation/api' },
        { title: 'Custom Workflows', href: '/documentation/workflows' },
        { title: 'Security Settings', href: '/documentation/security' },
      ],
    },
    {
      title: 'Troubleshooting',
      icon: <LifeBuoy className="h-6 w-6 text-[#634AFF]" />,
      description:
        'Find solutions to common issues and get help when you need it.',
      links: [
        { title: 'Common Issues', href: '/documentation/common-issues' },
        { title: 'Error Messages', href: '/documentation/error-messages' },
        { title: 'Contact Support', href: '/support' },
        { title: 'System Status', href: '/status' },
      ],
    },
  ];

  const popularArticles = [
    {
      title: 'How to set up team permissions',
      href: '/documentation/team-permissions',
    },
    {
      title: 'Importing documents from other platforms',
      href: '/documentation/importing',
    },
    {
      title: 'Setting up SSO authentication',
      href: '/documentation/sso-setup',
    },
    {
      title: 'Using keyboard shortcuts',
      href: '/documentation/keyboard-shortcuts',
    },
    {
      title: 'Exporting documents in different formats',
      href: '/documentation/exporting',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Syncro <span className="text-[#634AFF]">Documentation</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  Everything you need to know about using Syncro for document
                  collaboration.
                </p>
              </div>
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search documentation..."
                    className="h-12 w-full rounded-md border border-input bg-white pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#634AFF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold">{category.title}</h2>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="flex items-center text-sm text-[#634AFF] hover:underline"
                        >
                          <ChevronRight className="mr-1 h-4 w-4" />
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Popular articles
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  Our most frequently read documentation to help you get the
                  most out of Syncro.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl divide-y">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  href={article.href}
                  className="flex items-center justify-between py-4 hover:bg-gray-100 px-4 rounded-lg -mx-4"
                >
                  <div className="flex items-center">
                    <FileText className="mr-3 h-5 w-5 text-[#634AFF]" />
                    <span>{article.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Video tutorials
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  Learn visually with our step-by-step video guides.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#634AFF]/90 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-8 w-8 text-white"
                        >
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-400">Video Thumbnail</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">Getting Started with Syncro</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Learn the basics in this introductory tutorial.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link
                href="/documentation/videos"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#634AFF] bg-white px-8 text-sm font-medium text-[#634AFF] shadow-sm transition-colors hover:bg-[#634AFF]/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View all videos
              </Link>
            </div>
          </div>
        </section>

        {/* Community & Support */}
        <section className="py-20 bg-gradient-to-r from-[#634AFF] to-[#8970FF]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-4 rounded-xl bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <MessageSquare className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Join our community</h3>
                <p className="text-gray-500">
                  Connect with other Syncro users, share tips, and get inspired
                  by how others are using the platform.
                </p>
                <Link
                  href="/community"
                  className="w-fit inline-flex h-10 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white shadow transition-colors hover:bg-[#5239E0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Join Community
                </Link>
              </div>
              <div className="flex flex-col space-y-4 rounded-xl bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <LifeBuoy className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Need help?</h3>
                <p className="text-gray-500">
                  Our support team is here to help you with any questions or
                  issues you might have.
                </p>
                <Link
                  href="/support"
                  className="w-fit inline-flex h-10 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white shadow transition-colors hover:bg-[#5239E0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
