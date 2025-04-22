'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const faqs = [
    {
      question: 'How does real-time collaboration work?',
      answer:
        "Our platform allows multiple users to edit the same document simultaneously. Changes are synced in real-time, and you can see who's editing what with colored cursors and highlights.",
    },
    {
      question: 'Can I use DocCollab offline?',
      answer:
        'Yes, you can work on documents offline. Changes will automatically sync when you reconnect to the internet.',
    },
    {
      question: 'How secure are my documents?',
      answer:
        'We use industry-standard encryption to protect your data. All documents are encrypted both in transit and at rest, and we offer advanced permission controls to restrict access.',
    },
    {
      question: 'Can I integrate DocCollab with other tools?',
      answer:
        'Yes, we offer integrations with popular tools like Slack, Google Drive, Dropbox, and more. We also have an API for custom integrations.',
    },
    {
      question: 'What file formats are supported?',
      answer:
        'DocCollab supports a wide range of file formats including .docx, .pdf, .txt, .md, and more. You can import and export documents in these formats.',
    },
    {
      question: 'How do I get started with DocCollab?',
      answer:
        'Simply sign up for a free account, create your first document, and invite collaborators. Our intuitive interface makes it easy to get started right away.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about DocCollab and how it can
              help your team collaborate more effectively.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl py-12"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
