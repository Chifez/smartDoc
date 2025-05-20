'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const testimonials = [
    {
      quote:
        'Syncro has transformed how our team works together. The real-time collaboration features have made our workflow so much more efficient.',
      author: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      avatar: '/placeholder.svg?height=80&width=80',
    },
    {
      quote:
        "The intuitive interface and powerful features make document editing a breeze. I can't imagine going back to our old workflow.",
      author: 'Michael Chen',
      role: 'Creative Director at DesignHub',
      avatar: '/placeholder.svg?height=80&width=80',
    },
    {
      quote:
        "We've cut our document review time in half since switching to Syncro. The version history and commenting features are game-changers.",
      author: 'Emily Rodriguez',
      role: 'Team Lead at MarketingPro',
      avatar: '/placeholder.svg?height=80&width=80',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-50" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Loved by teams everywhere
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers have to say about how Syncro has
              transformed their document collaboration workflow.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col space-y-4 rounded-xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-1 text-[#634AFF]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <div className="flex items-center space-x-4">
                <Image
                  src={testimonial.avatar || '/corporate.jpg'}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
