import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
  const result = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    cc: cc && cc.length > 0 ? cc : undefined,
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