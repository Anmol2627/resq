import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ProfileRole = "victim" | "responder" | "both";

export type ProfileRow = {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  dob: string; // ISO date string (YYYY-MM-DD)
  role: ProfileRole;
  skills: string[];
  blood_type: string | null;
  allergies: string | null;
  chronic_conditions: string | null;
  medications: string | null;
  medical_issues: string | null;
  availability: boolean;
  created_at: string;
  updated_at: string;
};

export type EmergencyContactRow = {
  id: string;
  user_id: string;
  position: number; // 1..3
  name: string;
  relationship: string;
  phone: string;
  created_at: string;
};

export type IncidentType = "medical" | "fire" | "safety" | "technical";
export type IncidentSeverity = "MILD" | "MODERATE" | "CRITICAL";
export type IncidentStatus = "OPEN" | "RESOLVED" | "CANCELLED";

export type IncidentRow = {
  id: string;
  user_id: string | null;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string | null;
  status: IncidentStatus;
  accepted_by: string | null;
  accepted_at: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  resolved_at: string | null;
};

export type ResponderPreview = {
  id: string;
  first_name: string;
  last_name: string;
  role: ProfileRole;
  availability: boolean;
};

export type MapUser = {
  id: string;
  first_name: string;
  last_name: string;
  role: ProfileRole;
  availability: boolean;
  current_lat: number | null;
  current_lng: number | null;
};

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

async function ensureProfileForCurrentUser() {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes.user;
  if (!user?.id) throw new Error("Not signed in.");

  const { data: existing } = await sb.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing?.id) return user.id;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const firstNameMeta = typeof meta.first_name === "string" ? meta.first_name : null;
  const lastNameMeta = typeof meta.last_name === "string" ? meta.last_name : null;
  const phoneMeta = typeof meta.phone === "string" ? meta.phone : null;
  const dobMeta = typeof meta.dob === "string" ? meta.dob : null;
  const roleMeta = meta.role === "victim" || meta.role === "responder" || meta.role === "both" ? meta.role : "victim";
  const skillsMeta = Array.isArray(meta.skills) ? meta.skills.filter((s): s is string => typeof s === "string") : [];
  const fallbackName = user.email?.split("@")[0] ?? "Guest";
  const { error } = await sb.from("profiles").upsert({
    id: user.id,
    email: user.email ?? null,
    first_name: firstNameMeta?.trim() || fallbackName,
    last_name: lastNameMeta?.trim() || "User",
    phone: phoneMeta?.trim() || "NA",
    dob: dobMeta || "2000-01-01",
    role: roleMeta,
    skills: skillsMeta,
    availability: true,
  });
  if (error) throw error;
  return user.id;
}

async function ensureEmergencyContactsForCurrentUserFromMetadata() {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes.user;
  if (!user?.id) throw new Error("Not signed in.");

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const rawContacts = meta.emergency_contacts;
  if (!Array.isArray(rawContacts)) return;

  const payload = rawContacts
    .map((item, idx) => {
      const row = item as Record<string, unknown>;
      const name = typeof row.name === "string" ? row.name.trim() : "";
      const relationship = typeof row.relationship === "string" ? row.relationship.trim() : "";
      const phone = typeof row.phone === "string" ? row.phone.trim() : "";
      const positionFromMeta = typeof row.position === "number" ? row.position : idx + 1;
      return {
        user_id: user.id,
        position: Math.min(3, Math.max(1, positionFromMeta)),
        name,
        relationship,
        phone,
      };
    })
    .filter((c) => c.name && c.relationship && c.phone);

  if (!payload.length) return;
  const { error } = await sb.from("emergency_contacts").upsert(payload, { onConflict: "user_id,position" });
  if (error) throw error;
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) return null;

  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  if (data) return data as ProfileRow;

  await ensureProfileForCurrentUser();
  const { data: hydrated, error: hydratedErr } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (hydratedErr) throw hydratedErr;
  return (hydrated ?? null) as ProfileRow | null;
}

export async function getMyEmergencyContacts(): Promise<EmergencyContactRow[]> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) return [];

  const { data, error } = await sb.from("emergency_contacts").select("*").eq("user_id", userId).order("position", { ascending: true });
  if (error) throw error;
  if (data && data.length) return data as EmergencyContactRow[];

  await ensureEmergencyContactsForCurrentUserFromMetadata();
  const { data: hydrated, error: hydratedErr } = await sb
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", userId)
    .order("position", { ascending: true });
  if (hydratedErr) throw hydratedErr;
  return (hydrated ?? []) as EmergencyContactRow[];
}

export async function setAvailability(available: boolean): Promise<void> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Not signed in.");

  const { error } = await sb.from("profiles").update({ availability: available }).eq("id", userId);
  if (error) throw error;
}

export async function updateMyProfile(input: Partial<Pick<ProfileRow, "first_name" | "last_name" | "phone" | "dob" | "role" | "medical_issues" | "allergies" | "chronic_conditions" | "medications" | "skills">>): Promise<void> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Not signed in.");

  const { error } = await sb.from("profiles").update(input).eq("id", userId);
  if (error) throw error;
}

export async function upsertMyEmergencyContacts(contacts: Array<{ position: number; name: string; relationship: string; phone: string }>): Promise<void> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Not signed in.");

  const payload = contacts
    .map((c) => ({
      user_id: userId,
      position: c.position,
      name: c.name.trim(),
      relationship: c.relationship.trim(),
      phone: c.phone.trim(),
    }))
    .filter((c) => c.name && c.relationship && c.phone);

  const { error } = await sb.from("emergency_contacts").upsert(payload, { onConflict: "user_id,position" });
  if (error) throw error;
}

export async function createIncident(input: {
  type: IncidentType;
  severity: IncidentSeverity;
  description?: string;
  lat?: number;
  lng?: number;
}): Promise<IncidentRow> {
  const sb = requireSupabase();
  const userId = await ensureProfileForCurrentUser();

  const payload = {
    user_id: userId,
    type: input.type,
    severity: input.severity,
    description: input.description?.trim() ? input.description.trim() : null,
    status: "OPEN" as const,
    lat: typeof input.lat === "number" ? input.lat : null,
    lng: typeof input.lng === "number" ? input.lng : null,
  };

  const { data, error } = await sb.from("incidents").insert(payload).select("*").single();
  if (error) throw error;
  return data as IncidentRow;
}

export async function getOpenIncidents(): Promise<IncidentRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("incidents")
    .select("*")
    .eq("status", "OPEN")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as IncidentRow[];
}

export async function getIncidentById(incidentId: string): Promise<IncidentRow | null> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("incidents").select("*").eq("id", incidentId).maybeSingle();
  if (error) throw error;
  return (data ?? null) as IncidentRow | null;
}

export async function getAvailableResponders(): Promise<ResponderPreview[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("id,first_name,last_name,role,availability")
    .in("role", ["responder", "both"])
    .eq("availability", true)
    .order("updated_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []) as ResponderPreview[];
}

export async function acceptIncident(incidentId: string): Promise<IncidentRow> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const uid = userRes.user?.id;
  if (!uid) throw new Error("Not signed in.");

  const { data, error } = await sb
    .from("incidents")
    .update({ accepted_by: uid, accepted_at: new Date().toISOString() })
    .eq("id", incidentId)
    .is("accepted_by", null)
    .select("*")
    .single();
  if (error) throw error;
  return data as IncidentRow;
}

export async function updateMyLocation(lat: number, lng: number): Promise<void> {
  const sb = requireSupabase();
  const userId = await ensureProfileForCurrentUser();
  const { error } = await sb.from("profiles").update({ current_lat: lat, current_lng: lng }).eq("id", userId);
  if (error) throw error;
}

export async function getMapUsers(): Promise<MapUser[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("id,first_name,last_name,role,availability,current_lat,current_lng")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MapUser[];
}

export async function getMyIncidents(): Promise<IncidentRow[]> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const uid = userRes.user?.id;
  if (!uid) return [];
  const { data, error } = await sb
    .from("incidents")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as IncidentRow[];
}

