'use client';

import { features } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FeaturesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = {
    collaboration: 'Collaboration',
    security: 'Security',
    productivity: 'Productivity',
    // integration: 'Integration',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-16 md:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
              Features
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Everything you need for document collaboration
            </h1>
            <p className="mx-auto max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover the powerful features that make Syncro the perfect tool
              for your team's document collaboration needs.
            </p>
          </div>
        </motion.div>

        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(categories).map(([category, title]) => (
            <div key={category} className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <div className="space-y-6">
                {features
                  .filter((feature) => feature.category === category)
                  .map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <feature.icon className="h-6 w-6 text-[#634AFF]" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-gray-500">{feature.description}</p>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
