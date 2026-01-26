/**
 * Email sending utilities
 * Supports multiple email providers (Resend, SendGrid, etc.)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER || 'resend';

  try {
    switch (provider) {
      case 'resend':
        return await sendWithResend(options);
      case 'sendgrid':
        return await sendWithSendGrid(options);
      default:
        return { success: false, error: `Unknown email provider: ${provider}` };
    }
  } catch (error: any) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send email using Resend (recommended)
 * Get API key from: https://resend.com/api-keys
 */
async function sendWithResend(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const fromEmail = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'noreply@example.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Send email using SendGrid
 * Get API key from: https://app.sendgrid.com/settings/api_keys
 */
async function sendWithSendGrid(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'SENDGRID_API_KEY not configured' };
  }

  const fromEmail = process.env.EMAIL_FROM || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'noreply@example.com';

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
          },
        ],
        from: { email: fromEmail },
        subject: options.subject,
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>You requested to reset your password for FIRST TeamMatch.</p>
        <p>Click the button below to reset your password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - FIRST TeamMatch',
    html,
  });
}
