create table if not exists public.account_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);

alter table public.account_snapshots enable row level security;
revoke all on public.account_snapshots from anon;
grant select, insert, update on public.account_snapshots to authenticated;

drop policy if exists account_snapshots_owner on public.account_snapshots;
create policy account_snapshots_owner on public.account_snapshots
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
