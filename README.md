# Covenant Construction

The public site is a Next.js app. Quote requests are sent with the Postmark HTTP API.

## Contact form environment

Set these in the host (Netlify) environment. Do not commit real tokens.

| Variable | Required | Purpose |
| --- | --- | --- |
| `POSTMARK_SERVER_TOKEN` | Yes | Postmark server API token. Sent as `X-Postmark-Server-Token`. |
| `POSTMARK_FROM_EMAIL` | Yes | Verified Postmark sender on this domain. Use `info@covenantconstruction.group`. |
| `CONTACT_LEAD_TO_EMAIL` | No | Inbox that receives leads. Defaults to `info@covenantconstruction.group`. Comma-separated addresses are allowed. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key. The widget is shown only when this is set. |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret. When set, submissions are verified before the form is accepted. |

`POSTMARK_FROM_EMAIL` must be a verified sender in Postmark. If the token or from address is missing, the form tells the visitor to call (831) 524-1175 or email info@covenantconstruction.group.
