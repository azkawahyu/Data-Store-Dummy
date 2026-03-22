import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

export interface JwtPayload {
  userId: string | number;
  username: string;
  role?: string;
  sessionId: string;
}

export function signToken(payload: JwtPayload) {
  // make the options object explicit so TS uses the overload with SignOptions
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as unknown as SignOptions;

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
