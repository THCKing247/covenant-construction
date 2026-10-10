export const TURNSTILE_SITE_KEY = "0x4AAAAAAFS0CUwmZoMGGMAM";
export const TURNSTILE_ACTION = "contact";

const PRODUCTION_HOSTNAMES = ["covenantconstruction.group", "www.covenantconstruction.group"];

export function turnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || TURNSTILE_SITE_KEY;
}

export function expectedTurnstileHostnames(): Set<string> {
  const configured = (process.env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (configured.length > 0) return new Set(configured);

  const hostnames = new Set(PRODUCTION_HOSTNAMES);
  if (process.env.NODE_ENV !== "production") {
    hostnames.add("localhost");
    hostnames.add("127.0.0.1");
  }
  return hostnames;
}

export function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || undefined;
}

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const expectedHostnames = expectedTurnstileHostnames();
  if (!secret || expectedHostnames.size === 0) return false;
  if (token.length === 0 || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean; action?: string; hostname?: string };
    return Boolean(
      result.success === true && result.action === TURNSTILE_ACTION && result.hostname && expectedHostnames.has(result.hostname)
    );
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return false;
  }
}
