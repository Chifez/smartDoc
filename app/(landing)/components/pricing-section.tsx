'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for individuals and small projects',
      features: [
        'Up to 3 documents',
        'Basic editing tools',
        '1 collaborator per document',
        '1GB storage',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per user / month',
      description: 'Ideal for teams and growing businesses',
      features: [
        'Unlimited documents',
        'Advanced editing tools',
        'Up to 10 collaborators per document',
        '10GB storage',
        'Version history (30 days)',
        'Priority support',
        'Custom templates',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited everything',
        'Advanced security features',
        'Admin controls',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        '99.9% uptime SLA',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24" ref={ref}>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-[#634AFF]">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for you and your team. All plans
              include a 14-day free trial.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col space-y-4 rounded-xl border ${
                plan.popular
                  ? 'border-[#634AFF] shadow-lg'
                  : 'border-gray-200 shadow-sm'
              } bg-white p-6`}
            >
              {plan.popular && (
                <div className="inline-block self-start rounded-full bg-[#634AFF] px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-sm text-gray-500">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <ul className="flex-1 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-[#634AFF]" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-[#634AFF] hover:bg-[#5239E0] text-white'
                    : 'bg-white text-[#634AFF] border border-[#634AFF] hover:bg-[#634AFF]/5'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
