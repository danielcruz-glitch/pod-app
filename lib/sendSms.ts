import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendDriverSms(to: string, signingLink: string) {
  if (!to) {
    throw new Error("Driver phone number is missing.");
  }

  const message = await client.messages.create({
    body: `You have a POD ready for signature. Open this link: ${signingLink}`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });

  return message;
}