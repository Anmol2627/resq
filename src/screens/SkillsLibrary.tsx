import { useState } from "react";

const skills = [
  { cat: "medical", name: "CPR / Basic Life Support", icon: "❤️", type: "core" },
  { cat: "medical", name: "First Aid & Wound Care", icon: "🩹", type: "core" },
  { cat: "medical", name: "AED Operation", icon: "⚡", type: "core" },
  { cat: "medical", name: "Heimlich Maneuver", icon: "🫁", type: "core" },
  { cat: "medical", name: "Childbirth Assistance", icon: "👶", type: "verified" },
  { cat: "medical", name: "Mental Health First Aid", icon: "🧠", type: "support" },
  { cat: "medical", name: "Trauma Nursing", icon: "🏥", type: "verified" },
  { cat: "medical", name: "EMT / Paramedic", icon: "🚑", type: "verified" },
  { cat: "technical", name: "Electrical Fault Handling", icon: "🔌", type: "tech" },
  { cat: "technical", name: "Plumbing Emergency", icon: "🔧", type: "tech" },
  { cat: "technical", name: "Structural Assessment", icon: "🏗️", type: "verified" },
  { cat: "technical", name: "Generator / Power Backup", icon: "⚙️", type: "tech" },
  { cat: "technical", name: "Vehicle Extrication", icon: "🚗", type: "tech" },
  { cat: "technical", name: "Drone Operation", icon: "🛸", type: "tech" },
  { cat: "rescue", name: "Fire Extinguisher Use", icon: "🔥", type: "core" },
  { cat: "rescue", name: "Water Rescue", icon: "🌊", type: "verified" },
  { cat: "rescue", name: "Search & Rescue Basics", icon: "🔦", type: "verified" },
  { cat: "rescue", name: "Evacuation Coordination", icon: "🚨", type: "support" },
  { cat: "rescue", name: "Animal Handling", icon: "🐾", type: "support" },
  { cat: "specialized", name: "Firefighter", icon: "🧯", type: "verified" },
  { cat: "specialized", name: "Pharmacist", icon: "💊", type: "verified" },
  { cat: "specialized", name: "Structural Engineer", icon: "📐", type: "verified" },
  { cat: "specialized", name: "Ex-Serviceman", icon: "🎖️", type: "support" },
  { cat: "support", name: "Sign Language", icon: "🤟", type: "support" },
  { cat: "support", name: "Child & Elder Care", icon: "👴", type: "support" },
  { cat: "support", name: "Logistics & Supply", icon: "📦", type: "support" },
];

const sections = [
  { key: "medical", label: "Medical", color: "#e74c3c" },
  { key: "technical", label: "Technical", color: "#3498db" },
  { key: "rescue", label: "Safety & Rescue", color: "#f39c12" },
  { key: "specialized", label: "Specialized / Professional", color: "#1abc9c" },
  { key: "support", label: "Soft & Support Skills", color: "#9b59b6" },
];

const tagConfig = {
  core:     { label: "CORE",      bg: "rgba(231,76,60,.12)",  color: "#e74c3c", border: "rgba(231,76,60,.25)" },
  verified: { label: "VERIFIED",  bg: "rgba(26,188,156,.12)", color: "#1abc9c", border: "rgba(26,188,156,.25)" },
  tech:     { label: "TECHNICAL", bg: "rgba(52,152,219,.12)", color: "#3498db", border: "rgba(52,152,219,.25)" },
  support:  { label: "SUPPORT",   bg: "rgba(243,156,18,.12)", color: "#f39c12", border: "rgba(243,156,18,.25)" },
};

const borderAccent = {
  core:     "#e74c3c",
  verified: "#1abc9c",
  tech:     "#3498db",
  support:  "#f39c12",
};

const filters = ["All", "Medical", "Technical", "Rescue", "Specialized", "Support"];

export default function SkillsLibrary() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = (cat) =>
    skills.filter((s) => {
      const matchCat =
        activeFilter === "All" ||
        s.cat === activeFilter.toLowerCase();
      const matchQ =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        tagConfig[s.type].label.toLowerCase().includes(query.toLowerCase());
      return s.cat === cat && matchCat && matchQ;
    });

  const stats = [
    { val: skills.length, label: "Total Skills", color: "#e2e8f0" },
    { val: skills.filter((s) => s.type === "verified").length, label: "Verified", color: "#1abc9c" },
    { val: skills.filter((s) => s.type === "core").length, label: "Core / Critical", color: "#e74c3c" },
    { val: skills.filter((s) => s.type === "support").length, label: "Support", color: "#f39c12" },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.pageTitle}>Skills Library</div>
          <div style={s.pageSub}>Live skill registry · {skills.length} active entries</div>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <span style={{ ...s.statVal, color: st.color }}>{st.val}</span>
            <span style={s.statLabel}>{st.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="#5a6478" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          style={s.searchInput}
          placeholder="Search skills, tags, roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={s.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              ...s.filterBtn,
              ...(activeFilter === f ? s.filterBtnActive : {}),
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div>
        {sections.map((sec) => {
          const items = filtered(sec.key);
          if (!items.length) return null;
          return (
            <div key={sec.key} style={s.section}>
              <div style={s.sectionHead}>
                <div style={{ ...s.sectionBar, background: sec.color }} />
                <span style={s.sectionLabel}>{sec.label}</span>
                <span style={s.sectionCount}>{items.length}</span>
              </div>
              <div style={s.grid}>
                {items.map((sk) => {
                  const tag = tagConfig[sk.type];
                  return (
                    <div
                      key={sk.name}
                      style={{
                        ...s.card,
                        borderLeft: `2px solid ${borderAccent[sk.type]}`,
                      }}
                    >
                      <span style={s.cardIcon}>{sk.icon}</span>
                      <div style={s.cardName}>{sk.name}</div>
                      <span
                        style={{
                          ...s.cardTag,
                          background: tag.bg,
                          color: tag.color,
                          border: `1px solid ${tag.border}`,
                        }}
                      >
                        {tag.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {sections.every((sec) => filtered(sec.key).length === 0) && (
          <div style={s.empty}>NO SKILLS MATCH YOUR QUERY</div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: {
    background: "#0d0f14",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#e2e8f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  pageSub: {
    fontSize: "11px",
    fontFamily: "'Share Tech Mono', monospace",
    color: "#5a6478",
    letterSpacing: "0.1em",
    marginTop: "3px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    marginBottom: "18px",
  },
  statCard: {
    background: "#131720",
    border: "1px solid #1e2330",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  statVal: {
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "9px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0.12em",
    color: "#5a6478",
    textTransform: "uppercase",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#131720",
    border: "1px solid #1e2330",
    borderRadius: "7px",
    padding: "8px 14px",
    marginBottom: "14px",
  },
  searchIcon: {
    width: "13px",
    height: "13px",
    flexShrink: 0,
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#b0b8cc",
    width: "100%",
    letterSpacing: "0.04em",
  },
  filterRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  filterBtn: {
    fontSize: "10px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0.08em",
    padding: "5px 13px",
    borderRadius: "4px",
    border: "1px solid #1e2330",
    background: "transparent",
    color: "#5a6478",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  filterBtnActive: {
    background: "#1e0f0f",
    borderColor: "#e74c3c",
    color: "#e74c3c",
  },
  section: {
    marginBottom: "24px",
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  sectionBar: {
    width: "2px",
    height: "14px",
    borderRadius: "2px",
    flexShrink: 0,
  },
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    color: "#8899b0",
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: "10px",
    fontFamily: "'Share Tech Mono', monospace",
    color: "#3d4557",
    marginLeft: "4px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
    gap: "8px",
  },
  card: {
    background: "#131720",
    border: "1px solid #1e2330",
    borderRadius: "8px",
    padding: "12px",
    cursor: "pointer",
    transition: "border-color 0.15s, transform 0.12s",
  },
  cardIcon: {
    fontSize: "18px",
    marginBottom: "8px",
    display: "block",
    lineHeight: 1,
  },
  cardName: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#c8d0e0",
    lineHeight: 1.35,
    letterSpacing: "0.02em",
  },
  cardTag: {
    display: "inline-flex",
    alignItems: "center",
    marginTop: "8px",
    fontSize: "9px",
    letterSpacing: "0.1em",
    padding: "2px 7px",
    borderRadius: "3px",
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#3d4557",
    fontSize: "13px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "0.1em",
  },
};