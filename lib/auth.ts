import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export const AUTH_COOKIE = 'xh_admin';
export async function signToken(p: { username: string }) {
  return await new SignJWT(p).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
}
export async function verifyToken(token: string) {
  try { const { payload } = await jwtVerify(token, secret); return payload as { username: string }; }
  catch { return null; }
}