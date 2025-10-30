-- Create watchlist table for users to save movies
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id integer not null,
  title text not null,
  poster_path text,
  release_date text,
  vote_average numeric,
  added_at timestamp with time zone default now(),
  watched boolean default false,
  unique(user_id, tmdb_id)
);

-- Enable RLS
alter table public.watchlist enable row level security;

-- RLS Policies for watchlist
create policy "watchlist_select_own"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "watchlist_insert_own"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "watchlist_update_own"
  on public.watchlist for update
  using (auth.uid() = user_id);

create policy "watchlist_delete_own"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- Create user preferences table
create table if not exists public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  favorite_genres text[] default array[]::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- RLS Policies for user_preferences
create policy "preferences_select_own"
  on public.user_preferences for select
  using (auth.uid() = id);

create policy "preferences_insert_own"
  on public.user_preferences for insert
  with check (auth.uid() = id);

create policy "preferences_update_own"
  on public.user_preferences for update
  using (auth.uid() = id);

create policy "preferences_delete_own"
  on public.user_preferences for delete
  using (auth.uid() = id);

-- Create indexes for better performance
create index if not exists watchlist_user_id_idx on public.watchlist(user_id);
create index if not exists watchlist_tmdb_id_idx on public.watchlist(tmdb_id);
