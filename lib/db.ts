import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export type Attending = 'yes' | 'no';

export type GuestbookMessage = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

// Resolved lazily so a missing DATABASE_URL fails the request that needs it
// rather than the build: `next build` evaluates this module when collecting
// page data, long before any environment secret is bound.
let client: NeonQueryFunction<false, false> | null = null;

function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    client = neon(url);
  }
  return client;
}

export async function insertRsvp(name: string, attending: Attending): Promise<void> {
  await sql()`insert into rsvps (name, attending) values (${name}, ${attending})`;
}

export async function insertMessage(name: string, message: string): Promise<void> {
  await sql()`insert into guestbook_messages (name, message) values (${name}, ${message})`;
}

export async function listMessages(limit = 50): Promise<GuestbookMessage[]> {
  const rows = await sql()`
    select id, name, message, created_at
    from guestbook_messages
    where approved
    order by created_at desc
    limit ${limit}
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    message: String(row.message),
    createdAt: String(row.created_at)
  }));
}
