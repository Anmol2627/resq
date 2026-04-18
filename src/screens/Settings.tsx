import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useMyEmergencyContacts, useMyProfile, useUpdateMyProfile, useUpsertMyEmergencyContacts } from "@/hooks/resq";

type ContactForm = { position: number; name: string; relationship: string; phone: string };

export default function Settings() {
  const navigate = useNavigate();
  const { data: profile } = useMyProfile();
  const { data: contacts } = useMyEmergencyContacts();
  const updateProfile = useUpdateMyProfile();
  const upsertContacts = useUpsertMyEmergencyContacts();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [skillsCsv, setSkillsCsv] = useState("");
  const [contactForms, setContactForms] = useState<ContactForm[]>([
    { position: 1, name: "", relationship: "", phone: "" },
    { position: 2, name: "", relationship: "", phone: "" },
    { position: 3, name: "", relationship: "", phone: "" },
  ]);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setPhone(profile.phone ?? "");
    setDob(profile.dob ?? "");
    setSkillsCsv((profile.skills ?? []).join(", "));
  }, [profile]);

  useEffect(() => {
    if (!contacts) return;
    setContactForms((prev) =>
      prev.map((c) => {
        const db = contacts.find((x) => x.position === c.position);
        return db
          ? { position: c.position, name: db.name, relationship: db.relationship, phone: db.phone }
          : c;
      }),
    );
  }, [contacts]);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      toast.error("First name, last name and phone are required.");
      return;
    }
    const c1 = contactForms.find((c) => c.position === 1);
    if (!c1 || !c1.name.trim() || !c1.relationship.trim() || !c1.phone.trim()) {
      toast.error("Emergency Contact 1 is required.");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        dob,
        skills: skillsCsv.split(",").map((s) => s.trim()).filter(Boolean),
      });
      await upsertContacts.mutateAsync(contactForms);
      toast.success("Settings saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not save settings";
      toast.error("Save failed", { description: msg });
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="rounded-xl border border-subtle bg-card-elev p-4">
        <div className="font-display text-[18px] font-bold text-primary-fg">Profile Settings</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="date" className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" value={dob} onChange={(e) => setDob(e.target.value)} />
          <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm md:col-span-2" placeholder="Skills (comma separated)" value={skillsCsv} onChange={(e) => setSkillsCsv(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border border-subtle bg-card-elev p-4">
        <div className="font-display text-[18px] font-bold text-primary-fg">Emergency Contacts</div>
        <div className="text-xs text-muted-fg mt-1">Contact 1 is mandatory. Contacts 2-3 are optional.</div>
        <div className="mt-4 space-y-3">
          {contactForms.map((c, idx) => (
            <div key={c.position} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder={`Contact ${idx + 1} name`} value={c.name} onChange={(e) => setContactForms((prev) => prev.map((x) => (x.position === c.position ? { ...x, name: e.target.value } : x)))} />
              <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder="Relationship" value={c.relationship} onChange={(e) => setContactForms((prev) => prev.map((x) => (x.position === c.position ? { ...x, relationship: e.target.value } : x)))} />
              <input className="rounded-lg bg-elevated border border-subtle px-3 py-2 text-sm" placeholder="Phone" value={c.phone} onChange={(e) => setContactForms((prev) => prev.map((x) => (x.position === c.position ? { ...x, phone: e.target.value } : x)))} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={save} className="h-10 px-4 rounded-lg bg-emergency text-primary-fg font-display text-sm tracking-widest-2">
          Save Changes
        </button>
        <button onClick={signOut} className="h-10 px-4 rounded-lg border border-subtle text-secondary-fg font-display text-sm tracking-widest-2">
          Logout
        </button>
      </div>
    </div>
  );
}

