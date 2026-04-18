import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, Zap, MapPin, Users, Bell, Lock, Star, ChevronRight,
  Menu, X, CheckCircle, Phone, Heart, ArrowRight, Activity,
  AlertTriangle, Clock, Radio, Wifi, Award, UserCheck, ChevronDown,
  Eye, EyeOff, Plus, Minus
} from "lucide-react";

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

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }

  /* Grid overlay */
  .grid-bg {
    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* Animations */
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
  @keyframes scanLine {
    0% { top: -2px; } 100% { top: 100%; }
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
  @keyframes slideInRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideInLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

  .blob { animation: blobDrift 16s ease-in-out infinite; }
  .blob2 { animation: blobDrift 20s ease-in-out infinite reverse; }
  .blob3 { animation: blobDrift 14s ease-in-out infinite 4s; }
  .ui-float { animation: float1 7s ease-in-out infinite; }
  .ui-float2 { animation: float2 9s ease-in-out infinite 1.5s; }
  .ping-ring { animation: pingRing 2s ease-out infinite; }

  .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .reveal-d1 { transition-delay: 0.1s; } .reveal-d2 { transition-delay: 0.2s; }
  .reveal-d3 { transition-delay: 0.3s; } .reveal-d4 { transition-delay: 0.4s; }
  .reveal-d5 { transition-delay: 0.5s; } .reveal-d6 { transition-delay: 0.6s; }

  /* Buttons */
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

  /* Card */
  .glass-card {
    background: var(--s1); border: 1px solid var(--bd);
    border-radius: 16px; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-card:hover { transform: translateY(-5px); border-color: var(--bd2); box-shadow: 0 12px 48px rgba(0,0,0,0.5); }

  /* Input */
  .inp {
    width: 100%; background: var(--s2); border: 1px solid var(--bd);
    color: var(--t1); padding: 12px 16px; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .inp:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(255,45,45,0.18); }
  .inp::placeholder { color: var(--t3); }

  /* Step connector */
  .step-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--red-dim), var(--bd)); }

  /* Ticker */
  .ticker-track { animation: ticker 32s linear infinite; white-space: nowrap; }
  .ticker-track:hover { animation-play-state: paused; }

  /* Nav */
  .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

  /* Highlight */
  .text-green-glow { color: var(--green); text-shadow: 0 0 32px var(--green-glow), 0 0 64px rgba(0,212,106,0.2); }
  .text-red-accent { color: var(--red); }
  .dot-live { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulseRed 2s ease-in-out infinite; }

  /* Auth tab */
  .auth-tab { padding: 10px 24px; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; border: none; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
  .auth-tab.active { background: var(--red); color: #fff; box-shadow: 0 0 20px var(--red-glow); }
  .auth-tab:not(.active) { background: transparent; color: var(--t2); }
  .auth-tab:not(.active):hover { color: var(--t1); background: var(--s2); }

  /* Step indicator */
  .step-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--bd2); transition: all 0.3s; }
  .step-dot.active { background: var(--red); box-shadow: 0 0 12px var(--red-glow); }
  .step-dot.done { background: var(--green); }
`;

// ── Reveal hook ──────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    el.querySelectorAll(".reveal").forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Floating UI Mockup ────────────────────────────────────────────────────────
function AlertCard({ className }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: "18px 20px", width: 280, position: "absolute", zIndex: 2, pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--red-dim)", border: "1px solid var(--red-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={18} color="var(--red)" />
        </div>
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 14, color: "var(--t1)", letterSpacing: "0.5px" }}>MEDICAL EMERGENCY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="dot-live" style={{ animation: "pulseRed 1.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--green)" }}>LIVE · 0.3km away</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["CPR", "AED", "First Aid"].map(s => (
          <span key={s} style={{ fontFamily: "JetBrains Mono", fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "var(--s2)", border: "1px solid var(--bd)", color: "var(--blue)" }}>{s}</span>
        ))}
      </div>
      <button className="btn-red" style={{ width: "100%", padding: "9px", fontSize: 13, justifyContent: "center" }}>
        RESPOND NOW <ArrowRight size={13} />
      </button>
    </div>
  );
}

function ResponderCard({ className }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: "16px 18px", width: 230, position: "absolute", zIndex: 2, pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a2a4a,#0e1a30)", border: "2px solid var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rajdhani", fontWeight: 700, fontSize: 15, color: "var(--blue)" }}>AK</div>
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 13, color: "var(--t1)" }}>Arjun K.</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--green)" }}>● AVAILABLE</div>
        </div>
        <Award size={16} color="var(--amber)" style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {["EMT", "CPR", "Trauma"].map(s => (
          <span key={s} style={{ fontFamily: "JetBrains Mono", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--green-dim)", border: "1px solid var(--green-glow)", color: "var(--green)" }}>{s}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i<=5?"var(--amber)":"none"} color="var(--amber)" />)}
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--t2)", marginLeft: 4 }}>4.98</span>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["How it Works", "Features", "Responders", "About"];
  return (
    <>
      <nav className="nav-blur" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,7,10,0.88)" : "rgba(5,7,10,0.4)",
        borderBottom: scrolled ? "1px solid var(--bd)" : "1px solid transparent",
        transition: "all 0.35s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Rajdhani", fontWeight: 700, fontSize: 24, letterSpacing: "2px", cursor: "pointer" }}>
            <span style={{ color: "var(--t1)" }}>RESQ</span>
            <span style={{ color: "var(--red)", textShadow: "0 0 16px var(--red-glow)" }}>+</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {links.map(l => (
              <a key={l} href="#" style={{ color: "var(--t2)", fontFamily: "DM Sans", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", letterSpacing: "0.3px" }}
                onMouseEnter={e => e.target.style.color = "var(--t1)"} onMouseLeave={e => e.target.style.color = "var(--t2)"}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-outline" style={{ padding: "8px 20px", fontSize: 13 }}>Login</button>
            <button className="btn-red" style={{ padding: "8px 20px", fontSize: 13 }}>Get Started</button>
            <button onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "1px solid var(--bd)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--t1)" }} className="mobile-btn">
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
      {/* Mobile Drawer */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(5,7,10,0.97)", backdropFilter: "blur(20px)",
        transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column", padding: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 24, color: "var(--t1)", letterSpacing: "2px" }}>RESQ<span style={{ color: "var(--red)" }}>+</span></span>
          <button onClick={() => setMobileOpen(false)} style={{ background: "var(--s2)", border: "1px solid var(--bd)", borderRadius: 8, padding: 8, cursor: "pointer", color: "var(--t1)" }}><X size={18} /></button>
        </div>
        {links.map(l => (
          <a key={l} onClick={() => setMobileOpen(false)} href="#" style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 26, color: "var(--t1)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--bd)", letterSpacing: "1px" }}>{l}</a>
        ))}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-outline" style={{ justifyContent: "center" }}>Login</button>
          <button className="btn-red" style={{ justifyContent: "center" }}>Get Started</button>
        </div>
      </div>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="grid-bg" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", paddingTop: 80 }}>
      {/* Blobs */}
      {[
        { className: "blob", color: "rgba(255,45,45,0.12)", size: 600, top: "-10%", left: "-8%", blur: 80 },
        { className: "blob2", color: "rgba(0,212,106,0.08)", size: 500, top: "30%", right: "-5%", blur: 70 },
        { className: "blob3", color: "rgba(75,142,240,0.08)", size: 400, bottom: "-5%", left: "25%", blur: 60 },
      ].map((b, i) => (
        <div key={i} className={b.className} style={{
          position: "absolute", borderRadius: "50%",
          width: b.size, height: b.size,
          background: b.color, filter: `blur(${b.blur}px)`,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          pointerEvents: "none",
        }} />
      ))}

      {/* Floating UI elements */}
      <div className="ui-float" style={{ position: "absolute", right: "8%", top: "18%", zIndex: 2 }}>
        <AlertCard className="" />
      </div>
      <div className="ui-float2" style={{ position: "absolute", right: "15%", bottom: "20%", zIndex: 2 }}>
        <ResponderCard className="" />
      </div>
      {/* Map ping */}
      <div style={{ position: "absolute", right: "28%", top: "55%", zIndex: 1 }}>
        <div style={{ position: "relative", width: 14, height: 14 }}>
          <div className="ping-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--red)" }} />
          <div className="ping-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--red)", animationDelay: "0.5s" }} />
          <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "var(--red)" }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 5 }}>
        <div style={{ maxWidth: 680 }}>
          {/* Label */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--s1)", border: "1px solid var(--bd2)", borderRadius: 100, padding: "7px 16px", marginBottom: 28, animation: "fadeInUp 0.6s ease both" }}>
            <div className="dot-live" />
            <span className="mono" style={{ fontSize: 11, color: "var(--t2)", letterSpacing: "1.5px" }}>REAL-TIME EMERGENCY NETWORK</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "clamp(52px, 7vw, 88px)", lineHeight: 1.0, letterSpacing: "1px", marginBottom: 28, textTransform: "uppercase", animation: "fadeInUp 0.6s ease 0.15s both" }}>
            <span style={{ color: "var(--t1)" }}>THE FASTEST<br />WAY TO GET<br />HELP IS </span>
            <span className="text-green-glow">ALREADY<br />NEARBY</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 18, color: "var(--t2)", lineHeight: 1.7, maxWidth: 500, marginBottom: 40, animation: "fadeInUp 0.6s ease 0.28s both" }}>
            RESQ+ connects people in emergencies with verified, skilled responders in their immediate vicinity — in seconds, not minutes.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.4s both" }}>
            <button className="btn-red" style={{ fontSize: 15 }}>
              <Radio size={16} /> Trigger Demo Alert
            </button>
            <button className="btn-outline">
              See How It Works <ChevronRight size={16} />
            </button>
          </div>

          {/* Trust bar */}
          <div style={{ display: "flex", gap: 28, marginTop: 52, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.52s both" }}>
            {[
              { icon: <Zap size={15} color="var(--amber)" />, label: "Avg Response", val: "<90 secs" },
              { icon: <Users size={15} color="var(--blue)" />, label: "Active Responders", val: "12,400+" },
              { icon: <Shield size={15} color="var(--green)" />, label: "Verified & Secure", val: "ISO 27001" },
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

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { val: 12400, suffix: "+", label: "VERIFIED RESPONDERS" },
    { val: 87, suffix: "s", label: "AVG RESPONSE TIME" },
    { val: 94200, suffix: "+", label: "INCIDENTS RESOLVED" },
    { val: 99.9, suffix: "%", label: "PLATFORM UPTIME", isFloat: true },
    { val: 138, suffix: "", label: "CITIES COVERED" },
  ];
  const items = [...stats, ...stats];
  return (
    <div style={{ background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)", overflow: "hidden", padding: "18px 0" }}>
      <div className="ticker-track" style={{ display: "inline-flex", gap: 0 }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 40, padding: "0 48px", borderRight: "1px solid var(--bd)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--t1)" }}>
                <Counter to={s.isFloat ? 999 : s.val} suffix={s.suffix} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "1.5px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", icon: <AlertTriangle size={22} />, color: "var(--red)", title: "TRIGGER", desc: "Victim or bystander activates an emergency alert with one tap — location auto-detected." },
  { num: "02", icon: <Activity size={22} />, color: "var(--amber)", title: "CLASSIFY", desc: "AI instantly analyzes the alert type: cardiac, trauma, fire, mental health, and more." },
  { num: "03", icon: <MapPin size={22} />, color: "var(--blue)", title: "MATCH", desc: "Skill-based engine finds the nearest verified responders matching the emergency." },
  { num: "04", icon: <Bell size={22} />, color: "var(--green)", title: "NOTIFY", desc: "Responders receive a real-time push with location, situation, and navigation guidance." },
  { num: "05", icon: <Heart size={22} />, color: "var(--red)", title: "RESPOND", desc: "Trained responder arrives within minutes. Live status tracked by the victim and family." },
];

function HowItWorks() {
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 16 }}>SYSTEM FLOW</div>
        <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.05 }}>
          From Panic to<br /><span style={{ color: "var(--green)", textShadow: "0 0 24px var(--green-glow)" }}>Response</span> — In Seconds
        </h2>
        <p style={{ color: "var(--t2)", fontSize: 16, maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>A frictionless 5-step system designed for real-world chaos.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, position: "relative" }}>
        {STEPS.map((s, i) => (
          <div key={i} className={`glass-card reveal reveal-d${i + 1}`} style={{ padding: "28px 22px", position: "relative", overflow: "hidden", borderRadius: i === 0 ? "16px 4px 4px 16px" : i === STEPS.length - 1 ? "4px 16px 16px 4px" : "4px", cursor: "default" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div className="mono" style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "2px", marginBottom: 14 }}>{s.num}</div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}1a`, border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 16 }}>
              {s.icon}
            </div>
            <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 20, letterSpacing: "1.5px", color: "var(--t1)", marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{s.desc}</p>
            {i < STEPS.length - 1 && (
              <div style={{ position: "absolute", right: -2, top: "50%", transform: "translateY(-50%)", zIndex: 3 }}>
                <ChevronRight size={16} color="var(--t3)" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <MapPin size={22} />, color: "var(--red)", title: "Hyper-Local Matching", desc: "Geo-indexed skill matching finds the closest qualified responder within 200m radius in real time." },
  { icon: <Shield size={22} />, color: "var(--blue)", title: "Verified Responders", desc: "Multi-step credential verification — medical licenses, certifications, background checks included." },
  { icon: <Zap size={22} />, color: "var(--amber)", title: "Sub-second Alerts", desc: "Push alerts delivered in under 300ms via redundant global infrastructure. No delay, ever." },
  { icon: <Activity size={22} />, color: "var(--green)", title: "AI Triage Engine", desc: "Machine learning classifies incoming alerts and ranks responders by situational fit score." },
  { icon: <Lock size={22} />, color: "var(--blue)", title: "End-to-End Encrypted", desc: "All communication and data encrypted at rest and in transit. HIPAA compliant by design." },
  { icon: <Clock size={22} />, color: "var(--amber)", title: "Live Incident Tracking", desc: "Families and dispatchers get real-time responder ETA, status, and location updates." },
];

function Features() {
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "100px 24px 120px", background: "var(--s1)", borderTop: "1px solid var(--bd)", borderBottom: "1px solid var(--bd)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 16 }}>PLATFORM CAPABILITIES</div>
          <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.05 }}>
            Built for <span style={{ color: "var(--red)", textShadow: "0 0 24px var(--red-glow)" }}>High Stakes</span><br />Moments
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`glass-card reveal reveal-d${(i % 3) + 1}`}
              style={{ padding: "28px", background: "var(--bg)", cursor: "default", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${f.color}50`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--bd)"}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 16px 0 0", background: `radial-gradient(circle at top right, ${f.color}08, transparent 60%)`, pointerEvents: "none" }} />
              <div style={{ width: 48, height: 48, borderRadius: 13, background: `${f.color}15`, border: `1px solid ${f.color}35`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 18 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 19, letterSpacing: "0.8px", color: "var(--t1)", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Responder CTA ─────────────────────────────────────────────────────────────
function ResponderCTA() {
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div className="reveal">
          <div className="mono" style={{ fontSize: 11, color: "var(--green)", letterSpacing: "3px", marginBottom: 18 }}>JOIN THE NETWORK</div>
          <h2 style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)", lineHeight: 1.0, marginBottom: 24 }}>
            Your Skills<br />Can <span style={{ color: "var(--green)", textShadow: "0 0 24px var(--green-glow)" }}>Save</span><br />Lives
          </h2>
          <p style={{ fontSize: 16, color: "var(--t2)", lineHeight: 1.75, maxWidth: 420, marginBottom: 36 }}>
            If you're a trained first responder, nurse, paramedic, or even a certified CPR instructor — your skills are needed right now. Register, get verified, and start helping your community.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
            {[["12,400+", "Active Responders"], ["94K+", "Lives Impacted"], ["4.96", "Avg Rating"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center", padding: "16px 24px", background: "var(--s1)", border: "1px solid var(--bd)", borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: "var(--t1)" }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <button className="btn-red" style={{ fontSize: 15 }}><UserCheck size={17} /> Become a Responder</button>
        </div>

        <div className="reveal reveal-d2">
          <div className="glass-card" style={{ padding: 28, background: "var(--s1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, left: 0, height: 2, background: "linear-gradient(90deg, var(--green), var(--blue))" }} />
            {/* Responder profile mockup */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a5a,#0a1a30)", border: "2px solid var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rajdhani", fontWeight: 700, fontSize: 20, color: "var(--blue)" }}>SR</div>
              <div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 18, color: "var(--t1)" }}>Dr. Suresh R.</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={13} color="var(--green)" />
                  <span style={{ fontSize: 12, color: "var(--green)" }}>Verified Responder</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} size={13} fill="var(--amber)" color="var(--amber)" />)}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--amber)", marginTop: 3 }}>4.98 · 243 responses</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "var(--t3)", marginBottom: 10, letterSpacing: "0.5px" }}>SKILL CERTIFICATIONS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Advanced Cardiac", "Emergency Medicine", "Trauma Care", "ACLS", "PALS", "Disaster Response"].map(s => (
                  <span key={s} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "var(--green-dim)", border: "1px solid var(--green-glow)", color: "var(--green)", fontFamily: "DM Sans" }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["Response Rate", "98.2%", "var(--green)"], ["Avg ETA", "4.2 min", "var(--amber)"], ["Range", "2.5 km", "var(--blue)"], ["Status", "ON DUTY", "var(--green)"]].map(([l, v, c]) => (
                <div key={l} style={{ background: "var(--s2)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--bd)" }}>
                  <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4 }}>{l}</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--s2)", borderRadius: 10, padding: "14px", border: "1px solid var(--bd)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--amber-dim)", border: "1px solid var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={18} color="var(--amber)" />
              </div>
              <div>
                <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 14, color: "var(--t1)" }}>Top Responder — Q1 2026</div>
                <div style={{ fontSize: 12, color: "var(--t2)" }}>Ranked #1 in Chennai Metro District</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){section div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Meera S.", role: "Cardiac Arrest Survivor", text: "A RESQ+ responder reached me in under 3 minutes and performed CPR until the ambulance arrived. I genuinely wouldn't be alive today.", color: "var(--red)" },
  { name: "Karthik V.", role: "Paramedic, Chennai", text: "As an off-duty paramedic, I've responded to 40+ incidents through this platform. The matching is frighteningly accurate for emergencies near me.", color: "var(--green)" },
  { name: "Priya L.", role: "Emergency Dispatcher", text: "RESQ+ fills the critical gap between a 112 call and ambulance arrival. In dense urban areas, that gap can be the difference between life and death.", color: "var(--blue)" },
];

function Testimonials() {
  const ref = useReveal();
  return (
    <section ref={ref} style={{ padding: "100px 24px 120px", background: "var(--s1)", borderTop: "1px solid var(--bd)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 16 }}>IMPACT STORIES</div>
          <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)" }}>
            Real People.<br /><span style={{ color: "var(--red)", textShadow: "0 0 24px var(--red-glow)" }}>Real Stories.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`glass-card reveal reveal-d${i + 1}`} style={{ padding: "28px", background: "var(--bg)", cursor: "default" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="var(--amber)" color="var(--amber)" />)}
              </div>
              <p style={{ fontSize: 15, color: "var(--t2)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${t.color}20`, border: `1.5px solid ${t.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rajdhani", fontWeight: 700, fontSize: 14, color: t.color }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 15, color: "var(--t1)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--t3)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Auth Section ──────────────────────────────────────────────────────────────
const SIGNUP_STEPS = ["Basic Info", "Medical Info", "Emergency Contacts", "Your Role"];

function AuthSection() {
  const [tab, setTab] = useState("login");
  const [signupStep, setSignupStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("");
  const ref = useReveal();

  return (
    <section ref={ref} style={{ padding: "120px 24px", background: "var(--bg)", borderTop: "1px solid var(--bd)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--red)", letterSpacing: "3px", marginBottom: 14 }}>ACCESS THE PLATFORM</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, textTransform: "uppercase", color: "var(--t1)" }}>
            {tab === "login" ? "Welcome Back" : "Join RESQ+"}
          </h2>
        </div>

        <div className="reveal reveal-d1 glass-card" style={{ padding: "32px", background: "var(--s1)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, background: "var(--s2)", padding: 5, borderRadius: 11 }}>
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => { setTab("login"); setSignupStep(0); }}>Login</button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setTab("signup")}>Sign Up</button>
          </div>

          {tab === "login" ? (
            <div style={{ animation: "scaleIn 0.3s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--t3)", display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>EMAIL ADDRESS</label>
                  <input className="inp" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--t3)", display: "block", marginBottom: 6, letterSpacing: "0.5px" }}>PASSWORD</label>
                  <div style={{ position: "relative" }}>
                    <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••" style={{ paddingRight: 44 }} />
                    <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--t3)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a href="#" style={{ fontSize: 12, color: "var(--red)", textDecoration: "none" }}>Forgot Password?</a>
                </div>
                <button className="btn-red" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>Login to Dashboard</button>
              </div>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <span style={{ fontSize: 13, color: "var(--t3)" }}>Don't have an account? </span>
                <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 13, fontFamily: "DM Sans" }}>Sign Up Free</button>
              </div>
            </div>
          ) : (
            <div style={{ animation: "scaleIn 0.3s ease both" }}>
              {/* Step indicators */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                {SIGNUP_STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < SIGNUP_STEPS.length - 1 ? 1 : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "JetBrains Mono", fontWeight: 600,
                        background: i < signupStep ? "var(--green)" : i === signupStep ? "var(--red)" : "var(--s2)",
                        border: `1.5px solid ${i < signupStep ? "var(--green)" : i === signupStep ? "var(--red)" : "var(--bd)"}`,
                        color: i <= signupStep ? "#fff" : "var(--t3)",
                        boxShadow: i === signupStep ? "0 0 14px var(--red-glow)" : "none",
                        transition: "all 0.3s",
                      }}>
                        {i < signupStep ? <CheckCircle size={13} /> : i + 1}
                      </div>
                    </div>
                    {i < SIGNUP_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 1, background: i < signupStep ? "var(--green)" : "var(--bd)", margin: "0 6px", transition: "background 0.3s" }} />
                    )}
                  </div>
                ))}
              </div>

              <div className="mono" style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "1.5px", marginBottom: 18 }}>
                STEP {signupStep + 1} OF {SIGNUP_STEPS.length} — {SIGNUP_STEPS[signupStep].toUpperCase()}
              </div>

              {signupStep === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>FIRST NAME</label><input className="inp" placeholder="Arjun" /></div>
                    <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>LAST NAME</label><input className="inp" placeholder="Kumar" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>EMAIL</label><input className="inp" type="email" placeholder="arjun@example.com" /></div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>PHONE NUMBER</label><input className="inp" type="tel" placeholder="+91 9876 543 210" /></div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>PASSWORD</label><input className="inp" type="password" placeholder="Min. 8 characters" /></div>
                </div>
              )}
              {signupStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>BLOOD TYPE</label>
                    <select className="inp"><option value="">Select blood type</option>{["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}</select>
                  </div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>KNOWN ALLERGIES</label><input className="inp" placeholder="e.g. Penicillin, Latex (or None)" /></div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>CHRONIC CONDITIONS</label><input className="inp" placeholder="e.g. Diabetes, Hypertension (or None)" /></div>
                  <div><label style={{ fontSize: 11, color: "var(--t3)", display: "block", marginBottom: 5 }}>CURRENT MEDICATIONS</label><input className="inp" placeholder="List medications or None" /></div>
                </div>
              )}
              {signupStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2].map(n => (
                    <div key={n} style={{ background: "var(--s2)", borderRadius: 10, padding: "14px", border: "1px solid var(--bd)" }}>
                      <div className="mono" style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "1.5px", marginBottom: 12 }}>EMERGENCY CONTACT {n}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input className="inp" placeholder="Full name" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <input className="inp" placeholder="Relationship" />
                          <input className="inp" type="tel" placeholder="Phone number" />
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
                  ].map(r => (
                    <div key={r.id} onClick={() => setRole(r.id)} style={{ padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${role === r.id ? "var(--red)" : "var(--bd)"}`, background: role === r.id ? "var(--red-dim)" : "var(--s2)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
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
                  <button onClick={() => setSignupStep(s => s - 1)} className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: "11px" }}>Back</button>
                )}
                <button onClick={() => signupStep < SIGNUP_STEPS.length - 1 ? setSignupStep(s => s + 1) : null} className="btn-red" style={{ flex: 2, justifyContent: "center", padding: "11px" }}>
                  {signupStep === SIGNUP_STEPS.length - 1 ? "Create Account" : `Continue`} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "var(--s1)", borderTop: "1px solid var(--bd)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 26, letterSpacing: "2px", marginBottom: 14 }}>
              RESQ<span style={{ color: "var(--red)" }}>+</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.7, maxWidth: 280 }}>Real-time skill-based emergency response. Connecting trained responders to people in need — in seconds.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[Shield, Activity, Radio].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 9, background: "var(--s2)", border: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.background = "var(--red-dim)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bd)"; e.currentTarget.style.background = "var(--s2)"; }}>
                  <Icon size={15} color="var(--t2)" />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Features", "Responder Network", "Pricing", "API"] },
            { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Use", "HIPAA Compliance", "Cookies", "Security"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: 13, letterSpacing: "2px", color: "var(--t2)", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: 14, color: "var(--t3)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--t1)"} onMouseLeave={e => e.target.style.color = "var(--t3)"}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--bd)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--t3)" }}>© 2026 RESQ+ Technologies Inc. All rights reserved.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="dot-live" />
            <span className="mono" style={{ fontSize: 11, color: "var(--green)" }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer div[style*="grid-template-columns: 2fr"]{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{FONTS + CSS}</style>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Features />
        <ResponderCTA />
        <Testimonials />
        <AuthSection />
      </main>
      <Footer />
    </>
  );
}
