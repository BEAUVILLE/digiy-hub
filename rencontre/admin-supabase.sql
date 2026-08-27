-- DIGIY RENCONTRE — Cockpit admin V1
-- À exécuter dans Supabase SQL Editor avant d'ouvrir admin.html.
-- Aucun service_role n'est utilisé côté navigateur.

begin;

create or replace function public.digiy_rencontre_admin_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.digiy_profiles p
    where p.user_id = auth.uid()
      and p.role in ('super_admin','admin','operateur')
  );
$$;

revoke all on function public.digiy_rencontre_admin_allowed() from public;
grant execute on function public.digiy_rencontre_admin_allowed() to authenticated;


create or replace function public.digiy_rencontre_admin_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profiles jsonb := '[]'::jsonb;
  v_activities jsonb := '[]'::jsonb;
  v_reports jsonb := '[]'::jsonb;
  v_blocks jsonb := '[]'::jsonb;
  v_contacts jsonb := '[]'::jsonb;
  v_profiles_total bigint := 0;
  v_profiles_active bigint := 0;
  v_activities_total bigint := 0;
  v_reports_total bigint := 0;
  v_contacts_total bigint := 0;
begin
  if not public.digiy_rencontre_admin_allowed() then
    raise exception 'ADMIN_REQUIRED';
  end if;

  select count(*), count(*) filter (where p.is_active = true)
    into v_profiles_total, v_profiles_active
  from public.digiy_rencontre_profiles p;

  select coalesce(
    jsonb_agg(
      to_jsonb(p)
      || jsonb_build_object('zone_label', z.label)
      order by p.created_at desc
    ),
    '[]'::jsonb
  )
  into v_profiles
  from public.digiy_rencontre_profiles p
  left join public.digiy_zones z on z.id = p.zone_id;

  select count(*) into v_activities_total
  from public.digiy_rencontre_activities;

  select coalesce(
    jsonb_agg(
      to_jsonb(a)
      || jsonb_build_object(
        'creator_name', cp.display_name,
        'zone_label', z.label
      )
      order by a.created_at desc
    ),
    '[]'::jsonb
  )
  into v_activities
  from public.digiy_rencontre_activities a
  left join public.digiy_rencontre_profiles cp on cp.id = a.creator_profile_id
  left join public.digiy_zones z on z.id = a.zone_id;

  if to_regclass('public.digiy_rencontre_reports') is not null then
    select count(*) into v_reports_total
    from public.digiy_rencontre_reports;

    select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb)
      into v_reports
    from public.digiy_rencontre_reports r;
  end if;

  select coalesce(
    jsonb_agg(
      to_jsonb(b)
      || jsonb_build_object(
        'blocker_name', bp.display_name,
        'blocked_name', tp.display_name
      )
      order by b.created_at desc
    ),
    '[]'::jsonb
  )
  into v_blocks
  from public.digiy_rencontre_blocks b
  left join public.digiy_rencontre_profiles bp on bp.id = b.blocker_profile_id
  left join public.digiy_rencontre_profiles tp on tp.id = b.blocked_profile_id;

  select count(*) into v_contacts_total
  from public.digiy_rencontre_contact_requests;

  select coalesce(
    jsonb_agg(
      to_jsonb(c)
      || jsonb_build_object(
        'sender_name', sp.display_name,
        'receiver_name', rp.display_name
      )
      order by c.created_at desc
    ),
    '[]'::jsonb
  )
  into v_contacts
  from public.digiy_rencontre_contact_requests c
  left join public.digiy_rencontre_profiles sp on sp.id = c.sender_profile_id
  left join public.digiy_rencontre_profiles rp on rp.id = c.receiver_profile_id;

  return jsonb_build_object(
    'stats', jsonb_build_object(
      'profiles_total', v_profiles_total,
      'profiles_active', v_profiles_active,
      'activities_total', v_activities_total,
      'reports_total', v_reports_total,
      'contacts_total', v_contacts_total
    ),
    'profiles', v_profiles,
    'activities', v_activities,
    'reports', v_reports,
    'blocks', v_blocks,
    'contact_requests', v_contacts
  );
end;
$$;

revoke all on function public.digiy_rencontre_admin_snapshot() from public;
grant execute on function public.digiy_rencontre_admin_snapshot() to authenticated;


create or replace function public.digiy_rencontre_admin_set_profile_active(
  p_profile_id uuid,
  p_active boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.digiy_rencontre_admin_allowed() then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if p_profile_id is null or p_active is null then
    raise exception 'INVALID_ARGUMENT';
  end if;

  update public.digiy_rencontre_profiles
  set is_active = p_active,
      updated_at = now()
  where id = p_profile_id;

  if not found then
    raise exception 'PROFILE_NOT_FOUND';
  end if;
end;
$$;

revoke all on function public.digiy_rencontre_admin_set_profile_active(uuid, boolean) from public;
grant execute on function public.digiy_rencontre_admin_set_profile_active(uuid, boolean) to authenticated;


create or replace function public.digiy_rencontre_admin_delete_activity(
  p_activity_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.digiy_rencontre_admin_allowed() then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if p_activity_id is null then
    raise exception 'INVALID_ARGUMENT';
  end if;

  delete from public.digiy_rencontre_activity_participants
  where activity_id = p_activity_id;

  delete from public.digiy_rencontre_activities
  where id = p_activity_id;

  if not found then
    raise exception 'ACTIVITY_NOT_FOUND';
  end if;
end;
$$;

revoke all on function public.digiy_rencontre_admin_delete_activity(uuid) from public;
grant execute on function public.digiy_rencontre_admin_delete_activity(uuid) to authenticated;

commit;

-- Contrôle après installation :
-- select public.digiy_rencontre_admin_allowed();
-- Doit renvoyer true uniquement dans une session authentifiée portant
-- un rôle digiy_profiles = super_admin, admin ou operateur.
