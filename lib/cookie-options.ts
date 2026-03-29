type CookieSameSite = boolean | "lax" | "strict" | "none";

type CookieSerializeOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: CookieSameSite;
  path?: string;
  maxAge?: number;
  domain?: string;
  expires?: Date;
};

const DEFAULT_MAX_AGE = 60 * 60 * 24;

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function parseSameSite(
  value: string | undefined,
  fallback: CookieSerializeOptions["sameSite"],
) {
  const normalized = value?.toLowerCase();

  if (normalized === "strict") return "strict";
  if (normalized === "none") return "none";
  if (normalized === "lax") return "lax";

  return fallback;
}

function parseMaxAge(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_AGE;
}

export function getSessionCookieOptions(
  overrides: Partial<CookieSerializeOptions> = {},
): CookieSerializeOptions {
  return {
    httpOnly: true,
    secure: parseBoolean(
      process.env.SESSION_COOKIE_SECURE,
      process.env.NODE_ENV === "production",
    ),
    sameSite: parseSameSite(process.env.SESSION_COOKIE_SAMESITE, "lax"),
    path: "/",
    maxAge: parseMaxAge(process.env.SESSION_COOKIE_MAX_AGE),
    domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
    ...overrides,
  };
}

export function getClearedSessionCookieOptions(): CookieSerializeOptions {
  return getSessionCookieOptions({ expires: new Date(0), maxAge: 0 });
}
