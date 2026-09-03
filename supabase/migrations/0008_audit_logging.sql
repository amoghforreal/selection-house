-- ==========================================
-- SELECTION HOUSE — AUTOMATIC AUDIT LOGGING
-- Generic trigger that logs inserts/updates/deletes on key admin-managed
-- tables into audit_logs automatically, no app code needed per action.
-- ==========================================

create or replace function public.log_audit_event()
returns trigger as $$
begin
  insert into public.audit_logs (actor_id, action, table_name, record_id, old_data, new_data)
  values (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    coalesce(new.id, old.id),
    case when TG_OP in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when TG_OP in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists audit_products on products;
create trigger audit_products
  after insert or update or delete on products
  for each row execute function public.log_audit_event();

drop trigger if exists audit_categories on categories;
create trigger audit_categories
  after insert or update or delete on categories
  for each row execute function public.log_audit_event();

drop trigger if exists audit_businesses on businesses;
create trigger audit_businesses
  after insert or update or delete on businesses
  for each row execute function public.log_audit_event();

drop trigger if exists audit_orders on orders;
create trigger audit_orders
  after update on orders
  for each row execute function public.log_audit_event();

drop trigger if exists audit_coupons on coupons;
create trigger audit_coupons
  after insert or update or delete on coupons
  for each row execute function public.log_audit_event();
