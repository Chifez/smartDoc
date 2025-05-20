'use client';

import { integrations } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function IntegrationsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = {
    productivity: 'Productivity',
    communication: 'Communication',
    storage: 'Storage',
    development: 'Development',
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
              Integrations
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Connect with your favorite tools
            </h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Syncro integrates seamlessly with the tools you already use,
              making document collaboration even more powerful.
            </p>
          </div>
        </motion.div>

        <div ref={ref} className="space-y-16">
          {Object.entries(categories).map(([category, title]) => (
            <div key={category} className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {integrations
                  .filter((integration) => integration.category === category)
                  .map((integration, index) => (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="relative h-12 w-12">
                          <Image
                            src={integration.icon}
                            alt={integration.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Badge
                          variant={
                            integration.status === 'stable'
                              ? 'default'
                              : 'secondary'
                          }
                          className="ml-2"
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{integration.name}</h3>
                      <p className="text-gray-500">{integration.description}</p>
                      <button className="mt-4 inline-flex items-center justify-center rounded-md bg-[#634AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors">
                        Connect {integration.name}
                      </button>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Don't see what you're looking for?
          </h2>
          <p className="text-gray-500 mb-6">
            We're constantly adding new integrations. Let us know what tools
            you'd like to see integrated with Syncro.
          </p>
          <button className="inline-flex items-center justify-center rounded-md border border-[#634AFF] px-4 py-2 text-sm font-medium text-[#634AFF] hover:bg-[#634AFF]/5 transition-colors">
            Request an Integration
          </button>
        </motion.div>
      </div>
    </div>
  );
}
