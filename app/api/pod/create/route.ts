import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendDriverSms } from "@/lib/sendSms";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_number = String(body.order_number || "").trim();
    const company = String(body.company || "").trim();
    const customer_name = String(body.customer_name || "").trim();
    const recipient_email = String(body.recipient_email || "").trim();
    const delivery_address = String(body.delivery_address || "").trim();
    const delivery_date = String(body.delivery_date || "").trim();
    const delivery_time = String(body.delivery_time || "").trim();
    const items = String(body.items || "").trim();
    const driver_name = String(body.driver_name || "").trim();
    const driver_phone = String(body.driver_phone || "").trim();

    if (!order_number) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: "Company is required." },
        { status: 400 }
      );
    }

    if (!customer_name) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!recipient_email) {
      return NextResponse.json(
        { error: "Recipient email is required." },
        { status: 400 }
      );
    }

    if (!delivery_address) {
      return NextResponse.json(
        { error: "Delivery address is required." },
        { status: 400 }
      );
    }

    if (!delivery_date) {
      return NextResponse.json(
        { error: "Delivery date is required." },
        { status: 400 }
      );
    }

    if (!delivery_time) {
      return NextResponse.json(
        { error: "Delivery time is required." },
        { status: 400 }
      );
    }

    if (!items) {
      return NextResponse.json(
        { error: "Items are required." },
        { status: 400 }
      );
    }

    if (!driver_name) {
      return NextResponse.json(
        { error: "Driver name is required." },
        { status: 400 }
      );
    }

    if (!driver_phone) {
      return NextResponse.json(
        { error: "Driver phone is required." },
        { status: 400 }
      );
    }

    const signing_token = crypto.randomBytes(24).toString("hex");

    const { data, error } = await supabaseAdmin
      .from("pod_submissions")
      .insert([
        {
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
          signing_token,
          delivery_status: "Pending",
          pod_status: "Pending Signature",
          sms_status: "pending",
          signing_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to save POD in Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    const signingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pod/sign/${signing_token}`;

    try {
      await sendDriverSms(driver_phone, signingLink);

      const { error: updateError } = await supabaseAdmin
        .from("pod_submissions")
        .update({ sms_status: "sent" })
        .eq("id", data.id);

      if (updateError) {
        console.error("Failed to update sms_status to sent:", updateError.message);
      }
    } catch (smsError: any) {
      const { error: failedUpdateError } = await supabaseAdmin
        .from("pod_submissions")
        .update({ sms_status: "failed" })
        .eq("id", data.id);

      if (failedUpdateError) {
        console.error(
          "Failed to update sms_status to failed:",
          failedUpdateError.message
        );
      }

      return NextResponse.json(
        {
          error: `POD saved, but SMS failed: ${smsError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "POD saved and SMS sent successfully.",
      pod: data,
      signingLink,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}