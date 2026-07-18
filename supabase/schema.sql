-- Agama 3D Studio — Supabase/PostgreSQL schema
-- Mirrors the TypeScript types in src/lib/types.ts. Apply with:
--   supabase db push   (or run in the Supabase SQL editor)
--
-- After applying, replace the bodies of the getters in src/lib/data/*.ts
-- (getProductBySlug, queryProducts, ...) with Supabase queries — their
-- signatures already match what these tables return.

create extension if not exists "uuid-ossp";

-- ============================================================ categories
create table categories (
  id          text primary key,              -- slug-like stable id ("dragons")
  slug        text not null unique,          -- URL slug ("draci")
  name        text not null,
  description text not null default '',
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ============================================================ products
create table products (
  id                text primary key,        -- slug-like stable id
  slug              text not null unique,
  name              text not null,
  tagline           text not null default '',
  description       text not null default '',
  price_cents       integer not null check (price_cents >= 0),
  compare_at_cents  integer check (compare_at_cents >= 0),
  currency          text not null default 'EUR',
  rating            numeric(2,1) not null default 0,
  review_count      integer not null default 0,
  materials         text[] not null default '{}',   -- ["pla","resin"]
  colors            jsonb not null default '[]',    -- [{id,name,hex}]
  sizes             text[] not null default '{}',
  print_time_hours  integer not null default 0,
  delivery_days_min integer not null default 2,
  delivery_days_max integer not null default 7,
  in_stock          boolean not null default true,
  trending          boolean not null default false,
  new_arrival       boolean not null default false,
  featured          boolean not null default false,
  license           text not null default 'personal' check (license in ('personal','commercial')),
  size_cm           jsonb not null default '{}',    -- {width,height,depth}
  weight_grams      integer not null default 0,
  specifications    jsonb not null default '[]',
  printing_settings jsonb not null default '[]',
  model_url         text,                            -- optional GLB for the 3D viewer
  creator_id        uuid references profiles(id),
  created_at        timestamptz not null default now()
);

create table product_categories (
  product_id  text not null references products(id) on delete cascade,
  category_id text not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table product_images (
  id         uuid primary key default uuid_generate_v4(),
  product_id text not null references products(id) on delete cascade,
  url        text not null,
  position   integer not null default 0
);

-- ============================================================ profiles
-- Extends Supabase auth.users; created via trigger on signup.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text,
  bio        text,
  is_creator boolean not null default false,
  location   text,
  created_at timestamptz not null default now()
);

-- ============================================================ orders
create table orders (
  id             uuid primary key default uuid_generate_v4(),
  number         text not null unique,      -- "AGM-10482"
  user_id        uuid references profiles(id),
  email          text not null,
  status         text not null default 'processing'
                 check (status in ('processing','printing','shipped','delivered','cancelled')),
  total_cents    integer not null,
  currency       text not null default 'EUR',
  coupon_code    text,
  discount_cents integer not null default 0,
  shipping_cents integer not null default 0,
  address        jsonb not null,            -- {fullName,street,city,postalCode,country,phone}
  created_at     timestamptz not null default now()
);

create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  text references products(id),
  name        text not null,               -- denormalized snapshot
  price_cents integer not null,
  quantity    integer not null check (quantity > 0),
  material    text,
  color       text,
  size        text
);

-- ============================================================ reviews
create table reviews (
  id         uuid primary key default uuid_generate_v4(),
  product_id text not null references products(id) on delete cascade,
  user_id    uuid references profiles(id),
  author     text not null,
  rating     integer not null check (rating between 1 and 5),
  title      text not null default '',
  comment    text not null default '',
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================ files
-- Customer uploads for custom orders (STL/OBJ/3MF). Binary lives in Supabase
-- Storage bucket "custom-models"; this table is the metadata index.
create table files (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references profiles(id),
  order_id     uuid references orders(id),
  storage_path text not null,
  file_name    text not null,
  size_bytes   bigint not null,
  format       text not null check (format in ('stl','obj','3mf')),
  created_at   timestamptz not null default now()
);

-- ============================================================ RLS
-- Enable row-level security everywhere; public catalog is world-readable,
-- personal data is owner-scoped. Writes to catalog tables go through the
-- service role (admin tooling) only.
alter table categories         enable row level security;
alter table products           enable row level security;
alter table product_categories enable row level security;
alter table product_images     enable row level security;
alter table profiles           enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table reviews            enable row level security;
alter table files              enable row level security;

create policy "catalog readable"  on categories         for select using (true);
create policy "products readable" on products           for select using (true);
create policy "pc readable"       on product_categories for select using (true);
create policy "images readable"   on product_images     for select using (true);
create policy "reviews readable"  on reviews            for select using (true);

create policy "own profile"   on profiles for select using (auth.uid() = id);
create policy "edit profile"  on profiles for update using (auth.uid() = id);
create policy "own orders"    on orders   for select using (auth.uid() = user_id);
create policy "own items"     on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "own files"     on files    for select using (auth.uid() = user_id);
create policy "write reviews" on reviews  for insert with check (auth.uid() = user_id);

-- Helpful indexes
create index products_created_idx  on products (created_at desc);
create index products_rating_idx   on products (rating desc);
create index orders_user_idx       on orders (user_id);
create index reviews_product_idx   on reviews (product_id);
