import { useEffect, useState } from "react";
import { Plus, Minus, Crosshair, Layers, ChevronRight, Phone, MessageSquare } from "lucide-react";
import { LeafletMap } from "@/components/nexus/LeafletMap";
import { liveResponders, pendingResponders, skillColors } from "@/lib/nexus-data";
import { motion, AnimatePresence } from "framer-motion";
import { useMapUsers, useOpenIncidents, useUpdateMyLocation } from "@/hooks/resq";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const LiveMap = () => {
  const [elapsed, setElapsed] = useState(272);
  const incidentsQuery = useOpenIncidents();
  const usersQuery = useMapUsers();
  const updateLocation = useUpdateMyLocation();
  const incidents = incidentsQuery.data ?? [];
  const mapUsers = usersQuery.data ?? [];
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const syncLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation.mutate({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => undefined,
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 12000 }
      );
    };

    syncLocation();
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation.mutate({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 12000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [updateLocation]);

  return (
    <div className="pb-28">
      {/* Map */}
      <div className="relative">
        <LeafletMap height={420} users={mapUsers} incidents={incidents} />

        {/* Status banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-nav border border-emergency/40"
             style={{ background: 'hsl(var(--bg-void) / 0.85)' }}>
          <span className="h-2 w-2 rounded-full bg-emergency pulse-dot" />
          <span className="font-mono text-[10px] tracking-widest-2 text-primary-fg uppercase">EMERGENCY ACTIVE</span>
          <span className="font-mono text-[11px] text-amber tabular-nums">{fmt(elapsed)}</span>
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {[Plus, Minus, Crosshair, Layers].map((Icon, i) => (
            <button key={i} className="h-10 w-10 grid place-items-center rounded-full bg-elevated border border-subtle hover:border-info/40 transition-colors">
              <Icon className="h-4 w-4 text-secondary-fg" strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 pt-4">
        <div className="rounded-xl bg-card-elev border border-subtle p-3">
          <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">
            Open incidents: {incidents.length}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">
            Registered users on map: {mapUsers.length}
          </div>
          <div className="mt-2 space-y-1">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="text-[12px] text-secondary-fg">
                {inc.type.toUpperCase()} · {inc.severity} · {new Date(inc.created_at).toLocaleTimeString()}
              </div>
            ))}
            {!incidents.length && <div className="text-[12px] text-muted-fg">No live incidents yet.</div>}
          </div>
        </div>
      </section>

      {/* Responders panel (hidden on desktop so center stays Leaflet-only) */}
      <section className="px-6 pt-6 lg:hidden">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" />
            <span className="font-mono text-[11px] tracking-widest-2 text-safe uppercase">RESPONDING ({liveResponders.length})</span>
          </div>
          <span className="font-mono text-[11px] tracking-widest-2 text-muted-fg uppercase">PENDING ({pendingResponders.length})</span>
        </div>

        <div className="space-y-3">
          {liveResponders.map((r) => {
            const c = skillColors[r.type];
            return (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl bg-card-elev border border-subtle group transition-all"
              >
                {/* Status glow */}
                <div className="absolute top-0 left-0 w-1 h-full opacity-60" style={{ background: c.color }} />

                <div className="relative">
                  <div className="h-12 w-12 rounded-full grid place-items-center font-display font-bold text-[14px] text-primary-fg shadow-xl"
                       style={{ background: `linear-gradient(135deg, ${c.color}, hsl(var(--bg-card)))`, border: `2px solid ${c.color}` }}>
                    {r.initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-safe grid place-items-center border-2 border-[hsl(var(--bg-card))]">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--bg-card))] pulse-dot" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-primary-fg leading-tight group-hover:text-primary transition-colors">{r.name}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`font-mono text-[9px] font-bold tracking-widest-2 px-2 py-0.5 rounded-md ${c.bg} ${c.text} uppercase`}>{r.skill}</span>
                    <span className="font-mono text-[10px] text-muted-fg">{r.distance}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[11px] font-bold text-safe tracking-wider">{r.eta}</span>
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-8 w-8 rounded-full bg-elevated border border-subtle grid place-items-center hover:bg-subtle transition-colors">
                        <Phone className="h-3.5 w-3.5 text-secondary-fg" />
                      </button>
                      <button className="h-8 w-8 rounded-full bg-elevated border border-subtle grid place-items-center hover:bg-subtle transition-colors">
                        <MessageSquare className="h-3.5 w-3.5 text-secondary-fg" />
                      </button>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-fg group-hover:text-primary-fg transition-colors" />
                </div>

                {/* progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-subtle/30">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.max(15, 100 - (r.etaSec / 10))}%` }}
                    className="h-full shadow-[0_0_10px_currentColor]"
                    style={{ background: c.color, color: c.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-subtle" />
          <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">PENDING</span>
          <div className="flex-1 h-px bg-subtle" />
        </div>

        <div className="space-y-2">
          {pendingResponders.slice(0, 3).map((r) => {
            const c = skillColors[r.type];
            return (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-card-elev/50 border border-subtle">
                <div className="h-9 w-9 rounded-full grid place-items-center font-display font-bold text-[11px] text-secondary-fg bg-elevated">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-secondary-fg">{r.name}</div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[9px] tracking-widest-2 ${c.text} uppercase`}>{r.skill}</span>
                    <span className="font-mono text-[10px] text-muted-fg">{r.distance}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">AWAITING</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
