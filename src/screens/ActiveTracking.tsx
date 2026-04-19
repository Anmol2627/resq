import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, ChevronUp, Send } from "lucide-react";
import { LeafletMap } from "@/components/nexus/LeafletMap";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useAvailableResponders,
  useIncident,
  useMapUsers,
  useMyEmergencyContacts,
  useResolveIncident,
  type IncidentRow,
} from "@/hooks/resq";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const NEARBY_RADIUS_KM = 5;

const QUICK = ["I AM SAFE", "NEED AMBULANCE", "FIRE SPREADING"];

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa = s1 * s1 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * s2 * s2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

export const ActiveTracking = ({ onResolve, incident }: { onResolve: () => void; incident: IncidentRow | null }) => {
  const DEFAULT_INDIA_FALLBACK_CONTACT = "9675852627";
  const [elapsed, setElapsed] = useState(374);
  const [expanded, setExpanded] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdRef = useRef<number | null>(null);
  const incidentQuery = useIncident(incident?.id);
  const respondersQuery = useAvailableResponders();
  const contactsQuery = useMyEmergencyContacts();
  const mapUsersQuery = useMapUsers();
  const resolveIncidentMut = useResolveIncident();
  const incidentLive = incidentQuery.data ?? incident;
  const availableResponders = respondersQuery.data ?? [];
  const mapUsers = mapUsersQuery.data ?? [];
  const nearbyUsers =
    incidentLive?.lat != null && incidentLive?.lng != null
      ? mapUsers.filter((u) => {
          if (u.current_lat == null || u.current_lng == null) return false;
          return distanceKm(incidentLive.lat as number, incidentLive.lng as number, u.current_lat, u.current_lng) <= NEARBY_RADIUS_KM;
        })
      : mapUsers.filter((u) => u.current_lat != null && u.current_lng != null);
  const acceptedResponder = availableResponders.find((r) => r.id === incidentLive?.accepted_by);
  const responderEtas = nearbyUsers.slice(0, 5).map((r, idx) => ({
    id: r.id,
    name: `${r.first_name} ${r.last_name}`,
    eta: `${4 + idx * 3} min`,
  }));

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const startHold = () => {
    if (!incidentLive?.id) return;
    const start = Date.now();
    holdRef.current = window.setInterval(() => {
      const p = (Date.now() - start) / 1000;
      if (p >= 1) {
        cancelHold();
        resolveIncidentMut.mutate(incidentLive.id, {
          onSuccess: () => {
            toast.success("Incident resolved");
            onResolve();
          },
          onError: () => {
            toast.error("Could not resolve incident");
          },
        });
      }
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

  const sendWhatsappAlert = () => {
    if (!incidentLive) {
      toast.error("Incident unavailable", { description: "Wait a moment for SOS details to sync." });
      return;
    }
    const contacts = contactsQuery.data ?? [];
    const normalizeIndiaPhone = (raw: string) => {
      const digits = raw.replace(/\D/g, "");
      if (!digits) return "";
      if (digits.startsWith("91") && digits.length >= 12) return digits;
      if (digits.length === 10) return `91${digits}`;
      return digits;
    };

    const allPhones = [
      ...contacts.map((c) => c.phone),
      DEFAULT_INDIA_FALLBACK_CONTACT,
    ];
    const uniquePhones = Array.from(new Set(allPhones.map(normalizeIndiaPhone).filter(Boolean)));
    if (!uniquePhones.length) {
      toast.error("No emergency contacts found");
      return;
    }

    const mapsLink =
      incidentLive.lat != null && incidentLive.lng != null
        ? `https://www.google.com/maps?q=${incidentLive.lat},${incidentLive.lng}`
        : "Location unavailable";
    const messageText =
      `SOS ALERT from RESQ+\n` +
      `Type: ${incidentLive.type.toUpperCase()}\n` +
      `Severity: ${incidentLive.severity}\n` +
      `Details: ${incidentLive.description?.trim() ? incidentLive.description.trim() : "N/A"}\n` +
      `Location: ${mapsLink}`;
    const encoded = encodeURIComponent(messageText);

    let opened = 0;
    uniquePhones.forEach((phone) => {
      const win = window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank", "noopener,noreferrer");
      if (win) opened += 1;
    });
    if (opened === 0) {
      toast.error("Could not open WhatsApp", { description: "Allow popups and try again." });
      return;
    }
    toast.success("WhatsApp alert opened", { description: `Opened ${opened} chat(s). Tap send in each.` });
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
          Nearby registered users: {nearbyUsers.length} · Coming: {incidentLive?.accepted_by ? 1 : 0}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={sendWhatsappAlert}
            className="rounded-xl border border-safe/40 bg-safe-dim px-3 py-2 font-mono text-[10px] tracking-widest-2 text-safe uppercase"
          >
            Send WhatsApp Alert
          </button>
          <button
            onClick={openDirections}
            className="rounded-xl border border-info/40 bg-info-dim px-3 py-2 font-mono text-[10px] tracking-widest-2 text-info uppercase"
          >
            Directions
          </button>
        </div>
      </header>

      {/* Map */}
      <LeafletMap height={300} users={nearbyUsers} incidents={incidentLive ? [incidentLive] : []} />

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
                <div className="text-[12px] text-muted-fg">Nearby registered users in radius: {nearbyUsers.length}</div>
                {responderEtas.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {responderEtas.map((r) => (
                      <div key={r.id} className="text-[12px] text-secondary-fg">
                        {r.name} · ETA {r.eta}
                      </div>
                    ))}
                  </div>
                )}
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
        <button
          onClick={() => {
            if (!incidentLive?.id) return;
            resolveIncidentMut.mutate(incidentLive.id, {
              onSuccess: () => {
                toast.success("Issue resolved");
                onResolve();
              },
              onError: () => {
                toast.error("Could not resolve incident");
              },
            });
          }}
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
