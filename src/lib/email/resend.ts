import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  }
  return _resend;
}

// Convenience alias used in route handlers
export const resend = {
  emails: {
    send: (args: Parameters<Resend["emails"]["send"]>[0]) => getResend().emails.send(args),
  },
};

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "DealCraft <onboarding@resend.dev>";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
