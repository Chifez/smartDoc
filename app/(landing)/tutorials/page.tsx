'use client';

import { tutorials } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Code, Zap } from 'lucide-react';

export default function TutorialsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = {
    'getting-started': 'Getting Started',
    advanced: 'Advanced',
    integration: 'Integration',
    api: 'API',
  };

  const difficulties = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return BookOpen;
      case 'advanced':
        return Zap;
      case 'integration':
        return Code;
      case 'api':
        return Code;
      default:
        return BookOpen;
    }
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
              Tutorials
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Learn Syncro
            </h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Step-by-step guides to help you get the most out of Syncro's
              features.
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(categories).map(([key, label]) => {
            const Icon = getCategoryIcon(key);
            return (
              <Badge
                key={key}
                variant="outline"
                className="cursor-pointer hover:bg-[#634AFF]/5 hover:text-[#634AFF] transition-colors flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Badge>
            );
          })}
        </div>

        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial, index) => {
            const Icon = getCategoryIcon(tutorial.category);
            return (
              <motion.article
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col space-y-4"
              >
                <Link href={`/tutorials/${tutorial.id}`} className="group">
                  <div className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-[#634AFF]" />
                        <span className="text-sm text-gray-500">
                          {categories[tutorial.category]}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(
                          tutorial.difficulty
                        )} border-0`}
                      >
                        {difficulties[tutorial.difficulty]}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-[#634AFF] transition-colors">
                        {tutorial.title}
                      </h2>
                      <p className="mt-2 text-gray-500 line-clamp-2">
                        {tutorial.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {tutorial.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src={tutorial.author.avatar || '/corporate.jpg'}
                          alt={tutorial.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm text-gray-500">
                          {tutorial.author.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-500 mb-6">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex justify-center gap-2 lg:gap-4">
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-md bg-[#634AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/documentation"
              className="inline-flex items-center justify-center rounded-md border border-[#634AFF] px-4 py-2 text-sm font-medium text-[#634AFF] hover:bg-[#634AFF]/5 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
