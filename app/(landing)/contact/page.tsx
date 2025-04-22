import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../components/header';
import Footer from '../components/footer';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Get in <span className="text-[#634AFF]">Touch</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  We'd love to hear from you. Reach out to our team with any
                  questions, feedback, or inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Contact Information
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Our team is here to help. Reach out through any of these
                    channels.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Mail className="h-5 w-5 text-[#634AFF]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-500">hello@syncro.com</p>
                      <p className="text-gray-500">support@syncro.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Phone className="h-5 w-5 text-[#634AFF]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-500">+1 (555) 123-4567</p>
                      <p className="text-gray-500">Mon-Fri, 9am-5pm PT</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <MapPin className="h-5 w-5 text-[#634AFF]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Office</h3>
                      <p className="text-gray-500">123 Innovation Way</p>
                      <p className="text-gray-500">San Francisco, CA 94107</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <MessageSquare className="h-5 w-5 text-[#634AFF]" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-gray-500">Available on our website</p>
                      <p className="text-gray-500">Mon-Fri, 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold mb-2">Office Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM PT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>Closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium"
                      >
                        First name
                      </label>
                      <input
                        id="first-name"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium"
                      >
                        Last name
                      </label>
                      <input
                        id="last-name"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-[#634AFF] hover:bg-[#5239E0]">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Visit our office
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                  We're located in the heart of San Francisco's tech district.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden h-[400px] bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500">Interactive Map Would Be Here</div>
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
                  Find quick answers to common questions about contacting us.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl divide-y">
              <div className="py-5">
                <h3 className="text-lg font-medium">
                  How quickly will I receive a response?
                </h3>
                <p className="mt-2 text-gray-500">
                  We aim to respond to all inquiries within 24 hours during
                  business days. For urgent matters, please use our live chat
                  feature.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-lg font-medium">
                  Can I schedule a demo of Syncro?
                </h3>
                <p className="mt-2 text-gray-500">
                  Yes! You can schedule a personalized demo with our team by
                  filling out the contact form or emailing sales@syncro.com.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-lg font-medium">
                  Do you offer technical support?
                </h3>
                <p className="mt-2 text-gray-500">
                  Yes, our technical support team is available 24/7 for Pro and
                  Enterprise customers. Free users can access support during
                  business hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
