import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendPodEmailParams = {
  to: string;
  cc?: string;
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
  const emailData = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    cc: cc || undefined,
    subject: `Proof of Delivery - Order ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Proof of Delivery</h2>
        <p>Hello,</p>
        <p>Your Proof of Delivery for <strong>${customerName}</strong> has been generated.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p>
          You can view or download the PDF here:
          <a href="${pdfUrl}" target="_blank">Open POD PDF</a>
        </p>
        <p>Thank you.</p>
      </div>
    `,
  });

  return emailData;
}