import { NextResponse } from "next/server";
import {
  contactFailureMessage,
  contactSuccessMessage,
  parseContactLead,
} from "@/lib/contactLead";
import { postmarkIsConfigured } from "@/lib/postmarkEmail";
import { sendContactConfirmationEmail } from "@/lib/sendContactConfirmationEmail";
import { sendContactLeadEmail } from "@/lib/sendContactLeadEmail";
import { clientIp, verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const token = formData.get("cf-turnstile-response");
  const verified = await verifyTurnstile(typeof token === "string" ? token : "", clientIp(request));
  if (!verified) {
    return NextResponse.json(
      { error: "Please complete the security check before submitting." },
      { status: 403 }
    );
  }

  const website = formData.get("website");
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ message: contactSuccessMessage });
  }

  const parsed = parseContactLead(formData);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!postmarkIsConfigured()) {
    return NextResponse.json({ error: contactFailureMessage }, { status: 503 });
  }

  const leadResult = await sendContactLeadEmail(parsed.lead);
  if (!leadResult.ok) {
    return NextResponse.json({ error: contactFailureMessage }, { status: 502 });
  }

  try {
    const confirmation = await sendContactConfirmationEmail(parsed.lead);
    if (!confirmation.ok) console.error("Contact confirmation email failed");
  } catch (error) {
    console.error("Contact confirmation email failed", error);
  }

  return NextResponse.json({ message: contactSuccessMessage });
}
