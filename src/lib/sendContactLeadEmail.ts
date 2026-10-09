import {
  leadHtmlBody,
  leadRecipients,
  leadSubject,
  leadTextBody,
  type ContactLead,
} from "@/lib/contactLead";
import { sendPostmarkEmail } from "@/lib/postmarkEmail";

export async function sendContactLeadEmail(lead: ContactLead): Promise<{ ok: true } | { ok: false }> {
  const from = process.env.POSTMARK_FROM_EMAIL?.trim();
  if (!from) return { ok: false };

  return sendPostmarkEmail({
    From: from,
    To: leadRecipients().join(","),
    ReplyTo: lead.email,
    Subject: leadSubject(lead),
    TextBody: leadTextBody(lead),
    HtmlBody: leadHtmlBody(lead),
    MessageStream: "outbound",
  });
}
