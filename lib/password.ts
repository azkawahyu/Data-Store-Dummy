import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const TEMP_PASSWORD_PREFIX = "TEMP::";

export function isTemporaryPasswordHash(value: string) {
  return value.startsWith(TEMP_PASSWORD_PREFIX);
}

export function unwrapPasswordHash(value: string) {
  return isTemporaryPasswordHash(value)
    ? value.slice(TEMP_PASSWORD_PREFIX.length)
    : value;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function hashTemporaryPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return `${TEMP_PASSWORD_PREFIX}${hash}`;
}

export async function compareStoredPassword(
  password: string,
  storedHash: string,
) {
  return bcrypt.compare(password, unwrapPasswordHash(storedHash));
}

export function generateTemporaryPassword() {
  return `Tmp${randomBytes(6).toString("hex")}`;
}
