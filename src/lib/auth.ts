import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE = "auth_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24;

type AuthPayload = {
  sub: string;
  role: string;
  exp: number;
};

function getAuthSecret(): string | null {
  return process.env.AUTH_SECRET || process.env.CRON_SECRET || null;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAuthToken(userId: string, role: string): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;

  const payload: AuthPayload = {
    sub: userId,
    role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

function verifyToken(token: string | undefined): AuthPayload | null {
  const secret = getAuthSecret();
  if (!secret || !token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded, secret);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as AuthPayload;
    if (!payload.sub || !payload.role || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const payload = verifyToken(cookieStore.get(AUTH_COOKIE)?.value);
  return payload?.role === "admin" ? payload : null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAuthenticatedUser()) !== null;
}

export { AUTH_COOKIE, TOKEN_TTL_SECONDS };
