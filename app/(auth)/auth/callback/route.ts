import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('token');
  const invitationToken = requestUrl.searchParams.get('invitation');
  const documentId = requestUrl.searchParams.get('document');

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If there's an invitation token and document ID, handle the invitation
      if (invitationToken && documentId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Call the handleInvitationSignup function
          const { error: invitationError } = await supabase.rpc(
            'handle_invitation_signup',
            {
              p_token: invitationToken,
              p_document_id: documentId,
              p_user_id: user.id,
            }
          );

          if (invitationError) {
            console.error('Error handling invitation:', invitationError);
            return NextResponse.redirect(
              new URL('/auth?error=InvitationFailed', request.url)
            );
          }
        }
      }

      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(
    new URL('/auth?error=AuthCallbackFailed', request.url)
  );
}
