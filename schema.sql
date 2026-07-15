-- Run this once in your Supabase project's SQL editor.

-- Stores each user's encrypted Alpaca API keys.
-- The key/secret columns hold AES-256-GCM ciphertext, never plaintext.
create table if not exists broker_credentials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_key_id text not null,
  encrypted_secret_key text not null,
  paper boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table broker_credentials enable row level security;

-- Users can only ever see/manage their own row.
create policy "select own credentials"
  on broker_credentials for select
  using (auth.uid() = user_id);

create policy "insert own credentials"
  on broker_credentials for insert
  with check (auth.uid() = user_id);

create policy "update own credentials"
  on broker_credentials for update
  using (auth.uid() = user_id);

create policy "delete own credentials"
  on broker_credentials for delete
  using (auth.uid() = user_id);

-- Note: API routes use the Supabase service-role key to read/write this
-- table server-side (see lib/supabase/server.ts createServiceClient), since
-- that's where decryption happens. RLS still protects against any client-side
-- access with the anon key.
