-- The current invoice amount can be confirmed once during the initial human review,
-- even when OCR could not recover it. After review, all proposal versions are immutable.
create or replace function app_private.protect_fenie_proposal()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if old.reviewed_at is not null then
   raise exception 'La comparativa validada es inmutable; sube una versión nueva'
    using errcode='42501';
 end if;
 if (new.reviewed_at is not null and new.reviewed_by is distinct from auth.uid()
     and current_user = 'authenticated') then
   raise exception 'La persona que valida debe ser la persona autenticada'
    using errcode='42501';
 end if;
 if (to_jsonb(new)-array['current_total_eur','offer_total_eur','difference_eur',
      'comparison_status','comparison_reason','reviewed_at','reviewed_by','notes','updated_at']::text[])
    is distinct from
    (to_jsonb(old)-array['current_total_eur','offer_total_eur','difference_eur',
      'comparison_status','comparison_reason','reviewed_at','reviewed_by','notes','updated_at']::text[]) then
   raise exception 'El documento de la propuesta es inmutable; sube otra versión'
    using errcode='42501';
 end if;
 new.updated_at:=now();
 return new;
end; $$;
revoke all on function app_private.protect_fenie_proposal() from public,anon,authenticated;
