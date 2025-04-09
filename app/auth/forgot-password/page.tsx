'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth-store';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Reset your password
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submitted ? (
        <div className="text-center">
          <p className="mb-4">
            If an account exists for {email}, we've sent instructions to reset
            your password.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="mt-2">
              Back to login
            </Button>
          </Link>
        </div>
      ) : (
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

          <Button
            type="submit"
            className="w-full bg-[#634AFF] hover:bg-[#5338FF]"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send reset instructions'}
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="text-sm text-[#634AFF] hover:underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
