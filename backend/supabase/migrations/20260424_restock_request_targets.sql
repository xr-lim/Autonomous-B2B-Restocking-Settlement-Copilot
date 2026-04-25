alter table public.restock_requests
  add column if not exists target_price_min numeric(12, 2),
  add column if not exists target_price_max numeric(12, 2);
