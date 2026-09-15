'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Role } from '@/lib/auth';

/**
 * The role the server established for this request, handed down so client
 * components can adjust what they offer — chiefly whether the header shows the
 * Gallery link.
 *
 * This is presentation only. Anything that must actually stay private is
 * enforced server-side (see lib/session.ts and the /api/gallery routes): a
 * visitor who edits this value in devtools changes what their own header looks
 * like and nothing else, because the gallery page and the photo bytes both
 * re-check the signed cookie on the server.
 */
const RoleContext = createContext<Role | null>(null);

export function RoleProvider({ role, children }: { role: Role | null; children: ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole(): Role | null {
  return useContext(RoleContext);
}
