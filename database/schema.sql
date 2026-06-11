create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  active_plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  user_type text not null default 'personal',
  onboarding_status text not null default 'not_started',
  default_currency text not null default 'USD',
  privacy_level text not null default 'standard',
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

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_code text not null default 'free',
  status text not null default 'active',
  billing_cycle text not null default 'monthly',
  payment_rail text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  crypto_payment_wallet text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  failed_payment_count int not null default 0,
  retry_after timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  payment_type text not null,
  provider text not null,
  label text,
  stablecoin_asset text,
  chain text,
  wallet_address text,
  stripe_payment_method_id text,
  is_default boolean not null default false,
  encrypted_billing_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  amount numeric(18, 2) not null default 0,
  currency text not null default 'USD',
  rail text not null,
  status text not null default 'pending',
  provider_reference text,
  failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_label text not null,
  wallet_provider text not null,
  chain text not null,
  public_address text not null,
  last_signature_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  invoice_number text,
  amount_due numeric(18, 2) not null default 0,
  amount_paid numeric(18, 2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'draft',
  hosted_invoice_url text,
  crypto_receipt_url text,
  issued_at timestamptz not null default now(),
  due_at timestamptz
);

create table if not exists public.feature_entitlements (
  id uuid primary key default gen_random_uuid(),
  plan_code text not null,
  feature_key text not null,
  limit_value text not null default 'unlimited',
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (plan_code, feature_key)
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


create table if not exists public.virtual_asset_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_id uuid references public.connected_crypto_wallets(id) on delete set null,
  account_name text not null,
  asset_symbol text not null,
  account_type text not null default 'reserve',
  quantity numeric(28, 10) not null default 0,
  current_value_usd numeric(18, 2) not null default 0,
  cost_basis_usd numeric(18, 2) not null default 0,
  legal_core_status text not null default 'tracking_ready',
  classification_status text not null default 'pending_setup',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_historical_prices (
  id uuid primary key default gen_random_uuid(),
  asset_symbol text not null,
  price_timestamp timestamptz not null,
  market_price_usd numeric(24, 10) not null default 0,
  source text not null default 'historical_price_engine',
  created_at timestamptz not null default now(),
  unique(asset_symbol, price_timestamp)
);

create table if not exists public.asset_legal_core_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  virtual_asset_account_id uuid references public.virtual_asset_accounts(id) on delete cascade,
  acquisition_date date,
  acquisition_time time,
  asset_quantity numeric(28, 10) not null default 0,
  acquisition_wallet text not null default '',
  acquisition_transaction_hash text not null default '',
  historical_market_price numeric(24, 10) not null default 0,
  cost_basis_usd numeric(18, 2) not null default 0,
  current_price_usd numeric(24, 10) not null default 0,
  current_value_usd numeric(18, 2) not null default 0,
  holding_period_days int not null default 0,
  unrealized_gain_usd numeric(18, 2) not null default 0,
  unrealized_loss_usd numeric(18, 2) not null default 0,
  realized_gain_usd numeric(18, 2) not null default 0,
  realized_loss_usd numeric(18, 2) not null default 0,
  transfer_history jsonb not null default '[]'::jsonb,
  disposition_history jsonb not null default '[]'::jsonb,
  classification_status text not null default 'pending_setup',
  legal_core_status text not null default 'tracking_ready',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_transaction_classifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  virtual_asset_account_id uuid references public.virtual_asset_accounts(id) on delete set null,
  transaction_hash text not null default '',
  destination_address text not null default '',
  destination_type text not null default 'unknown_destination',
  classification text not null,
  legal_core_status text not null,
  disposal_status text not null,
  tax_ledger_impact text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.asset_tax_ledger_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  virtual_asset_account_id uuid references public.virtual_asset_accounts(id) on delete cascade,
  asset_symbol text not null,
  cost_basis_usd numeric(18, 2) not null default 0,
  current_value_usd numeric(18, 2) not null default 0,
  unrealized_gain_usd numeric(18, 2) not null default 0,
  unrealized_loss_usd numeric(18, 2) not null default 0,
  realized_gain_usd numeric(18, 2) not null default 0,
  realized_loss_usd numeric(18, 2) not null default 0,
  report_payload jsonb not null default '{}'::jsonb,
  export_ready boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.coin_logo_references (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  display_name text not null,
  issuer text not null,
  logo_family text not null default 'stablecoin',
  reference_image_path text not null,
  logo_image_path text not null default '',
  canonical_class text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.coin_logo_references
  add column if not exists logo_image_path text not null default '';

insert into public.coin_logo_references (
  symbol,
  display_name,
  issuer,
  reference_image_path,
  logo_image_path,
  canonical_class,
  metadata
) values
  ('PYUSD', 'PayPal USD', 'PayPal', './assets/reference-icons/major-stablecoins-20260528.png', './assets/reference-icons/stablecoins/pyusd-reference.png', 'pyusd', '{"reference_order": 1, "reference_note": "Blue PYUSD PayPal USD mark from user-provided Major Stablecoins reference."}'::jsonb),
  ('USDT', 'Tether USD', 'Tether', './assets/reference-icons/major-stablecoins-20260528.png', './assets/reference-icons/stablecoins/usdt-reference.png', 'usdt', '{"reference_order": 2, "reference_note": "Green Tether USD mark from user-provided Major Stablecoins reference."}'::jsonb),
  ('USDC', 'USD Coin', 'Circle', './assets/reference-icons/major-stablecoins-20260528.png', './assets/reference-icons/stablecoins/usdc-reference.png', 'usdc', '{"reference_order": 3, "reference_note": "Blue USD Coin mark from user-provided Major Stablecoins reference."}'::jsonb),
  ('USDS', 'Sky Dollar', 'Sky Protocol', './assets/reference-icons/major-stablecoins-20260528.png', './assets/reference-icons/stablecoins/usds-reference.png', 'usds', '{"reference_order": 4, "reference_note": "Orange Sky Dollar mark from user-provided Major Stablecoins reference."}'::jsonb),
  ('DAI', 'Dai', 'MakerDAO', './assets/reference-icons/major-stablecoins-20260528.png', './assets/reference-icons/stablecoins/dai-reference.png', 'dai', '{"reference_order": 5, "reference_note": "Gold Dai mark from user-provided Major Stablecoins reference."}'::jsonb)
on conflict (symbol) do update set
  display_name = excluded.display_name,
  issuer = excluded.issuer,
  reference_image_path = excluded.reference_image_path,
  logo_image_path = excluded.logo_image_path,
  canonical_class = excluded.canonical_class,
  metadata = excluded.metadata,
  updated_at = now();


insert into public.coin_logo_references (
  symbol,
  display_name,
  issuer,
  logo_family,
  reference_image_path,
  logo_image_path,
  canonical_class,
  metadata
) values
  ('BTC', 'Bitcoin', 'Bitcoin', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/btc-reference.svg', 'btc', '{"reference_order": 1, "reference_note": "Canonical AllocaFi Bitcoin logo for Asset Reserve and Legal Core."}'::jsonb),
  ('ETH', 'Ethereum', 'Ethereum', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/eth-reference.svg', 'eth', '{"reference_order": 2, "reference_note": "Canonical AllocaFi Ethereum logo for Asset Reserve and Legal Core."}'::jsonb),
  ('SOL', 'Solana', 'Solana', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/sol-reference.svg', 'sol', '{"reference_order": 3, "reference_note": "Canonical AllocaFi Solana logo for Asset Reserve and Legal Core."}'::jsonb),
  ('LTC', 'Litecoin', 'Litecoin', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/ltc-reference.svg', 'ltc', '{"reference_order": 4, "reference_note": "Canonical AllocaFi Litecoin logo for Asset Reserve and Legal Core."}'::jsonb),
  ('ADA', 'Cardano', 'Cardano', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/ada-reference.svg', 'ada', '{"reference_order": 5, "reference_note": "Canonical AllocaFi Cardano logo for Asset Reserve and Legal Core."}'::jsonb),
  ('XRP', 'XRP', 'XRP Ledger', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/xrp-reference.svg', 'xrp', '{"reference_order": 6, "reference_note": "Canonical AllocaFi XRP logo for Asset Reserve and Legal Core."}'::jsonb),
  ('AVAX', 'Avalanche', 'Avalanche', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/avax-reference.svg', 'avax', '{"reference_order": 7, "reference_note": "Canonical AllocaFi Avalanche logo for Asset Reserve and Legal Core."}'::jsonb),
  ('HBAR', 'Hedera', 'Hedera', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/hbar-reference.svg', 'hbar', '{"reference_order": 8, "reference_note": "Canonical AllocaFi Hedera logo for Asset Reserve and Legal Core."}'::jsonb),
  ('BNB', 'BNB', 'BNB Chain', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/bnb-reference.svg', 'bnb', '{"reference_order": 9, "reference_note": "Canonical AllocaFi BNB logo for Asset Reserve and Legal Core."}'::jsonb),
  ('POL', 'Polygon', 'Polygon', 'reserve_asset', './assets/reference-icons/reserve-assets/reserve-asset-logo-reference-2026-06-11.svg', './assets/reference-icons/reserve-assets/pol-reference.svg', 'pol', '{"reference_order": 10, "reference_note": "Canonical AllocaFi Polygon/POL logo for Asset Reserve and Legal Core."}'::jsonb)
on conflict (symbol) do update set
  display_name = excluded.display_name,
  issuer = excluded.issuer,
  logo_family = excluded.logo_family,
  reference_image_path = excluded.reference_image_path,
  logo_image_path = excluded.logo_image_path,
  canonical_class = excluded.canonical_class,
  metadata = excluded.metadata,
  updated_at = now();
create table if not exists public.wallet_metadata (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_id uuid references public.connected_crypto_wallets(id) on delete cascade,
  metadata_key text not null,
  metadata_value jsonb not null default '{}'::jsonb,
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

create table if not exists public.bucket_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bucket_id uuid not null references public.buckets(id) on delete cascade,
  balance_amount numeric(18, 2) not null default 0,
  balance_source text not null default 'virtual',
  calculated_at timestamptz not null default now()
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

create table if not exists public.transaction_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  default_bucket_id uuid references public.buckets(id) on delete set null,
  color text,
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

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  report_type text not null,
  period_start date,
  period_end date,
  report_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_backups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  backup_label text,
  encrypted_blob_ref text,
  vault_version int not null default 1,
  encrypted_size_bytes int,
  compression text,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_owner_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  owner_wallet_address text not null,
  owner_wallet_chain text not null default 'solana',
  wallet_provider text not null default 'unknown',
  verification_status text not null default 'pending_signature',
  signature_verifier text not null default 'wallet_signature',
  last_signature_at timestamptz,
  warning_acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, owner_wallet_address, owner_wallet_chain)
);

create table if not exists public.vault_recovery_wallets (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  recovery_wallet_address text not null,
  recovery_wallet_chain text not null default 'solana',
  recovery_order int not null default 1,
  approval_status text not null default 'pending_primary_owner_signature',
  approved_by_owner_signature_ref text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_wallet_id, recovery_wallet_address, recovery_wallet_chain)
);

create table if not exists public.vault_trusted_devices (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  device_fingerprint_hash text not null,
  device_label text not null default 'Trusted device',
  trust_status text not null default 'trusted',
  last_seen_at timestamptz,
  risk_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (owner_wallet_id, device_fingerprint_hash)
);

create table if not exists public.vault_signature_challenges (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid references public.vault_owner_wallets(id) on delete cascade,
  purpose text not null default 'vault_access',
  challenge_nonce text not null,
  message_hash text not null,
  signature_type text not null default 'safe-verification',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  trusted_device_id uuid references public.vault_trusted_devices(id) on delete set null,
  session_token_hash text not null,
  verification_mode text not null default 'wallet_signature',
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_snapshots_v2 (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  vault_version int not null default 2,
  snapshot_version int not null default 1,
  snapshot_kind text not null default 'current',
  encrypted_blob_ref text not null,
  encrypted_manifest jsonb not null default '{}'::jsonb,
  encryption_method text not null default 'AES-256-GCM',
  compression text not null default 'gzip',
  encrypted_size_bytes int not null default 0,
  key_commitment text,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_asset_records (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  asset_type text not null,
  asset_version int not null default 1,
  alfi_cost numeric(18, 4) not null default 0,
  permissions jsonb not null default '["owner"]'::jsonb,
  encrypted_asset_ref text not null,
  source_event text not null default 'vault_restore',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.vault_restore_events (
  id uuid primary key default gen_random_uuid(),
  owner_wallet_id uuid not null references public.vault_owner_wallets(id) on delete cascade,
  snapshot_id uuid references public.vault_snapshots_v2(id) on delete set null,
  trusted_device_id uuid references public.vault_trusted_devices(id) on delete set null,
  restore_status text not null default 'requested',
  risk_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists virtual_asset_accounts_user_asset_idx on public.virtual_asset_accounts(user_id, asset_symbol, archived);
create index if not exists asset_legal_core_records_account_idx on public.asset_legal_core_records(virtual_asset_account_id, updated_at desc);
create index if not exists asset_transaction_classifications_account_idx on public.asset_transaction_classifications(virtual_asset_account_id, created_at desc);
create index if not exists asset_tax_ledger_records_account_idx on public.asset_tax_ledger_records(virtual_asset_account_id, updated_at desc);

create index if not exists vault_snapshots_v2_owner_created_idx on public.vault_snapshots_v2(owner_wallet_id, created_at desc);
create index if not exists vault_activity_owner_created_idx on public.vault_activity(user_id, created_at desc);
create index if not exists vault_asset_records_owner_type_idx on public.vault_asset_records(owner_wallet_id, asset_type, created_at desc);
create index if not exists vault_restore_events_owner_created_idx on public.vault_restore_events(owner_wallet_id, created_at desc);

create table if not exists public.ai_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  memory_type text not null,
  encrypted_summary text,
  redaction_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  current_step text not null default 'start',
  completed_steps jsonb not null default '[]'::jsonb,
  user_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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


create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  wallet_id text not null default '',
  role text not null default 'user',
  prompt text not null,
  normalized_intent text not null default '',
  classification text not null,
  status text not null,
  blocked_reason text not null default '',
  provider text not null default '',
  model text not null default '',
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  image_count int not null default 0,
  estimated_cost numeric(18, 6) not null default 0,
  alfi_charged numeric(18, 4) not null default 0,
  revenue_value numeric(18, 4) not null default 0,
  profit numeric(18, 4) not null default 0,
  rule_used text not null default '',
  ip_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_rules (
  id uuid primary key default gen_random_uuid(),
  intent text not null,
  trigger_phrases jsonb not null default '[]'::jsonb,
  action_type text not null,
  template_data jsonb not null default '{}'::jsonb,
  alfi_cost numeric(18, 4) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alfi_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  feature_name text not null,
  request_type text not null,
  base_credit_cost numeric(18, 4) not null default 0,
  estimated_provider_cost numeric(18, 6) not null default 0,
  minimum_profit_margin numeric(8, 4) not null default 0.7,
  active boolean not null default true,
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage_summaries (
  id uuid primary key default gen_random_uuid(),
  summary_date date not null,
  total_calls int not null default 0,
  rule_calls int not null default 0,
  api_calls int not null default 0,
  blocked_calls int not null default 0,
  total_cost numeric(18, 6) not null default 0,
  total_alfi_charged numeric(18, 4) not null default 0,
  total_revenue numeric(18, 4) not null default 0,
  net_profit numeric(18, 4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.prompt_optimization_suggestions (
  id uuid primary key default gen_random_uuid(),
  normalized_intent text not null,
  example_prompt text not null default '',
  monthly_calls int not null default 0,
  monthly_cost numeric(18, 6) not null default 0,
  monthly_revenue numeric(18, 4) not null default 0,
  estimated_savings numeric(18, 6) not null default 0,
  recommended_rule text not null default '',
  priority text not null default 'medium',
  status text not null default 'suggested',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_skins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  wallet_id text not null default '',
  prompt text not null,
  uploaded_image_url text not null default '',
  generated_asset_url text not null default '',
  skin_type text not null default 'dashboard_skin',
  status text not null default 'pending',
  alfi_charged numeric(18, 4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_vaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  primary_wallet_address text not null,
  encrypted_vault_data text not null default '',
  encryption_version int not null default 2,
  vault_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vault_export_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  wallet_address text not null,
  export_type text not null,
  signature_status text not null default 'pending',
  signed_message text not null default '',
  signature_hash text not null default '',
  export_status text not null default 'requested',
  alfi_charged numeric(18, 4) not null default 0,
  file_url text not null default '',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  wallet_address text not null default '',
  event_type text not null,
  export_type text not null default '',
  status text not null,
  ip_address text not null default '',
  device_info jsonb not null default '{}'::jsonb,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_ai_analytics_store (
  id uuid primary key default gen_random_uuid(),
  summary_date date not null,
  ai_usage jsonb not null default '{}'::jsonb,
  ai_cost numeric(18, 6) not null default 0,
  alfi_revenue numeric(18, 4) not null default 0,
  net_profit numeric(18, 4) not null default 0,
  blocked_requests jsonb not null default '[]'::jsonb,
  rule_savings numeric(18, 6) not null default 0,
  created_at timestamptz not null default now()
);

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

create index if not exists ai_request_logs_wallet_created_idx on public.ai_request_logs(wallet_id, created_at desc);
create index if not exists ai_request_logs_intent_idx on public.ai_request_logs(normalized_intent, created_at desc);
create index if not exists prompt_optimization_intent_idx on public.prompt_optimization_suggestions(normalized_intent, status);
create index if not exists vault_export_requests_wallet_created_idx on public.vault_export_requests(wallet_address, created_at desc);
create index if not exists vault_audit_logs_wallet_created_idx on public.vault_audit_logs(wallet_address, created_at desc);
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

create table if not exists public.service_events (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  event_type text not null,
  severity text not null default 'info',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null unique,
  enabled boolean not null default false,
  rollout_percent int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budget_templates (
  id text primary key,
  name text not null,
  category text not null,
  description text not null default '',
  is_premium boolean not null default false,
  is_ai_template boolean not null default false,
  account_count int not null default 0,
  accounts_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists budget_templates_category_idx on public.budget_templates(category);
create index if not exists budget_templates_premium_ai_idx on public.budget_templates(is_premium, is_ai_template);

alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payment_history enable row level security;
alter table public.wallet_connections enable row level security;
alter table public.invoices enable row level security;
alter table public.feature_entitlements enable row level security;
alter table public.connected_crypto_wallets enable row level security;
alter table public.virtual_asset_accounts enable row level security;
alter table public.asset_historical_prices enable row level security;
alter table public.asset_legal_core_records enable row level security;
alter table public.asset_transaction_classifications enable row level security;
alter table public.asset_tax_ledger_records enable row level security;
alter table public.coin_logo_references enable row level security;
alter table public.wallet_metadata enable row level security;
alter table public.connected_bank_items enable row level security;
alter table public.connected_bank_accounts enable row level security;
alter table public.buckets enable row level security;
alter table public.bucket_allocations enable row level security;
alter table public.bucket_balances enable row level security;
alter table public.bank_transactions enable row level security;
alter table public.crypto_transactions enable row level security;
alter table public.unified_transactions enable row level security;
alter table public.transaction_categories enable row level security;
alter table public.category_rules enable row level security;
alter table public.recurring_bills enable row level security;
alter table public.monthly_budget_summaries enable row level security;
alter table public.reports enable row level security;
alter table public.vault_backups enable row level security;
alter table public.vault_activity enable row level security;
alter table public.vault_owner_wallets enable row level security;
alter table public.vault_recovery_wallets enable row level security;
alter table public.vault_trusted_devices enable row level security;
alter table public.vault_signature_challenges enable row level security;
alter table public.vault_sessions enable row level security;
alter table public.vault_snapshots_v2 enable row level security;
alter table public.vault_asset_records enable row level security;
alter table public.vault_restore_events enable row level security;
alter table public.ai_memory enable row level security;
alter table public.onboarding_sessions enable row level security;
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
alter table public.ai_request_logs enable row level security;
alter table public.ai_rules enable row level security;
alter table public.alfi_pricing_rules enable row level security;
alter table public.ai_usage_summaries enable row level security;
alter table public.prompt_optimization_suggestions enable row level security;
alter table public.ai_skins enable row level security;
alter table public.user_vaults enable row level security;
alter table public.vault_export_requests enable row level security;
alter table public.vault_audit_logs enable row level security;
alter table public.admin_ai_analytics_store enable row level security;
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
alter table public.subscription_detections enable row level security;
alter table public.alfi_points_ledger enable row level security;
alter table public.golden_tickets enable row level security;
alter table public.allocafi_snapshots enable row level security;
alter table public.service_events enable row level security;
alter table public.feature_flags enable row level security;
alter table public.budget_templates enable row level security;
