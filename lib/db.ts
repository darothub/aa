import { neon } from '@neondatabase/serverless';

export type Attending = 'yes' | 'no';

const sql = neon(process.env.DATABASE_URL!);

export async function insertRsvp(name: string, attending: Attending): Promise<void> {
  await sql`insert into rsvps (name, attending) values (${name}, ${attending})`;
}
