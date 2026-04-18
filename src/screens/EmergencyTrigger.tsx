import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, MapPin, Send, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { emergencyTypes } from "@/lib/nexus-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateIncident, type IncidentRow } from "@/hooks/resq";

export const EmergencyTrigger = ({ onBack, onSent }: { onBack: () => void; onSent: (incident?: IncidentRow) => void }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [severity, setSeverity] = useState<"MILD" | "MODERATE" | "CRITICAL">("MODERATE");
  const [desc, setDesc] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const dispatchedRef = useRef(false);

  const createIncidentMut = useCreateIncident();

  const typeMeta = emergencyTypes.find((t) => t.id === selectedType);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 },
    );
  }, []);

  useEffect(() => {
    if (step === 2) locate();
  }, [locate, step]);

  const dispatchNow = useCallback(async () => {
    if (dispatching || dispatchedRef.current) return;
    if (!selectedType) {
      toast.error("Select an emergency type first.");
      return;
    }
    setDispatching(true);
    dispatchedRef.current = true;
    try {
      const incident = await createIncidentMut.mutateAsync({
        type: selectedType as "medical" | "fire" | "safety" | "technical",
        severity,
        description: desc,
        lat: coords?.lat,
        lng: coords?.lng,
      });
      toast.success("SOS dispatched", { description: "Tracking responders now. You can send WhatsApp alerts from the next screen." });
      onSent(incident);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to dispatch SOS";
      toast.error("Incident sync failed", { description: msg });
      dispatchedRef.current = false;
    } finally {
      setDispatching(false);
    }
  }, [coords, createIncidentMut, desc, dispatching, onSent, selectedType, severity]);

  useEffect(() => {
    if (step !== 3) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  return (
    <div className="relative min-h-screen pb-32">
      {/* radial bloom */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 30%, hsl(var(--emergency) / 0.12), transparent 60%)' }} />

      {/* Top bar */}
      <header className="relative z-10 flex flex-col px-6 pt-6 pb-4 gap-4">
        <div className="flex items-center justify-between">
          {step === 1 ? (
            <button onClick={onBack} className="h-10 w-10 grid place-items-center rounded-full bg-elevated border border-subtle hover:bg-subtle transition-colors">
              <ArrowLeft className="h-5 w-5 text-secondary-fg" />
            </button>
          ) : (
            <button onClick={() => setStep(step - 1)} className="h-10 w-10 grid place-items-center rounded-full bg-elevated border border-subtle hover:bg-subtle transition-colors">
              <ArrowLeft className="h-5 w-5 text-secondary-fg" />
            </button>
          )}
          <div className="flex flex-col items-center">
            <h1 className="font-display text-[18px] font-bold tracking-widest-2 text-primary-fg">EMERGENCY REPORT</h1>
            <span className="font-mono text-[10px] tracking-widest-2 text-amber uppercase mt-0.5">STEP {step} OF 3</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-card-elev border border-subtle rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-emergency shadow-[0_0_10px_rgba(255,80,80,0.5)]"
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </header>

      <motion.main
        key={step}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-6"
      >
        {step === 1 && (
          <>
            <h2 className="font-display text-[32px] font-bold tracking-wider text-primary-fg leading-none">WHAT'S HAPPENING?</h2>
            <p className="text-[13px] text-secondary-fg mt-2 mb-6">Select the type of emergency</p>
            <div className="grid grid-cols-2 gap-3">
              {emergencyTypes.map((t) => {
                const Icon = t.icon;
                const isSel = selectedType === t.id;
                const colorVar = `hsl(var(--${t.color}))`;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={cn(
                      "relative h-[140px] p-3 rounded-xl text-left transition-all",
                      "bg-card-elev border-2",
                      isSel ? "scale-[1.02]" : "hover:-translate-y-0.5"
                    )}
                    style={{
                      borderColor: isSel ? colorVar : `hsl(var(--${t.color}) / 0.4)`,
                      background: `linear-gradient(135deg, hsl(var(--bg-card)), hsl(var(--${t.color}) / 0.12))`,
                      boxShadow: isSel ? `0 0 20px hsl(var(--${t.color}) / 0.3)` : undefined,
                    }}
                  >
                    <Icon className="h-10 w-10" style={{ color: colorVar }} strokeWidth={1.8} />
                    <div className={cn(
                      "absolute top-3 right-3 h-5 w-5 rounded-full border-2 grid place-items-center transition-all",
                      isSel ? "" : "border-subtle"
                    )} style={{ borderColor: isSel ? colorVar : undefined, background: isSel ? colorVar : 'transparent' }}>
                      {isSel && <Check className="h-3 w-3 text-[hsl(var(--bg-void))]" strokeWidth={3} />}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="font-display text-[22px] font-bold tracking-wider text-primary-fg">{t.name}</div>
                      <div className="text-[11px] text-muted-fg leading-tight">{t.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-[28px] font-bold tracking-wider text-primary-fg leading-tight">SEVERITY & DETAILS</h2>
            <p className="text-[13px] text-secondary-fg mt-2 mb-6">Help responders prepare</p>

            <div className="mb-8">
              <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase mb-3">Severity level</div>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { id: "MILD", icon: AlertCircle, color: "text-safe", bg: "bg-safe-dim", border: "border-safe/30" },
                    { id: "MODERATE", icon: AlertTriangle, color: "text-amber", bg: "bg-amber-dim", border: "border-amber-acc/30" },
                    { id: "CRITICAL", icon: ShieldAlert, color: "text-emergency", bg: "bg-emergency-dim", border: "border-emergency/30" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-300",
                      severity === s.id
                        ? `bg-card-elev border-primary-fg shadow-lg scale-105`
                        : `bg-card-elev/40 border-subtle grayscale opacity-60`
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-xl grid place-items-center", s.bg)}>
                      <s.icon className={cn("h-5 w-5", s.color)} strokeWidth={2.5} />
                    </div>
                    <span className={cn("font-display text-[11px] font-bold tracking-widest-2", severity === s.id ? "text-primary-fg" : "text-muted-fg")}>
                      {s.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase mb-2">Description (optional)</div>
              <textarea
                value={desc} onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe the situation briefly..."
                rows={3}
                className="w-full bg-card-elev border border-subtle rounded-xl px-4 py-3 text-[14px] text-primary-fg placeholder:text-muted-fg focus:outline-none focus:border-info transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-card-elev border border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-info-dim grid place-items-center">
                  <MapPin className="h-4 w-4 text-info" />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-primary-fg">Using current location</div>
                  <div className="font-mono text-[10px] text-muted-fg">
                    {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° W` : "Locating..."}
                  </div>
                </div>
              </div>
              <button onClick={locate} className="font-mono text-[10px] tracking-widest-2 text-info uppercase">REFRESH</button>
            </div>
          </>
        )}

        {step === 3 && typeMeta && (
          <>
            <div className="rounded-2xl bg-card-elev border border-emergency/40 p-5 mb-6"
                 style={{ boxShadow: '0 0 30px hsl(var(--emergency) / 0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl grid place-items-center"
                     style={{ background: `hsl(var(--${typeMeta.color}) / 0.15)` }}>
                  <typeMeta.icon className="h-6 w-6" style={{ color: `hsl(var(--${typeMeta.color}))` }} />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Emergency type</div>
                  <div className="font-display text-[24px] font-bold tracking-wider text-primary-fg leading-tight">{typeMeta.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-subtle">
                <div>
                  <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Severity</div>
                  <div className="font-display text-[18px] font-bold text-emergency">{severity}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Location</div>
                  <div className="font-display text-[18px] font-bold text-primary-fg">CONFIRMED</div>
                </div>
              </div>
            </div>

            <div className="text-center relative py-12">
              {/* Countdown ring */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="h-[240px] w-[240px] rounded-full border border-emergency ring-expand" />
                <div className="h-[200px] w-[200px] rounded-full border border-emergency ring-expand" style={{ animationDelay: '1s' }} />
              </div>

              <div className="relative z-10">
                <div className="font-mono text-[10px] tracking-widest-2 text-amber uppercase mb-4">Alerting responders in</div>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-[100px] font-bold leading-none text-emergency tabular-nums drop-shadow-[0_0_15px_rgba(255,80,80,0.5)]"
                >
                  {countdown}
                </motion.div>
                <div className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase mt-4">Seconds</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={dispatchNow}
                className="w-full h-16 rounded-2xl bg-emergency text-primary-fg font-display font-bold tracking-widest-2 text-[16px] glow-red flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="h-5 w-5" />
                {dispatching ? "DISPATCHING..." : "DISPATCH NOW"}
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full h-14 rounded-2xl bg-card-elev border border-subtle text-muted-fg font-mono text-[11px] tracking-widest-2 uppercase hover:bg-subtle transition-colors"
              >
                Cancel and edit
              </button>
            </div>
          </>
        )}
      </motion.main>

      {/* Sticky CTA */}
      {step < 3 && (
        <div className="sticky bottom-0 lg:bottom-4 inset-x-0 z-40 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 -mx-0"
             style={{ background: 'linear-gradient(to top, hsl(var(--bg-void)) 60%, transparent)' }}>
          <button
            disabled={step === 1 ? !selectedType : false}
            onClick={() => setStep(step + 1)}
            className={cn(
              "w-full h-14 rounded-xl font-display text-[16px] font-bold tracking-widest-2 transition-all flex items-center justify-center gap-2",
              (step === 1 && !selectedType)
                ? "bg-elevated text-muted-fg cursor-not-allowed"
                : "bg-emergency text-primary-fg glow-red active:scale-[0.98]"
            )}
          >
            {step === 2 ? "REVIEW & CONFIRM" : "CONTINUE"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
