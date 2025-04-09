import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('token');

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(
    new URL('/auth?error=AuthCallbackFailed', request.url)
  );
}
