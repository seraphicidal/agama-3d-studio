alter table public.profiles           enable row level security;
alter table public.categories         enable row level security;
alter table public.products           enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_images     enable row level security;
alter table public.orders             enable row level security;
alter table public.order_items        enable row level security;
alter table public.reviews            enable row level security;
alter table public.files              enable row level security;

create policy "categories readable" on public.categories         for select using (true);
create policy "products readable"   on public.products           for select using (true);
create policy "pc readable"         on public.product_categories for select using (true);
create policy "images readable"     on public.product_images     for select using (true);
create policy "reviews readable"    on public.reviews            for select using (true);

create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own orders read" on public.orders for select using (auth.uid() = user_id);
create policy "own order items read" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "own files read"  on public.files for select using (auth.uid() = user_id);
create policy "own files write" on public.files for insert with check (auth.uid() = user_id);

create policy "write own review" on public.reviews for insert with check (auth.uid() = user_id);
