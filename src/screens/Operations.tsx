import { Shield, MapPin, ChevronRight, Zap, ExternalLink } from "lucide-react";
import { responders, recentActivity, skillColors } from "@/lib/nexus-data";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export const Operations = () => {
  const stats = [
    { label: "ACTIVE ALERTS", value: "3", color: "text-emergency" },
    { label: "RESPONDERS", value: "124", color: "text-safe" },
    { label: "AVG RESPONSE", value: "4m 12s", color: "text-info" },
  ];

  return (
    <div className="relative pb-32">
      {/* STATS BAR */}
      <section className="px-6 pt-4 grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="p-3 rounded-xl bg-card-elev border border-subtle flex flex-col items-center justify-center">
            <span className={`font-display font-bold text-lg ${stat.color}`}>{stat.value}</span>
            <span className="font-mono text-[8px] tracking-widest-2 text-muted-fg uppercase mt-1">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* RESPONDERS STRIP */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase tracking-widest-2">Responders in range</span>
          <span className="font-mono text-[10px] tracking-widest-2 text-amber uppercase flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber pulse-dot" />
            12 ACTIVE
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
          {responders.map((r) => {
            const c = skillColors[r.type];
            return (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.02 }}
                className="shrink-0 w-[170px] p-4 rounded-xl bg-card-elev border border-subtle relative overflow-hidden group transition-all"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: c.color }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div
                      className="h-12 w-12 rounded-full grid place-items-center font-display font-bold text-[14px] text-primary-fg shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${c.color}, hsl(var(--bg-card)))` }}
                    >
                      {r.initials}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full grid place-items-center ${c.bg} border-2 border-[hsl(var(--bg-card))] shadow-sm`}>
                      <div className={`h-2.5 w-2.5 rounded-full`} style={{ background: c.color }} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${r.status === 'available' ? 'bg-safe' : 'bg-amber'} pulse-dot shadow-lg`} />
                    <Badge variant="outline" className={`text-[8px] px-1.5 py-0 border-subtle bg-background/50 text-muted-fg`}>
                      {r.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="text-[14px] font-bold text-primary-fg leading-tight mb-0.5 group-hover:text-primary transition-colors">
                  {r.name}
                </div>
                <div className="text-[11px] text-secondary-fg font-medium mb-3">{r.skill}</div>

                <div className="flex items-center justify-between border-t border-subtle pt-3 mt-1">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-muted-fg uppercase tracking-wider">Distance</span>
                    <span className="font-mono text-[11px] font-bold text-safe">{r.distance}</span>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="font-mono text-[9px] text-muted-fg uppercase tracking-wider">ETA</span>
                    <span className="font-mono text-[11px] font-bold text-primary-fg">{r.eta}</span>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase tracking-widest-2">Recent activity</span>
          <button className="font-mono text-[10px] tracking-widest-2 text-info uppercase flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="rounded-xl bg-card-elev border border-subtle overflow-hidden">
          {recentActivity.map((a, i) => {
            const Icon = a.icon;
            const isResolved = a.type === 'resolved';
            const isActive = a.status === 'ACTIVE';
            return (
              <motion.div
                key={a.id}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                className={`flex items-center gap-3 px-4 py-4 group cursor-pointer ${i < recentActivity.length - 1 ? 'border-b border-subtle' : ''} ${i === recentActivity.length - 1 ? 'opacity-70' : ''}`}
              >
                <div className={`h-10 w-10 rounded-xl grid place-items-center transition-transform group-hover:scale-110 ${isResolved ? 'bg-safe-dim text-safe' : isActive ? 'bg-info-dim text-info' : 'bg-emergency-dim text-emergency'}`}>
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-primary-fg leading-tight group-hover:text-primary transition-colors">{a.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[9px] text-muted-fg uppercase tracking-wider">{a.time}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-fg/30" />
                    <span className="font-mono text-[9px] text-muted-fg uppercase tracking-wider">SECTOR 4</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[9px] font-bold tracking-widest-2 px-2.5 py-1 rounded-md border shadow-sm ${
                    isResolved ? 'text-safe bg-safe-dim border-safe/40' :
                    isActive ? 'text-info bg-info-dim border-info/40' :
                    'text-amber bg-amber-dim border-amber-acc/40'
                  }`}>{a.status}</span>
                  <ChevronRight className="h-4 w-4 text-muted-fg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
