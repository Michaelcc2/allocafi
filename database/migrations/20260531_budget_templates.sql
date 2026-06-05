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

alter table public.budget_templates enable row level security;
