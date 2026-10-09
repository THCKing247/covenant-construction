import { site } from "@/lib/site";

export const LOCATION_TYPES = [
  "Bar / restaurant",
  "Family entertainment center",
  "Hotel / motel",
  "Arcade / retail",
  "Laundromat",
  "Waiting room / office",
  "Other",
] as const;

export const FOOT_TRAFFIC = [
  { value: "under-50", label: "Under 50 people per day" },
  { value: "50-150", label: "50-150 per day" },
  { value: "150-400", label: "150-400 per day" },
  { value: "400-plus", label: "400+ per day" },
] as const;

const REQUIRED_MAX = 500;
const MESSAGE_MAX = 4000;

export type ContactLead = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  locationType: string;
  footTraffic: string;
  message: string;
};

export type ContactParseResult =
  | { ok: true; lead: ContactLead }
  | { ok: false; error: string };

export const contactSuccessMessage =
  "Thank you. We received your request and will be in touch soon.";

export const contactFailureMessage = `We couldn't send your request. Call ${site.phoneDisplay} or email ${site.email}.`;

export function digitsFromPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export function formatUsPhone(value: string): string {
  const digits = digitsFromPhone(value).slice(0, 10);
  if (!digits) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidUsPhone(value: string): boolean {
  const digits = digitsFromPhone(value);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}

export function footTrafficLabel(value: string): string | undefined {
  return FOOT_TRAFFIC.find((option) => option.value === value)?.label;
}

export function leadRecipients(): string[] {
  const raw = process.env.CONTACT_LEAD_TO_EMAIL?.trim() || site.leadInbox;
  const recipients = raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return recipients.length > 0 ? recipients : [site.leadInbox];
}

export function confirmationReplyTo(): string {
  return leadRecipients()[0];
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function checkRequired(value: string, label: string): string | null {
  if (!value) return `${label} is required.`;
  if (value.length > REQUIRED_MAX) return `${label} must be ${REQUIRED_MAX} characters or fewer.`;
  return null;
}

export function parseContactLead(formData: FormData): ContactParseResult {
  const name = readText(formData, "name");
  const businessName = readText(formData, "businessName");
  const phone = readText(formData, "phone");
  const email = readText(formData, "email");
  const address = readText(formData, "address");
  const locationType = readText(formData, "locationType");
  const footTraffic = readText(formData, "footTraffic");
  const message = readText(formData, "message");

  const requiredError =
    checkRequired(name, "Name") ||
    checkRequired(businessName, "Business name") ||
    checkRequired(phone, "Phone") ||
    checkRequired(email, "Email") ||
    checkRequired(address, "Address") ||
    checkRequired(locationType, "Location type") ||
    checkRequired(footTraffic, "Foot traffic");
  if (requiredError) return { ok: false, error: requiredError };

  if (message.length > MESSAGE_MAX) {
    return { ok: false, error: `Message must be ${MESSAGE_MAX} characters or fewer.` };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!isValidUsPhone(phone)) {
    return { ok: false, error: "Enter a valid 10-digit US phone number." };
  }
  if (!LOCATION_TYPES.includes(locationType as (typeof LOCATION_TYPES)[number])) {
    return { ok: false, error: "Choose a location type." };
  }
  if (!footTrafficLabel(footTraffic)) {
    return { ok: false, error: "Choose a foot traffic range." };
  }

  return {
    ok: true,
    lead: {
      name,
      businessName,
      phone: formatUsPhone(phone),
      email,
      address,
      locationType,
      footTraffic,
      message,
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function leadSubject(lead: ContactLead): string {
  return `[${site.businessName}] contact lead: ${oneLine(lead.businessName)} (${oneLine(lead.name)})`;
}

export function confirmationSubject(): string {
  return `We received your ${site.businessName} request`;
}

function leadRows(lead: ContactLead): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Business", lead.businessName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Address", lead.address],
    ["Location type", lead.locationType],
    ["Foot traffic", footTrafficLabel(lead.footTraffic) ?? lead.footTraffic],
  ];
  if (lead.message) rows.push(["Message", lead.message]);
  return rows;
}

export function leadTextBody(lead: ContactLead): string {
  const lines = leadRows(lead).map(([label, value]) => `${label}: ${value}`);
  return [`New ${site.businessName} contact lead`, "", ...lines].join("\n");
}

export function leadHtmlBody(lead: ContactLead): string {
  const rows = leadRows(lead)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;color:#161412;"><h1 style="font-size:20px;font-weight:400;">New ${escapeHtml(site.businessName)} contact lead</h1>${rows}</body></html>`;
}

export function confirmationTextBody(lead: ContactLead): string {
  return [
    `We received your ${site.businessName} request.`,
    "",
    `Thank you, ${lead.name}. We have your details and will be in touch soon.`,
    "",
    `If you need us sooner, call ${site.phoneDisplay} or email ${site.email}.`,
  ].join("\n");
}

export function confirmationHtmlBody(lead: ContactLead): string {
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;color:#161412;"><h1 style="font-size:20px;font-weight:400;">We received your request</h1><p>Thank you, ${escapeHtml(lead.name)}. We have your details and will be in touch soon.</p><p>If you need us sooner, call ${escapeHtml(site.phoneDisplay)} or email <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>.</p></body></html>`;
}
