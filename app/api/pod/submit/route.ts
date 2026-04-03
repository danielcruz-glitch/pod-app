import { supabaseServer } from '@/lib/supabase-server';
import { generatePodPdf } from '@/lib/pdf-generator';
import { sendPodEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      delivery_date,
      delivery_time,
      driver_name,
      customer_name,
      company_name,
      delivery_address,
      order_number,
      items_delivered,
      delivery_status,
      receiver_printed_name,
      notes,
      recipient_email,
      cc_email,
      submitted_by,
      signature_data,
    } = body;

    if (
      !delivery_date ||
      !driver_name ||
      !customer_name ||
      !delivery_address ||
      !order_number ||
      !delivery_status ||
      !receiver_printed_name ||
      !recipient_email
    ) {
      return Response.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const { data: insertedRows, error: insertError } = await supabaseServer
      .from('pod_submissions')
      .insert([
        {
          delivery_date,
          delivery_time,
          driver_name,
          customer_name,
          company_name,
          delivery_address,
          order_number,
          items_delivered,
          delivery_status,
          receiver_printed_name,
          notes,
          recipient_email,
          cc_email,
          submitted_by,
          signature_data,
          email_status: 'pending',
        },
      ])
      .select();

    if (insertError || !insertedRows || insertedRows.length === 0) {
      return Response.json(
        { error: insertError?.message || 'Insert failed.' },
        { status: 500 }
      );
    }

    const insertedPod = insertedRows[0];

    const pdfBytes = await generatePodPdf({
      id: insertedPod.id,
      delivery_date,
      delivery_time,
      driver_name,
      customer_name,
      company_name,
      delivery_address,
      order_number,
      items_delivered,
      delivery_status,
      receiver_printed_name,
      notes,
      recipient_email,
      cc_email,
      submitted_by,
      signature_data,
    });

    const fileName = `pod-${insertedPod.id}.pdf`;

    await supabaseServer.storage
      .from('pod-files')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    const { data: publicUrlData } = supabaseServer.storage
      .from('pod-files')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    await supabaseServer
      .from('pod_submissions')
      .update({ pdf_url: pdfUrl })
      .eq('id', insertedPod.id);

    await sendPodEmail({
      to: recipient_email,
      cc: cc_email,
      orderNumber: order_number,
      customerName: customer_name,
      pdfUrl,
    });

    await supabaseServer
      .from('pod_submissions')
      .update({
        email_status: 'sent',
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', insertedPod.id);

    return Response.json({
      success: true,
      message: 'POD submitted successfully.',
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}