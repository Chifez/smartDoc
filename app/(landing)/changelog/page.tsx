import { changelog } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function ChangelogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'fix':
        return 'bg-yellow-100 text-yellow-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              Changelog
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              What's New in Syncro
            </h1>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay up to date with the latest features, improvements, and fixes
              in Syncro.
            </p>
          </div>
        </motion.div>

        <div ref={ref} className="max-w-3xl mx-auto space-y-12">
          {changelog.map((entry, index) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 pb-12 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
            >
              <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#634AFF] text-white">
                <span className="text-sm font-medium">{entry.version}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <time className="text-sm text-gray-500">
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </time>
                </div>
                <div className="space-y-4">
                  {entry.changes.map((change, changeIndex) => (
                    <div
                      key={changeIndex}
                      className="flex items-start space-x-4"
                    >
                      <Badge
                        variant="outline"
                        className={`${getChangeTypeColor(
                          change.type
                        )} border-0`}
                      >
                        {change.type.charAt(0).toUpperCase() +
                          change.type.slice(1)}
                      </Badge>
                      <p className="text-gray-600">{change.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Subscribe to Updates</h2>
          <p className="text-gray-500 mb-6">
            Get notified about new features, improvements, and fixes directly in
            your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-[#634AFF] focus:outline-none focus:ring-1 focus:ring-[#634AFF]"
            />
            <button className="inline-flex items-center justify-center rounded-md bg-[#634AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5239E0] transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
