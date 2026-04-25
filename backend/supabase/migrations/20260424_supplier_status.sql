alter table public.suppliers
  add column if not exists status text;

update public.suppliers
set status = case
  when reliability_score >= 90 then 'preferred'
  when reliability_score >= 80 then 'watchlist'
  else 'inactive'
end
where status is null;

alter table public.suppliers
  alter column status set not null;

alter table public.suppliers
  drop constraint if exists suppliers_status_check;

alter table public.suppliers
  add constraint suppliers_status_check
  check (status in ('preferred', 'watchlist', 'inactive'));
