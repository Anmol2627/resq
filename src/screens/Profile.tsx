import { useEffect, useMemo, useState } from "react";
import { Star, ShieldCheck, Plus, Award, Upload, ChevronRight, MapPin, Clock } from "lucide-react";
import { skillColors, type SkillType } from "@/lib/nexus-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useMyIncidents, useMyProfile, useSetAvailability } from "@/hooks/resq";

export const Profile = () => {
  const { data: profile, isLoading, error } = useMyProfile();
  const incidentsQuery = useMyIncidents();
  const setAvail = useSetAvailability();

  const primaryType: SkillType = "medical";
  const c = skillColors[primaryType];

  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : "—";
  const initials = profile ? `${profile.first_name[0] ?? ""}${profile.last_name[0] ?? ""}`.toUpperCase() : "--";
  const tagline = profile ? `${profile.role.toUpperCase()} · ${profile.phone}` : "—";

  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (typeof profile?.availability === "boolean") setAvailable(profile.availability);
  }, [profile?.availability]);

  const chips = useMemo(() => profile?.skills ?? [], [profile?.skills]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pb-32 space-y-6"
    >
      {/* Availability Toggle */}
      <section className="flex items-center justify-between p-4 rounded-2xl bg-card-elev border border-subtle shadow-lg">
        <div className="flex items-center gap-3">
          <div className={cn("h-3 w-3 rounded-full pulse-dot", available ? "bg-safe shadow-[0_0_8px_hsl(var(--safe))]" : "bg-muted-fg")} />
          <div className="flex flex-col">
            <span className="font-display font-bold text-[14px] text-primary-fg tracking-wide">
              {available ? "OPERATIONAL" : "OFF-DUTY"}
            </span>
            <span className="font-mono text-[9px] text-muted-fg tracking-widest-2 uppercase">
              {available ? "VISIBLE TO MISSION CONTROL" : "HIDDEN FROM NETWORK"}
            </span>
          </div>
        </div>
        <Switch checked={available} onCheckedChange={setAvailable} className="data-[state=checked]:bg-safe" />
      </section>

      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-card-elev border border-subtle p-6 mt-2 group">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-[60px] opacity-20 transition-opacity group-hover:opacity-30" style={{ background: c.color }} />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <div className="h-[84px] w-[84px] rounded-full grid place-items-center font-display font-bold text-[28px] text-primary-fg p-[3px] shadow-2xl"
                 style={{ background: `linear-gradient(135deg, ${c.color}, hsl(var(--info)))` }}>
              <div className="h-full w-full rounded-full bg-card-elev grid place-items-center">
                {initials}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-safe grid place-items-center border-3 border-[hsl(var(--bg-card))] shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--bg-void))]" strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-[26px] font-bold tracking-wider text-primary-fg leading-tight">{displayName}</h1>
            <p className="text-[14px] text-secondary-fg font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-muted-fg" />
              {tagline}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-subtle relative z-10">
          {[
            { label: "RESPONSES", val: "—", icon: null },
            { label: "RATING", val: "—", icon: Star },
            { label: "RANK", val: "—", icon: Award },
          ].map((s, i) => (
            <div key={i} className={cn("text-center", i < 2 && "border-r border-subtle")}>
              <div className="font-display text-[22px] font-bold text-primary-fg flex items-center justify-center gap-1.5">
                {s.val}
                {s.icon && <s.icon className="h-4 w-4 text-amber" fill="currentColor" />}
              </div>
              <div className="font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Score */}
      <section className="rounded-2xl bg-card-elev border border-subtle p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">Responder score</span>
          <Award className="h-4 w-4 text-amber" />
        </div>
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--bg-elevated))" strokeWidth="6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--safe))" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(94 / 100) * 276} 276`}
                      style={{ filter: 'drop-shadow(0 0 6px hsl(var(--safe)))' }} />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <span className="font-display text-[36px] font-bold text-primary-fg leading-none">—</span>
                <span className="font-display text-[14px] text-muted-fg">/100</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] tracking-widest-2 text-amber uppercase">PROFILE</div>
            <div className="text-[12px] text-secondary-fg mt-1 leading-snug max-w-[180px]">Maintained 96% on-scene success rate over 30 days.</div>
          </div>
        </div>
        {chips.length ? (
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {chips.map((a) => (
              <span key={a} className="shrink-0 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-elevated border border-subtle text-secondary-fg uppercase">{a}</span>
            ))}
          </div>
        ) : null}
      </section>

      {/* Skills Library */}
      <section>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">Skills library</p>
              <h2 className="text-lg font-semibold tracking-tight text-primary-fg">Curated certifications & capabilities</h2>
            </div>
            <button className="font-mono text-[10px] tracking-widest-2 text-info uppercase flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add skill
            </button>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-secondary-fg">
            This library shows your verified credentials and pending certifications in one place. Keep it updated so mission control can dispatch you to the right incident.
          </p>
        </div>
        <div className="space-y-2">
          {(profile?.skills ?? []).map((skill) => {
            const sc = skillColors[primaryType];
            const verified = true;
            return (
              <div key={skill} className="p-4 rounded-xl bg-card-elev border border-subtle">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full grid place-items-center"
                       style={{ background: `${sc.color}25`, color: sc.color }}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-primary-fg">{skill}</div>
                    <div className="text-[11px] text-muted-fg">User provided</div>
                  </div>
                  {verified ? (
                    <span className="relative overflow-hidden font-mono text-[10px] font-bold tracking-widest-2 px-2.5 py-1 rounded-full bg-safe-dim text-safe border border-safe/40">
                      VERIFIED
                      <span className="absolute inset-0 holo-shimmer pointer-events-none" />
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] font-bold tracking-widest-2 px-2.5 py-1 rounded-full bg-amber-dim text-amber border border-amber-acc/40">
                      PENDING
                    </span>
                  )}
                </div>
                <div className="mt-3 h-1 bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `100%`, background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
                </div>
                {!verified && (
                  <button className="mt-3 flex items-center gap-1.5 font-mono text-[10px] tracking-widest-2 text-info uppercase">
                    <Upload className="h-3 w-3" /> UPLOAD CERTIFICATE
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Availability */}
      <section>
        <div className={cn(
          "flex items-center justify-between p-4 rounded-xl border transition-all",
          available ? "bg-safe-dim border-safe/50 glow-green" : "bg-card-elev border-subtle"
        )}>
          <div>
            <div className={cn("font-display text-[14px] font-bold tracking-widest-2", available ? "text-safe" : "text-secondary-fg")}>
              AVAILABLE TO RESPOND
            </div>
            <div className="text-[11px] text-muted-fg mt-0.5">You'll receive alerts within 2 km</div>
          </div>
          <button
            onClick={async () => {
              const next = !available;
              setAvailable(next);
              try {
                await setAvail.mutateAsync(next);
              } catch {
                setAvailable(!next);
              }
            }}
            className={cn("relative h-7 w-12 rounded-full transition-colors", available ? "bg-safe" : "bg-elevated")}
          >
            <span className={cn(
              "absolute top-0.5 h-6 w-6 rounded-full bg-primary-fg transition-transform",
              available ? "translate-x-[22px]" : "translate-x-0.5"
            )} />
          </button>
        </div>
      </section>

      {/* History */}
      <section>
        <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase mb-3">Recent responses</div>
        <div className="rounded-xl bg-card-elev border border-subtle overflow-hidden">
          {incidentsQuery.isLoading ? (
            <div className="px-4 py-3 text-[12px] text-muted-fg">Loading incident history...</div>
          ) : incidentsQuery.error ? (
            <div className="px-4 py-3 text-[12px] text-muted-fg">Failed to load incident history.</div>
          ) : (incidentsQuery.data ?? []).length ? (
            <div className="divide-y divide-subtle">
              {(incidentsQuery.data ?? []).slice(0, 8).map((inc) => (
                <div key={inc.id} className="px-4 py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[12px] text-primary-fg font-medium uppercase">
                      {inc.type} · {inc.severity}
                    </div>
                    <div className="text-[11px] text-muted-fg truncate">
                      {inc.description || "No description provided"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn(
                      "font-mono text-[10px] tracking-wider uppercase",
                      inc.status === "OPEN" ? "text-emergency" : "text-safe"
                    )}>
                      {inc.status}
                    </div>
                    <div className="text-[10px] text-muted-fg">
                      {new Date(inc.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-[12px] text-muted-fg">
              {isLoading ? "Loading profile..." : error ? "Failed to load profile." : "No incidents yet. Your future SOS history will be saved here."}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};
