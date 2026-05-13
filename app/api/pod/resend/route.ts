import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendSigningEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const podId = Number(body.pod_id);

    if (!podId) {
      return NextResponse.json(
        { error: "POD id is required." },
        { status: 400 }
      );
    }

    const { data: pod, error: findError } = await supabaseAdmin
      .from("pod_submissions")
      .select("*")
      .eq("id", podId)
      .single();

    if (findError || !pod) {
      return NextResponse.json(
        { error: "POD record not found." },
        { status: 404 }
      );
    }

    if (!pod.signing_token) {
      return NextResponse.json(
        { error: "Signing token is missing on this POD." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const signingLink = `${baseUrl}/pod/sign/${pod.signing_token}`;

    await sendSigningEmail({
      signingLink,
      orderNumber: pod.order_number,
      company: pod.company,
      customerName: pod.customer_name,
      driverName: pod.driver_name,
      deliveryDate: pod.delivery_date,
    });

    await supabaseAdmin
      .from("pod_submissions")
      .update({ sms_status: "email_resent" })
      .eq("id", pod.id);

    return NextResponse.json({
      success: true,
      message: "Email notification resent successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
