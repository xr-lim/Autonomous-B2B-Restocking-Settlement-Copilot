alter table public.invoices
  add column if not exists processing_status text not null default 'idle'
  check (processing_status in ('idle', 'extracting', 'analyzing'));

alter table public.invoices
  add column if not exists extracted_text text;

alter table public.invoices
  add column if not exists ai_last_analyzed_at timestamptz;

alter table public.invoices
  add column if not exists risk_confidence numeric;

alter table public.invoices
  add column if not exists ai_summary text;

alter table public.invoices
  alter column risk_confidence type numeric using risk_confidence::numeric;
