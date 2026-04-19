import { useEffect, useState } from "react";
import { Plus, Minus, Crosshair, Layers } from "lucide-react";
import { LeafletMap } from "@/components/nexus/LeafletMap";
import { useMapUsers, useOpenIncidents, useUpdateMyLocation } from "@/hooks/resq";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const LiveMap = () => {
  const [elapsed, setElapsed] = useState(272);
  const incidentsQuery = useOpenIncidents();
  const usersQuery = useMapUsers();
  const updateLocation = useUpdateMyLocation();
  const incidents = incidentsQuery.data ?? [];
  const registeredUsers = usersQuery.data ?? [];
  const usersWithLocation = registeredUsers.filter(
    (u) => typeof u.current_lat === "number" && typeof u.current_lng === "number"
  );
  const usersWithoutLocation = registeredUsers.filter(
    (u) => typeof u.current_lat !== "number" || typeof u.current_lng !== "number"
  );
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
        <LeafletMap height={420} users={registeredUsers} incidents={incidents} />

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
            Total registered users: {registeredUsers.length}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">
            Users sharing location: {usersWithLocation.length}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">
            Pending location permission: {usersWithoutLocation.length}
          </div>
          <div className="mt-2 space-y-1">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="text-[12px] text-secondary-fg">
                {inc.type.toUpperCase()} · {inc.severity} · {new Date(inc.created_at).toLocaleTimeString()}
              </div>
            ))}
            {!incidents.length && <div className="text-[12px] text-muted-fg">No live incidents yet.</div>}
          </div>
          {usersWithoutLocation.length > 0 && (
            <div className="mt-3 rounded-lg border border-subtle bg-elevated/40 p-2.5">
              <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">
                Registered users not sharing location yet
              </div>
              <div className="mt-2 space-y-1">
                {usersWithoutLocation.slice(0, 6).map((u) => (
                  <div key={u.id} className="text-[12px] text-secondary-fg">
                    {u.first_name} {u.last_name} · {u.role.toUpperCase()}
                  </div>
                ))}
                {usersWithoutLocation.length > 6 && (
                  <div className="text-[11px] text-muted-fg">
                    +{usersWithoutLocation.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile live details */}
      <section className="px-6 pt-6 lg:hidden">
        <div className="rounded-xl bg-card-elev border border-subtle p-3">
          <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">
            Live users sharing location
          </div>
          <div className="mt-2 space-y-1">
            {usersWithLocation.slice(0, 6).map((u) => (
              <div key={u.id} className="text-[12px] text-secondary-fg">
                {u.first_name} {u.last_name} · {u.role.toUpperCase()}
              </div>
            ))}
            {usersWithLocation.length === 0 && (
              <div className="text-[12px] text-muted-fg">No users are sharing location right now.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
