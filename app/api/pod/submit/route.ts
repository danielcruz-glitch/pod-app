import { supabase } from '@/lib/supabase';

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
      receiver_name,
      notes,
      recipient_email,
      cc_email,
      submitted_by,
    } = body;

    if (
      !delivery_date ||
      !driver_name ||
      !customer_name ||
      !delivery_address ||
      !order_number ||
      !delivery_status ||
      !receiver_name ||
      !recipient_email
    ) {
      return Response.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
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
          receiver_name,
          notes,
          recipient_email,
          cc_email,
          submitted_by,
          email_status: 'pending',
        },
      ])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}