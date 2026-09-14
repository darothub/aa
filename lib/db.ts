import { neon } from '@neondatabase/serverless';

export type Attending = 'yes' | 'no';

export type GuestbookMessage = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

const sql = neon(process.env.DATABASE_URL!);

export async function insertRsvp(name: string, attending: Attending): Promise<void> {
  await sql`insert into rsvps (name, attending) values (${name}, ${attending})`;
}

export async function insertMessage(name: string, message: string): Promise<void> {
  await sql`insert into guestbook_messages (name, message) values (${name}, ${message})`;
}

export async function listMessages(limit = 50): Promise<GuestbookMessage[]> {
  const rows = await sql`
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
