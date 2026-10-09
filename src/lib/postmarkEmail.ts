export type PostmarkMessage = {
  From: string;
  To: string;
  ReplyTo: string;
  Subject: string;
  TextBody: string;
  HtmlBody: string;
  MessageStream: "outbound";
};

export function postmarkIsConfigured(): boolean {
  return Boolean(process.env.POSTMARK_SERVER_TOKEN?.trim() && process.env.POSTMARK_FROM_EMAIL?.trim());
}

export async function sendPostmarkEmail(message: PostmarkMessage): Promise<{ ok: true } | { ok: false }> {
  const token = process.env.POSTMARK_SERVER_TOKEN?.trim();
  if (!token) return { ok: false };

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    console.error("Postmark rejected an email", response.status);
    return { ok: false };
  }

  return { ok: true };
}
