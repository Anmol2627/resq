import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StatusBar } from "@/components/nexus/StatusBar";
import { BottomNav, type NavScreen } from "@/components/nexus/BottomNav";
import { DesktopSidebar } from "@/components/nexus/DesktopSidebar";
import { DesktopTopBar } from "@/components/nexus/DesktopTopBar";
import { DesktopMapStage } from "@/components/nexus/DesktopMapStage";
import { ResponderPanel } from "@/components/nexus/ResponderPanel";
import { Dashboard } from "@/screens/Dashboard";
import { EmergencyTrigger } from "@/screens/EmergencyTrigger";
import { LiveMap } from "@/screens/LiveMap";
import { IncomingAlert } from "@/screens/IncomingAlert";
import { Profile } from "@/screens/Profile";
import { ActiveTracking } from "@/screens/ActiveTracking";
import { Operations } from "@/screens/Operations";
import { toast } from "sonner";

type Screen = NavScreen | "trigger" | "tracking";

const titles: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: { title: "MISSION CONTROL", subtitle: "Emergency Quick-Action Node" },
  map: { title: "LIVE MAP", subtitle: "Real-time responder tracking" },
  sos: { title: "EMERGENCY REPORT", subtitle: "Multi-step incident dispatch" },
  trigger: { title: "EMERGENCY REPORT", subtitle: "Multi-step incident dispatch" },
  tracking: { title: "ACTIVE INCIDENT", subtitle: "Help is on the way · Tracking responders" },
  alert: { title: "OPERATIONS", subtitle: "Live sector activity & stats" },
  profile: { title: "RESPONDER PROFILE", subtitle: "Skills · Reputation · Availability" },
};

const Index = () => {
  const [screen, setScreen] = useState<Screen>("dashboard");

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
            onSent={() => {
              toast.success("Alert dispatched", { description: "12 responders notified within 2 km" });
              setScreen("tracking");
            }}
          />
        );
      case "tracking":
        return (
          <ActiveTracking
            onResolve={() => {
              toast("Emergency resolved", { description: "All responders have been notified" });
              setScreen("dashboard");
            }}
          />
        );
      case "map":
        return <LiveMap />;
      case "alert":
        return <Operations />;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  const navActive: NavScreen =
    screen === "trigger" || screen === "tracking" ? "sos" : (screen as NavScreen);
  const meta = titles[screen] || titles.dashboard;

  // Hide the extra desktop map stage on the dedicated map screen so the center only contains Leaflet.
  const showDesktopMapStage = screen !== "map";
  const hideDesktopMapStage = !showDesktopMapStage;

  return (
    <div className="relative min-h-screen bg-void">
      {/* ============== MOBILE / TABLET (< lg) ============== */}
      <div className="lg:hidden relative z-10 mx-auto max-w-[430px] min-h-screen">
        {screen !== "alert" && screen !== "trigger" && <StatusBar />}
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
        />

        <div className="flex-1 flex flex-col min-w-0">
          <DesktopTopBar title={meta.title} subtitle={meta.subtitle} />

          <div className="flex-1 flex min-h-0">
            {/* Center: stage + screen content */}
            <div className="flex-1 flex min-w-0">
              {showDesktopMapStage && <DesktopMapStage screen={screen} />}

              {/* Screen detail column */}
              <div className={
                hideDesktopMapStage
                  ? "flex-1 overflow-y-auto"
                  : "w-[440px] shrink-0 border-l border-subtle bg-surface/60 overflow-y-auto h-[calc(100vh-72px)] sticky top-[72px]"
              }>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className={hideDesktopMapStage ? "" : "max-w-[430px] mx-auto"}
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
