import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const DEFAULT_NOTIFY_EMAIL = 'daniel.cruz@pursuit.org';

type SendPodEmailParams = {
  to: string;
  cc?: string[];
  orderNumber: string;
  customerName: string;
  pdfUrl: string;
};

export async function sendPodEmail({
  to,
  cc,
  orderNumber,
  customerName,
  pdfUrl,
}: SendPodEmailParams) {
  const ccList = Array.from(
    new Set([...(cc ?? []), DEFAULT_NOTIFY_EMAIL])
  ).filter(Boolean);

  const result = await resend.emails.send({
    from: 'POD-App <onboarding@resend.dev>',
    to,
    cc: ccList.length > 0 ? ccList : undefined,
    subject: `Proof of Delivery - Order ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Proof of Delivery</h2>
        <p>Hello,</p>
        <p>The final signed Proof of Delivery for <strong>${customerName}</strong> has been completed.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p>
          You can view or download the signed PDF here:
          <a href="${pdfUrl}" target="_blank">Open Signed POD PDF</a>
        </p>
        <p>This copy has been sent for customer recordkeeping and billing follow-up.</p>
        <p>Thank you.</p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Resend failed to send email.');
  }

  return result;
}

type SendSigningEmailParams = {
  signingLink: string;
  orderNumber?: string | null;
  company?: string | null;
  customerName?: string | null;
  driverName?: string | null;
  deliveryDate?: string | null;
};

export async function sendSigningEmail({
  signingLink,
  orderNumber,
  company,
  customerName,
  driverName,
  deliveryDate,
}: SendSigningEmailParams) {
  const subject = orderNumber
    ? `POD Signing Request - Order ${orderNumber}`
    : 'POD Signing Request';

  const result = await resend.emails.send({
    from: 'POD-App <onboarding@resend.dev>',
    to: DEFAULT_NOTIFY_EMAIL,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1c1917;">
        <h2 style="margin-bottom: 4px;">POD Signing Request</h2>
        <p style="margin-top: 0; color: #78716c; font-size: 14px;">A new delivery order is ready for signature.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 480px; margin: 16px 0;">
          ${orderNumber ? `<tr><td style="padding: 6px 0; font-weight: 700; width: 140px;">Order #</td><td>${orderNumber}</td></tr>` : ''}
          ${company ? `<tr><td style="padding: 6px 0; font-weight: 700;">Company</td><td>${company}</td></tr>` : ''}
          ${customerName ? `<tr><td style="padding: 6px 0; font-weight: 700;">Customer</td><td>${customerName}</td></tr>` : ''}
          ${driverName ? `<tr><td style="padding: 6px 0; font-weight: 700;">Driver</td><td>${driverName}</td></tr>` : ''}
          ${deliveryDate ? `<tr><td style="padding: 6px 0; font-weight: 700;">Delivery Date</td><td>${deliveryDate}</td></tr>` : ''}
        </table>
        <p>
          <a href="${signingLink}" target="_blank"
            style="display: inline-block; padding: 10px 20px; background: #f59e0b; color: #fff;
                   text-decoration: none; border-radius: 6px; font-weight: 700;">
            Open Signing Link
          </a>
        </p>
        <p style="font-size: 12px; color: #78716c;">Or copy this link: ${signingLink}</p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Resend failed to send signing email.');
  }

  return result;
}