import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { twilioClient } from "@/lib/twilio";
import { formatUSPhoneNumber } from "@/lib/formatPhoneNumber";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company,
      receiver_printed_name,
      driver_phone,
      billing_email,
      cc_email,
      submitted_by,
      items,
    } = body;

    console.log("Incoming POD body:", body);

    // Step 1: Validate required fields
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company is required" },
        { status: 400 }
      );
    }

    if (!receiver_printed_name) {
      return NextResponse.json(
        { success: false, message: "Receiver printed name is required" },
        { status: 400 }
      );
    }

    if (!driver_phone) {
      return NextResponse.json(
        { success: false, message: "Driver phone is required" },
        { status: 400 }
      );
    }

    // Step 2: Format phone number
    const formattedPhone = formatUSPhoneNumber(driver_phone);

    if (!formattedPhone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number. Enter a 10-digit US number like 6462048114",
        },
        { status: 400 }
      );
    }

    console.log("Formatted phone:", formattedPhone);

    // Step 3: Generate token
    const signingToken = crypto.randomBytes(24).toString("hex");

    // Step 4: Build signing link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const signingLink = `${appUrl}/pod/sign/${signingToken}`;

    console.log("Generated signing token:", signingToken);
    console.log("Generated signing link:", signingLink);

    // Step 5: Insert POD record first
    const { data: insertedPod, error: insertError } = await supabase
      .from("pod_submissions")
      .insert([
        {
          company,
          receiver_printed_name,
          driver_phone: formattedPhone,
          billing_email: billing_email || null,
          cc_email: cc_email || null,
          submitted_by: submitted_by || null,
          items: items || null,
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

    // Step 6: Send SMS
    try {
      const smsResult = await twilioClient.messages.create({
        body: `Please sign your POD here: ${signingLink}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: formattedPhone,
      });

      console.log("SMS sent successfully:", smsResult.sid);

      // Step 7: Update sms_status to sent
      const { error: smsUpdateError } = await supabase
        .from("pod_submissions")
        .update({
          sms_status: `sent:${smsResult.sid}`,
        })
        .eq("id", insertedPod.id);

      if (smsUpdateError) {
        console.error("Failed updating sms_status:", smsUpdateError);
      }

      return NextResponse.json({
        success: true,
        message: "POD created and SMS sent successfully",
        pod: insertedPod,
        signingLink,
        smsSid: smsResult.sid,
      });
    } catch (smsError: any) {
      console.error("Twilio SMS failed:", smsError);

      // Step 8: Update sms_status to failed
      const { error: smsFailUpdateError } = await supabase
        .from("pod_submissions")
        .update({
          sms_status: `failed:${smsError.message || "Unknown SMS error"}`,
        })
        .eq("id", insertedPod.id);

      if (smsFailUpdateError) {
        console.error("Failed updating sms_status after SMS failure:", smsFailUpdateError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "POD saved, but SMS failed",
          pod: insertedPod,
          signingLink,
          smsError: smsError.message || "Unknown Twilio error",
          smsCode: smsError.code || null,
          smsMoreInfo: smsError.moreInfo || null,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("POD create route crashed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}