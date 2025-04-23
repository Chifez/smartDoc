import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import Header from '@/app/(landing)/components/header';
import Footer from '@/app/(landing)/components/footer';

export default function BlogPage() {
  const featuredPost = {
    title: "How to Improve Your Team's Document Collaboration",
    excerpt:
      'Learn the best practices for effective document collaboration and how Syncro can help your team work better together.',
    image: '/placeholder.svg?height=600&width=1200',
    date: 'May 15, 2023',
    author: 'Sarah Johnson',
    readTime: '8 min read',
    slug: 'improve-document-collaboration',
  };

  const posts = [
    {
      title: '5 Ways to Streamline Your Document Workflow',
      excerpt:
        'Discover how to optimize your document processes and save time with these proven strategies.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'April 28, 2023',
      author: 'Michael Chen',
      readTime: '6 min read',
      slug: 'streamline-document-workflow',
    },
    {
      title: 'The Future of Real-time Collaboration Tools',
      excerpt:
        'Explore the emerging trends and technologies shaping the future of collaborative work.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'April 15, 2023',
      author: 'Emily Rodriguez',
      readTime: '10 min read',
      slug: 'future-collaboration-tools',
    },
    {
      title: 'Security Best Practices for Document Sharing',
      excerpt:
        'Learn how to keep your sensitive documents secure while maintaining efficient collaboration.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'April 3, 2023',
      author: 'David Kim',
      readTime: '7 min read',
      slug: 'document-security-best-practices',
    },
    {
      title: 'How AI is Transforming Document Editing',
      excerpt:
        'Discover how artificial intelligence is revolutionizing the way we create and edit documents.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'March 22, 2023',
      author: 'Priya Patel',
      readTime: '9 min read',
      slug: 'ai-document-editing',
    },
    {
      title: 'Building a Culture of Collaboration',
      excerpt:
        'Tips for fostering a collaborative environment that enhances productivity and innovation.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'March 10, 2023',
      author: 'James Wilson',
      readTime: '5 min read',
      slug: 'culture-of-collaboration',
    },
    {
      title: 'Case Study: How Company X Improved Efficiency by 40%',
      excerpt:
        'See how a leading company transformed their document workflow with Syncro.',
      image: '/placeholder.svg?height=400&width=600',
      date: 'February 28, 2023',
      author: 'Lisa Thompson',
      readTime: '8 min read',
      slug: 'company-x-case-study',
    },
  ];

  const categories = [
    'All Posts',
    'Productivity',
    'Collaboration',
    'Security',
    'Case Studies',
    'Product Updates',
    'Tips & Tricks',
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Syncro <span className="text-[#634AFF]">Blog</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  Insights, tips, and news about document collaboration and
                  productivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/blog/category/${category
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  className={`px-4 py-2 rounded-full text-sm ${
                    index === 0
                      ? 'bg-[#634AFF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Featured Post</h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={featuredPost.image || '/placeholder.svg'}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h3 className="text-3xl font-bold">{featuredPost.title}</h3>
                <p className="text-gray-500">{featuredPost.excerpt}</p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center text-[#634AFF] font-medium hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image || '/placeholder.svg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <div className="text-sm">{post.author}</div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm text-[#634AFF] font-medium hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/blog/archive"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#634AFF] bg-white px-8 text-sm font-medium text-[#634AFF] shadow-sm transition-colors hover:bg-[#634AFF]/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View all posts
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Subscribe to our newsletter
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg">
                  Get the latest insights and tips on document collaboration
                  delivered to your inbox.
                </p>
              </div>
              <div className="flex w-full max-w-md flex-col gap-2 min-[400px]:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="inline-flex h-12 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white shadow transition-colors hover:bg-[#5239E0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
