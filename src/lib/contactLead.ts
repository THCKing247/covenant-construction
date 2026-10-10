import { site } from "@/lib/site";

export const PROJECT_TYPES = [
  "New home construction",
  "Home addition",
  "Whole-home remodel",
  "Kitchen remodel",
  "Bathroom remodel",
  "ADU / guest house",
  "Outdoor living / exterior",
  "Repairs & improvements",
  "Commercial / tenant improvement",
  "Other",
] as const;

export const PROJECT_TIMELINES = [
  { value: "asap", label: "ASAP" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const BUDGET_RANGES = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-75k", label: "$25,000–$75,000" },
  { value: "75k-150k", label: "$75,000–$150,000" },
  { value: "150k-300k", label: "$150,000–$300,000" },
  { value: "300k-plus", label: "$300,000+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const REQUIRED_MAX = 500;
const MESSAGE_MAX = 4000;

export type ContactLead = {
  name: string;
  phone: string;
  email: string;
  address: string;
  projectType: string;
  timeline: string;
  budget: string;
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

export function timelineLabel(value: string): string | undefined {
  return PROJECT_TIMELINES.find((option) => option.value === value)?.label;
}

export function budgetLabel(value: string): string | undefined {
  return BUDGET_RANGES.find((option) => option.value === value)?.label;
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
  const phone = readText(formData, "phone");
  const email = readText(formData, "email");
  const address = readText(formData, "address");
  const projectType = readText(formData, "projectType");
  const timeline = readText(formData, "timeline");
  const budget = readText(formData, "budget");
  const message = readText(formData, "message");

  const requiredError =
    checkRequired(name, "Name") ||
    checkRequired(phone, "Phone") ||
    checkRequired(email, "Email") ||
    checkRequired(address, "Project address") ||
    checkRequired(projectType, "Project type") ||
    checkRequired(timeline, "Preferred timeline");
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
  if (!PROJECT_TYPES.includes(projectType as (typeof PROJECT_TYPES)[number])) {
    return { ok: false, error: "Choose a project type." };
  }
  if (!timelineLabel(timeline)) {
    return { ok: false, error: "Choose a preferred timeline." };
  }
  if (budget && !budgetLabel(budget)) {
    return { ok: false, error: "Choose a valid budget range." };
  }

  return {
    ok: true,
    lead: {
      name,
      phone: formatUsPhone(phone),
      email,
      address,
      projectType,
      timeline,
      budget,
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
  return `[${site.businessName}] contact lead: ${oneLine(lead.projectType)} (${oneLine(lead.name)})`;
}

export function confirmationSubject(): string {
  return `We received your ${site.businessName} request`;
}

function leadRows(lead: ContactLead): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Project address", lead.address],
    ["Project type", lead.projectType],
    ["Preferred timeline", timelineLabel(lead.timeline) ?? lead.timeline],
  ];
  if (lead.budget) rows.push(["Approximate budget", budgetLabel(lead.budget) ?? lead.budget]);
  if (lead.message) rows.push(["Project details", lead.message]);
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
