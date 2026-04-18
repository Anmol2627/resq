import { MapPin } from "lucide-react";
import { useOpenIncidents } from "@/hooks/resq";

export const ResponderPanel = () => {
  const { data: incidents, isLoading } = useOpenIncidents();
  const openIncidents = incidents ?? [];

  return (
    <aside className="hidden xl:flex flex-col w-[360px] shrink-0 border-l border-subtle bg-surface/40 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
      <div className="m-4 rounded-xl border border-subtle bg-card-elev p-4">
        <div className="font-mono text-[10px] tracking-widest-2 text-secondary-fg uppercase">Open incidents</div>
        <div className="font-display text-[28px] font-bold text-emergency mt-2">{openIncidents.length}</div>
        <div className="text-[12px] text-muted-fg mt-1">Live incidents are shown below.</div>
      </div>

      <div className="px-4 pb-6 space-y-2">
        {isLoading && (
          <div className="p-3 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">
            Loading incidents...
          </div>
        )}
        {!isLoading && openIncidents.length === 0 && (
          <div className="p-3 rounded-xl bg-card-elev border border-subtle text-[12px] text-secondary-fg">
            No live incidents right now.
          </div>
        )}
        {openIncidents.slice(0, 6).map((inc) => (
          <div key={inc.id} className="p-3 rounded-xl bg-card-elev border border-subtle">
            <div className="flex items-center justify-between">
              <div className="font-display text-[15px] font-bold text-primary-fg">{inc.type.toUpperCase()}</div>
              <div className="font-mono text-[9px] px-2 py-0.5 rounded border border-emergency/40 text-emergency bg-emergency-dim">{inc.severity}</div>
            </div>
            <div className="mt-2 text-[11px] text-muted-fg flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {inc.lat != null && inc.lng != null ? `${inc.lat.toFixed(5)}, ${inc.lng.toFixed(5)}` : "No GPS location"}
            </div>
            <div className="mt-1 text-[10px] text-muted-fg">{new Date(inc.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};
