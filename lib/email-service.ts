import { createClient } from "@/lib/utils/supabase/client";

const APP_NAME = "Syncro";
const PRIMARY_COLOR = "#634AFF";
const LOGO_URL = "https://your-logo-url.com/logo.png"; // Replace with your actual logo URL
const SOCIAL_LINKS = {
  twitter: "https://twitter.com/your-handle",
  github: "https://github.com/your-repo",
  linkedin: "https://linkedin.com/in/your-profile",
};

export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .logo {
      max-width: 150px;
      height: auto;
    }
    .content {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      background-color: ${PRIMARY_COLOR};
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      color: #666;
      font-size: 14px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      color: #666;
      text-decoration: none;
      margin: 0 10px;
    }
    .divider {
      border-top: 1px solid #eee;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="${APP_NAME}" class="logo">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <div class="divider"></div>
      <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <div class="social-links">
        <a href="${SOCIAL_LINKS.twitter}">Twitter</a>
        <a href="${SOCIAL_LINKS.github}">GitHub</a>
        <a href="${SOCIAL_LINKS.linkedin}">LinkedIn</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

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

  const content = `
    <h2 style="color: ${PRIMARY_COLOR}; margin-top: 0;">Document Collaboration Invitation</h2>
    <p>${invitedBy} has invited you to collaborate on the document "${
    documentTitle || "Untitled Document"
  }".</p>
    <p>Join ${APP_NAME} to start collaborating in real-time with your team.</p>
    <div style="text-align: center;">
      <a href="${signupLink}" class="button">Accept Invitation</a>
    </div>
    <p style="font-size: 14px; color: #666;">This invitation will expire in 7 days.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request this invitation, you can safely ignore this email.</p>
  `;

  const { data, error } = await supabase.functions.invoke("send-email", {
    body: {
      to,
      subject: `You've been invited to collaborate on "${
        documentTitle || "Untitled Document"
      }"`,
      html: emailTemplate(content),
    },
  });

  console.log("data", data);
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

  const content = `
    <h2 style="color: ${PRIMARY_COLOR}; margin-top: 0;">Document Access Granted</h2>
    <p>${sharedBy} has shared the document "${
    documentTitle || "Untitled Document"
  }" with you.</p>
    <p>You can now collaborate on this document in real-time with your team.</p>
    <div style="text-align: center;">
      <a href="${documentLink}" class="button">Open Document</a>
    </div>
    <p style="font-size: 14px; color: #666;">You can access this document anytime from your ${APP_NAME} dashboard.</p>
  `;

  const { data, error } = await supabase.functions.invoke("send-email", {
    body: {
      to,
      subject: `You've been given access to "${
        documentTitle || "Untitled Document"
      }"`,
      html: emailTemplate(content),
    },
  });

  console.log("data", data);
  if (error) {
    console.error("Error sending share notification email:", error);
    throw error;
  }
}
