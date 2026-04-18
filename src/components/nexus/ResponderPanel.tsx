import { ChevronRight, Phone, MessageCircle } from "lucide-react";
import { liveResponders, pendingResponders, recentActivity, skillColors } from "@/lib/nexus-data";
import { cn } from "@/lib/utils";

export const ResponderPanel = () => {
  return (
    <aside className="hidden xl:flex flex-col w-[360px] shrink-0 border-l border-subtle bg-surface/40 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
      {/* Active emergency banner */}
      <div className="m-4 rounded-xl border border-emergency/40 bg-emergency-dim p-4 relative overflow-hidden"
           style={{ boxShadow: '0 0 30px hsl(var(--emergency) / 0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-emergency pulse-dot" />
          <span className="font-mono text-[10px] tracking-widest-2 text-emergency uppercase">EMERGENCY ACTIVE</span>
        </div>
        <div className="font-display text-[20px] font-bold tracking-wider text-primary-fg leading-tight">
          MEDICAL · CRITICAL
        </div>
        <div className="text-[12px] text-secondary-fg mt-1">47 Brunswick Ave · 0.8 km</div>
        <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-emergency/20">
          <span className="font-mono text-[10px] tracking-widest-2 text-muted-fg uppercase">Elapsed</span>
          <span className="font-mono text-[14px] font-bold text-amber tabular-nums">04:32</span>
        </div>
      </div>

      {/* Responding */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" />
            <span className="font-mono text-[10px] tracking-widest-2 text-safe uppercase">RESPONDING ({liveResponders.length})</span>
          </div>
          <button className="font-mono text-[9px] tracking-widest-2 text-info uppercase">ALL</button>
        </div>
        <div className="space-y-2">
          {liveResponders.map((r) => {
            const c = skillColors[r.type];
            return (
              <div key={r.id} className="relative overflow-hidden p-3 rounded-xl bg-card-elev border border-subtle hover:border-primary-fg/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full grid place-items-center font-display font-bold text-[12px] text-primary-fg ring-2"
                       style={{ background: `linear-gradient(135deg, ${c.color}, hsl(var(--bg-card)))`, boxShadow: `0 0 0 2px ${c.color}` }}>
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-primary-fg leading-tight">{r.name}</div>
                    <div className={cn("text-[11px]", c.text)}>{r.skill}</div>
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-widest-2 px-2 py-0.5 rounded-full bg-safe-dim text-safe border border-safe/40">{r.eta}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="flex-1 h-7 rounded-md bg-elevated border border-subtle text-secondary-fg hover:text-safe hover:border-safe/40 transition-colors flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider uppercase">
                    <Phone className="h-3 w-3" /> Call
                  </button>
                  <button className="flex-1 h-7 rounded-md bg-elevated border border-subtle text-secondary-fg hover:text-info hover:border-info/40 transition-colors flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider uppercase">
                    <MessageCircle className="h-3 w-3" /> Msg
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-elevated">
                  <div className="h-full" style={{ background: c.color, width: `${Math.max(20, 100 - (r.etaSec / 8))}%`, boxShadow: `0 0 8px ${c.color}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-subtle" />
          <span className="font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">PENDING ({pendingResponders.length})</span>
          <div className="flex-1 h-px bg-subtle" />
        </div>
        <div className="space-y-1.5">
          {pendingResponders.slice(0, 4).map((r) => {
            const c = skillColors[r.type];
            return (
              <div key={r.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card-elev/50 border border-subtle">
                <div className="h-7 w-7 rounded-full grid place-items-center font-mono font-bold text-[10px] text-secondary-fg bg-elevated">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-secondary-fg truncate">{r.name}</div>
                  <div className={cn("font-mono text-[9px] tracking-wider uppercase", c.text)}>{r.skill} · {r.distance}</div>
                </div>
                <span className="font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">WAIT</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="px-4 pb-6 mt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">Recent Activity</span>
          <button className="font-mono text-[9px] tracking-widest-2 text-info uppercase flex items-center gap-1">
            VIEW ALL <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="rounded-xl bg-card-elev border border-subtle overflow-hidden">
          {recentActivity.map((a, i) => {
            const Icon = a.icon;
            const isResolved = a.type === 'resolved';
            const isActive = a.status === 'ACTIVE';
            return (
              <div key={a.id}
                   className={cn("flex items-center gap-3 px-3 py-2.5", i < recentActivity.length - 1 && "border-b border-subtle")}>
                <div className={cn(
                  "h-7 w-7 rounded-full grid place-items-center shrink-0",
                  isResolved ? "bg-safe-dim text-safe" : isActive ? "bg-info-dim text-info" : "bg-emergency-dim text-emergency"
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-primary-fg leading-tight truncate">{a.title}</div>
                  <div className="font-mono text-[9px] text-muted-fg uppercase">{a.time}</div>
                </div>
                <span className={cn(
                  "font-mono text-[8px] font-bold tracking-widest-2 px-1.5 py-0.5 rounded-full border",
                  isResolved ? "text-safe bg-safe-dim border-safe/40" :
                  isActive ? "text-info bg-info-dim border-info/40" :
                  "text-amber bg-amber-dim border-amber-acc/40"
                )}>{a.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
