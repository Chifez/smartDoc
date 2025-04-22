'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, Users, Clock, Lock, Zap, Globe } from 'lucide-react';

export default function FeatureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <FileText className="h-10 w-10 text-[#634AFF]" />,
      title: 'Smart Document Editing',
      description:
        'Powerful editing tools with real-time formatting, spell check, and AI-powered suggestions.',
    },
    {
      icon: <Users className="h-10 w-10 text-[#634AFF]" />,
      title: 'Real-time Collaboration',
      description:
        'Work together with your team in real-time, seeing changes as they happen.',
    },
    {
      icon: <Clock className="h-10 w-10 text-[#634AFF]" />,
      title: 'Version History',
      description:
        'Track changes and revert to previous versions with comprehensive history.',
    },
    {
      icon: <Lock className="h-10 w-10 text-[#634AFF]" />,
      title: 'Advanced Permissions',
      description:
        'Control who can view, edit, or comment on your documents with granular permissions.',
    },
    {
      icon: <Zap className="h-10 w-10 text-[#634AFF]" />,
      title: 'Instant Sharing',
      description:
        'Share documents with anyone via secure links or direct invitations.',
    },
    {
      icon: <Globe className="h-10 w-10 text-[#634AFF]" />,
      title: 'Cross-platform Access',
      description:
        'Access your documents from any device, anywhere, with our web and mobile apps.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-24" ref={ref}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything you need for document collaboration
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides all the tools you need to create, edit, and
              collaborate on documents with your team.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col space-y-4 rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#634AFF]/30"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
