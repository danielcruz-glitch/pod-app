import { supabaseServer } from '@/lib/supabase-server';
import { generatePodPdf } from '@/lib/pdf-generator';
import { sendPodEmail } from '@/lib/email';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function buildCcArray(...emails: Array<string | null | undefined>) {
  const cleaned = emails
    .flatMap((email) => (email ? email.split(',') : []))
    .map((email) => email.trim())
    .filter((email) => email.length > 0)
    .filter((email) => isValidEmail(email));

  return cleaned.length > 0 ? cleaned : undefined;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      signing_token,
      receiver_printed_name,
      signature_data,
    } = body;

    if (!signing_token || !receiver_printed_name || !signature_data) {
      return Response.json(
        { error: 'Missing required signing fields.' },
        { status: 400 }
      );
    }

    const { data: existingRows, error: fetchError } = await supabaseServer
      .from('pod_submissions')
      .select('*')
      .eq('signing_token', signing_token)
      .limit(1);

    if (fetchError || !existingRows || existingRows.length === 0) {
      return Response.json(
        { error: 'POD record not found for this signing link.' },
        { status: 404 }
      );
    }

    const pod = existingRows[0];

    const { error: updateError } = await supabaseServer
      .from('pod_submissions')
      .update({
        receiver_printed_name,
        signature_data,
        pod_status: 'Signed',
        signed_at: new Date().toISOString(),
      })
      .eq('id', pod.id);

    if (updateError) {
      return Response.json(
        { error: `Failed to update signed POD: ${updateError.message}` },
        { status: 500 }
      );
    }

    const pdfBytes = await generatePodPdf({
      id: pod.id,
      delivery_date: pod.delivery_date,
      delivery_time: pod.delivery_time,
      driver_name: pod.driver_name,
      customer_name: pod.customer_name,
      company_name: pod.company_name,
      delivery_address: pod.delivery_address,
      order_number: pod.order_number,
      items_delivered: pod.items_delivered,
      delivery_status: pod.delivery_status,
      receiver_printed_name,
      notes: pod.notes,
      recipient_email: pod.recipient_email,
      cc_email: pod.cc_email,
      submitted_by: pod.submitted_by,
      signature_data,
    });

    const fileName = `pod-${pod.id}.pdf`;

    const { error: uploadError } = await supabaseServer.storage
      .from('pod-files')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      await supabaseServer
        .from('pod_submissions')
        .update({ email_status: 'failed' })
        .eq('id', pod.id);

      return Response.json(
        { error: `PDF upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseServer.storage
      .from('pod-files')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    const { error: pdfUpdateError } = await supabaseServer
      .from('pod_submissions')
      .update({
        pdf_url: pdfUrl,
      })
      .eq('id', pod.id);

    if (pdfUpdateError) {
      return Response.json(
        { error: `Failed to save PDF URL: ${pdfUpdateError.message}` },
        { status: 500 }
      );
    }

    try {
      const safeCc = buildCcArray(pod.billing_email, pod.cc_email);

      const emailResult = await sendPodEmail({
        to: pod.recipient_email,
        cc: safeCc,
        orderNumber: pod.order_number,
        customerName: pod.customer_name,
        pdfUrl,
      });

      const { error: emailUpdateError } = await supabaseServer
        .from('pod_submissions')
        .update({
          email_status: 'sent',
          email_sent_at: new Date().toISOString(),
        })
        .eq('id', pod.id);

      if (emailUpdateError) {
        return Response.json(
          { error: `Failed to update email status: ${emailUpdateError.message}` },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: 'POD signed successfully. Final PDF generated and emailed.',
        pdfUrl,
        emailId: emailResult.data?.id || null,
      });
    } catch (emailError: any) {
      await supabaseServer
        .from('pod_submissions')
        .update({
          email_status: 'failed',
        })
        .eq('id', pod.id);

      return Response.json(
        {
          error: `POD signed and PDF generated, but email failed: ${
            emailError.message || 'Unknown email error'
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}