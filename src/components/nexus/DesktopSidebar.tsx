import { Home, Map, Bell, User, Zap, Shield, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavScreen } from "./BottomNav";

const items: { id: NavScreen; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Emergency Node", icon: Home },
  { id: "map", label: "Live Map", icon: Map },
  { id: "alert", label: "Operations Hub", icon: Shield },
  { id: "profile", label: "Profile & Skills", icon: User },
];

export const DesktopSidebar = ({
  active,
  onChange,
  onSos,
}: {
  active: NavScreen;
  onChange: (id: NavScreen) => void;
  onSos: () => void;
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-subtle bg-surface">
      {/* Brand */}
      <div className="px-6 pt-6 pb-5 border-b border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 rounded-lg bg-emergency grid place-items-center glow-red">
            <Zap className="h-4.5 w-4.5 text-primary-fg" fill="currentColor" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[18px] font-bold tracking-widest-2 text-primary-fg">RESQ+</span>
            <span className="font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">Response Grid</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-elevated border border-subtle w-fit">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-safe pulse-dot" />
          </span>
          <span className="font-mono text-[10px] tracking-widest-2 text-safe uppercase">LIVE · NODE 04</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        <div className="px-3 pb-2 font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">Operations</div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                isActive
                  ? "bg-emergency-dim text-primary-fg"
                  : "text-secondary-fg hover:text-primary-fg hover:bg-elevated"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-emergency"
                      style={{ boxShadow: '0 0 8px hsl(var(--emergency))' }} />
              )}
              <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-emergency")} strokeWidth={2.2} />
              <span className="text-[13px] font-medium flex-1">{item.label}</span>
              {item.id === "alert" && (
                <span className="grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-emergency text-[9px] font-bold text-primary-fg font-mono">3</span>
              )}
            </button>
          );
        })}

        {/* SOS button */}
        <div className="pt-4">
          <button
            onClick={onSos}
            className="relative w-full overflow-hidden rounded-xl p-4 bg-emergency text-primary-fg glow-red active:scale-[0.98] transition-transform"
            style={{ background: 'radial-gradient(circle at 30% 20%, #FF5050, #C01818 75%)' }}
          >
            <div className="absolute inset-0 ring-2 ring-emergency/50 rounded-xl ring-expand pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-fg/15 grid place-items-center">
                <Zap className="h-5 w-5" fill="currentColor" strokeWidth={2} />
              </div>
              <div className="text-left">
                <div className="font-display text-[16px] font-bold tracking-widest-2 leading-none">TRIGGER SOS</div>
                <div className="font-mono text-[9px] tracking-widest-2 uppercase opacity-80 mt-1">Hold · Multi-step</div>
              </div>
            </div>
          </button>
        </div>

        <div className="pt-6 px-3 pb-2 font-mono text-[9px] tracking-widest-2 text-muted-fg uppercase">System</div>
        {[
          { label: "Skills Library", icon: Shield },
          { label: "Settings", icon: Settings },
        ].map((s) => (
          <button key={s.label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-fg hover:text-primary-fg hover:bg-elevated transition-colors text-left">
            <s.icon className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-[13px] font-medium">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="border-t border-subtle p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emergency to-orange grid place-items-center font-display font-bold text-[12px] text-primary-fg ring-1 ring-emergency/40">
            MC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-primary-fg leading-tight truncate">Maya Chen</div>
            <div className="font-mono text-[10px] text-safe tracking-wider uppercase">● On-call</div>
          </div>
          <button className="h-8 w-8 grid place-items-center rounded-md text-muted-fg hover:text-primary-fg hover:bg-elevated transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
