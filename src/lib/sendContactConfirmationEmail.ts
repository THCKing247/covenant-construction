import {
  confirmationHtmlBody,
  confirmationReplyTo,
  confirmationSubject,
  confirmationTextBody,
  type ContactLead,
} from "@/lib/contactLead";
import { sendPostmarkEmail } from "@/lib/postmarkEmail";

export async function sendContactConfirmationEmail(
  lead: ContactLead
): Promise<{ ok: true } | { ok: false }> {
  const from = process.env.POSTMARK_FROM_EMAIL?.trim();
  if (!from) return { ok: false };

  return sendPostmarkEmail({
    From: from,
    To: lead.email,
    ReplyTo: confirmationReplyTo(),
    Subject: confirmationSubject(),
    TextBody: confirmationTextBody(lead),
    HtmlBody: confirmationHtmlBody(lead),
    MessageStream: "outbound",
  });
}
