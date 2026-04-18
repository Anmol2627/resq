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

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) return null;

  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return (data ?? null) as ProfileRow | null;
}

export async function getMyEmergencyContacts(): Promise<EmergencyContactRow[]> {
  const sb = requireSupabase();
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) return [];

  const { data, error } = await sb.from("emergency_contacts").select("*").eq("user_id", userId).order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EmergencyContactRow[];
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
  const { data: userRes, error: userErr } = await sb.auth.getUser();
  if (userErr) throw userErr;
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Not signed in.");

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

