import { ArrowRight, FileText, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from './components/header';
import FaqSection from './components/faq-section';
import FeatureSection from './components/feature-section';
import Footer from './components/footer';
import HeroSection from './components/hero-section';
import PricingSection from './components/pricing-section';
import TestimonialSection from './components/testimonial-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}

      <main className="flex-1">
        <HeroSection />
        <FeatureSection />

        {/* How it works section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
                  Seamless Workflow
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How it works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes document collaboration simple and efficient
                  with just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Create & Import</h3>
                <p className="text-gray-500">
                  Create new documents or import existing ones from your device
                  or cloud storage.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Invite & Collaborate</h3>
                <p className="text-gray-500">
                  Invite team members to collaborate in real-time with intuitive
                  sharing controls.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Zap className="h-6 w-6 text-[#634AFF]" />
                </div>
                <h3 className="text-xl font-bold">Edit & Finalize</h3>
                <p className="text-gray-500">
                  Make changes together in real-time and finalize your documents
                  with powerful editing tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TestimonialSection />
        <PricingSection />
        <FaqSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#634AFF] to-[#8970FF]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Ready to transform your document workflow?
                </h2>
                <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed">
                  Join thousands of teams who have already improved their
                  collaboration process.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#634AFF] shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Schedule a Demo
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
