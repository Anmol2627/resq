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
    <nav
      className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-nav border-t border-subtle"
      style={{ background: "hsl(var(--bg-surface) / 0.92)" }}
    >
      <div className="mx-auto max-w-[430px] grid grid-cols-5 items-end gap-0 px-1 sm:px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          if (item.id === "sos") {
            return (
              <div key={item.id} className="flex justify-center min-h-[52px]">
                <button
                  type="button"
                  onClick={() => onChange("sos")}
                  className="relative -mt-6 h-14 w-14 shrink-0 rounded-full bg-emergency grid place-items-center glow-red transition-transform active:scale-95 hover:scale-105"
                  aria-label="Trigger SOS"
                >
                  <span className="absolute inset-0 rounded-full ring-2 ring-emergency/40 ring-expand" />
                  <Zap className="h-6 w-6 text-primary-fg" strokeWidth={2.5} fill="currentColor" />
                </button>
              </div>
            );
          }

          return (
            <div key={item.id} className="flex justify-center pb-1 min-h-[48px]">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className="flex flex-col items-center justify-end gap-0.5 w-full max-w-[72px] py-1 transition-colors"
              >
                <Icon
                  className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-fg" : "text-muted-fg")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "font-mono text-[8px] sm:text-[9px] tracking-widest-2 uppercase leading-none min-h-[10px]",
                    isActive ? "text-primary-fg opacity-100" : "opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
