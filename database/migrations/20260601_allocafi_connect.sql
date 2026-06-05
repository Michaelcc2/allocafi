-- AllocaFi Connect beta schema.
-- App-to-app wallet messaging and calling only. No phone numbers, SMS, carrier minutes, or emergency calling.

create table if not exists public.connect_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  wallet_address text not null,
  chain text not null default 'evm',
  username text unique,
  display_name text not null default '',
  avatar_url text not null default '',
  verified boolean not null default false,
  verification_signature_hash text not null default '',
  connect_status text not null default 'setup_required',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connect_conversations (
  id uuid primary key default gen_random_uuid(),
  participant_wallets text[] not null default '{}'::text[],
  participant_user_ids uuid[] not null default '{}'::uuid[],
  last_message_at timestamptz,
  last_message_preview_encrypted text not null default '',
  unread_count int not null default 0,
  muted_by uuid[] not null default '{}'::uuid[],
  blocked_status text not null default 'clear',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connect_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.connect_conversations(id) on delete cascade,
  sender_wallet text not null,
  recipient_wallet text not null,
  sender_user_id uuid references public.users(id) on delete set null,
  recipient_user_id uuid references public.users(id) on delete set null,
  encrypted_payload jsonb not null,
  plaintext_preview_hash text not null default '',
  message_type text not null default 'text',
  delivery_status text not null default 'pending',
  read_status text not null default 'unread',
  deleted_by_sender boolean not null default false,
  deleted_by_recipient boolean not null default false,
  protocol_source text not null default 'allocafi_connect',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connect_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.users(id) on delete cascade,
  contact_user_id uuid references public.users(id) on delete set null,
  contact_wallet text not null,
  contact_username text not null default '',
  nickname text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connect_calls (
  id uuid primary key default gen_random_uuid(),
  caller_user_id uuid references public.users(id) on delete set null,
  caller_wallet text not null,
  recipient_user_id uuid references public.users(id) on delete set null,
  recipient_wallet text not null,
  call_type text not null default 'voice',
  call_status text not null default 'ringing',
  started_at timestamptz,
  answered_at timestamptz,
  ended_at timestamptz,
  duration_seconds int not null default 0,
  missed boolean not null default false,
  declined boolean not null default false,
  failure_reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.connect_call_signals (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references public.connect_calls(id) on delete cascade,
  from_user_id uuid references public.users(id) on delete set null,
  to_user_id uuid references public.users(id) on delete set null,
  signal_type text not null,
  signal_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes')
);

create table if not exists public.connect_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null,
  from_user_id uuid references public.users(id) on delete set null,
  to_user_id uuid references public.users(id) on delete set null,
  from_wallet text not null,
  to_wallet text not null,
  status text not null default 'pending',
  payload_encrypted jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.connect_blocked_addresses (
  id uuid primary key default gen_random_uuid(),
  blocker_user_id uuid references public.users(id) on delete cascade,
  blocked_wallet text not null,
  blocked_user_id uuid references public.users(id) on delete set null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.connect_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references public.users(id) on delete set null,
  reported_wallet text not null,
  reported_user_id uuid references public.users(id) on delete set null,
  report_type text not null,
  message_id uuid references public.connect_messages(id) on delete set null,
  description text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.connect_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text not null default '',
  read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.connect_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  connect_enabled boolean not null default true,
  messaging_enabled boolean not null default true,
  voice_calls_enabled boolean not null default true,
  video_calls_enabled boolean not null default false,
  payment_requests_enabled boolean not null default false,
  invoice_requests_enabled boolean not null default false,
  commerce_chat_enabled boolean not null default false,
  family_chat_enabled boolean not null default false,
  enterprise_chat_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists connect_profiles_wallet_idx on public.connect_profiles(wallet_address);
create index if not exists connect_profiles_username_idx on public.connect_profiles(username);
create index if not exists connect_conversations_last_message_idx on public.connect_conversations(last_message_at desc);
create index if not exists connect_messages_conversation_created_idx on public.connect_messages(conversation_id, created_at);
create index if not exists connect_messages_sender_idx on public.connect_messages(sender_wallet);
create index if not exists connect_messages_recipient_idx on public.connect_messages(recipient_wallet);
create index if not exists connect_contacts_owner_status_idx on public.connect_contacts(owner_user_id, status);
create index if not exists connect_calls_recipient_status_idx on public.connect_calls(recipient_wallet, call_status, created_at desc);
create index if not exists connect_call_signals_call_idx on public.connect_call_signals(call_id, created_at);
create index if not exists connect_requests_to_status_idx on public.connect_requests(to_wallet, status, created_at desc);
create index if not exists connect_blocked_addresses_blocker_idx on public.connect_blocked_addresses(blocker_user_id, blocked_wallet);
create index if not exists connect_reports_status_idx on public.connect_reports(status, created_at desc);
create index if not exists connect_notifications_user_read_idx on public.connect_notifications(user_id, read, created_at desc);

alter table public.connect_profiles enable row level security;
alter table public.connect_conversations enable row level security;
alter table public.connect_messages enable row level security;
alter table public.connect_contacts enable row level security;
alter table public.connect_calls enable row level security;
alter table public.connect_call_signals enable row level security;
alter table public.connect_requests enable row level security;
alter table public.connect_blocked_addresses enable row level security;
alter table public.connect_reports enable row level security;
alter table public.connect_notifications enable row level security;
alter table public.connect_settings enable row level security;
