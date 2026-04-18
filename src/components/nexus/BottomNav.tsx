import { Home, Map, Shield, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavScreen = "dashboard" | "map" | "sos" | "alert" | "profile";

const items: { id: NavScreen; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "HOME", icon: Home },
  { id: "map", label: "MAP", icon: Map },
  { id: "sos", label: "SOS", icon: Zap },
  { id: "alert", label: "OPERATIONS", icon: Shield },
  { id: "profile", label: "PROFILE", icon: User },
];

export const BottomNav = ({ active, onChange }: { active: NavScreen; onChange: (id: NavScreen) => void }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-nav border-t border-subtle"
         style={{ background: 'hsl(var(--bg-surface) / 0.92)' }}>
      <div className="mx-auto max-w-[430px] px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-end justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          if (item.id === "sos") {
            return (
              <button
                key={item.id}
                onClick={() => onChange("sos")}
                className="relative -mt-6 h-14 w-14 rounded-full bg-emergency grid place-items-center glow-red transition-transform active:scale-95 hover:scale-105"
                aria-label="Trigger SOS"
              >
                <span className="absolute inset-0 rounded-full ring-2 ring-emergency/40 ring-expand" />
                <Zap className="h-6 w-6 text-primary-fg" strokeWidth={2.5} fill="currentColor" />
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[44px] min-h-[44px] justify-center transition-colors"
            >
              <Icon
                className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-fg" : "text-muted-fg")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "font-mono text-[9px] tracking-widest-2 uppercase transition-opacity",
                isActive ? "text-primary-fg opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
