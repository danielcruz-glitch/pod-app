import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = String(body.token || "").trim();
    const receiver_printed_name = String(body.receiver_printed_name || "").trim();
    const signature_data_url = String(body.signature_data_url || "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Signing token is required." },
        { status: 400 }
      );
    }

    if (!receiver_printed_name) {
      return NextResponse.json(
        { error: "Receiver printed name is required." },
        { status: 400 }
      );
    }

    if (!signature_data_url) {
      return NextResponse.json(
        { error: "Signature data is required." },
        { status: 400 }
      );
    }

    const { data: existingPod, error: findError } = await supabaseAdmin
      .from("pod_submissions")
      .select("*")
      .eq("signing_token", token)
      .single();

    if (findError || !existingPod) {
      return NextResponse.json(
        { error: "Invalid or expired signing link." },
        { status: 404 }
      );
    }

    const { data: updatedPod, error: updateError } = await supabaseAdmin
      .from("pod_submissions")
      .update({
        receiver_printed_name,
        signature_data_url,
        signing_status: "signed",
        signed_at: new Date().toISOString(),
      })
      .eq("signing_token", token)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to save signature: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signature saved successfully.",
      pod: updatedPod,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}