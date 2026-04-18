import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StatusBar } from "@/components/nexus/StatusBar";
import { BottomNav, type NavScreen } from "@/components/nexus/BottomNav";
import { DesktopSidebar } from "@/components/nexus/DesktopSidebar";
import { DesktopTopBar } from "@/components/nexus/DesktopTopBar";
import { ResponderPanel } from "@/components/nexus/ResponderPanel";
import { Dashboard } from "@/screens/Dashboard";
import { EmergencyTrigger } from "@/screens/EmergencyTrigger";
import { LiveMap } from "@/screens/LiveMap";
import { IncomingAlert } from "@/screens/IncomingAlert";
import { Profile } from "@/screens/Profile";
import { ActiveTracking } from "@/screens/ActiveTracking";
import { Operations } from "@/screens/Operations";
import { toast } from "sonner";
import SkillsLibrary from "@/screens/SkillsLibrary";
import Settings from "@/screens/Settings";
import type { IncidentRow } from "@/hooks/resq";

type Screen = NavScreen | "trigger" | "tracking" | "skills" | "settings";

const titles: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: { title: "MISSION CONTROL", subtitle: "Emergency Quick-Action Node" },
  map: { title: "LIVE MAP", subtitle: "Real-time responder tracking" },
  sos: { title: "EMERGENCY REPORT", subtitle: "Multi-step incident dispatch" },
  trigger: { title: "EMERGENCY REPORT", subtitle: "Multi-step incident dispatch" },
  tracking: { title: "ACTIVE INCIDENT", subtitle: "Help is on the way · Tracking responders" },
  alert: { title: "OPERATIONS", subtitle: "Live sector activity & stats" },
  profile: { title: "RESPONDER PROFILE", subtitle: "Skills · Reputation · Availability" },
  skills: { title: "SKILLS LIBRARY", subtitle: "Live skill registry" },
  settings: { title: "SETTINGS", subtitle: "Profile, emergency contacts, and account" },
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeIncident, setActiveIncident] = useState<IncidentRow | null>(null);

  const handleNav = (id: NavScreen) => {
    if (id === "sos") setScreen("trigger");
    else setScreen(id);
  };

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <Dashboard onSos={() => setScreen("trigger")} />;
      case "trigger":
        return (
          <EmergencyTrigger
            onBack={() => setScreen("dashboard")}
            onSent={(incident) => {
              if (incident) setActiveIncident(incident);
              toast.success("Alert dispatched", { description: "Emergency synced. Waiting for responders..." });
              setScreen("tracking");
            }}
          />
        );
      case "tracking":
        return (
          <ActiveTracking
            incident={activeIncident}
            onResolve={() => {
              toast("Emergency resolved", { description: "All responders have been notified" });
              setScreen("dashboard");
            }}
          />
        );
      case "map":
        return <LiveMap />;
      case "skills":
        return <SkillsLibrary />;
      case "settings":
        return <Settings />;
      case "alert":
        return <Operations />;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  const navActive: NavScreen =
    screen === "trigger" || screen === "tracking" ? "sos" :
    screen === "skills" || screen === "settings" ? "profile" :
    (screen as NavScreen);
  const meta = titles[screen] || titles.dashboard;

  return (
    <div className="relative min-h-screen bg-void">
      {/* ============== MOBILE / TABLET (< lg) ============== */}
      <div className="lg:hidden relative z-10 mx-auto max-w-[430px] min-h-screen">
        {screen !== "alert" && screen !== "trigger" && (
          <StatusBar
            onOpenSettings={() => setScreen("settings")}
            onOpenSkills={() => setScreen("skills")}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.main
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderScreen()}
          </motion.main>
        </AnimatePresence>
        <BottomNav active={navActive} onChange={handleNav} />
      </div>

      {/* ============== DESKTOP (>= lg) ============== */}
      <div className="hidden lg:flex min-h-screen w-full">
        <DesktopSidebar
          active={navActive}
          onChange={handleNav}
          onSos={() => setScreen("trigger")}
          onOpenSettings={() => setScreen("settings")}
          onOpenSkills={() => setScreen("skills")}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <DesktopTopBar title={meta.title} subtitle={meta.subtitle} />

          <div className="flex-1 flex min-h-0">
            {/* Center: stage + screen content */}
            <div className="flex-1 flex min-w-0">
              {/* Screen detail column */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: responder ops panel */}
            <ResponderPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
