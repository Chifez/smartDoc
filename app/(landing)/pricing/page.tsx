import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../components/header';
import Footer from '../components/footer';

export default function PricingPage() {
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
        'SSO and advanced authentication',
        'Custom contract terms',
        'Dedicated support team',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faq = [
    {
      question: 'Can I change plans at any time?',
      answer:
        'Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.',
    },
    {
      question:
        'Do you offer discounts for non-profits or educational institutions?',
      answer:
        'Yes, we offer special pricing for non-profits, educational institutions, and open source projects. Please contact our sales team for more information.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing and purchase orders.',
    },
    {
      question: 'Is there a setup fee?',
      answer:
        'No, there are no setup fees for any of our plans. You only pay the advertised price.',
    },
    {
      question: 'Can I try before I buy?',
      answer:
        "We offer a 14-day free trial of our Pro plan with no credit card required. You can also start with our Free plan and upgrade when you're ready.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Simple, transparent{' '}
                  <span className="text-[#634AFF]">pricing</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  Choose the plan that's right for you and your team. All plans
                  include a 14-day free trial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compare Plans */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Compare plans in detail
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  See all features and choose the plan that best fits your
                  needs.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-gray-500">
                      Features
                    </th>
                    <th className="p-4 text-center font-medium text-gray-500">
                      Free
                    </th>
                    <th className="p-4 text-center font-medium text-gray-500">
                      Pro
                    </th>
                    <th className="p-4 text-center font-medium text-gray-500">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Documents</td>
                    <td className="p-4 text-center">Up to 3</td>
                    <td className="p-4 text-center">Unlimited</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">
                      Collaborators per document
                    </td>
                    <td className="p-4 text-center">1</td>
                    <td className="p-4 text-center">Up to 10</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Storage</td>
                    <td className="p-4 text-center">1GB</td>
                    <td className="p-4 text-center">10GB</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Version history</td>
                    <td className="p-4 text-center">None</td>
                    <td className="p-4 text-center">30 days</td>
                    <td className="p-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Custom templates</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">API access</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">SSO & advanced auth</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Dedicated support</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Frequently asked questions
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  Find answers to common questions about our pricing and plans.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl divide-y">
              {faq.map((item, index) => (
                <div key={index} className="py-5">
                  <h3 className="text-lg font-medium">{item.question}</h3>
                  <p className="mt-2 text-gray-500">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#634AFF] to-[#8970FF]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                  Ready to transform your document workflow?
                </h2>
                <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed">
                  Start your 14-day free trial today. No credit card required.
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
                  Contact Sales
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
