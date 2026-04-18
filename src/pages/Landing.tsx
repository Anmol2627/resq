import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Lock,
  MapPin,
  Menu,
  Phone,
  Radio,
  Shield,
  Star,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #05070A; --s1: #0C0F14; --s2: #141820; --s3: #1C2230;
    --red: #FF2D2D; --red-dim: rgba(255,45,45,0.18); --red-glow: rgba(255,45,45,0.4);
    --green: #00D46A; --green-dim: rgba(0,212,106,0.15); --green-glow: rgba(0,212,106,0.35);
    --blue: #4B8EF0; --blue-dim: rgba(75,142,240,0.15);
    --amber: #F59E0B; --amber-dim: rgba(245,158,11,0.15);
    --t1: #EEF2FF; --t2: #8892A4; --t3: #4A5568;
    --bd: rgba(255,255,255,0.07); --bd2: rgba(255,255,255,0.12);
  }
  html { scroll-behavior: smooth; font-size: 16px; }
  body { background: var(--bg); color: var(--t1); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  h1,h2,h3,h4,h5 { font-family: 'Rajdhani', sans-serif; letter-spacing: 0.03em; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }

  .grid-bg {
    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  @keyframes blobDrift {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
    33% { transform: translate(40px,-50px) scale(1.15) rotate(5deg); }
    66% { transform: translate(-30px,30px) scale(0.9) rotate(-3deg); }
  }
  @keyframes float1 {
    0%,100% { transform: translateY(0) rotate(-4deg) rotateX(10deg); }
    50% { transform: translateY(-22px) rotate(-4deg) rotateX(10deg); }
  }
  @keyframes float2 {
    0%,100% { transform: translateY(0) rotate(4deg) rotateX(-8deg); }
    50% { transform: translateY(-16px) rotate(4deg) rotateX(-8deg); }
  }
  @keyframes pingRing {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(3); opacity: 0; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pulseRed {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,45,45,0.4); }
    50% { box-shadow: 0 0 0 12px rgba(255,45,45,0); }
  }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

  .blob { animation: blobDrift 16s ease-in-out infinite; }
  .blob2 { animation: blobDrift 20s ease-in-out infinite reverse; }
  .blob3 { animation: blobDrift 14s ease-in-out infinite 4s; }
  .ui-float { animation: float1 7s ease-in-out infinite; }
  .ui-float2 { animation: float2 9s ease-in-out infinite 1.5s; }
  .ping-ring { animation: pingRing 2s ease-out infinite; }

  .btn-red {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--red); color: #fff;
    padding: 13px 28px; border-radius: 9px;
    font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px;
    letter-spacing: 1.2px; text-transform: uppercase; border: none; cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 0 24px var(--red-glow), 0 4px 16px rgba(0,0,0,0.4);
  }
  .btn-red:hover { transform: scale(1.04) translateY(-1px); box-shadow: 0 0 40px rgba(255,45,45,0.55), 0 8px 24px rgba(0,0,0,0.5); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--t1);
    padding: 13px 28px; border-radius: 9px;
    font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 15px;
    letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--bd2); transition: all 0.18s ease;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.06); transform: translateY(-1px); }

  .glass-card {
    background: var(--s1); border: 1px solid var(--bd);
    border-radius: 16px; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-card:hover { transform: translateY(-5px); border-color: var(--bd2); box-shadow: 0 12px 48px rgba(0,0,0,0.5); }

  .inp {
    width: 100%; background: var(--s2); border: 1px solid var(--bd);
    color: var(--t1); padding: 12px 16px; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .inp:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(255,45,45,0.18); }
  .inp::placeholder { color: var(--t3); }

  .ticker-track { animation: ticker 32s linear infinite; white-space: nowrap; }
  .ticker-track:hover { animation-play-state: paused; }

  .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .text-green-glow { color: var(--green); text-shadow: 0 0 32px var(--green-glow), 0 0 64px rgba(0,212,106,0.2); }
  .dot-live { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulseRed 2s ease-in-out infinite; }

  .auth-tab { padding: 10px 24px; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; border: none; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
  .auth-tab.active { background: var(--red); color: #fff; box-shadow: 0 0 20px var(--red-glow); }
  .auth-tab:not(.active) { background: transparent; color: var(--t2); }
  .auth-tab:not(.active):hover { color: var(--t1); background: var(--s2); }
`;

function useLandingGlobalStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-resq-landing", "true");
    style.textContent = FONTS + CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);
}

function Counter({ to, suffix = "", duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function AlertCard({ className }: { className?: string }) {
  return (
    <div
      className={`glass-card ${className ?? ""}`}
      style={{ padding: "18px 20px", width: 280, position: "absolute", zIndex: 2, pointerEvents: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--red-dim)",
            border: "1px solid var(--red-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={18} color="var(--red)" />
        </div>
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 14, color: "var(--t1)", letterSpacing: "0.5px" }}>
            MEDICAL EMERGENCY
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="dot-live" style={{ animation: "pulseRed 1.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--green)" }}>LIVE · 0.3km away</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["CPR", "AED", "First Aid"].map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 5,
              background: "var(--s2)",
              border: "1px solid var(--bd)",
              color: "var(--blue)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <button className="btn-red" style={{ width: "100%", padding: "9px", fontSize: 13, justifyContent: "center" }}>
        RESPOND NOW <ArrowRight size={13} />
      </button>
    </div>
  );
}

function ResponderCard({ className }: { className?: string }) {
  return (
    <div className={`glass-card ${className ?? ""}`} style={{ padding: "16px 18px", width: 230, position: "absolute", zIndex: 2, pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#1a2a4a,#0e1a30)",
            border: "2px solid var(--blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Rajdhani",
            fontWeight: 700,
            fontSize: 15,
            color: "var(--blue)",
          }}
        >
          AK
        </div>
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 13, color: "var(--t1)" }}>Arjun K.</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--green)" }}>● AVAILABLE</div>
        </div>
        <Award size={16} color="var(--amber)" style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {["EMT", "CPR", "Trauma"].map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 4,
              background: "var(--green-dim)",
              border: "1px solid var(--green-glow)",
              color: "var(--green)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={11} fill={i <= 5 ? "var(--amber)" : "none"} color="var(--amber)" />
        ))}
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--t2)", marginLeft: 4 }}>4.98</span>
      </div>
    </div>
  );
}

function Navbar({ onLogin, onGetStarted }: { onLogin: () => void; onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "How it Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Responders", href: "#responders" },
    { label: "About", href: "#about" },
  ];

  return (
    <>
      <nav
        className="nav-blur"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(5,7,10,0.88)" : "rgba(5,7,10,0.4)",
          borderBottom: scrolled ? "1px solid var(--bd)" : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Rajdhani", fontWeight: 700, fontSize: 24, letterSpacing: "2px", textDecoration: "none" }}>
            <span style={{ color: "var(--t1)" }}>RESQ</span>
            <span style={{ color: "var(--red)", textShadow: "0 0 16px var(--red-glow)" }}>+</span>
          </a>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{ color: "var(--t2)", fontFamily: "DM Sans", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", letterSpacing: "0.3px" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "var(--t1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "var(--t2)";
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-outline" style={{ padding: "8px 20px", fontSize: 13 }} onClick={onLogin}>
              Login
            </button>
            <button className="btn-red" style={{ padding: "8px 20px", fontSize: 13 }} onClick={onGetStarted}>
              Get Started
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ display: "none", background: "none", border: "1px solid var(--bd)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--t1)" }}
              className="mobile-btn"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-btn { display: flex !important; }
          }
        `}</style>
      </nav>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(5,7,10,0.97)",
          backdropFilter: "blur(20px)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
        }}
        aria-hidden={!mobileOpen}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 24, color: "var(--t1)", letterSpacing: "2px" }}>
            RESQ<span style={{ color: "var(--red)" }}>+</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "var(--s2)", border: "1px solid var(--bd)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--t1)" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        {links.map((l) => (
          <a
            key={l.label}
            onClick={() => setMobileOpen(false)}
            href={l.href}
            style={{
              fontFamily: "Rajdhani",
              fontWeight: 600,
              fontSize: 26,
              color: "var(--t1)",
              textDecoration: "none",
              padding: "14px 0",
              borderBottom: "1px solid var(--bd)",
              letterSpacing: "1px",
            }}
          >
            {l.label}
          </a>
        ))}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            className="btn-outline"
            style={{ justifyContent: "center" }}
            onClick={() => {
              setMobileOpen(false);
              onLogin();
            }}
          >
            Login
          </button>
          <button
            className="btn-red"
            style={{ justifyContent: "center" }}
            onClick={() => {
              setMobileOpen(false);
              onGetStarted();
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

function Hero({ onDemo, onHow }: { onDemo: () => void; onHow: () => void }) {
  return (
    <section className="grid-bg" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: 80 }}>
      {[
        { className: "blob", color: "rgba(255,45,45,0.12)", size: 600, top: "-10%", left: "-8%", blur: 80 },
        { className: "blob2", color: "rgba(0,212,106,0.08)", size: 500, top: "30%", right: "-5%", blur: 70 },
        { className: "blob3", color: "rgba(75,142,240,0.08)", size: 400, bottom: "-5%", left: "25%", blur: 60 },
      ].map((b, i) => (
        <div
          key={i}
          className={b.className}
          style={{
            position: "absolute",
            borderRadius: "50%",
            width: b.size,
            height: b.size,
            background: b.color,
            filter: `blur(${b.blur}px)`,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="ui-float" style={{ position: "absolute", right: "8%", top: "18%", zIndex: 2 }}>
        <AlertCard />
      </div>
      <div className="ui-float2" style={{ position: "absolute", right: "15%", bottom: "20%", zIndex: 2 }}>
        <ResponderCard />
      </div>
      <div style={{ position: "absolute", right: "28%", top: "55%", zIndex: 1 }}>
        <div style={{ position: "relative", width: 14, height: 14 }}>
          <div className="ping-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--red)" }} />
          <div className="ping-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--red)", animationDelay: "0.5s" }} />
          <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "var(--red)" }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 5 }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--s1)", border: "1px solid var(--bd2)", borderRadius: 100, padding: "7px 16px", marginBottom: 28, animation: "fadeInUp 0.6s ease both" }}>
            <div className="dot-live" />
            <span className="mono" style={{ fontSize: 11, color: "var(--t2)", letterSpacing: "1.5px" }}>
              REAL-TIME EMERGENCY NETWORK
            </span>
          </div>

          <h1 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "clamp(52px, 7vw, 88px)", lineHeight: 1.0, letterSpacing: "1px", marginBottom: 28, textTransform: "uppercase", animation: "fadeInUp 0.6s ease 0.15s both" }}>
            <span style={{ color: "var(--t1)" }}>
              THE FASTEST
              <br />
              WAY TO GET
              <br />
              HELP IS{" "}
            </span>
            <span className="text-green-glow">
              ALREADY
              <br />
              NEARBY
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "var(--t2)", lineHeight: 1.7, maxWidth: 520, marginBottom: 40, animation: "fadeInUp 0.6s ease 0.28s both" }}>
            RESQ+ connects people in emergencies with verified, skilled responders in their immediate vicinity — in seconds, not minutes.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.4s both" }}>
            <button className="btn-red" style={{ fontSize: 15 }} onClick={onDemo}>
              <Radio size={16} /> Trigger Demo Alert
            </button>
            <button className="btn-outline" onClick={onHow}>
              See How It Works <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 28, marginTop: 52, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.52s both" }}>
            {[
              { icon: <Zap size={15} color="var(--amber)" />, label: "Avg Response", val: "<90 secs" },
              { icon: <Users size={15} color="var(--blue)" />, label: "Active Responders", val: "12,400+" },
              { icon: <Shield size={15} color="var(--green)" />, label: "Verified & Secure", val: "E2E Encrypted" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--s2)", border: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "center" }}>{t.icon}</div>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--t1)", fontWeight: 600 }}>{t.val}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>{t.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = useMemo(
    () => [
      { val: 12400, suffix: "+", label: "VERIFIED RESPONDERS" },
      { val: 87, suffix: "s", label: "AVG RESPONSE TIME" },
      { val: 94200, suffix: "+", label: "INCIDENTS RESOLVED" },
      { val: 99, suffix: "%", label: "PLATFORM UPTIME" },
      { val: 138, suffix: "", label: "CITIES COVERED" },
    ],
    [],
  );
  const items = [...stats, ...stats];
  return (
    <div style={{ background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", overflow: "hidden", padding: "18px 0" }}>
      <div className="ticker-track" style={{ display: "inline-flex", gap: 0 }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 40, padding: "0 48px", borderRight: "1px solid var(--bd)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--t1)" }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "1.5px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SIGNUP_STEPS = ["Basic Info", "Medical Info", "Emergency Contacts", "Your Role"] as const;

type EmergencyContact = { name: string; relationship: string; phone: string };

const DEFAULT_SKILLS = [
  "CPR",
  "First Aid",
  "Nursing",
  "EMT",
  "Paramedic",
  "Doctor",
  "Fire Safety",
  "Lifeguard",
  "Disaster Response",
] as const;

function AuthSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "signup" ? "signup" : "login";

  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const [signupStep, setSignupStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [role, setRole] = useState<"victim" | "responder" | "both" | "">("");
  const [signup, setSignup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    bloodType: "",
    medicalIssues: "",
    allergies: "",
    chronicConditions: "",
    medications: "",
    skills: [] as string[],
    emergencyContacts: [
      { name: "", relationship: "", phone: "" },
      { name: "", relationship: "", phone: "" },
      { name: "", relationship: "", phone: "" },
    ] as EmergencyContact[],
  });

  useEffect(() => {
    if (tabParam === "login" || tabParam === "signup") setTab(tabParam);
  }, [tabParam]);

  const setTabSafe = useCallback(
    (next: "login" | "signup") => {
      setTab(next);
      setSearchParams((prev) => {
        const np = new URLSearchParams(prev);
        np.set("tab", next);
        return np;
      });
      if (next === "login") setSignupStep(0);
    },
    [setSearchParams],
  );

  const validateSignupStep = useCallback((): string | null => {
    if (signupStep === 0) {
      if (!signup.firstName.trim()) return "Please enter your first name.";
      if (!signup.lastName.trim()) return "Please enter your last name.";
      if (!signup.email.trim()) return "Please enter your email.";
      if (!signup.dob.trim()) return "Please enter your date of birth.";
      if (!signup.phone.trim()) return "Please enter your phone number.";
      if (signup.password.length < 8) return "Password must be at least 8 characters.";
    }
    if (signupStep === 2) {
      const c1 = signup.emergencyContacts[0];
      if (!c1.name.trim() || !c1.relationship.trim() || !c1.phone.trim()) return "Please complete Emergency Contact 1.";
    }
    if (signupStep === 3) {
      if (!role) return "Please select your role.";
    }
    return null;
  }, [role, signup, signupStep]);

  const onLogin = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Auth not configured", { description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env`, then restart the dev server." });
      return;
    }
    if (!loginEmail.trim() || !loginPassword) {
      toast.error("Missing login details", { description: "Please enter email and password." });
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPassword });
      if (error) throw error;
      if (!data.session) {
        toast("Check your email", { description: "If email confirmation is enabled, confirm your email then login." });
        return;
      }
      toast.success("Welcome back", { description: "Redirecting to your dashboard..." });
      navigate("/app");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      toast.error("Login failed", { description: msg });
    } finally {
      setBusy(false);
    }
  }, [loginEmail, loginPassword, navigate]);

  const onGuestAccess = useCallback(() => {
    if (!isSupabaseConfigured || !supabase) {
      toast("Guest mode enabled", {
        description: "SOS works, but incident sync may fail until Supabase is configured.",
      });
      navigate("/app?guest=1");
      return;
    }

    supabase.auth
      .signInAnonymously()
      .then(({ error }) => {
        if (error) {
          toast("Guest mode limited", {
            description: "Anonymous auth failed, so SOS may not sync across devices.",
          });
        } else {
          toast("Guest mode enabled", {
            description: "You can trigger SOS instantly and incidents will sync live.",
          });
        }
        navigate("/app?guest=1");
      })
      .catch(() => {
        navigate("/app?guest=1");
      });
  }, [navigate]);

  const onCreateAccount = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Auth not configured", { description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env`, then restart the dev server." });
      return;
    }
    const err = validateSignupStep();
    if (err) {
      toast.error("Fix this step", { description: err });
      return;
    }
    setBusy(true);
    try {
      const profile = {
        first_name: signup.firstName.trim(),
        last_name: signup.lastName.trim(),
        phone: signup.phone.trim(),
        dob: signup.dob,
        role,
        blood_type: signup.bloodType || null,
        allergies: signup.allergies || null,
        chronic_conditions: signup.chronicConditions || null,
        medications: signup.medications || null,
        medical_issues: signup.medicalIssues || null,
        skills: signup.skills,
      };

      const { data, error } = await supabase.auth.signUp({
        email: signup.email.trim(),
        password: signup.password,
        options: {
          data: {
            ...profile,
            emergency_contacts: signup.emergencyContacts.map((c, idx) => ({
              position: idx + 1,
              name: c.name.trim(),
              relationship: c.relationship.trim(),
              phone: c.phone.trim(),
            })),
          },
        },
      });
      if (error) throw error;

      const userId = data.user?.id;
      const hasSession = !!data.session;
      if (userId && hasSession) {
        const { error: profileErr } = await supabase
          .from("profiles")
          .upsert({ id: userId, email: signup.email.trim(), ...profile });
        if (profileErr) throw profileErr;

        const contactsPayload = signup.emergencyContacts
          .map((c, idx) => ({
            user_id: userId,
            position: idx + 1,
            name: c.name.trim(),
            relationship: c.relationship.trim(),
            phone: c.phone.trim(),
          }))
          .filter((c) => c.name && c.relationship && c.phone);
        const { error: contactsErr } = await supabase.from("emergency_contacts").upsert(contactsPayload, {
          onConflict: "user_id,position",
        });
        if (contactsErr) throw contactsErr;
      }

      if (!hasSession) {
        toast.success("Account created", { description: "Please verify your email, then login." });
        setTabSafe("login");
        return;
      }

      toast.success("Account created", { description: "Redirecting to your dashboard..." });
      navigate("/app");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Signup failed";
      toast.error("Signup failed", { description: msg });
    } finally {
      setBusy(false);
    }
  }, [navigate, role, setTabSafe, signup, validateSignupStep]);

  const onContinue = useCallback(async () => {
    if (signupStep < SIGNUP_STEPS.length - 1) {
      const err = validateSignupStep();
      if (err) {
        toast.error("Fix this step", { description: err });
        return;
      }
      setSignupStep((s) => s + 1);
      return;
    }
    await onCreateAccount();
  }, [onCreateAccount, signupStep, validateSignupStep]);

  const toggleSkill = useCallback((skill: string) => {
    setSignup((s) => {
      const has = s.skills.includes(skill);
      return { ...s, skills: has ? s.skills.filter((x) => x !== skill) : [...s.skills, skill] };
    });
  }, []);

  return (
    <section ref={sectionRef} id="auth" style={{ padding: "120px 24px", background: "var(--bg)", borderTop: "1px solid var(--bd)" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 14 }}>
            ACCESS THE PLATFORM
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)" }}>
            {tab === "login" ? "Welcome Back" : "Join RESQ+"}
          </h2>
        </div>

        <div className="glass-card" style={{ padding: "32px", background: "var(--s1)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 32, background: "var(--s2)", padding: 5, borderRadius: 11 }}>
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setTabSafe("login")} type="button">
              Login
            </button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setTabSafe("signup")} type="button">
              Sign Up
            </button>
          </div>

          {tab === "login" ? (
            <div style={{ animation: "scaleIn 0.3s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--t3)", display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>EMAIL ADDRESS</label>
                  <input className="inp" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--t3)", display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>PASSWORD</label>
                  <div style={{ position: "relative" }}>
                    <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••" style={{ paddingRight: 44 }} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <button onClick={() => setShowPass((s) => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--t3)" }} type="button" aria-label={showPass ? "Hide password" : "Show password"}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button className="btn-red" style={{ width: "100%", justifyContent: "center", marginTop: 6, opacity: busy ? 0.7 : 1 }} onClick={onLogin} disabled={busy} type="button">
                  {busy ? "Logging in..." : "Login to Dashboard"}
                </button>
                <button
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "center", padding: "10px 14px" }}
                  onClick={onGuestAccess}
                  type="button"
                >
                  Continue as Guest (SOS only)
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <span style={{ fontSize: 13, color: "var(--t3)" }}>Don't have an account? </span>
                <button onClick={() => setTabSafe("signup")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 13, fontFamily: "DM Sans" }} type="button">
                  Sign Up Free
                </button>
              </div>
            </div>
          ) : (
            <div style={{ animation: "scaleIn 0.3s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                {SIGNUP_STEPS.map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < SIGNUP_STEPS.length - 1 ? 1 : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontFamily: "JetBrains Mono",
                          fontWeight: 600,
                          background: i < signupStep ? "var(--green)" : i === signupStep ? "var(--red)" : "var(--s2)",
                          border: `1.5px solid ${i < signupStep ? "var(--green)" : i === signupStep ? "var(--red)" : "var(--bd)"}`,
                          color: i <= signupStep ? "#fff" : "var(--t3)",
                          boxShadow: i === signupStep ? "0 0 14px var(--red-glow)" : "none",
                          transition: "all 0.3s",
                        }}
                      >
                        {i < signupStep ? <CheckCircle size={13} /> : i + 1}
                      </div>
                    </div>
                    {i < SIGNUP_STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < signupStep ? "var(--green)" : "var(--bd)", margin: "0 6px", transition: "background 0.3s" }} />}
                  </div>
                ))}
              </div>

              <div className="mono" style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "1.5px", marginBottom: 18 }}>
                STEP {signupStep + 1} OF {SIGNUP_STEPS.length} — {SIGNUP_STEPS[signupStep].toUpperCase()}
              </div>

              {signupStep === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>FIRST NAME</label>
                      <input className="inp" placeholder="Arjun" value={signup.firstName} onChange={(e) => setSignup((s) => ({ ...s, firstName: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>LAST NAME</label>
                      <input className="inp" placeholder="Kumar" value={signup.lastName} onChange={(e) => setSignup((s) => ({ ...s, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>EMAIL</label>
                    <input className="inp" type="email" placeholder="arjun@example.com" value={signup.email} onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>DATE OF BIRTH</label>
                      <input className="inp" type="date" value={signup.dob} onChange={(e) => setSignup((s) => ({ ...s, dob: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>PHONE NUMBER</label>
                      <input className="inp" type="tel" placeholder="+91 9876 543 210" value={signup.phone} onChange={(e) => setSignup((s) => ({ ...s, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>PASSWORD</label>
                    <input className="inp" type="password" placeholder="Min. 8 characters" value={signup.password} onChange={(e) => setSignup((s) => ({ ...s, password: e.target.value }))} />
                  </div>
                </div>
              )}

              {signupStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>SKILLS (SELECT ALL THAT APPLY)</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {DEFAULT_SKILLS.map((s) => {
                        const selected = signup.skills.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSkill(s)}
                            style={{
                              fontSize: 12,
                              padding: "6px 10px",
                              borderRadius: 8,
                              background: selected ? "var(--green-dim)" : "var(--s2)",
                              border: `1px solid ${selected ? "var(--green)" : "var(--bd)"}`,
                              color: selected ? "var(--green)" : "var(--t2)",
                              cursor: "pointer",
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>BLOOD TYPE (OPTIONAL)</label>
                    <select className="inp" value={signup.bloodType} onChange={(e) => setSignup((s) => ({ ...s, bloodType: e.target.value }))}>
                      <option value="">Select blood type</option>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>ANY MEDICAL ISSUES / NOTES</label>
                    <input className="inp" placeholder="e.g. Asthma, epilepsy, implants (or None)" value={signup.medicalIssues} onChange={(e) => setSignup((s) => ({ ...s, medicalIssues: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>KNOWN ALLERGIES</label>
                    <input className="inp" placeholder="e.g. Penicillin, Latex (or None)" value={signup.allergies} onChange={(e) => setSignup((s) => ({ ...s, allergies: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>CHRONIC CONDITIONS</label>
                    <input className="inp" placeholder="e.g. Diabetes, Hypertension (or None)" value={signup.chronicConditions} onChange={(e) => setSignup((s) => ({ ...s, chronicConditions: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>CURRENT MEDICATIONS</label>
                    <input className="inp" placeholder="List medications or None" value={signup.medications} onChange={(e) => setSignup((s) => ({ ...s, medications: e.target.value }))} />
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} style={{ background: "var(--s2)", borderRadius: 10, padding: "14px", border: "1px solid var(--bd)" }}>
                      <div className="mono" style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "1.5px", marginBottom: 12 }}>
                        EMERGENCY CONTACT {idx + 1}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input
                          className="inp"
                          placeholder="Full name"
                          value={signup.emergencyContacts[idx].name}
                          onChange={(e) =>
                            setSignup((s) => {
                              const ec = [...s.emergencyContacts];
                              ec[idx] = { ...ec[idx], name: e.target.value };
                              return { ...s, emergencyContacts: ec };
                            })
                          }
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <input
                            className="inp"
                            placeholder="Relationship"
                            value={signup.emergencyContacts[idx].relationship}
                            onChange={(e) =>
                              setSignup((s) => {
                                const ec = [...s.emergencyContacts];
                                ec[idx] = { ...ec[idx], relationship: e.target.value };
                                return { ...s, emergencyContacts: ec };
                              })
                            }
                          />
                          <input
                            className="inp"
                            type="tel"
                            placeholder="Phone number"
                            value={signup.emergencyContacts[idx].phone}
                            onChange={(e) =>
                              setSignup((s) => {
                                const ec = [...s.emergencyContacts];
                                ec[idx] = { ...ec[idx], phone: e.target.value };
                                return { ...s, emergencyContacts: ec };
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {signupStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--t2)", marginBottom: 6 }}>Select your role on the platform:</div>
                  {[
                    { id: "victim", label: "Citizen / Potential Victim", desc: "I want to be able to call for help fast", icon: <Phone size={18} /> },
                    { id: "responder", label: "Trained Responder", desc: "I have medical or emergency skills", icon: <Heart size={18} /> },
                    { id: "both", label: "Both", desc: "I can both call for help and respond", icon: <Users size={18} /> },
                  ].map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id as typeof role)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: `1.5px solid ${role === r.id ? "var(--red)" : "var(--bd)"}`,
                        background: role === r.id ? "var(--red-dim)" : "var(--s2)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ color: role === r.id ? "var(--red)" : "var(--t3)" }}>{r.icon}</div>
                      <div>
                        <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 15, color: "var(--t1)" }}>{r.label}</div>
                        <div style={{ fontSize: 12, color: "var(--t3)" }}>{r.desc}</div>
                      </div>
                      {role === r.id && <CheckCircle size={16} color="var(--red)" style={{ marginLeft: "auto" }} />}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                {signupStep > 0 && (
                  <button onClick={() => setSignupStep((s) => s - 1)} className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: "11px" }} type="button" disabled={busy}>
                    Back
                  </button>
                )}
                <button onClick={onContinue} className="btn-red" style={{ flex: 2, justifyContent: "center", padding: "11px", opacity: busy ? 0.7 : 1 }} type="button" disabled={busy}>
                  {signupStep === SIGNUP_STEPS.length - 1 ? (busy ? "Creating..." : "Create Account") : "Continue"} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "var(--s1)", borderTop: "1px solid var(--bd)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 26, letterSpacing: "2px", marginBottom: 14 }}>
              RESQ<span style={{ color: "var(--red)" }}>+</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.7, maxWidth: 320 }}>
              Real-time, skill-based emergency response. Connecting trained responders to people in need — in seconds.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[Shield, Activity, Radio, Wifi, Lock, Bell].map((Icon, i) => (
                <div
                  key={i}
                  style={{ width: 36, height: 36, borderRadius: 9, background: "var(--s2)", border: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--red)";
                    e.currentTarget.style.background = "var(--red-dim)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--bd)";
                    e.currentTarget.style.background = "var(--s2)";
                  }}
                >
                  <Icon size={15} color="var(--t2)" />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Features", "Responder Network", "API"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 13, letterSpacing: "2px", color: "var(--t2)", marginBottom: 16 }}>{col.title}</div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{ display: "block", fontSize: 14, color: "var(--t3)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "var(--t1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = "var(--t3)";
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--bd)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--t3)" }}>
            © 2026 RESQ+ Technologies Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="dot-live" />
            <span className="mono" style={{ fontSize: 11, color: "var(--green)" }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer div[style*="grid-template-columns: 2fr"]{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}

export default function Landing() {
  useLandingGlobalStyles();
  const authRef = useRef<HTMLElement | null>(null);

  const scrollToAuth = useCallback((tab: "login" | "signup") => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
    authRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onDemo = useCallback(() => {
    toast("Demo alert", { description: "For now this is a UI demo — we’ll wire real SOS next." });
    scrollToAuth("signup");
  }, [scrollToAuth]);

  return (
    <>
      <Navbar onLogin={() => scrollToAuth("login")} onGetStarted={() => scrollToAuth("signup")} />
      <main>
        <Hero onDemo={onDemo} onHow={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} />
        <StatsBar />

        <section id="how" style={{ padding: "90px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 16 }}>
              SYSTEM FLOW
            </div>
            <h2 style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.05 }}>
              From Panic to <span style={{ color: "var(--green)", textShadow: "0 0 24px var(--green-glow)" }}>Response</span>
            </h2>
            <p style={{ color: "var(--t2)", fontSize: 16, maxWidth: 520, margin: "18px auto 0", lineHeight: 1.7 }}>
              Trigger SOS → we match nearby skilled responders → your emergency contacts are notified.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { icon: <AlertTriangle size={22} />, title: "Trigger SOS", desc: "One tap shares your live location and emergency type." },
              { icon: <MapPin size={22} />, title: "Match Nearby", desc: "Skill-based matching finds responders close to you." },
              { icon: <Bell size={22} />, title: "Notify Contacts", desc: "Your 3 emergency contacts get instant updates on every SOS." },
              { icon: <Heart size={22} />, title: "Respond & Track", desc: "Live status updates until the incident is resolved." },
            ].map((s) => (
              <div key={s.title} className="glass-card" style={{ padding: 22, background: "var(--s1)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--s2)", border: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)", marginBottom: 14 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 18, letterSpacing: "0.8px", color: "var(--t1)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" style={{ padding: "90px 24px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 16 }}>
                PLATFORM CAPABILITIES
              </div>
              <h2 style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.05 }}>
                Built for <span style={{ color: "var(--red)", textShadow: "0 0 24px var(--red-glow)" }}>High Stakes</span> Moments
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {[
                { icon: <MapPin size={22} />, color: "var(--red)", title: "Hyper-Local Matching", desc: "Geo-indexed matching finds the closest qualified responder in real time." },
                { icon: <Shield size={22} />, color: "var(--blue)", title: "Verified Responders", desc: "Skills and identity can be verified and tracked over time." },
                { icon: <Lock size={22} />, color: "var(--amber)", title: "Privacy First", desc: "Only essential info is shared during SOS with consent-driven controls." },
              ].map((f) => (
                <div key={f.title} className="glass-card" style={{ padding: 24, background: "var(--bg)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `${f.color}15`, border: `1px solid ${f.color}35`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 16 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 19, letterSpacing: "0.8px", color: "var(--t1)", marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="responders" style={{ padding: "90px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="glass-card" style={{ padding: 28, background: "var(--s1)", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "center" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--green)", letterSpacing: "3px", marginBottom: 12 }}>
                JOIN THE NETWORK
              </div>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.05, marginBottom: 14 }}>
                Your Skills Can <span style={{ color: "var(--green)", textShadow: "0 0 24px var(--green-glow)" }}>Save</span> Lives
              </h2>
              <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.7, maxWidth: 520 }}>
                Register as a responder (or both) and get matched to nearby emergencies when you’re available.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-red" style={{ justifyContent: "center" }} onClick={() => scrollToAuth("signup")}>
                <Heart size={16} /> Become a Responder
              </button>
              <button className="btn-outline" style={{ justifyContent: "center" }} onClick={() => scrollToAuth("login")}>
                <ChevronRight size={16} /> I already have an account
              </button>
            </div>
          </div>
          <style>{`@media(max-width:768px){section#responders .glass-card{grid-template-columns:1fr!important;}}`}</style>
        </section>

        <section id="about" style={{ padding: "70px 24px 20px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="glass-card" style={{ padding: 24, background: "var(--s1)" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "3px", marginBottom: 10 }}>
              WHY RESQ+
            </div>
            <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.8 }}>
              The goal is simple: get the right help to the right place faster — and keep families informed automatically.
            </p>
          </div>
        </section>

        <AuthSection sectionRef={authRef} />
      </main>
      <Footer />
    </>
  );
}

