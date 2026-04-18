import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAcceptIncident, useIncidentHistory, useOpenIncidents } from "@/hooks/resq";

export const Operations = () => {
  const openIncidents = useOpenIncidents();
  const historyIncidents = useIncidentHistory();
  const acceptIncident = useAcceptIncident();
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");

  const incidents = useMemo(
    () => (openIncidents.data ?? []).filter((inc) => !declinedIds.includes(inc.id)),
    [declinedIds, openIncidents.data]
  );
  const history = historyIncidents.data ?? [];

  const openDirections = (lat: number | null, lng: number | null) => {
    if (lat == null || lng == null) {
      toast("Location unavailable", { description: "This incident does not include GPS coordinates." });
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative pb-32">
      <section className="px-6 pt-5">
        <div className="p-4 rounded-xl bg-card-elev border border-subtle">
          <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Live incidents</div>
          <div className="font-display text-[28px] font-bold text-emergency mt-2">{incidents.length}</div>
          <div className="text-[12px] text-secondary-fg mt-1">Cross-device SOS stream (updates every 3s)</div>
        </div>
      </section>

      <section className="px-6 pt-4 space-y-3">
        <div className="rounded-xl bg-card-elev border border-subtle p-1 flex gap-1">
          <button
            onClick={() => setActiveTab("open")}
            className={`flex-1 h-9 rounded-lg text-[11px] font-display tracking-widest-2 ${
              activeTab === "open" ? "bg-emergency-dim text-emergency border border-emergency/40" : "text-secondary-fg"
            }`}
          >
            OPEN
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 h-9 rounded-lg text-[11px] font-display tracking-widest-2 ${
              activeTab === "history" ? "bg-info-dim text-info border border-info/40" : "text-secondary-fg"
            }`}
          >
            HISTORY
          </button>
        </div>

        {activeTab === "open" && (
          <>
        {openIncidents.isLoading && (
          <div className="p-4 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">Loading incidents...</div>
        )}
        {!openIncidents.isLoading && incidents.length === 0 && (
          <div className="p-4 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">No open incidents right now.</div>
        )}

        {incidents.map((inc) => {
          const accepted = !!inc.accepted_by;
          return (
            <div key={inc.id} className="p-4 rounded-xl bg-card-elev border border-subtle">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-[18px] font-bold text-primary-fg">{inc.type.toUpperCase()}</div>
                  <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg">{inc.severity} · {new Date(inc.created_at).toLocaleTimeString()}</div>
                </div>
                <div className={`font-mono text-[10px] px-2 py-1 rounded border ${accepted ? "text-safe border-safe/40 bg-safe-dim" : "text-emergency border-emergency/40 bg-emergency-dim"}`}>
                  {accepted ? "ACCEPTED" : "OPEN"}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 text-[12px] text-secondary-fg">
                <MapPin className="h-4 w-4 mt-0.5 text-info" />
                <div>
                  {inc.lat != null && inc.lng != null ? `${inc.lat.toFixed(5)}, ${inc.lng.toFixed(5)}` : "No GPS location"}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  disabled={accepted || acceptIncident.isPending}
                  onClick={async () => {
                    try {
                      await acceptIncident.mutateAsync(inc.id);
                      toast.success("Incident accepted");
                    } catch (e) {
                      const msg = e instanceof Error ? e.message : "Could not accept incident";
                      toast.error("Accept failed", { description: msg });
                    }
                  }}
                  className={`h-10 px-4 rounded-lg font-display text-[12px] tracking-widest-2 ${
                    accepted ? "bg-elevated text-muted-fg border border-subtle" : "bg-emergency text-primary-fg"
                  }`}
                >
                  {accepted ? "ALREADY ACCEPTED" : "ACCEPT"}
                </button>
                <button
                  disabled={accepted}
                  onClick={() => {
                    setDeclinedIds((prev) => (prev.includes(inc.id) ? prev : [...prev, inc.id]));
                    toast("Incident declined", { description: "Removed from your current queue." });
                  }}
                  className={`h-10 px-4 rounded-lg font-display text-[12px] tracking-widest-2 border ${
                    accepted
                      ? "bg-elevated text-muted-fg border-subtle"
                      : "bg-card-elev text-secondary-fg border-subtle hover:border-primary-fg/30"
                  }`}
                >
                  DECLINE
                </button>
                <button
                  onClick={() => openDirections(inc.lat, inc.lng)}
                  className="h-10 px-4 rounded-lg bg-info-dim border border-info/40 text-info font-display text-[12px] tracking-widest-2"
                >
                  DIRECTIONS
                </button>
              </div>
            </div>
          );
        })}
          </>
        )}

        {activeTab === "history" && (
          <>
            {historyIncidents.isLoading && (
              <div className="p-4 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">Loading history...</div>
            )}
            {!historyIncidents.isLoading && history.length === 0 && (
              <div className="p-4 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">No closed incidents yet.</div>
            )}
            {history.map((inc) => (
              <div key={inc.id} className="p-4 rounded-xl bg-card-elev border border-subtle">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-[18px] font-bold text-primary-fg">{inc.type.toUpperCase()}</div>
                    <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg">
                      {inc.severity} · {new Date(inc.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] px-2 py-1 rounded border text-safe border-safe/40 bg-safe-dim">
                    {inc.status}
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-muted-fg">
                  Closed: {inc.resolved_at ? new Date(inc.resolved_at).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};
