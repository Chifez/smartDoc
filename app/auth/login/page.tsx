'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { signIn, isLoading, error, user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);

    // Check session directly after login
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    // Check if user came from email verification
    const emailVerified = searchParams?.get('emailVerified') === 'true';
    if (emailVerified) {
      setVerificationSuccess(true);
    }

    // Check session directly from Supabase
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      console.log('Session from Supabase:', data.user);

      if (data.user) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [searchParams, router]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Log in to your account
      </h2>

      {verificationSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <AlertDescription className="text-green-700">
            Email verified successfully! You can now log in.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#634AFF] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#634AFF] hover:bg-[#5338FF]"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#634AFF] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
