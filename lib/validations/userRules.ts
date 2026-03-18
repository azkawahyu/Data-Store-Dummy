export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
export const NIP_REGEX = /^\d+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)\S+$/;
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 100;
export const NIP_MIN_LENGTH = 8;
export const NIP_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_MAX_LENGTH = 150;

export function isValidUuid(value: string) {
  return UUID_REGEX.test(value.trim());
}
