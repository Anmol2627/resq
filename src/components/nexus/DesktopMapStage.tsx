import { MapCanvas } from "@/components/nexus/MapCanvas";
import { Plus, Minus, Crosshair, Layers, Maximize2, Activity } from "lucide-react";

const titles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "MISSION CONTROL", subtitle: "Emergency Quick-Action Node" },
  map: { title: "LIVE MAP", subtitle: "Real-time responder tracking" },
  trigger: { title: "EMERGENCY REPORT", subtitle: "Multi-step incident dispatch" },
  tracking: { title: "ACTIVE INCIDENT", subtitle: "Help is on the way · Tracking responders" },
  alert: { title: "OPERATIONS", subtitle: "Live sector activity & stats" },
  profile: { title: "RESPONDER PROFILE", subtitle: "Skills · Reputation · Availability" },
};

export const DesktopMapStage = ({ screen }: { screen: string }) => {
  const meta = titles[screen] ?? titles.dashboard;
  return (
    <div className="hidden lg:flex flex-col flex-1 p-6 gap-4">
      {/* Map hero */}
      <div className="relative rounded-2xl border border-subtle overflow-hidden bg-surface flex-1 min-h-[420px]"
           style={{ boxShadow: '0 0 60px hsl(var(--emergency) / 0.05) inset' }}>
        <div className="h-full">
          <MapCanvas height={520} />
        </div>

        {/* Top overlay strip */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-nav border border-emergency/40"
                 style={{ background: 'hsl(var(--bg-void) / 0.85)' }}>
              <span className="h-2 w-2 rounded-full bg-emergency pulse-dot" />
              <span className="font-mono text-[10px] tracking-widest-2 text-primary-fg uppercase">EMERGENCY ACTIVE</span>
              <span className="font-mono text-[11px] text-amber tabular-nums">04:32</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-nav border border-subtle w-fit"
                 style={{ background: 'hsl(var(--bg-void) / 0.7)' }}>
              <Activity className="h-3 w-3 text-safe" />
              <span className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">{meta.subtitle}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pointer-events-auto">
            {[Plus, Minus, Crosshair, Layers, Maximize2].map((Icon, i) => (
              <button key={i} className="h-9 w-9 grid place-items-center rounded-lg backdrop-blur-nav border border-subtle hover:border-info/50 transition-colors"
                      style={{ background: 'hsl(var(--bg-void) / 0.7)' }}>
                <Icon className="h-3.5 w-3.5 text-secondary-fg" strokeWidth={2.2} />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2.5 rounded-xl backdrop-blur-nav border border-subtle"
             style={{ background: 'hsl(var(--bg-void) / 0.75)' }}>
          {[
            { color: "emergency", label: "Incident" },
            { color: "safe", label: "Available" },
            { color: "amber", label: "En route" },
            { color: "info", label: "Technical" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full bg-${l.color === 'emergency' ? 'emergency' : l.color === 'safe' ? 'safe' : l.color === 'amber' ? 'amber-acc' : 'info'}`}
                    style={{ boxShadow: `0 0 6px hsl(var(--${l.color}))` }} />
              <span className="font-mono text-[9px] tracking-widest-2 text-secondary-fg uppercase">{l.label}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg backdrop-blur-nav border border-subtle"
             style={{ background: 'hsl(var(--bg-void) / 0.75)' }}>
          <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">43.6532° N · 79.3832° W</span>
        </div>
      </div>
    </div>
  );
};
