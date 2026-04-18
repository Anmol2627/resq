import { useEffect, useState } from "react";
import { Heart, MapPin, ShieldCheck, User } from "lucide-react";
import { incomingAlert } from "@/lib/nexus-data";

export const IncomingAlert = ({ onRespond, onDecline }: { onRespond: () => void; onDecline: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    if (accepted) return;
    if (timeLeft <= 0) { onDecline(); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [accepted, timeLeft, onDecline]);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${incomingAlert.address}, ${incomingAlert.city}`,
  )}&travelmode=driving`;

  return (
    <div className="relative min-h-screen pb-32">
      {/* Pulsing border */}
      <div className="fixed inset-0 pointer-events-none border-[3px] border-emergency border-pulse z-30" />

      {/* Diagonal stripe */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(155deg, hsl(var(--emergency) / 0.10) 0%, transparent 35%)' }} />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emergency pulse-dot" />
          <h1 className="font-display text-[13px] font-bold tracking-widest-2 text-emergency">EMERGENCY ALERT</h1>
        </div>
        <p className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase mt-2">
          TRIGGERED {incomingAlert.triggeredAgo}s AGO
        </p>
      </header>

      {/* Incident card */}
      <main className="relative z-10 px-6">
        <div className="rounded-2xl bg-card-elev border border-emergency/40 p-6"
             style={{ boxShadow: '0 0 40px hsl(var(--emergency) / 0.15)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-emergency/30 blur-2xl" />
              <div className="relative h-16 w-16 rounded-2xl bg-emergency-dim grid place-items-center border border-emergency/40">
                <Heart className="h-8 w-8 text-emergency" fill="currentColor" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="font-display text-[36px] font-bold tracking-wider text-primary-fg leading-none">{incomingAlert.type}</h2>
            <span className="mt-3 inline-flex font-display text-[11px] font-bold tracking-widest-2 px-3 py-1 rounded-full bg-emergency-dim text-emergency border border-emergency/50">
              {incomingAlert.severity}
            </span>
          </div>

          <div className="flex items-start gap-2 mt-5 pb-5 border-b border-subtle">
            <MapPin className="h-4 w-4 text-secondary-fg mt-0.5 shrink-0" />
            <div className="flex-1 text-[13px] text-secondary-fg leading-snug">
              <div>{incomingAlert.address}</div>
              <div className="font-mono text-[11px] text-muted-fg mt-0.5">{incomingAlert.city}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-5 border-b border-subtle">
            <div>
              <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Distance</div>
              <div className="font-display text-[22px] font-bold tracking-wider text-safe leading-tight">{incomingAlert.distance}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">ETA</div>
              <div className="font-display text-[22px] font-bold tracking-wider text-primary-fg leading-tight">~4 MIN</div>
            </div>
          </div>

          <div className="pt-5">
            <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase mb-2">Your skills needed</div>
            <div className="flex flex-wrap gap-2">
              {incomingAlert.matchedSkills.map((s) => (
                <span key={s} className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full bg-safe-dim text-safe border border-safe/40">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reporter */}
        <div className="flex items-center gap-3 mt-4 px-4 py-3 rounded-xl bg-card-elev border border-subtle">
          <div className="h-8 w-8 rounded-full bg-elevated grid place-items-center">
            <User className="h-4 w-4 text-secondary-fg" />
          </div>
          <div className="flex-1">
            <div className="text-[12px] text-primary-fg font-medium">Anonymous Reporter</div>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-safe" />
              <span className="font-mono text-[10px] text-safe tracking-wider">VERIFIED LOCATION</span>
            </div>
          </div>
        </div>
      </main>

      {/* Action buttons */}
      <div className="sticky bottom-0 inset-x-0 z-40 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4"
           style={{ background: 'linear-gradient(to top, hsl(var(--bg-void)) 60%, transparent)' }}>
        {/* Timer bar */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest-2 text-amber uppercase">{timeLeft}s to respond</span>
          <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Auto-decline</span>
        </div>
        <div className="h-1 w-full bg-elevated rounded-full overflow-hidden mb-3">
          <div className="h-full bg-emergency transition-all duration-1000 ease-linear"
               style={{ width: `${(timeLeft / 30) * 100}%`, boxShadow: '0 0 8px hsl(var(--emergency))' }} />
        </div>

        {!accepted ? (
          <div className="flex gap-3">
            <button onClick={onDecline}
                    className="h-12 px-5 rounded-xl border border-subtle text-secondary-fg font-display font-bold text-[13px] tracking-widest-2 hover:border-primary-fg/30 transition-colors">
              DECLINE
            </button>
            <button
              onClick={() => {
                setAccepted(true);
                onRespond();
              }}
              className="flex-1 h-12 rounded-xl bg-emergency text-primary-fg font-display font-bold text-[16px] tracking-widest-2 glow-red active:scale-[0.98] transition-transform"
            >
              RESPOND NOW
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = directionsUrl;
              }}
              className="flex-1 h-12 rounded-xl bg-safe text-primary-fg font-display font-bold text-[14px] tracking-widest-2 active:scale-[0.98] transition-transform"
            >
              OPEN DIRECTIONS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
