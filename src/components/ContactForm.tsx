"use client";

import { FormEvent, useState } from "react";
import { ContactSuccess } from "@/components/ContactSuccess";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { PROJECT_TYPES, contactFailureMessage, formatUsPhone } from "@/lib/contactLead";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

export function ContactForm() {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileReset((value) => value + 1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (siteKey && !turnstileToken) {
      setError("Please complete the security check before submitting.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (turnstileToken) formData.set("cf-turnstile-response", turnstileToken);

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;

      if (!response.ok) {
        setError(data?.error || contactFailureMessage);
        resetTurnstile();
        setSending(false);
        return;
      }

      form.reset();
      setPhone("");
      setAddress("");
      resetTurnstile();
      setSuccessMessage(data?.message || "Thank you. We received your project details and will be in touch soon.");
    } catch {
      setError(contactFailureMessage);
      resetTurnstile();
      setSending(false);
    }
  }

  if (successMessage) return <ContactSuccess message={successMessage} />;

  return (
    <form action="/api/contact" method="post" encType="multipart/form-data" onSubmit={onSubmit}>
      <input
        id="name"
        name="name"
        autoComplete="name"
        placeholder="Full name *"
        required
        maxLength={500}
        disabled={sending}
      />
      <input
        id="phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="Phone number *"
        value={phone}
        onChange={(event) => setPhone(formatUsPhone(event.target.value))}
        required
        disabled={sending}
      />
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email *"
        required
        maxLength={500}
        disabled={sending}
      />
      <select id="projectType" name="projectType" defaultValue="" required disabled={sending}>
        <option value="">Project type *</option>
        {PROJECT_TYPES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        id="address"
        className="wide"
        name="address"
        autoComplete="street-address"
        placeholder="Project street address *"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        required
        maxLength={500}
        disabled={sending}
      />
      <input
        id="city"
        name="city"
        autoComplete="address-level2"
        placeholder="City *"
        required
        maxLength={500}
        disabled={sending}
      />
      <input
        id="zip"
        name="zip"
        autoComplete="postal-code"
        inputMode="numeric"
        placeholder="ZIP code *"
        required
        maxLength={10}
        disabled={sending}
      />
      <textarea
        id="message"
        name="message"
        placeholder="Tell us about your project"
        maxLength={4000}
        disabled={sending}
      />
      <input
        className="contact-honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {siteKey ? (
        <TurnstileWidget siteKey={siteKey} resetKey={turnstileReset} onToken={setTurnstileToken} />
      ) : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn wide" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send Quote Request →"}
      </button>
      <p className="form-note">Required fields are marked *.</p>
    </form>
  );
}
