create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  active_plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_code text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.connected_crypto_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  label text not null,
  chain text not null,
  asset text not null,
  public_address text not null,
  last_balance numeric(24, 8) not null default 0,
  last_balance_usd numeric(18, 2) not null default 0,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.connected_bank_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plaid_item_id text,
  institution_name text not null,
  encrypted_access_token text,
  status text not null default 'healthy',
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.connected_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bank_item_id uuid references public.connected_bank_items(id) on delete cascade,
  plaid_account_id text,
  name text not null,
  account_type text,
  current_balance numeric(18, 2) not null default 0,
  available_balance numeric(18, 2),
  iso_currency_code text default 'USD',
  status text not null default 'healthy',
  created_at timestamptz not null default now()
);

create table if not exists public.buckets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_id uuid references public.connected_crypto_wallets(id) on delete set null,
  bank_account_id uuid references public.connected_bank_accounts(id) on delete set null,
  name text not null,
  icon text,
  monthly_goal numeric(18, 2) not null default 0,
  allocated_amount numeric(18, 2) not null default 0,
  spent_amount numeric(18, 2) not null default 0,
  allocation_percent numeric(8, 4) not null default 0,
  source_type text not null default 'crypto',
  is_bills_bucket boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bucket_allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bucket_id uuid not null references public.buckets(id) on delete cascade,
  amount numeric(18, 2) not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bank_account_id uuid references public.connected_bank_accounts(id) on delete set null,
  plaid_transaction_id text,
  merchant_name text,
  amount numeric(18, 2) not null,
  category text,
  bucket_id uuid references public.buckets(id) on delete set null,
  pending boolean not null default false,
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.crypto_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_id uuid references public.connected_crypto_wallets(id) on delete set null,
  tx_hash text,
  chain text not null,
  asset text not null,
  amount numeric(24, 8) not null,
  amount_usd numeric(18, 2),
  address_label text,
  category text,
  bucket_id uuid references public.buckets(id) on delete set null,
  status text not null default 'completed',
  transaction_date timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.unified_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  bucket_id uuid references public.buckets(id) on delete set null,
  amount numeric(18, 2) not null,
  merchant_or_address text,
  category text,
  status text not null default 'completed',
  transaction_date timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.category_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_value text not null,
  category text not null,
  bucket_id uuid references public.buckets(id) on delete set null,
  always_apply boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.recurring_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bucket_id uuid references public.buckets(id) on delete set null,
  name text not null,
  amount numeric(18, 2) not null default 0,
  due_day int,
  due_month text not null default 'monthly',
  frequency text not null default 'monthly',
  reminder_days int not null default 5,
  created_at timestamptz not null default now()
);

create table if not exists public.monthly_budget_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  month_start date not null,
  income numeric(18, 2) not null default 0,
  spending numeric(18, 2) not null default 0,
  bank_spending numeric(18, 2) not null default 0,
  crypto_spending numeric(18, 2) not null default 0,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.family_groups (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references public.family_groups(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  email text,
  role text not null default 'member',
  privacy_level text not null default 'bucket_totals_only',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.family_invites (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references public.family_groups(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  invite_token text not null default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.family_privacy_settings (
  id uuid primary key default gen_random_uuid(),
  family_member_id uuid not null references public.family_members(id) on delete cascade,
  setting_key text not null,
  setting_value text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_goals (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references public.family_groups(id) on delete cascade,
  name text not null,
  target_amount numeric(18, 2) not null default 0,
  current_amount numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.family_buckets (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references public.family_groups(id) on delete cascade,
  name text not null,
  monthly_goal numeric(18, 2) not null default 0,
  allocated_amount numeric(18, 2) not null default 0,
  spent_amount numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  business_name text not null,
  business_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  email text,
  role text not null default 'employee_view_only',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.business_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  bank_account_id uuid references public.connected_bank_accounts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.business_crypto_wallets (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  crypto_wallet_id uuid references public.connected_crypto_wallets(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.business_buckets (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  name text not null,
  monthly_goal numeric(18, 2) not null default 0,
  allocated_amount numeric(18, 2) not null default 0,
  spent_amount numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  name text not null,
  default_bucket_id uuid references public.buckets(id) on delete set null,
  monthly_spend numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.business_reports (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  month_start date not null,
  report_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  insight_type text not null,
  message text not null,
  severity text not null default 'info',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_detections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  merchant_name text not null,
  average_amount numeric(18, 2) not null default 0,
  cadence text not null default 'monthly',
  source_type text not null,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.alfi_points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  points int not null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.golden_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  founding_member_number int unique,
  status text not null default 'reserved',
  issued_at timestamptz not null default now()
);

create table if not exists public.community_impact_pools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'placeholder',
  balance numeric(18, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid references public.community_impact_pools(id) on delete set null,
  title text not null,
  description text,
  city text,
  state text,
  status text not null default 'draft',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  vote_value text not null,
  created_at timestamptz not null default now(),
  unique (proposal_id, user_id)
);

create table if not exists public.donation_records (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references public.proposals(id) on delete set null,
  amount numeric(18, 2) not null default 0,
  status text not null default 'pending_admin_approval',
  created_at timestamptz not null default now()
);

create table if not exists public.recognition_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  display_name text,
  show_on_wall boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.allocafi_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.connected_crypto_wallets enable row level security;
alter table public.connected_bank_items enable row level security;
alter table public.connected_bank_accounts enable row level security;
alter table public.buckets enable row level security;
alter table public.bucket_allocations enable row level security;
alter table public.bank_transactions enable row level security;
alter table public.crypto_transactions enable row level security;
alter table public.unified_transactions enable row level security;
alter table public.category_rules enable row level security;
alter table public.recurring_bills enable row level security;
alter table public.monthly_budget_summaries enable row level security;
alter table public.family_groups enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invites enable row level security;
alter table public.family_privacy_settings enable row level security;
alter table public.family_goals enable row level security;
alter table public.family_buckets enable row level security;
alter table public.business_profiles enable row level security;
alter table public.business_members enable row level security;
alter table public.business_bank_accounts enable row level security;
alter table public.business_crypto_wallets enable row level security;
alter table public.business_buckets enable row level security;
alter table public.vendors enable row level security;
alter table public.business_reports enable row level security;
alter table public.ai_insights enable row level security;
alter table public.subscription_detections enable row level security;
alter table public.alfi_points_ledger enable row level security;
alter table public.golden_tickets enable row level security;
alter table public.allocafi_snapshots enable row level security;
