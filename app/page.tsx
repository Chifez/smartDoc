import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './component/logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-[#634AFF] hover:bg-[#5338FF] text-white font-medium">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Collaborate on documents in real-time
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          smartDoc helps teams create, edit, and share documents seamlessly with
          powerful AI assistance.
        </p>
        <Link href="/auth/signup">
          <Button
            size="lg"
            className="bg-[#634AFF] hover:bg-[#5338FF] text-white font-medium px-8"
          >
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}
