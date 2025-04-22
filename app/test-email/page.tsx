'use client';

import { emailTemplate } from '@/lib/email-service';

export default function TestEmailPage() {
  const invitationContent = `
    <h2 style="color: #634AFF; margin-top: 0;">Document Collaboration Invitation</h2>
    <p>John Doe has invited you to collaborate on the document "Project Proposal".</p>
    <p>Join Syncro to start collaborating in real-time with your team.</p>
    <div style="text-align: center;">
      <a href="#" class="button">Accept Invitation</a>
    </div>
    <p style="font-size: 14px; color: #666;">This invitation will expire in 7 days.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request this invitation, you can safely ignore this email.</p>
  `;

  const shareContent = `
    <h2 style="color: #634AFF; margin-top: 0;">Document Access Granted</h2>
    <p>Jane Smith has shared the document "Team Meeting Notes" with you.</p>
    <p>You can now collaborate on this document in real-time with your team.</p>
    <div style="text-align: center;">
      <a href="#" class="button">Open Document</a>
    </div>
    <p style="font-size: 14px; color: #666;">You can access this document anytime from your Syncro dashboard.</p>
  `;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Email Template Previews</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Invitation Email</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: emailTemplate(invitationContent),
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Share Notification Email
          </h2>
          <div
            dangerouslySetInnerHTML={{ __html: emailTemplate(shareContent) }}
          />
        </div>
      </div>
    </div>
  );
}
