import { createClient } from "@/lib/utils/supabase/client";

export async function sendInvitationEmail({
  to,
  documentTitle,
  signupLink,
  invitedBy,
}: {
  to: string;
  documentTitle?: string | null;
  signupLink: string;
  invitedBy: string;
}) {
  const supabase = createClient();

  const { error } = await supabase.functions.invoke("send-email", {
    body: {
      to,
      subject: `You've been invited to collaborate on "${
        documentTitle || "Untitled Document"
      }"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Document Collaboration Invitation</h2>
          <p>${invitedBy} has invited you to collaborate on the document "${
        documentTitle || "Untitled Document"
      }".</p>
          <p>Click the button below to accept the invitation and start collaborating:</p>
          <a href="${signupLink}" style="display: inline-block; padding: 10px 20px; background-color: #634AFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Accept Invitation
          </a>
          <p>This invitation will expire in 7 days.</p>
          <p>If you didn't request this invitation, you can safely ignore this email.</p>
        </div>
      `,
    },
  });

  if (error) {
    console.error("Error sending invitation email:", error);
    throw error;
  }
}

export async function sendShareNotificationEmail({
  to,
  documentTitle,
  documentLink,
  sharedBy,
}: {
  to: string;
  documentTitle?: string | null;
  documentLink: string;
  sharedBy: string;
}) {
  const supabase = createClient();

  const { error } = await supabase.functions.invoke("send-email", {
    body: {
      to,
      subject: `You've been given access to "${
        documentTitle || "Untitled Document"
      }"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Document Access Granted</h2>
          <p>${sharedBy} has shared the document "${
        documentTitle || "Untitled Document"
      }" with you.</p>
          <p>Click the button below to access the document:</p>
          <a href="${documentLink}" style="display: inline-block; padding: 10px 20px; background-color: #634AFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Open Document
          </a>
          <p>You can now collaborate on this document in real-time.</p>
        </div>
      `,
    },
  });

  if (error) {
    console.error("Error sending share notification email:", error);
    throw error;
  }
}
