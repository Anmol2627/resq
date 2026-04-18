import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, ChevronUp, Send } from "lucide-react";
import { MapCanvas } from "@/components/nexus/MapCanvas";
import { cn } from "@/lib/utils";
import { useAvailableResponders, useIncident, type IncidentRow } from "@/hooks/resq";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const QUICK = ["I AM SAFE", "NEED AMBULANCE", "FIRE SPREADING"];

export const ActiveTracking = ({ onResolve, incident }: { onResolve: () => void; incident: IncidentRow | null }) => {
  const [elapsed, setElapsed] = useState(374);
  const [expanded, setExpanded] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdRef = useRef<number | null>(null);
  const incidentQuery = useIncident(incident?.id);
  const respondersQuery = useAvailableResponders();
  const incidentLive = incidentQuery.data ?? incident;
  const availableResponders = respondersQuery.data ?? [];
  const acceptedResponder = availableResponders.find((r) => r.id === incidentLive?.accepted_by);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const startHold = () => {
    const start = Date.now();
    holdRef.current = window.setInterval(() => {
      const p = (Date.now() - start) / 1500;
      if (p >= 1) { cancelHold(); onResolve(); }
      else setHoldProgress(p);
    }, 16);
  };
  const cancelHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = null;
    setHoldProgress(0);
  };

  const openDirections = () => {
    const destination =
      incidentLive?.lat != null && incidentLive?.lng != null
        ? `${incidentLive.lat},${incidentLive.lng}`
        : "28.6139,77.2090";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.location.href = url;
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="px-6 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-[18px] font-bold tracking-widest-2 text-safe">HELP IS ON THE WAY</h1>
          <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">OPEN FOR {fmt(elapsed)}</span>
        </div>
        <p className="text-[12px] text-secondary-fg mt-1">
          Nearby responders: {availableResponders.length} · Coming: {incidentLive?.accepted_by ? 1 : 0}
        </p>
        <button
          onClick={openDirections}
          className="mt-3 rounded-xl border border-info/40 bg-info-dim px-3 py-2 font-mono text-[10px] tracking-widest-2 text-info uppercase"
        >
          Directions
        </button>
      </header>

      {/* Map */}
      <MapCanvas height={300} />

      {/* Responders panel (collapsible) */}
      <section className="px-6 -mt-4 relative z-10">
        <div className="rounded-2xl bg-card-elev border border-subtle p-4">
          <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">COMING RESPONDERS</div>
                <div className="font-display text-[16px] font-bold tracking-wider text-safe leading-none">
                  {incidentLive?.accepted_by ? "1 RESPONDER ACCEPTED" : "WAITING FOR ACCEPTANCE"}
                </div>
              </div>
            </div>
            <ChevronUp className={cn("h-5 w-5 text-secondary-fg transition-transform", expanded && "rotate-180")} />
          </button>

          {expanded && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <div className="p-3 rounded-xl bg-elevated border border-subtle">
                <div className="text-[12px] text-muted-fg">Nearby responders notified: {availableResponders.length}</div>
              </div>
              {acceptedResponder ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-elevated border border-subtle">
                  <div className="h-10 w-10 rounded-full grid place-items-center font-display font-bold text-[12px] text-primary-fg bg-safe-dim">
                    {(acceptedResponder.first_name[0] ?? "").toUpperCase()}
                    {(acceptedResponder.last_name[0] ?? "").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-primary-fg">
                      {acceptedResponder.first_name} {acceptedResponder.last_name}
                    </div>
                    <div className="text-[11px] text-safe">Accepted and on the way</div>
                  </div>
                  <button className="h-8 w-8 grid place-items-center rounded-full bg-safe-dim border border-safe/40">
                    <Phone className="h-3.5 w-3.5 text-safe" />
                  </button>
                  <button className="h-8 w-8 grid place-items-center rounded-full bg-info-dim border border-info/40">
                    <MessageCircle className="h-3.5 w-3.5 text-info" />
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-elevated border border-subtle text-[12px] text-muted-fg">
                  No responder has accepted yet. Keep this screen open.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Communication */}
      <section className="px-6 mt-5">
        <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase mb-2">Send update</div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-card-elev border border-subtle">
          <input
            placeholder="Send update to responders..."
            className="flex-1 bg-transparent px-2 py-2 text-[13px] text-primary-fg placeholder:text-muted-fg focus:outline-none"
          />
          <button className="h-9 w-9 grid place-items-center rounded-lg bg-info text-primary-fg">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK.map((q, i) => (
            <button key={q} className={cn(
              "font-mono text-[10px] font-bold tracking-widest-2 px-3 py-1.5 rounded-full border transition-colors uppercase",
              i === 1 ? "bg-amber-dim border-amber-acc/50 text-amber" :
              i === 2 ? "bg-orange-dim border-orange-acc/40 text-orange-acc" :
              "bg-card-elev border-subtle text-secondary-fg hover:border-safe/40 hover:text-safe"
            )}>
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Resolve */}
      <section className="px-6 mt-6 space-y-3">
        <button onClick={onResolve}
                className="w-full py-3 rounded-xl border border-safe/40 bg-safe-dim text-safe font-display font-bold text-[13px] tracking-widest-2">
          MARK AS RESOLVED
        </button>
        <p className="text-center text-[11px] text-muted-fg">This will notify all responders</p>

        <button
          onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
          onTouchStart={startHold} onTouchEnd={cancelHold}
          className="relative w-full py-3 rounded-xl border border-emergency/40 text-emergency font-display font-bold text-[13px] tracking-widest-2 overflow-hidden select-none"
        >
          <div className="absolute inset-0 bg-emergency/30 transition-all"
               style={{ width: `${holdProgress * 100}%` }} />
          <span className="relative">{holdProgress > 0 ? "KEEP HOLDING..." : "HOLD TO CANCEL EMERGENCY"}</span>
        </button>
      </section>
    </div>
  );
};
