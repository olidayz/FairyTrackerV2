import { Resend } from 'resend';
import { db } from './db';
import { emailTemplates } from '../shared/schema';
import { eq } from 'drizzle-orm';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function getEmailTemplate(slug: string) {
  const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.slug, slug));
  return template;
}

function replaceVariables(text: string | null, variables: Record<string, string>): string {
  if (!text) return '';
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

export async function sendTrackingEmail(toEmail: string, childName: string, trackerUrl: string) {
  try {
    const template = await getEmailTemplate('tracking-link');
    if (!template) {
      console.log('[Email] No tracking-link template found, skipping email');
      return null;
    }

    const { client, fromEmail } = await getResendClient();
    
    const variables = {
      child_name: childName,
      tracker_url: trackerUrl,
    };

    const bodyHtml = generateEmailHtml({
      type: 'tracking',
      headline: replaceVariables(template.headline, variables) || 'Kiki is Airborne!',
      bodyText: replaceVariables(template.bodyText, variables),
      ctaText: template.ctaText || 'Track Kiki Live',
      ctaUrl: replaceVariables(template.ctaUrl, variables) || trackerUrl,
      footerText: replaceVariables(template.footerText, variables),
    });

    const senderEmail = fromEmail || 'onboarding@resend.dev';
    const sender = `${SENDER_NAME} <${senderEmail}>`;
    
    const { data, error } = await client.emails.send({
      from: sender,
      to: [toEmail],
      subject: template.subject,
      html: bodyHtml,
    });

    if (error) {
      console.error('[Email] Failed to send tracking email:', error);
      return null;
    }

    console.log(`[Email] Sent tracking email to ${toEmail}, id: ${data?.id}`);
    return data;
  } catch (error) {
    console.error('[Email] Error sending tracking email:', error);
    return null;
  }
}

export async function sendMorningUnlockEmail(toEmail: string, childName: string, trackerUrl: string) {
  try {
    const template = await getEmailTemplate('morning-unlock');
    if (!template) {
      console.log('[Email] No morning-unlock template found, skipping email');
      return null;
    }

    const { client, fromEmail } = await getResendClient();
    
    const variables = {
      child_name: childName,
      tracker_url: trackerUrl,
    };

    const bodyHtml = generateEmailHtml({
      type: 'morning',
      headline: replaceVariables(template.headline, variables) || 'Mission Complete!',
      bodyText: replaceVariables(template.bodyText, variables),
      ctaText: template.ctaText || 'See The Magic',
      ctaUrl: replaceVariables(template.ctaUrl, variables) || trackerUrl,
      footerText: replaceVariables(template.footerText, variables),
    });

    const senderEmail = fromEmail || 'onboarding@resend.dev';
    const sender = `${SENDER_NAME} <${senderEmail}>`;
    
    const { data, error } = await client.emails.send({
      from: sender,
      to: [toEmail],
      subject: template.subject,
      html: bodyHtml,
    });

    if (error) {
      console.error('[Email] Failed to send morning unlock email:', error);
      return null;
    }

    console.log(`[Email] Sent morning unlock email to ${toEmail}, id: ${data?.id}`);
    return data;
  } catch (error) {
    console.error('[Email] Error sending morning unlock email:', error);
    return null;
  }
}

export async function sendAdminNotificationEmail(parentEmail: string, childName: string, referrer: string | null) {
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) {
      console.log('[Email] No ADMIN_NOTIFICATION_EMAIL configured, skipping admin notification');
      return null;
    }

    const { client, fromEmail } = await getResendClient();

    const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="color: #0ea5e9; margin: 0 0 16px 0;">New Tracker Signup!</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Child's Name:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${childName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Parent Email:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${parentEmail}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Referrer:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${referrer || 'Direct'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time:</td>
        <td style="padding: 8px 0; color: #1e293b; font-weight: 500;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

    const senderEmail = fromEmail || 'onboarding@resend.dev';
    const sender = `${SENDER_NAME} <${senderEmail}>`;
    
    const { data, error } = await client.emails.send({
      from: sender,
      to: [adminEmail],
      subject: `New Signup: ${childName}`,
      html: bodyHtml,
    });

    if (error) {
      console.error('[Email] Failed to send admin notification:', error);
      return null;
    }

    console.log(`[Email] Sent admin notification for ${childName}, id: ${data?.id}`);
    return data;
  } catch (error) {
    console.error('[Email] Error sending admin notification:', error);
    return null;
  }
}

interface EmailContent {
  type: 'tracking' | 'morning';
  headline: string;
  bodyText: string;
  ctaText: string;
  ctaUrl: string;
  footerText: string;
}

const SENDER_NAME = 'Kiki the Tooth Fairy';
const LOGO_URL = 'https://kiki-tracker.replit.app/kiki-logo.png';

function getLogoUrl(): string {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}/kiki-logo.png`;
  }
  return LOGO_URL;
}

export function getSenderName(): string {
  return SENDER_NAME;
}

function generateEmailHtml(content: EmailContent): string {
  const isTracking = content.type === 'tracking';
  const accentColor = isTracking ? '#0ea5e9' : '#d946ef';
  const badgeText = isTracking ? 'Tracker Activated' : 'Delivery Confirmed';
  const badgeBgColor = isTracking ? 'rgba(34, 197, 94, 0.1)' : 'rgba(217, 70, 239, 0.1)';
  const badgeBorderColor = isTracking ? 'rgba(34, 197, 94, 0.2)' : 'rgba(217, 70, 239, 0.2)';
  const badgeTextColor = isTracking ? '#4ade80' : '#f0abfc';
  const headerSubtext = isTracking ? 'Tooth Fairy Tracker' : 'Mission Update';
  const headerSubtextColor = isTracking ? '#22d3ee' : '#f0abfc';
  const logoUrl = getLogoUrl();

  const footerLines = content.footerText?.split('|').map(l => l.trim()).filter(Boolean) || [];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 12px; overflow: hidden;">
    
    <!-- Header -->
    <div style="background-color: #020617; padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <img src="${logoUrl}" alt="Kiki" style="width: 64px; height: 64px; border-radius: 12px; margin-bottom: 16px;">
      <p style="color: ${headerSubtextColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">${headerSubtext}</p>
    </div>

    <!-- Hero -->
    <div style="background-color: #1e293b; padding: 40px 32px; text-align: center;">
      <div style="display: inline-block; background-color: ${badgeBgColor}; border: 1px solid ${badgeBorderColor}; border-radius: 9999px; padding: 6px 12px; margin-bottom: 24px;">
        <span style="color: ${badgeTextColor}; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">${badgeText}</span>
      </div>

      <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0 0 16px 0;">${content.headline}</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; max-width: 400px; margin: 0 auto 32px auto;">${content.bodyText}</p>

      <a href="${content.ctaUrl}" style="display: inline-block; background-color: ${accentColor}; color: white; font-weight: bold; font-size: 14px; padding: 16px 32px; border-radius: 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">
        ${content.ctaText}
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color: #020617; padding: 24px; text-align: center;">
      ${footerLines.map(line => `<p style="color: #64748b; font-size: 11px; margin: 0 0 8px 0;">${line}</p>`).join('')}
    </div>

  </div>
</body>
</html>
`;
}
