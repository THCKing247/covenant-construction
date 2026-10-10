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
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Browser key for address suggestions on the project address field. |

`POSTMARK_FROM_EMAIL` must be a verified sender in Postmark. If the token or from address is missing, the form tells the visitor to call (831) 524-1175 or email info@covenantconstruction.group.

### NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

Browser key with Maps JavaScript API and Places API enabled. Restrict the key by HTTP referrer to:

- `https://covenantconstruction.group/*`
- `https://www.covenantconstruction.group/*`
- `http://localhost:3000/*`
- this site’s preview host, if it has one (for example a Netlify subdomain)

The variable is public and is baked in at build time, so the site must be redeployed after it is set. Without the key, the address field stays a normal text box.
