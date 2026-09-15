create table if not exists event_photos (
  id bigserial primary key,
  r2_key text not null unique,
  uploader_name text not null,
  caption text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
