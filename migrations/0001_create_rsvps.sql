create table if not exists rsvps (
  id bigserial primary key,
  name text not null,
  attending text not null check (attending in ('yes', 'no')),
  created_at timestamptz not null default now()
);
