create table "public"."document_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "document_id" uuid,
    "email" text not null,
    "token" text not null,
    "invited_by" uuid,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "expires_at" timestamp with time zone not null,
    "used" boolean default false,
    "used_at" timestamp with time zone
);


alter table "public"."document_invitations" enable row level security;

create table "public"."document_permissions" (
    "id" uuid not null default uuid_generate_v4(),
    "document_id" uuid not null,
    "user_id" uuid not null,
    "permission_level" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."document_permissions" enable row level security;

create table "public"."documents" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "content" text not null default ''::text,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "is_public" boolean not null default false
);


alter table "public"."documents" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "updated_at" timestamp with time zone
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX document_invitations_pkey ON public.document_invitations USING btree (id);

CREATE UNIQUE INDEX document_invitations_token_key ON public.document_invitations USING btree (token);

CREATE UNIQUE INDEX document_permissions_document_id_user_id_key ON public.document_permissions USING btree (document_id, user_id);

CREATE UNIQUE INDEX document_permissions_pkey ON public.document_permissions USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX unique_document_email ON public.document_invitations USING btree (document_id, email);

alter table "public"."document_invitations" add constraint "document_invitations_pkey" PRIMARY KEY using index "document_invitations_pkey";

alter table "public"."document_permissions" add constraint "document_permissions_pkey" PRIMARY KEY using index "document_permissions_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."document_invitations" add constraint "document_invitations_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE not valid;

alter table "public"."document_invitations" validate constraint "document_invitations_document_id_fkey";

alter table "public"."document_invitations" add constraint "document_invitations_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."document_invitations" validate constraint "document_invitations_invited_by_fkey";

alter table "public"."document_invitations" add constraint "document_invitations_token_key" UNIQUE using index "document_invitations_token_key";

alter table "public"."document_invitations" add constraint "unique_document_email" UNIQUE using index "unique_document_email";

alter table "public"."document_permissions" add constraint "document_permissions_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE not valid;

alter table "public"."document_permissions" validate constraint "document_permissions_document_id_fkey";

alter table "public"."document_permissions" add constraint "document_permissions_document_id_user_id_key" UNIQUE using index "document_permissions_document_id_user_id_key";

alter table "public"."document_permissions" add constraint "document_permissions_permission_level_check" CHECK ((permission_level = ANY (ARRAY['read'::text, 'write'::text, 'admin'::text]))) not valid;

alter table "public"."document_permissions" validate constraint "document_permissions_permission_level_check";

alter table "public"."document_permissions" add constraint "document_permissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."document_permissions" validate constraint "document_permissions_user_id_fkey";

alter table "public"."documents" add constraint "documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_document_invitation(p_document_id uuid, p_email text, p_invited_by uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_token text;
begin
  -- Check if user already has access
  if exists (
    select 1 
    from document_permissions 
    where document_id = p_document_id 
    and user_id = (select id from auth.users where email = p_email)
  ) then
    raise exception 'User already has access to this document';
  end if;

  -- Check if invitation already exists
  if exists (
    select 1 
    from document_invitations 
    where document_id = p_document_id 
    and email = p_email 
    and expires_at > now() 
    and not used
  ) then
    raise exception 'Active invitation already exists for this email';
  end if;

  -- Generate token
  v_token := generate_invitation_token();

  -- Create invitation
  insert into document_invitations (
    document_id,
    email,
    token,
    invited_by,
    expires_at
  ) values (
    p_document_id,
    p_email,
    v_token,
    p_invited_by,
    now() + interval '7 days'
  );

  return v_token;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_document(p_title text, p_is_public boolean, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_document_id uuid;
BEGIN
    INSERT INTO documents (
        title,
        content,
        user_id,
        created_at,
        updated_at,
        is_public
    ) VALUES (
        p_title,
        '',
        p_user_id,
        NOW(),
        NOW(),
        p_is_public
    )
    RETURNING id INTO v_document_id;
    
    RETURN v_document_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_invitation_token()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
  v_token text;
begin
  -- Generate a random token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Ensure token is unique
  while exists (select 1 from document_invitations where token = v_token) loop
    v_token := encode(gen_random_bytes(32), 'hex');
  end loop;
  
  return v_token;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_document_permissions(p_document_id uuid)
 RETURNS TABLE(id uuid, document_id uuid, user_id uuid, permission_level text, created_at timestamp with time zone, profiles jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        dp.id,
        dp.document_id,
        dp.user_id,
        dp.permission_level,
        dp.created_at,
        jsonb_build_object(
            'email', p.email,
            'full_name', p.full_name,
            'avatar_url', p.avatar_url
        ) as profiles
    FROM document_permissions dp
    JOIN profiles p ON p.id = dp.user_id
    WHERE dp.document_id = p_document_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_document_with_permission(p_document_id uuid)
 RETURNS TABLE(id uuid, title text, content text, user_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, is_public boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        d.updated_at,
        d.is_public
    FROM documents d
    LEFT JOIN document_permissions dp ON d.id = dp.document_id AND dp.user_id = auth.uid()
    WHERE d.id = p_document_id  -- Using p_document_id to clearly refer to the parameter
    AND (d.user_id = auth.uid() OR dp.user_id = auth.uid());
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_documents()
 RETURNS TABLE(id uuid, title text, content text, user_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone, is_public boolean, permission_level text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.content,
        d.user_id,
        d.created_at,
        d.updated_at,
        d.is_public,
        dp.permission_level
    FROM documents d
    LEFT JOIN document_permissions dp ON d.id = dp.document_id AND dp.user_id = auth.uid()
    WHERE d.user_id = auth.uid() OR dp.user_id = auth.uid();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_profiles(p_user_ids uuid[])
 RETURNS TABLE(id uuid, email text, full_name text, avatar_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.avatar_url
    FROM profiles p
    WHERE p.id = ANY(p_user_ids);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_invitation_signup(p_token text, p_document_id uuid, p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_invitation record;
begin
  -- Get and verify the invitation
  select * into v_invitation
  from document_invitations
  where token = p_token
    and document_id = p_document_id
    and expires_at > now()
    and used = false;

  if not found then
    raise exception 'Invalid or expired invitation';
  end if;

  -- Create the permission
  insert into document_permissions (document_id, user_id, permission_level)
  values (p_document_id, p_user_id, 'editor');

  -- Mark invitation as used
  update document_invitations
  set used = true,
      used_at = now()
  where token = p_token;

  -- Delete the invitation after use
  delete from document_invitations
  where token = p_token;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.remove_document_permission(p_document_id uuid, p_user_id uuid, p_requester_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_is_owner BOOLEAN;
BEGIN
    -- Check if requester is the document owner
    SELECT EXISTS (
        SELECT 1 FROM documents 
        WHERE id = p_document_id AND user_id = p_requester_id
    ) INTO v_is_owner;

    IF NOT v_is_owner THEN
        RAISE EXCEPTION 'Only document owners can remove permissions';
    END IF;

    -- Remove the permission
    DELETE FROM document_permissions
    WHERE document_id = p_document_id 
    AND user_id = p_user_id;

    RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_user_by_email(p_email text)
 RETURNS TABLE(id uuid, email text, full_name text, avatar_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.avatar_url
    FROM profiles p
    WHERE p.email ILIKE '%' || p_email || '%'
    LIMIT 10;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.share_document(p_document_id uuid, p_user_id uuid, p_permission_level text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if user has permission to share this document
    IF NOT EXISTS (
        SELECT 1 
        FROM documents d
        WHERE d.id = p_document_id
        AND d.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'You do not have permission to share this document';
    END IF;

    -- Insert the permission
    INSERT INTO document_permissions (
        document_id,
        user_id,
        permission_level,
        created_at
    ) VALUES (
        p_document_id,
        p_user_id,
        p_permission_level,
        NOW()
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_document_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_document(p_document_id uuid, p_title text, p_content text, p_is_public boolean, p_user_id uuid)
 RETURNS documents
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_document documents;
BEGIN
    -- Check if user is owner or has write permission
    IF EXISTS (
        SELECT 1 
        FROM documents d
        LEFT JOIN document_permissions dp ON d.id = dp.document_id AND dp.user_id = p_user_id
        WHERE d.id = p_document_id
        AND (d.user_id = p_user_id OR dp.permission_level IN ('write', 'admin'))
    ) THEN
        UPDATE documents
        SET 
            title = COALESCE(p_title, title),
            content = COALESCE(p_content, content),
            is_public = COALESCE(p_is_public, is_public),
            updated_at = NOW()
        WHERE id = p_document_id
        RETURNING * INTO v_document;
        
        RETURN v_document;
    ELSE
        RAISE EXCEPTION 'You do not have permission to update this document';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_document(p_document_id uuid, p_title text, p_content text, p_user_id uuid, p_is_public boolean DEFAULT false)
 RETURNS documents
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_document documents;
BEGIN
    -- Check if user is owner or has write permission
    IF EXISTS (
        SELECT 1 
        FROM documents d
        LEFT JOIN document_permissions dp ON d.id = dp.document_id AND dp.user_id = p_user_id
        WHERE d.id = p_document_id
        AND (d.user_id = p_user_id OR dp.permission_level IN ('write', 'admin'))
    ) THEN
        UPDATE documents
        SET 
            title = COALESCE(p_title, title),
            content = COALESCE(p_content, content),
            is_public = COALESCE(p_is_public, is_public),
            updated_at = NOW()
        WHERE id = p_document_id
        RETURNING * INTO v_document;
        
        RETURN v_document;
    ELSE
        RAISE EXCEPTION 'You do not have permission to update this document';
    END IF;
END;
$function$
;

grant delete on table "public"."document_invitations" to "anon";

grant insert on table "public"."document_invitations" to "anon";

grant references on table "public"."document_invitations" to "anon";

grant select on table "public"."document_invitations" to "anon";

grant trigger on table "public"."document_invitations" to "anon";

grant truncate on table "public"."document_invitations" to "anon";

grant update on table "public"."document_invitations" to "anon";

grant delete on table "public"."document_invitations" to "authenticated";

grant insert on table "public"."document_invitations" to "authenticated";

grant references on table "public"."document_invitations" to "authenticated";

grant select on table "public"."document_invitations" to "authenticated";

grant trigger on table "public"."document_invitations" to "authenticated";

grant truncate on table "public"."document_invitations" to "authenticated";

grant update on table "public"."document_invitations" to "authenticated";

grant delete on table "public"."document_invitations" to "service_role";

grant insert on table "public"."document_invitations" to "service_role";

grant references on table "public"."document_invitations" to "service_role";

grant select on table "public"."document_invitations" to "service_role";

grant trigger on table "public"."document_invitations" to "service_role";

grant truncate on table "public"."document_invitations" to "service_role";

grant update on table "public"."document_invitations" to "service_role";

grant delete on table "public"."document_permissions" to "anon";

grant insert on table "public"."document_permissions" to "anon";

grant references on table "public"."document_permissions" to "anon";

grant select on table "public"."document_permissions" to "anon";

grant trigger on table "public"."document_permissions" to "anon";

grant truncate on table "public"."document_permissions" to "anon";

grant update on table "public"."document_permissions" to "anon";

grant delete on table "public"."document_permissions" to "authenticated";

grant insert on table "public"."document_permissions" to "authenticated";

grant references on table "public"."document_permissions" to "authenticated";

grant select on table "public"."document_permissions" to "authenticated";

grant trigger on table "public"."document_permissions" to "authenticated";

grant truncate on table "public"."document_permissions" to "authenticated";

grant update on table "public"."document_permissions" to "authenticated";

grant delete on table "public"."document_permissions" to "service_role";

grant insert on table "public"."document_permissions" to "service_role";

grant references on table "public"."document_permissions" to "service_role";

grant select on table "public"."document_permissions" to "service_role";

grant trigger on table "public"."document_permissions" to "service_role";

grant truncate on table "public"."document_permissions" to "service_role";

grant update on table "public"."document_permissions" to "service_role";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Users can create invitations"
on "public"."document_invitations"
as permissive
for insert
to public
with check ((auth.uid() = invited_by));


create policy "Users can delete their own invitations"
on "public"."document_invitations"
as permissive
for delete
to public
using ((auth.uid() = invited_by));


create policy "Users can view their own invitations"
on "public"."document_invitations"
as permissive
for select
to public
using ((auth.uid() = invited_by));


create policy "Document owners can manage permissions"
on "public"."document_permissions"
as permissive
for all
to public
using ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE (documents.user_id = auth.uid()))));


create policy "Document owners can view permissions"
on "public"."document_permissions"
as permissive
for select
to public
using ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE (documents.user_id = auth.uid()))));


create policy "Users can view their own document permissions"
on "public"."document_permissions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can create documents"
on "public"."documents"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own documents"
on "public"."documents"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own documents"
on "public"."documents"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view shared documents"
on "public"."documents"
as permissive
for select
to public
using ((id IN ( SELECT document_permissions.document_id
   FROM document_permissions
  WHERE (document_permissions.user_id = auth.uid()))));


create policy "Users can view their own documents"
on "public"."documents"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER on_document_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_document_updated_at();


