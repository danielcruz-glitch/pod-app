import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendSigningEmail } from "@/lib/email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_number,
      company,
      customer_name,
      recipient_email,
      delivery_address,
      delivery_date,
      delivery_time,
      items,
      driver_name,
      driver_phone,
    } = body;

    console.log("Incoming POD body:", body);

    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company is required" },
        { status: 400 }
      );
    }

    if (!driver_phone) {
      return NextResponse.json(
        { success: false, message: "Driver phone is required" },
        { status: 400 }
      );
    }

    // Generate signing token and link
    const signingToken = crypto.randomBytes(24).toString("hex");
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const signingLink = `${appUrl}/pod/sign/${signingToken}`;

    console.log("Generated signing link:", signingLink);

    // Insert POD record
    const { data: insertedPod, error: insertError } = await supabase
      .from("pod_submissions")
      .insert([
        {
          order_number: order_number || null,
          company,
          customer_name: customer_name || null,
          recipient_email: recipient_email || null,
          delivery_address: delivery_address || null,
          delivery_date: delivery_date || null,
          delivery_time: delivery_time || null,
          items: items || null,
          driver_name: driver_name || null,
          driver_phone: driver_phone || null,
          signing_token: signingToken,
          signing_status: "pending",
          pod_status: "Pending Signature",
          sms_status: "pending",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert failed:", insertError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save POD to database",
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    console.log("POD inserted:", insertedPod);

    // Send email notification
    try {
      const emailResult = await sendSigningEmail({
        signingLink,
        orderNumber: order_number,
        company,
        customerName: customer_name,
        driverName: driver_name,
        deliveryDate: delivery_date,
      });

      console.log("Signing email sent:", emailResult.data?.id);

      await supabase
        .from("pod_submissions")
        .update({ sms_status: `email_sent:${emailResult.data?.id ?? "ok"}` })
        .eq("id", insertedPod.id);

      return NextResponse.json({
        success: true,
        message: "POD created and email notification sent successfully",
        pod: insertedPod,
        signingLink,
        emailId: emailResult.data?.id,
      });
    } catch (emailError: unknown) {
      const msg = emailError instanceof Error ? emailError.message : "Unknown error";
      console.error("Email notification failed:", emailError);

      await supabase
        .from("pod_submissions")
        .update({ sms_status: `email_failed:${msg}` })
        .eq("id", insertedPod.id);

      return NextResponse.json(
        {
          success: false,
          message: "POD saved, but email notification failed",
          pod: insertedPod,
          signingLink,
          emailError: msg,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown server error";
    console.error("POD create route crashed:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: msg },
      { status: 500 }
    );
  }
}
