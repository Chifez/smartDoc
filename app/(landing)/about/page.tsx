import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Users,
  Award,
  Globe,
  Zap,
  Heart,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function AboutPage() {
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
                  About <span className="text-[#634AFF]">Syncro</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  We're on a mission to transform how teams collaborate on
                  documents and work together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  From idea to innovation
                </h2>
                <p className="text-gray-500 md:text-lg">
                  Syncro began in 2020 when our founders experienced firsthand
                  the challenges of remote collaboration. Frustrated by the
                  limitations of existing tools, they set out to build a
                  solution that would make document collaboration seamless,
                  intuitive, and enjoyable.
                </p>
                <p className="text-gray-500 md:text-lg">
                  What started as a simple idea has grown into a platform
                  trusted by thousands of teams worldwide. Our journey is just
                  beginning, and we're excited to continue innovating and
                  improving how teams work together.
                </p>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  alt="Syncro team working together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
                  Our Values
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  What drives us
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  Our core values guide everything we do, from product
                  development to customer support.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Collaboration First</h3>
                <p className="text-gray-500">
                  We believe in the power of teams working together. Our
                  platform is designed to make collaboration natural and
                  effortless.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Award className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Excellence in Design</h3>
                <p className="text-gray-500">
                  We're obsessed with creating beautiful, intuitive interfaces
                  that make complex tasks simple and enjoyable.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Zap className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Continuous Innovation</h3>
                <p className="text-gray-500">
                  We're never satisfied with the status quo. We constantly push
                  boundaries to create better solutions.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Globe className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Global Perspective</h3>
                <p className="text-gray-500">
                  We build for teams around the world, embracing diversity of
                  thought, experience, and background.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Heart className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Customer Obsession</h3>
                <p className="text-gray-500">
                  Our customers are at the heart of everything we do. Their
                  success is our success.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Transparency</h3>
                <p className="text-gray-500">
                  We believe in open communication, both within our team and
                  with our customers and partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
                  Our Team
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Meet the people behind Syncro
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  We're a diverse team of designers, engineers, and product
                  thinkers passionate about creating the best collaboration
                  tools.
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full">
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Team Member ${i}`}
                      alt={`Team member ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold">Team Member {i}</h3>
                    <p className="text-sm text-gray-500">Position Title</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="py-20 bg-gradient-to-r from-[#634AFF] to-[#8970FF]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                  Join our team
                </h2>
                <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed">
                  We're always looking for talented people to join our mission.
                  Check out our open positions.
                </p>
              </div>
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#634AFF] shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
