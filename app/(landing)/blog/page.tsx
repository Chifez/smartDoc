'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import Header from '@/app/(landing)/components/header';
import Footer from '@/app/(landing)/components/footer';
import { blogPosts } from '@/lib/mock-data';
import { useSearchParams } from 'next/navigation';

export default function BlogPage() {
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

  const featuredPost =
    filteredPosts.find((post) => post.isFeatured) || filteredPosts[0];
  const recentPosts = filteredPosts
    .filter((post) => !post.isFeatured)
    .slice(0, 5);

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
              {categories.map((category) => {
                const isSelected =
                  category === selectedCategory ||
                  (!selectedCategory && category === 'All Posts');
                return (
                  <Link
                    key={category}
                    href={
                      category === 'All Posts'
                        ? '/blog'
                        : `/blog?category=${category}`
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

        {filteredPosts.length > 0 ? (
          <>
            {/* Featured Post */}
            <section className="py-12">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl font-bold mb-8">Featured Post</h2>
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src={featuredPost.featuredImage || '/corporate.jpg'}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredPost.author.name}
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
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featuredImage || '/corporate.jpg'}
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
                              src={post.author.avatar || '/corporate.jpg'}
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
                <div className="flex justify-center mt-12">
                  <Link
                    href={`/blog/archive${
                      selectedCategory ? `?category=${selectedCategory}` : ''
                    }`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#634AFF] bg-white px-8 text-sm font-medium text-[#634AFF] shadow-sm transition-colors hover:bg-[#634AFF]/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    View all posts
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No posts found</h2>
                <p className="text-gray-500 mb-8">
                  No posts found in the selected category. Try selecting a
                  different category.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#634AFF] px-4 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors"
                >
                  View all posts
                </Link>
              </div>
            </div>
          </section>
        )}

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
      {/* <Footer /> */}
    </div>
  );
}
