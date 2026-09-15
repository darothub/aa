import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { SESSION_COOKIE, verifySession, type Role } from '@/lib/auth';

/**
 * The verified role on the current request, read on the server. Every private
 * route calls this rather than trusting anything the client sends beyond the
 * signed cookie itself.
 */
export async function currentRole(): Promise<Role | null> {
  const { env } = getCloudflareContext();
  if (!env.SESSION_SECRET) return null;
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value, env.SESSION_SECRET);
}

export async function hasRole(...allowed: Role[]): Promise<boolean> {
  const role = await currentRole();
  return role !== null && allowed.includes(role);
}
