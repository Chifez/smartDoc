import { blogPosts } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookmarkPlus,
  ArrowLeft,
} from 'lucide-react';
import Header from '@/app/(landing)/components/header';
import Footer from '@/app/(landing)/components/footer';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = (await params).slug;
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Mock content for the blog post
  const content = `
    <p class="lead">${post.excerpt}</p>

    <h2>The Importance of Document Collaboration</h2>
    <p>In today's fast-paced business environment, effective document collaboration is more crucial than ever. Teams need to work together seamlessly, regardless of their physical location or time zone. This is where modern collaboration tools come into play, transforming how we work with documents.</p>

    <h2>Key Benefits of Real-time Collaboration</h2>
    <ul>
      <li>Instant updates and changes visible to all team members</li>
      <li>Reduced email chains and version confusion</li>
      <li>Improved team productivity and efficiency</li>
      <li>Better communication and transparency</li>
    </ul>

    <h2>Best Practices for Document Collaboration</h2>
    <p>To make the most of your document collaboration tools, consider implementing these best practices:</p>
    <ol>
      <li>Establish clear naming conventions for documents</li>
      <li>Set up proper access controls and permissions</li>
      <li>Use comments and annotations effectively</li>
      <li>Regularly review and update shared documents</li>
    </ol>

    <blockquote>
      "The future of work is collaborative, and document collaboration tools are at the forefront of this transformation."
    </blockquote>

    <h2>Getting Started with Document Collaboration</h2>
    <p>Getting started with document collaboration doesn't have to be complicated. Here are some simple steps to begin:</p>
    <ol>
      <li>Choose the right collaboration platform for your team</li>
      <li>Set up your team structure and permissions</li>
      <li>Create templates for common document types</li>
      <li>Train your team on best practices</li>
    </ol>

    <h2>Conclusion</h2>
    <p>Document collaboration is no longer a nice-to-have feature—it's essential for modern teams. By implementing the right tools and practices, you can significantly improve your team's productivity and efficiency.</p>
  `;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Back to Blog Link */}
        <div className="border-b">
          <div className="container px-4 md:px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16 ">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto ">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {post.category
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-gray-500">Author</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <div className="relative h-[400px] md:h-[300px] border border-black max-w-4xl mx-auto ">
          <Image
            src={post.featuredImage || '/placeholder.svg'}
            alt={post.title}
            fill
            className="object-cover mx-auto "
            priority
          />
        </div>

        {/* Content */}
        <article className="py-12 ">
          <div className="container px-4 md:px-6 max-w-4xl  mx-auto ">
            <div
              className="prose prose-lg max-w-2xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share and Save */}
            <div className="mt-8 flex items-center gap-4">
              <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <BookmarkPlus className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedPost.featuredImage || '/placeholder.svg'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(relatedPost.publishedAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {relatedPost.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 flex-1">
                        {relatedPost.excerpt}
                      </p>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="text-sm text-[#634AFF] font-medium hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Subscribe to our newsletter
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500">
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
