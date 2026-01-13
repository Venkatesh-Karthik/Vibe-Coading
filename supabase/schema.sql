-- TripMosaic+ Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  photo text,
  created_at timestamp with time zone default now()
);

-- RLS Policies for users
alter table users enable row level security;

create policy "Users can read all users"
  on users for select
  using (true);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on users for insert
  with check (auth.uid() = id);

-- =============================================
-- TRIPS TABLE
-- =============================================
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text,
  start_date date,
  end_date date,
  status text check (status in ('planning', 'active', 'completed')) default 'planning',
  description text,
  is_public boolean default false,
  budget numeric default 0,
  cover_image text,
  organizer_id uuid references users(id),
  join_code text unique,
  created_at timestamp with time zone default now()
);

-- RLS Policies for trips
alter table trips enable row level security;

create policy "Users can read trips they are members of or public trips"
  on trips for select
  using (
    is_public = true or
    auth.uid() = organizer_id or
    exists (
      select 1 from trip_members
      where trip_members.trip_id = trips.id
      and trip_members.user_id = auth.uid()
    )
  );

create policy "Users can create trips"
  on trips for insert
  with check (auth.uid() = organizer_id);

create policy "Organizers can update their trips"
  on trips for update
  using (auth.uid() = organizer_id);

create policy "Organizers can delete their trips"
  on trips for delete
  using (auth.uid() = organizer_id);

-- =============================================
-- TRIP MEMBERS TABLE
-- =============================================
create table trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('organizer', 'member')),
  joined_at timestamp with time zone default now(),
  unique(trip_id, user_id)
);

-- RLS Policies for trip_members
alter table trip_members enable row level security;

create policy "Users can read trip members of their trips"
  on trip_members for select
  using (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members tm where tm.trip_id = trips.id and tm.user_id = auth.uid()))
    )
  );

create policy "Organizers can add members"
  on trip_members for insert
  with check (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
      and trips.organizer_id = auth.uid()
    )
  );

create policy "Organizers can remove members"
  on trip_members for delete
  using (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
      and trips.organizer_id = auth.uid()
    )
  );

-- =============================================
-- ITINERARY DAYS TABLE
-- =============================================
create table itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  day_number integer not null,
  created_at timestamp with time zone default now(),
  unique(trip_id, day_number)
);

-- RLS Policies for itinerary_days
alter table itinerary_days enable row level security;

create policy "Users can read itinerary days of their trips"
  on itinerary_days for select
  using (
    exists (
      select 1 from trips
      where trips.id = itinerary_days.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can create itinerary days"
  on itinerary_days for insert
  with check (
    exists (
      select 1 from trips
      where trips.id = itinerary_days.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can update itinerary days"
  on itinerary_days for update
  using (
    exists (
      select 1 from trips
      where trips.id = itinerary_days.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can delete itinerary days"
  on itinerary_days for delete
  using (
    exists (
      select 1 from trips
      where trips.id = itinerary_days.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

-- =============================================
-- ACTIVITIES TABLE
-- =============================================
create table activities (
  id uuid primary key default gen_random_uuid(),
  day_id uuid references itinerary_days(id) on delete cascade,
  title text not null,
  location text,
  time text,
  notes text,
  cost numeric default 0,
  lat numeric,
  lng numeric,
  created_at timestamp with time zone default now()
);

-- RLS Policies for activities
alter table activities enable row level security;

create policy "Users can read activities of their trips"
  on activities for select
  using (
    exists (
      select 1 from itinerary_days
      join trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can create activities"
  on activities for insert
  with check (
    exists (
      select 1 from itinerary_days
      join trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can update activities"
  on activities for update
  using (
    exists (
      select 1 from itinerary_days
      join trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can delete activities"
  on activities for delete
  using (
    exists (
      select 1 from itinerary_days
      join trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

-- =============================================
-- EXPENSES TABLE
-- =============================================
create table expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  title text not null,
  amount numeric not null,
  paid_by uuid references users(id),
  date date default current_date,
  category text check (category in ('stay', 'food', 'travel', 'entry', 'other')),
  created_at timestamp with time zone default now()
);

-- RLS Policies for expenses
alter table expenses enable row level security;

create policy "Users can read expenses of their trips"
  on expenses for select
  using (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can create expenses"
  on expenses for insert
  with check (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can update expenses"
  on expenses for update
  using (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can delete expenses"
  on expenses for delete
  using (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

-- =============================================
-- EXPENSE SPLITS TABLE
-- =============================================
create table expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid references expenses(id) on delete cascade,
  user_id uuid references users(id),
  share numeric not null,
  unique(expense_id, user_id)
);

-- RLS Policies for expense_splits
alter table expense_splits enable row level security;

create policy "Users can read expense splits of their trips"
  on expense_splits for select
  using (
    exists (
      select 1 from expenses
      join trips on trips.id = expenses.trip_id
      where expenses.id = expense_splits.expense_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can create expense splits"
  on expense_splits for insert
  with check (
    exists (
      select 1 from expenses
      join trips on trips.id = expenses.trip_id
      where expenses.id = expense_splits.expense_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can update expense splits"
  on expense_splits for update
  using (
    exists (
      select 1 from expenses
      join trips on trips.id = expenses.trip_id
      where expenses.id = expense_splits.expense_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can delete expense splits"
  on expense_splits for delete
  using (
    exists (
      select 1 from expenses
      join trips on trips.id = expenses.trip_id
      where expenses.id = expense_splits.expense_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

-- =============================================
-- MEMORIES TABLE
-- =============================================
create table memories (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  uploaded_by uuid references users(id),
  file_url text not null,
  file_type text check (file_type in ('image', 'video')),
  caption text,
  likes integer default 0,
  created_at timestamp with time zone default now()
);

-- RLS Policies for memories
alter table memories enable row level security;

create policy "Users can read memories of their trips"
  on memories for select
  using (
    exists (
      select 1 from trips
      where trips.id = memories.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Trip members can create memories"
  on memories for insert
  with check (
    exists (
      select 1 from trips
      where trips.id = memories.trip_id
      and (trips.organizer_id = auth.uid() or
           exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid()))
    )
  );

create policy "Uploaders can update their memories"
  on memories for update
  using (auth.uid() = uploaded_by);

create policy "Uploaders can delete their memories"
  on memories for delete
  using (auth.uid() = uploaded_by);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Note: Storage buckets need to be created via Supabase Dashboard or CLI
-- This is a reference for the expected setup:
--
-- Bucket name: memories
-- Public: true (or configure policies)
-- File size limit: 50MB
-- Allowed MIME types: image/*, video/*
--
-- Storage policies would be similar to the table policies above
