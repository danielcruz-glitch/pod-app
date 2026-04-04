import { NextResponse } from "next/server";
import { twilioClient } from "@/lib/twilio";

export async function GET() {
  try {
    const to = "+16462048114"; // replace with your real cell number

    const result = await twilioClient.messages.create({
      body: "Test SMS from POD app",
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });

    console.log("Test SMS sent successfully:", result.sid);

    return NextResponse.json({
      success: true,
      sid: result.sid,
      to,
    });
  } catch (error: any) {
    console.error("Test SMS failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unknown error",
        moreInfo: error.moreInfo || null,
        code: error.code || null,
      },
      { status: 500 }
    );
  }
}