import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendDriverSms } from "@/lib/sendSms";

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

    if (pod.signing_status === "signed") {
      return NextResponse.json(
        { error: "This POD is already signed. No resend needed." },
        { status: 400 }
      );
    }

    if (!pod.driver_phone) {
      return NextResponse.json(
        { error: "Driver phone is missing on this POD." },
        { status: 400 }
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

    await sendDriverSms(pod.driver_phone, signingLink);

    const { error: updateError } = await supabaseAdmin
      .from("pod_submissions")
      .update({ sms_status: "resent" })
      .eq("id", pod.id);

    if (updateError) {
      console.error("Failed to update sms_status to resent:", updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: "SMS resent successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}