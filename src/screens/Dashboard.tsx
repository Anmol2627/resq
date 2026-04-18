import { Shield, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const Dashboard = ({ onSos }: { onSos: () => void }) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const holdRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const startHold = () => {
    startRef.current = Date.now();
    holdRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 800;
      if (elapsed >= 1) {
        cancelHold();
        setHoldProgress(0);
        onSos();
      } else {
        setHoldProgress(elapsed);
      }
    }, 16);
  };
  const cancelHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = null;
    setHoldProgress(0);
  };
  useEffect(() => () => cancelHold(), []);

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center pb-20">
      {/* HERO */}
      <section className="relative w-full px-6 grid place-items-center">
        {/* radial bloom */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'radial-gradient(circle at 50% 50%, hsl(var(--emergency) / 0.15), transparent 70%)'
             }} />
        
        {/* expanding rings */}
        <div className="relative h-[320px] w-[320px] grid place-items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute h-[240px] w-[240px] rounded-full border border-emergency/30 ring-expand"
              style={{ animationDelay: `${i * 1}s` }}
            />
          ))}

          {/* outer ring */}
          <div className="absolute h-[220px] w-[220px] rounded-full border-[3px] border-emergency/40" />

          {/* hold progress arc */}
          {holdProgress > 0 && (
            <svg className="absolute h-[220px] w-[220px] -rotate-90" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="87" fill="none"
                stroke="hsl(var(--primary-foreground))" strokeWidth="3"
                strokeDasharray={`${holdProgress * 547} 547`}
                strokeLinecap="round" />
            </svg>
          )}

          {/* SOS button */}
          <motion.button
            onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
            onTouchStart={startHold} onTouchEnd={cancelHold}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.04 }}
            className="relative h-[180px] w-[180px] rounded-full grid place-items-center glow-red select-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FF5050, #C01818 70%)',
              boxShadow: '0 0 40px hsl(var(--emergency) / 0.6), 0 0 100px hsl(var(--emergency) / 0.3), inset 0 -10px 30px rgba(0,0,0,0.3)'
            }}
          >
            <Zap className="h-10 w-10 text-primary-fg" fill="currentColor" strokeWidth={2.5} />
            <span className="absolute bottom-10 font-display text-[18px] font-bold tracking-widest-2 text-primary-fg">SOS</span>
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-[12px] tracking-widest-2 text-primary-fg font-bold uppercase">
            Press and hold for 1 second
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase opacity-60">
            to broadcast emergency signal
          </p>
        </div>

        <div className="mt-12 grid w-full max-w-[520px] gap-4 text-sm">
          <div className="rounded-[32px] border border-subtle bg-surface/80 p-5 shadow-lg ring-1 ring-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-muted-fg">Emergency readiness</p>
                <h2 className="mt-2 text-base font-semibold text-primary-fg">Only SOS lives here</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-emergency/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-emergency">
                SOS only
              </span>
            </div>
            <p className="mt-4 leading-6 text-muted-fg">
              The first screen is reserved for emergency activation. Use the dedicated MAP screen for live tracking and the OPERATIONS screen for incident management.
            </p>
          </div>

          <div className="rounded-[32px] border border-subtle bg-surface/80 p-5 shadow-lg ring-1 ring-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-muted-fg">Quick control</p>
                <h2 className="mt-2 text-base font-semibold text-primary-fg">Ready for rapid dispatch</h2>
              </div>
              <div className="rounded-full bg-safe/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-safe">
                Live network
              </div>
            </div>
            <p className="mt-4 leading-6 text-muted-fg">
              Hold the red button to alert responders immediately. You can also switch to PROFILE to review skills or ALERTS for sector status after dispatch.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
