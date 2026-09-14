create table if not exists guestbook_messages (
  id bigserial primary key,
  name text not null,
  message text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
