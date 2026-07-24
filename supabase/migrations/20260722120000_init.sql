-- Agama 3D Studio — initial schema.
-- Apply locally with `supabase db reset` (runs migrations + seed) or push to a
-- linked cloud project with `supabase db push`.

create extension if not exists "uuid-ossp";

-- ============================================================ profiles
-- Extends Supabase auth.users; a row is created automatically on signup.
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text,
  bio        text,
  is_creator boolean not null default false,
  location   text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================ categories
create table public.categories (
  id          text primary key,          -- stable id ("dragons")
  slug        text not null unique,       -- URL slug ("draci")
  name        text not null,
  description text not null default '',
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ============================================================ products
create table public.products (
  id                text primary key,
  slug              text not null unique,
  name              text not null,
  tagline           text not null default '',
  description       text not null default '',
  price_cents       integer not null check (price_cents >= 0),
  compare_at_cents  integer check (compare_at_cents >= 0),
  currency          text not null default 'EUR',
  materials         text[] not null default '{}',
  colors            jsonb not null default '[]',
  sizes             text[] not null default '{}',
  print_time_hours  integer not null default 0,
  delivery_days_min integer not null default 2,
  delivery_days_max integer not null default 7,
  stock             integer not null default 0 check (stock >= 0),
  trending          boolean not null default false,
  new_arrival       boolean not null default false,
  featured          boolean not null default false,
  license           text not null default 'personal' check (license in ('personal','commercial')),
  size_cm           jsonb not null default '{}',
  weight_grams      integer not null default 0,
  specifications    jsonb not null default '[]',
  printing_settings jsonb not null default '[]',
  model_url         text,
  creator_id        uuid references public.profiles(id),
  created_at        timestamptz not null default now()
);

-- in_stock is derived from stock; expose it as a generated column for queries.
alter table public.products
  add column in_stock boolean generated always as (stock > 0) stored;

create table public.product_categories (
  product_id  text not null references public.products(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table public.product_images (
  id         uuid primary key default uuid_generate_v4(),
  product_id text not null references public.products(id) on delete cascade,
  url        text not null,
  position   integer not null default 0
);

-- ============================================================ orders
create table public.orders (
  id                uuid primary key default uuid_generate_v4(),
  number            text not null unique,
  user_id           uuid references public.profiles(id),   -- null = guest order
  email             text not null,
  customer_name     text not null default '',
  status            text not null default 'processing'
                    check (status in ('processing','printing','shipped','delivered','cancelled')),
  currency          text not null default 'EUR',
  subtotal_cents    integer not null default 0,
  discount_code     text,
  discount_cents    integer not null default 0,
  shipping_cents    integer not null default 0,
  shipping_method   text,
  vat_rate          numeric(4,3),                          -- e.g. 0.230
  vat_cents         integer,                               -- VAT portion (prices are VAT-inclusive)
  net_cents         integer,                               -- total − VAT
  total_cents       integer not null,
  address           jsonb not null,
  payment_provider  text,
  payment_reference text unique,                           -- Stripe payment_intent / session id
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.order_items (
  id               uuid primary key default uuid_generate_v4(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       text references public.products(id),
  name             text not null,                -- denormalized snapshot
  variant          text not null default '',     -- "PLA · Čierna · M"
  price_cents      integer not null,             -- unit price (VAT-inclusive)
  quantity         integer not null check (quantity > 0),
  line_total_cents integer not null default 0,
  vat_rate         numeric(4,3),
  vat_cents        integer,
  net_cents        integer
);

-- ============================================================ reviews
create table public.reviews (
  id         uuid primary key default uuid_generate_v4(),
  product_id text not null references public.products(id) on delete cascade,
  user_id    uuid references public.profiles(id),
  author     text not null,
  rating     integer not null check (rating between 1 and 5),
  title      text not null default '',
  comment    text not null default '',
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================ files
-- Custom-order uploads (STL/OBJ/3MF). Binary lives in the "custom-models"
-- Storage bucket; this table is the metadata index.
create table public.files (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id),
  order_id     uuid references public.orders(id),
  storage_path text not null,
  file_name    text not null,
  size_bytes   bigint not null,
  format       text not null check (format in ('stl','obj','3mf')),
  created_at   timestamptz not null default now()
);

-- ============================================================ indexes
create index products_created_idx     on public.products (created_at desc);
create index product_categories_c_idx on public.product_categories (category_id);
create index orders_user_idx          on public.orders (user_id);
create index orders_payment_ref_idx   on public.orders (payment_reference);
create index reviews_product_idx      on public.reviews (product_id);
