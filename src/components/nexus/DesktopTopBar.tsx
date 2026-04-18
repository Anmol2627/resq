import { Bell, Search, Activity, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useOpenIncidents } from "@/hooks/resq";

export const DesktopTopBar = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const { data: incidents } = useOpenIncidents();
  const openCount = incidents?.length ?? 0;

  return (
    <header className="hidden lg:flex items-center justify-between gap-6 px-8 h-[72px] border-b border-subtle bg-surface/60 backdrop-blur-nav sticky top-0 z-30">
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-wider text-primary-fg leading-none">{title}</h1>
        {subtitle && <p className="text-[12px] text-secondary-fg mt-1">{subtitle}</p>}
      </div>

      {/* Live KPI strip */}
      <div className="flex items-center gap-2">
        {[
          { icon: Users, label: "RESPONDERS", val: "LIVE", tone: "safe" },
          { icon: AlertTriangle, label: "ACTIVE", val: String(openCount), tone: "emergency" },
          { icon: TrendingUp, label: "AVG ETA", val: "--", tone: "amber" },
          { icon: Activity, label: "UPTIME", val: "LIVE", tone: "info" },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-elevated border border-subtle">
            <k.icon className={`h-3.5 w-3.5 text-${k.tone === 'safe' ? 'safe' : k.tone === 'emergency' ? 'emergency' : k.tone === 'amber' ? 'amber' : 'info'}`} />
            <div className="leading-tight">
              <div className="font-display text-[14px] font-bold text-primary-fg tabular-nums leading-none">{k.val}</div>
              <div className="font-mono text-[8px] tracking-widest-2 text-muted-fg uppercase mt-0.5">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
          <input
            placeholder="Search responders, incidents, skills..."
            className="w-[280px] h-9 pl-9 pr-3 rounded-lg bg-elevated border border-subtle text-[12px] text-primary-fg placeholder:text-muted-fg focus:outline-none focus:border-info"
          />
        </div>
        <button className="relative h-9 w-9 grid place-items-center rounded-lg bg-elevated border border-subtle hover:border-emergency/50 transition-colors">
          <Bell className="h-4 w-4 text-secondary-fg" />
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 grid place-items-center rounded-full bg-emergency text-[9px] font-bold text-primary-fg font-mono">3</span>
        </button>
      </div>
    </header>
  );
};
