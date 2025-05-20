'use client';

import { roadmap } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import Footer from '../components/footer';

export default function RoadmapPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentYear = new Date().getFullYear();

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
              Roadmap
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Our Vision for Syncro
            </h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what we're building next and help shape the future of document
              collaboration.
            </p>
          </div>
        </motion.div>

        <div ref={ref} className="space-y-16">
          {quarters.map((quarter) => (
            <div key={quarter} className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {quarter} {currentYear}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roadmap
                  .filter(
                    (item) =>
                      item.quarter == quarter && item.year == currentYear
                  )
                  .map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(item.status)} border-0`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-gray-500">{item.description}</p>
                      <button className="mt-4 inline-flex items-center justify-center rounded-md border border-[#634AFF] px-4 py-2 text-sm font-medium text-[#634AFF] hover:bg-[#634AFF]/5 transition-colors">
                        Vote for this feature
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
          <h2 className="text-2xl font-bold mb-4">Have a Feature Request?</h2>
          <p className="text-gray-500 mb-6">
            We'd love to hear your ideas for making Syncro even better. Share
            your suggestions with us.
          </p>
          <button className="inline-flex items-center justify-center rounded-md bg-[#634AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors">
            Submit Feature Request
          </button>
        </motion.div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
