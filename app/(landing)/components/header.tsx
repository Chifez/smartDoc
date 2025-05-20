'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/app/component/logo';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-white'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* <FileText className="h-6 w-6 text-[#634AFF]" /> */}
          <Logo className="font-black text-xl" />
          {/* <span className="font-bold text-xl">Syncro</span> */}
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Button
                onClick={handleLogin}
                variant="outline"
                className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors"
              >
                Login
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-[#634AFF] hover:bg-[#5239E0] text-white"
              >
                Get Started
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDashboard}
              className="bg-[#634AFF] hover:bg-[#5239E0] text-white"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'fit-content',
              position: 'absolute',
              width: '100%',
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b"
          >
            <div className="container px-4 py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2">
                {!user ? (
                  <>
                    <Button
                      onClick={handleLogin}
                      className="text-sm font-medium text-gray-600 hover:text-[#634AFF] transition-colors py-2"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={handleGetStarted}
                      className="bg-[#634AFF] hover:bg-[#5239E0] text-white w-full"
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleDashboard}
                    className="bg-[#634AFF] hover:bg-[#5239E0] text-white w-full"
                  >
                    Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
