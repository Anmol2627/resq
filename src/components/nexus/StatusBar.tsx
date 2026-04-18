import { Bell, Signal, Settings, BookOpen } from "lucide-react";

export const StatusBar = ({
  unread = 3,
  onOpenSettings,
  onOpenSkills,
}: {
  unread?: number;
  onOpenSettings?: () => void;
  onOpenSkills?: () => void;
}) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-[18px] font-bold tracking-widest-2 text-primary-fg">
          RESQ+
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-safe pulse-dot" />
            <span className="absolute inset-0 rounded-full bg-safe blur-[3px] opacity-70" />
          </span>
          <span className="font-mono text-[10px] tracking-widest-2 text-safe uppercase">LIVE</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSkills}
          className="h-9 w-9 grid place-items-center rounded-full bg-elevated border border-subtle hover:border-info/50 transition-colors"
          aria-label="Open skills library"
        >
          <BookOpen className="h-4 w-4 text-secondary-fg" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="h-9 w-9 grid place-items-center rounded-full bg-elevated border border-subtle hover:border-info/50 transition-colors"
          aria-label="Open settings"
        >
          <Settings className="h-4 w-4 text-secondary-fg" strokeWidth={2} />
        </button>
        <Signal className="h-4 w-4 text-secondary-fg" strokeWidth={2.5} />
        <button className="relative h-9 w-9 grid place-items-center rounded-full bg-elevated border border-subtle hover:border-emergency/50 transition-colors">
          <Bell className="h-4 w-4 text-secondary-fg" strokeWidth={2} />
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 grid place-items-center rounded-full bg-emergency text-[9px] font-bold text-primary-fg font-mono">
            {unread}
          </span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emergency to-orange grid place-items-center font-display font-bold text-[12px] text-primary-fg ring-1 ring-emergency/40">
          MC
        </div>
      </div>
    </header>
  );
};
