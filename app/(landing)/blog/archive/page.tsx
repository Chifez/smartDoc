'use client';

import { blogPosts } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import Header from '@/app/(landing)/components/header';
import Footer from '@/app/(landing)/components/footer';
import { useSearchParams } from 'next/navigation';

export default function BlogArchivePage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  // Get unique categories from blog posts and format them for display
  const categories = [
    'All Posts',
    ...new Set(
      blogPosts.map((post) => {
        return post.category
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      })
    ),
  ];

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory && selectedCategory !== 'All Posts'
      ? blogPosts.filter((post) => {
          const postCategory = post.category
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return postCategory === selectedCategory;
        })
      : blogPosts;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Blog <span className="text-[#634AFF]">Archive</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  Browse all our articles about document collaboration and
                  productivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                const isSelected =
                  category === selectedCategory ||
                  (!selectedCategory && category === 'All Posts');
                return (
                  <Link
                    key={category}
                    href={
                      category === 'All Posts'
                        ? '/blog/archive'
                        : `/blog/archive?category=${category}`
                    }
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#634AFF] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            {filteredPosts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featuredImage || '/placeholder.svg'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString(
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
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span className="text-sm">{post.author.name}</span>
                          </div>
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

                {/* Pagination */}
                <div className="flex justify-center mt-12 gap-2">
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                    Previous
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white hover:bg-[#5239E0]">
                    1
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500 hover:bg-gray-50">
                    2
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No posts found</h2>
                <p className="text-gray-500 mb-8">
                  No posts found in the selected category. Try selecting a
                  different category.
                </p>
                <Link
                  href="/blog/archive"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors"
                >
                  View all posts
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-50">
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
