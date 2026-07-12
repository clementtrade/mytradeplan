create table if not exists day_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  content text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table day_insights enable row level security;

create policy "day_insights_select_own"
  on day_insights for select
  using (auth.uid() = user_id);

create policy "day_insights_insert_own"
  on day_insights for insert
  with check (auth.uid() = user_id);

create policy "day_insights_update_own"
  on day_insights for update
  using (auth.uid() = user_id);

create policy "day_insights_delete_own"
  on day_insights for delete
  using (auth.uid() = user_id);
