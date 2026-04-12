/**
 * silicon_siddhanta_app.jsx
 * ═══════════════════════════════════════════════════════════
 * Silicon Siddhanta — Unified Vedic Intelligence Platform
 *
 * Architecture:
 *   Main Tabs: Astrology (Chart, Planets, Dashas, KP, Predictions, Ashtakavarga)
 *              Muhurta (Auspicious Windows)
 *              Vastu (Cross-Check Tool)
 *              BG Chatbot (Brajesh Gautam AI)
 *              Settings
 *
 *   Floating: Breathing Simulator (mini orb → expands on click)
 *             AI Chat toggle (future)
 *
 * Self-contained JSX. Vedic Mystic theme inline.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════
// THEME TOKENS (inline — Vedic Mystic StyleKit)
// ═══════════════════════════════════════════════════
const T = {
  bg: "#0b1120", bgSec: "#131b2e", bgTer: "#1a2340",
  bgCard: "rgba(19,27,46,0.85)", bgCardHov: "rgba(26,35,64,0.92)",
  bgOverlay: "rgba(11,17,32,0.96)",
  text: "#eef2f7", textSec: "#8b9cc0", textMuted: "#5a6b8a",
  accent: "#e5a100", accentHov: "#f5b800", accentDim: "rgba(229,161,0,0.12)",
  indigo: "#6366f1", cyan: "#0ea5e9",
  pos: "#22c55e", neg: "#ef4444", warn: "#eab308", info: "#3b82f6",
  border: "#1e2a42", borderAcc: "rgba(229,161,0,0.25)",
  radius: "10px", radiusSm: "6px", radiusLg: "16px",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 24px rgba(0,0,0,0.5)",
  shadowGlow: "0 0 24px rgba(229,161,0,0.1)",
};

const PC = { Sun: "#FF8C00", Moon: "#B8C4D4", Mars: "#DC2626", Mercury: "#16A34A", Jupiter: "#EAB308", Venus: "#EC4899", Saturn: "#4F6BCC", Rahu: "#8B5CF6", Ketu: "#B45309" };
const PS = { Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋" };
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SS = { Aries:"♈", Taurus:"♉", Gemini:"♊", Cancer:"♋", Leo:"♌", Virgo:"♍", Libra:"♎", Scorpio:"♏", Sagittarius:"♐", Capricorn:"♑", Aquarius:"♒", Pisces:"♓" };

// ═══════════════════════════════════════════════════
// CHART DATA — Hemant Thackeray
// ═══════════════════════════════════════════════════
const CHART = {
  name: "Hemant Thackeray", dob: "27/03/1980", time: "11:45 AM", place: "Kalyan, Maharashtra",
  asc: "Gemini", ascDeg: 6.81, moonSign: "Cancer", sunSign: "Pisces", lagnaLord: "Mercury",
  currentDasha: "Moon-Ketu-Rahu",
  planets: {
    Sun: { sign: "Pisces", deg: 13.16, nak: "Uttara Bhadrapada", pada: 3, nakLord: "Saturn", house: 10, retro: false, subLord: "Rahu" },
    Moon: { sign: "Cancer", deg: 25.70, nak: "Ashlesha", pada: 3, nakLord: "Mercury", house: 2, retro: false, subLord: "Rahu", ownSign: true },
    Mars: { sign: "Leo", deg: 2.93, nak: "Magha", pada: 1, nakLord: "Ketu", house: 3, retro: true, subLord: "Venus" },
    Mercury: { sign: "Aquarius", deg: 16.43, nak: "Shatabhisha", pada: 3, nakLord: "Rahu", house: 9, retro: false, subLord: "Venus" },
    Jupiter: { sign: "Leo", deg: 8.03, nak: "Magha", pada: 3, nakLord: "Ketu", house: 3, retro: true, subLord: "Jupiter" },
    Venus: { sign: "Aries", deg: 28.72, nak: "Krittika", pada: 1, nakLord: "Sun", house: 11, retro: false, subLord: "Mars" },
    Saturn: { sign: "Leo", deg: 29.04, nak: "Uttara Phalguni", pada: 1, nakLord: "Sun", house: 4, retro: true, subLord: "Mars" },
    Rahu: { sign: "Leo", deg: 3.75, nak: "Magha", pada: 2, nakLord: "Ketu", house: 3, retro: true, subLord: "Moon" },
    Ketu: { sign: "Aquarius", deg: 3.75, nak: "Dhanishtha", pada: 4, nakLord: "Mars", house: 9, retro: true, subLord: "Venus" },
  },
  houses: {
    1: { sign: "Gemini", lord: "Mercury", occ: [] }, 2: { sign: "Cancer", lord: "Moon", occ: ["Moon"] },
    3: { sign: "Cancer", lord: "Moon", occ: ["Mars","Jupiter","Rahu"] }, 4: { sign: "Leo", lord: "Sun", occ: ["Saturn"] },
    5: { sign: "Libra", lord: "Venus", occ: [] }, 6: { sign: "Scorpio", lord: "Mars", occ: [] },
    7: { sign: "Sagittarius", lord: "Jupiter", occ: [] }, 8: { sign: "Capricorn", lord: "Saturn", occ: [] },
    9: { sign: "Capricorn", lord: "Saturn", occ: ["Mercury","Ketu"] }, 10: { sign: "Aquarius", lord: "Saturn", occ: ["Sun"] },
    11: { sign: "Aries", lord: "Mars", occ: ["Venus"] }, 12: { sign: "Taurus", lord: "Venus", occ: [] },
  },
  dashas: [
    { lord: "Moon", start: "20/09/2018", end: "19/09/2028", years: 10, active: true,
      antars: [
        { lord: "Moon", start: "20/09/2018", end: "20/07/2019" },
        { lord: "Mars", start: "20/07/2019", end: "20/02/2020" },
        { lord: "Rahu", start: "20/02/2020", end: "20/08/2021" },
        { lord: "Jupiter", start: "20/08/2021", end: "20/12/2022" },
        { lord: "Saturn", start: "20/12/2022", end: "20/07/2024" },
        { lord: "Mercury", start: "20/07/2024", end: "20/12/2025" },
        { lord: "Ketu", start: "20/12/2025", end: "20/07/2026", active: true },
        { lord: "Venus", start: "20/07/2026", end: "20/03/2028" },
        { lord: "Sun", start: "20/03/2028", end: "19/09/2028" },
      ]
    },
    { lord: "Mars", start: "19/09/2028", end: "19/09/2035", years: 7 },
    { lord: "Rahu", start: "19/09/2035", end: "20/09/2053", years: 18 },
    { lord: "Jupiter", start: "20/09/2053", end: "19/09/2069", years: 16 },
  ],
  yogas: [
    { name: "Gajakesari Yoga", cat: "Raja", strength: 0.8, good: true, desc: "Jupiter in kendra from Moon — wisdom, fortune, good character.", planets: ["Jupiter","Moon"] },
    { name: "Chandra-Mangala Yoga", cat: "Dhana", strength: 0.5, good: true, desc: "Moon and Mars in mutual aspect — financial drive, emotional passion.", planets: ["Moon","Mars"] },
  ],
  kpSignificators: {
    1: ["Moon","Mercury"], 2: ["Moon"], 3: ["Mars","Jupiter","Rahu","Moon"],
    4: ["Venus","Saturn","Sun"], 5: ["Venus"], 6: ["Ketu","Mars"],
    7: ["Jupiter"], 8: ["Sun","Saturn"], 9: ["Mercury","Ketu","Sun","Saturn"],
    10: ["Sun","Saturn"], 11: ["Venus","Saturn","Ketu","Mars"], 12: ["Venus"],
  },
};

// ═══════════════════════════════════════════════════
// BREATHING TECHNIQUES (embedded for floater)
// ═══════════════════════════════════════════════════
const BREATH_TECHNIQUES = [
  { id: "ujjayi", name: "Ujjayi", icon: "🌊", inhale: 4, hold: 0, exhale: 6, rounds: 20, teacher: "Classical", desc: "Ocean breath — gentle throat constriction" },
  { id: "nadi_shodhana", name: "Nadi Shodhana", icon: "🌙", inhale: 4, hold: 8, exhale: 8, rounds: 9, teacher: "Both", desc: "Alternate nostril breathing" },
  { id: "box", name: "Box Breathing", icon: "⬜", inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 12, teacher: "Universal", desc: "Equal ratio square breath (4-4-4-4)" },
  { id: "478", name: "4-7-8 Relaxation", icon: "😴", inhale: 4, hold: 7, exhale: 8, rounds: 8, teacher: "Dr. Weil", desc: "Natural tranquilizer for sleep" },
  { id: "bhramari", name: "Bhramari", icon: "🐝", inhale: 3, hold: 0, exhale: 9, rounds: 7, teacher: "Classical", desc: "Bee breath — humming exhale" },
  { id: "kapalabhati", name: "Kapalabhati", icon: "💎", inhale: 0.5, hold: 0, exhale: 0.3, rounds: 30, teacher: "Classical", desc: "Skull-shining rapid exhale pumps" },
  { id: "so_hum", name: "So-Hum", icon: "🕊️", inhale: 5, hold: 0, exhale: 7, rounds: 30, teacher: "Sri Sri", desc: "'I am That' — mantra-synced breath" },
  { id: "isha_kriya", name: "Isha Kriya", icon: "🧘", inhale: 5, hold: 0, exhale: 7, rounds: 24, teacher: "Sadhguru", desc: "Affirmation breath: 'I am not the body'" },
  { id: "bhastrika", name: "Bhastrika", icon: "🔥", inhale: 1, hold: 0, exhale: 1, rounds: 20, teacher: "Classical", desc: "Bellows breath — energizing rapid pumps" },
  { id: "sitali", name: "Sitali", icon: "❄️", inhale: 4, hold: 2, exhale: 6, rounds: 15, teacher: "Classical", desc: "Cooling breath through curled tongue" },
];

// ═══════════════════════════════════════════════════
// VASTU RULES (embedded for Vastu tab)
// ═══════════════════════════════════════════════════
const VASTU_ZONES = {
  NE: { name: "Ishaan", element: "Water", deity: "Isha/Parjanya", symbol: "💧", color: "#38bdf8", ideal: ["Prayer","Well/Borewell","Garden","Study"], avoid: ["Toilet","Kitchen","Storage","Septic"] },
  N: { name: "Kubera", element: "Water", deity: "Soma/Kubera", symbol: "🌊", color: "#0ea5e9", ideal: ["Living Room","Entrance","Treasury"], avoid: ["Kitchen","Heavy Storage"] },
  NW: { name: "Vayu", element: "Air", deity: "Vayu", symbol: "🌬️", color: "#cbd5e1", ideal: ["Garage","Guest Room","Bathroom"], avoid: ["Master Bedroom","Prayer"] },
  E: { name: "Indra", element: "Space", deity: "Indra/Surya", symbol: "✨", color: "#a78bfa", ideal: ["Entrance","Living Room","Bathroom(shower)"], avoid: ["Toilet","Septic"] },
  Center: { name: "Brahma", element: "Akasha", deity: "Brahma", symbol: "🕉️", color: "#c084fc", ideal: ["Open/Courtyard"], avoid: ["ANY construction","Pillars","Toilet","Kitchen"] },
  W: { name: "Varun", element: "Air", deity: "Varun", symbol: "💨", color: "#94a3b8", ideal: ["Dining","Children Room","Study"], avoid: ["Entrance"] },
  SE: { name: "Agni", element: "Fire", deity: "Agni", symbol: "🔥", color: "#f97316", ideal: ["Kitchen","Electrical/Generator"], avoid: ["Bedroom","Water Storage","Well"] },
  S: { name: "Yama", element: "Earth", deity: "Yama", symbol: "🌍", color: "#a16207", ideal: ["Bedroom","Storage"], avoid: ["Entrance","Well","Prayer"] },
  SW: { name: "Nairitya", element: "Earth", deity: "Nairitya/Pitru", symbol: "🏔️", color: "#92400e", ideal: ["Master Bedroom","Heavy Storage","Staircase"], avoid: ["Entrance(CRITICAL)","Kitchen","Well","Prayer"] },
};

const ROOM_TYPES = [
  { id: "entrance", label: "Main Entrance", icon: "🚪" }, { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "master_bed", label: "Master Bedroom", icon: "🛏️" }, { id: "bedroom", label: "Bedroom", icon: "🛌" },
  { id: "bathroom", label: "Bathroom", icon: "🚿" }, { id: "prayer", label: "Puja Room", icon: "🕉️" },
  { id: "living", label: "Living Room", icon: "🛋️" }, { id: "dining", label: "Dining", icon: "🍽️" },
  { id: "study", label: "Study/Office", icon: "📚" }, { id: "storage", label: "Storage", icon: "📦" },
  { id: "staircase", label: "Staircase", icon: "🪜" }, { id: "garden", label: "Garden/Open", icon: "🌿" },
];

// ═══════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════
export default function SiliconSiddhantaApp() {
  // ── Navigation ──
  const [activeTab, setActiveTab] = useState("chart");
  const [chartSub, setChartSub] = useState("overview");

  // ── Breathing Floater ──
  const [breathOpen, setBreathOpen] = useState(false);
  const [breathExpanded, setBreathExpanded] = useState(false);
  const [breathTech, setBreathTech] = useState(BREATH_TECHNIQUES[0]);
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPaused, setBreathPaused] = useState(false);
  const [breathState, setBreathState] = useState("idle");
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathRound, setBreathRound] = useState(0);
  const [breathOrbScale, setBreathOrbScale] = useState(0.4);
  const [breathCount, setBreathCount] = useState(0);
  const breathInterval = useRef(null);

  // ── Vastu State ──
  const [vastuGrid, setVastuGrid] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)));
  const [vastuRoom, setVastuRoom] = useState(null);
  const [vastuFloor, setVastuFloor] = useState(null);
  const vastuFileRef = useRef(null);

  // ─── NAV TABS ───
  const TABS = [
    { id: "chart", label: "Astrology", icon: "🪐" },
    { id: "muhurta", label: "Muhurta", icon: "⏰" },
    { id: "vastu", label: "Vastu", icon: "🏠" },
    { id: "predictions", label: "Predictions", icon: "🔮" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const CHART_SUBS = ["overview", "planets", "houses", "dashas", "kp", "yogas"];

  // ═══════════════════════════════════════════════════
  // BREATHING ENGINE (for floating orb)
  // ═══════════════════════════════════════════════════
  const breathTick = useCallback(() => {
    if (breathPaused) return;
    setBreathTimer(prev => {
      const next = prev + 0.05;
      const tech = breathTech;
      const inhaleT = tech.inhale || 0;
      const holdT = tech.hold || 0;
      const exhaleT = tech.exhale || 0;
      const holdOutT = tech.holdOut || 0;
      const cycle = inhaleT + holdT + exhaleT + holdOutT;

      if (cycle === 0) return 0;

      const pos = next % cycle;
      if (pos < inhaleT) {
        setBreathState("inhale");
        setBreathOrbScale(0.4 + (pos / inhaleT) * 0.5);
      } else if (pos < inhaleT + holdT) {
        setBreathState("hold");
        setBreathOrbScale(0.9);
      } else if (pos < inhaleT + holdT + exhaleT) {
        setBreathState("exhale");
        setBreathOrbScale(0.9 - ((pos - inhaleT - holdT) / exhaleT) * 0.5);
      } else {
        setBreathState("holdOut");
        setBreathOrbScale(0.4);
      }

      const prevCycles = Math.floor(prev / cycle);
      const nextCycles = Math.floor(next / cycle);
      if (nextCycles > prevCycles) {
        setBreathCount(c => c + 1);
        setBreathRound(r => {
          if (r + 1 >= tech.rounds) {
            stopBreathing();
            return 0;
          }
          return r + 1;
        });
      }
      return next;
    });
  }, [breathTech, breathPaused]);

  const startBreathing = () => {
    setBreathRunning(true); setBreathPaused(false); setBreathTimer(0);
    setBreathRound(0); setBreathCount(0); setBreathState("inhale"); setBreathOrbScale(0.4);
    if (breathInterval.current) clearInterval(breathInterval.current);
    breathInterval.current = setInterval(breathTick, 50);
  };

  const stopBreathing = () => {
    setBreathRunning(false); setBreathPaused(false); setBreathState("idle"); setBreathOrbScale(0.4);
    if (breathInterval.current) clearInterval(breathInterval.current);
  };

  useEffect(() => {
    if (breathRunning && !breathPaused) {
      if (breathInterval.current) clearInterval(breathInterval.current);
      breathInterval.current = setInterval(breathTick, 50);
    } else {
      if (breathInterval.current) clearInterval(breathInterval.current);
    }
    return () => { if (breathInterval.current) clearInterval(breathInterval.current); };
  }, [breathRunning, breathPaused, breathTick]);

  // ═══ HELPERS ═══
  const breathColor = breathState === "inhale" ? T.accent : breathState === "exhale" ? T.cyan : breathState === "hold" || breathState === "holdOut" ? T.indigo : T.border;
  const breathLabel = breathState === "inhale" ? "IN" : breathState === "exhale" ? "OUT" : breathState === "hold" || breathState === "holdOut" ? "HOLD" : "●";

  const getZone = (r, c) => {
    if (r <= 2 && c <= 2) return "NW"; if (r <= 2 && c >= 6) return "NE";
    if (r >= 6 && c <= 2) return "SW"; if (r >= 6 && c >= 6) return "SE";
    if (r <= 2) return "N"; if (r >= 6) return "S";
    if (c <= 2) return "W"; if (c >= 6) return "E"; return "Center";
  };

  // ═══ STYLES ═══
  const S = {
    app: { minHeight: "100vh", background: `linear-gradient(160deg, ${T.bg} 0%, ${T.bgSec} 40%, ${T.bg} 100%)`, color: T.text, fontFamily: T.font },
    nav: { display: "flex", background: `${T.bg}f0`, borderBottom: `1px solid ${T.border}`, padding: "0 16px", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 },
    navBtn: (active) => ({ padding: "14px 18px", border: "none", borderBottom: active ? `2px solid ${T.accent}` : "2px solid transparent", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: T.font, background: "transparent", color: active ? T.accent : T.textMuted, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", whiteSpace: "nowrap" }),
    subNav: { display: "flex", gap: 2, padding: "8px 16px", borderBottom: `1px solid ${T.border}22` },
    subBtn: (active) => ({ padding: "6px 14px", border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: T.font, background: active ? T.accentDim : "transparent", color: active ? T.accent : T.textMuted, textTransform: "capitalize" }),
    body: { padding: "20px 24px", maxWidth: 1200, margin: "0 auto" },
    card: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 16, backdropFilter: "blur(8px)" },
    cardGlow: { background: T.bgCard, border: `1px solid ${T.borderAcc}`, borderRadius: T.radius, padding: 16, boxShadow: T.shadowGlow },
    label: { fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" },
    badge: (color) => ({ fontSize: 9, padding: "2px 8px", borderRadius: "999px", color, background: `${color}18`, fontWeight: 600 }),
    btn: (active) => ({ padding: "8px 18px", border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: T.font, background: active ? T.accent : T.bgTer, color: active ? T.bg : T.textSec, transition: "all 0.2s" }),
    select: { background: T.bgTer, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 12, padding: "8px 12px", outline: "none" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
    th: { padding: "8px 10px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` },
    td: { padding: "8px 10px", borderBottom: `1px solid ${T.border}22` },
  };

  // ═══════════════════════════════════════════════════
  // RENDER: South Indian Chart
  // ═══════════════════════════════════════════════════
  const renderSIChart = () => {
    const grid = [[11,0,1,2],[10,-1,-1,3],[9,-1,-1,4],[8,7,6,5]];
    const ascIdx = SIGNS.indexOf(CHART.asc);
    const getPlanets = (si) => Object.entries(CHART.planets).filter(([_,p]) => SIGNS.indexOf(p.sign) === si);

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 80px)", gap: 2 }}>
        {grid.flat().map((si, i) => {
          if (si === -1) return <div key={i} style={{ width: 80, height: 80, background: T.bgTer, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, color: T.accent, opacity: 0.3 }}>🕉️</span>
          </div>;
          const planets = getPlanets(si);
          const isAsc = si === ascIdx;
          return (
            <div key={i} style={{ width: 80, height: 80, background: isAsc ? T.accentDim : T.bgCard, border: `1px solid ${isAsc ? T.accent : T.border}`, borderRadius: 4, padding: 4, overflow: "hidden", fontSize: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: isAsc ? T.accent : T.textMuted, fontWeight: 600 }}>{SS[SIGNS[si]]} {SIGNS[si].slice(0,3)}</span>
                {isAsc && <span style={{ color: T.accent, fontSize: 7, fontWeight: 700 }}>ASC</span>}
              </div>
              <div style={{ marginTop: 2 }}>
                {planets.map(([name]) => (
                  <span key={name} style={{ display: "inline-block", fontSize: 9, color: PC[name], fontWeight: 700, marginRight: 3 }}>
                    {PS[name]}{CHART.planets[name].retro ? "ᴿ" : ""}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — Overview
  // ═══════════════════════════════════════════════════
  const renderChartOverview = () => (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
      {/* Left: Chart */}
      <div>
        <div style={S.card}>{renderSIChart()}</div>
        <div style={{ ...S.card, marginTop: 12, fontSize: 11, color: T.textSec, lineHeight: 1.8 }}>
          <div><strong style={{ color: T.text }}>Name:</strong> {CHART.name}</div>
          <div><strong style={{ color: T.text }}>Birth:</strong> {CHART.dob}, {CHART.time}</div>
          <div><strong style={{ color: T.text }}>Place:</strong> {CHART.place}</div>
          <div><strong style={{ color: T.text }}>Lagna:</strong> <span style={{ color: T.accent }}>{SS[CHART.asc]} {CHART.asc} ({CHART.ascDeg.toFixed(2)}°)</span></div>
          <div><strong style={{ color: T.text }}>Moon:</strong> {SS[CHART.moonSign]} {CHART.moonSign} | <strong style={{ color: T.text }}>Sun:</strong> {SS[CHART.sunSign]} {CHART.sunSign}</div>
          <div><strong style={{ color: T.text }}>Dasha:</strong> <span style={{ color: PC.Moon }}>{CHART.currentDasha}</span></div>
        </div>
      </div>
      {/* Right: Quick insights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Yogas */}
        <div style={S.cardGlow}>
          <p style={S.label}>Active Yogas</p>
          {CHART.yogas.map((y, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: y.good ? T.pos : T.neg }}>{y.name}</span>
                <span style={S.badge(y.good ? T.pos : T.neg)}>{y.cat} · {Math.round(y.strength * 100)}%</span>
              </div>
              <p style={{ fontSize: 11, color: T.textSec, margin: "4px 0 0", lineHeight: 1.5 }}>{y.desc}</p>
            </div>
          ))}
        </div>
        {/* Current Dasha */}
        <div style={S.card}>
          <p style={S.label}>Current Vimshottari Dasha</p>
          {CHART.dashas.filter(d => d.active).map(d => (
            <div key={d.lord}>
              <div style={{ fontSize: 14, fontWeight: 700, color: PC[d.lord] }}>{PS[d.lord]} {d.lord} Maha Dasha <span style={{ fontSize: 10, color: T.textMuted }}>({d.start} – {d.end})</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                {d.antars?.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", background: a.active ? T.accentDim : "transparent", borderRadius: 4, borderLeft: a.active ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                    <span style={{ fontSize: 12, color: PC[a.lord] }}>{PS[a.lord]}</span>
                    <span style={{ fontSize: 11, color: a.active ? T.accent : T.textSec, fontWeight: a.active ? 700 : 400 }}>{a.lord}</span>
                    <span style={{ fontSize: 9, color: T.textMuted, marginLeft: "auto" }}>{a.start} – {a.end}</span>
                    {a.active && <span style={S.badge(T.accent)}>CURRENT</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Planet Quick View */}
        <div style={S.card}>
          <p style={S.label}>Planet Positions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {Object.entries(CHART.planets).map(([name, p]) => (
              <div key={name} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: "6px 8px", fontSize: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: PC[name], fontSize: 14 }}>{PS[name]}</span>
                  <span style={{ color: T.text, fontWeight: 600 }}>{name}</span>
                  {p.retro && <span style={{ color: T.neg, fontSize: 8 }}>ᴿ</span>}
                </div>
                <div style={{ color: T.textMuted, marginTop: 2 }}>{SS[p.sign]} {p.sign} · H{p.house}</div>
                <div style={{ color: T.textMuted }}>{p.nak} {p.pada}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — Planets Detail
  // ═══════════════════════════════════════════════════
  const renderPlanets = () => (
    <div style={S.card}>
      <p style={S.label}>Planetary Positions — Detailed</p>
      <div style={{ overflowX: "auto" }}>
        <table style={S.table}>
          <thead>
            <tr>{["Planet","Sign","Degree","Nakshatra","Pada","Nak Lord","House","Sub Lord","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {Object.entries(CHART.planets).map(([name, p]) => (
              <tr key={name}>
                <td style={{ ...S.td, color: PC[name], fontWeight: 700 }}>{PS[name]} {name}</td>
                <td style={S.td}>{SS[p.sign]} {p.sign}</td>
                <td style={S.td}>{p.deg.toFixed(2)}°</td>
                <td style={S.td}>{p.nak}</td>
                <td style={{ ...S.td, textAlign: "center" }}>{p.pada}</td>
                <td style={{ ...S.td, color: PC[p.nakLord] }}>{p.nakLord}</td>
                <td style={{ ...S.td, textAlign: "center", fontWeight: 700 }}>H{p.house}</td>
                <td style={{ ...S.td, color: PC[p.subLord] }}>{p.subLord}</td>
                <td style={S.td}>
                  {p.retro && <span style={S.badge(T.neg)}>Retro</span>}
                  {p.ownSign && <span style={S.badge(T.pos)}>Own Sign</span>}
                  {!p.retro && !p.ownSign && <span style={{ color: T.textMuted }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — Houses
  // ═══════════════════════════════════════════════════
  const renderHouses = () => (
    <div style={S.card}>
      <p style={S.label}>House Cusps & Occupants</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {Object.entries(CHART.houses).map(([num, h]) => (
          <div key={num} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 10, border: `1px solid ${h.occ.length > 0 ? T.borderAcc : T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>H{num}</span>
              <span style={{ fontSize: 10, color: T.textMuted }}>{SS[h.sign]} {h.sign}</span>
            </div>
            <div style={{ fontSize: 10, color: T.textSec, marginTop: 4 }}>Lord: <span style={{ color: PC[h.lord] }}>{PS[h.lord]} {h.lord}</span></div>
            {h.occ.length > 0 && (
              <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {h.occ.map(p => <span key={p} style={{ ...S.badge(PC[p]), fontSize: 10 }}>{PS[p]} {p}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — KP Significators
  // ═══════════════════════════════════════════════════
  const renderKP = () => (
    <div style={S.card}>
      <p style={S.label}>KP House Significators</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {Object.entries(CHART.kpSignificators).map(([house, planets]) => (
          <div key={house} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.accent, marginBottom: 4 }}>House {house}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {planets.map(p => <span key={p} style={{ ...S.badge(PC[p]) }}>{PS[p]} {p}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 11, color: T.textSec, lineHeight: 1.7, padding: "10px 12px", background: T.bgTer, borderRadius: T.radiusSm }}>
        <strong style={{ color: T.accent }}>KP Method:</strong> Each house cusp's sub-lord determines results. Planets listed are significators through star-lord and sub-lord chain. Houses 2,6,10,11 activation = career/financial gains. Houses 5,7,11 = marriage. Houses 3,9,12 = foreign travel.
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — Yogas
  // ═══════════════════════════════════════════════════
  const renderYogas = () => (
    <div style={S.card}>
      <p style={S.label}>Planetary Yogas</p>
      {CHART.yogas.map((y, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 8, background: T.bgTer, borderRadius: T.radiusSm, borderLeft: `3px solid ${y.good ? T.pos : T.neg}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{y.name}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={S.badge(y.good ? T.pos : T.neg)}>{y.cat}</span>
              <span style={S.badge(T.accent)}>{Math.round(y.strength * 100)}%</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: T.textSec, margin: "6px 0 0", lineHeight: 1.6 }}>{y.desc}</p>
          <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
            {y.planets.map(p => <span key={p} style={{ ...S.badge(PC[p]) }}>{PS[p]} {p}</span>)}
          </div>
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: ASTROLOGY — Dashas Timeline
  // ═══════════════════════════════════════════════════
  const renderDashas = () => (
    <div style={S.card}>
      <p style={S.label}>Vimshottari Dasha Timeline</p>
      {CHART.dashas.map((d, i) => (
        <div key={i} style={{ marginBottom: 12, padding: 12, background: d.active ? T.accentDim : T.bgTer, borderRadius: T.radiusSm, border: `1px solid ${d.active ? T.borderAcc : T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: PC[d.lord] }}>{PS[d.lord]} {d.lord} Dasha ({d.years} yrs)</span>
            <span style={{ fontSize: 10, color: T.textMuted }}>{d.start} – {d.end}</span>
          </div>
          {d.antars && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
              {d.antars.map((a, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 8px", background: a.active ? `${T.accent}12` : "transparent", borderRadius: 3 }}>
                  <span style={{ width: 18, fontSize: 12, color: PC[a.lord] }}>{PS[a.lord]}</span>
                  <span style={{ fontSize: 10, color: a.active ? T.accent : T.textSec, fontWeight: a.active ? 700 : 400, flex: 1 }}>{a.lord}</span>
                  <span style={{ fontSize: 9, color: T.textMuted }}>{a.start} – {a.end}</span>
                  {a.active && <span style={S.badge(T.accent)}>NOW</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: VASTU — Quick Cross-Check
  // ═══════════════════════════════════════════════════
  const renderVastu = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Upload */}
        <div style={{ ...S.card, cursor: "pointer", textAlign: "center", minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${vastuFloor ? T.pos : T.border}` }}
          onClick={() => vastuFileRef.current?.click()}>
          {vastuFloor ? (
            <><img src={vastuFloor} alt="Plan" style={{ maxHeight: 100, borderRadius: 4, opacity: 0.7 }} /><p style={{ fontSize: 10, color: T.pos, marginTop: 4 }}>Plan uploaded — click to replace</p></>
          ) : (
            <><div style={{ fontSize: 32, opacity: 0.5 }}>📐</div><p style={{ fontSize: 12, color: T.textSec, margin: "8px 0 0" }}>Upload Floor Plan (optional)</p></>
          )}
          <input ref={vastuFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const f = e.target.files?.[0]; if (!f) return;
            const r = new FileReader(); r.onload = ev => setVastuFloor(ev.target.result); r.readAsDataURL(f);
          }} />
        </div>

        {/* Zone reference */}
        <div style={S.card}>
          <p style={S.label}>Vastu Zone Reference</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            {["NW","N","NE","W","Center","E","SW","S","SE"].map(z => {
              const zone = VASTU_ZONES[z];
              return (
                <div key={z} style={{ background: T.bgTer, borderRadius: 4, padding: 6, textAlign: "center", fontSize: 9 }}>
                  <div style={{ fontSize: 14 }}>{zone.symbol}</div>
                  <div style={{ color: zone.color, fontWeight: 700 }}>{z}</div>
                  <div style={{ color: T.textMuted }}>{zone.element}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Room palette + Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
        <div style={S.card}>
          <p style={{ ...S.label, fontSize: 9 }}>Rooms</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {ROOM_TYPES.map(rm => (
              <button key={rm.id} onClick={() => setVastuRoom(vastuRoom === rm.id ? null : rm.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", border: `1px solid ${vastuRoom === rm.id ? T.accent : T.border}`,
                borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: T.font, background: vastuRoom === rm.id ? T.accentDim : "transparent",
                color: vastuRoom === rm.id ? T.accent : T.textSec, textAlign: "left",
              }}>
                <span style={{ fontSize: 12 }}>{rm.icon}</span> {rm.label}
              </button>
            ))}
          </div>
        </div>

        {/* 9x9 Grid */}
        <div>
          <div style={{ textAlign: "center", marginBottom: 4, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 2 }}>NORTH</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 2, position: "relative" }}>
            {vastuFloor && <img src={vastuFloor} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, borderRadius: 4, pointerEvents: "none" }} />}
            {Array.from({ length: 81 }).map((_, i) => {
              const r = Math.floor(i / 9), c = i % 9;
              const assigned = vastuGrid[r][c];
              const zone = getZone(r, c);
              const zInfo = VASTU_ZONES[zone];
              const rm = assigned ? ROOM_TYPES.find(x => x.id === assigned) : null;
              const isCenter = zone === "Center";

              return (
                <div key={i} onClick={() => {
                  if (!vastuRoom) return;
                  setVastuGrid(prev => { const n = prev.map(x => [...x]); n[r][c] = n[r][c] === vastuRoom ? null : vastuRoom; return n; });
                }} style={{
                  aspectRatio: "1", border: `1px solid ${assigned ? T.borderAcc : isCenter ? `${T.indigo}33` : T.border}`,
                  borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: vastuRoom ? "pointer" : "default", fontSize: 8,
                  background: assigned ? `${T.accent}12` : isCenter ? `${T.indigo}08` : "transparent",
                  position: "relative", zIndex: 1,
                }}>
                  {assigned ? (
                    <><span style={{ fontSize: 12 }}>{rm?.icon}</span><span style={{ fontSize: 6, color: T.accent }}>{rm?.label?.split(" ")[0]}</span></>
                  ) : (
                    <><span style={{ fontSize: 8, color: isCenter ? T.indigo : T.textMuted }}>{zone}</span></>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 4, fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: 2 }}>SOUTH</div>

          {/* Quick Analysis button */}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button style={S.btn(false)} onClick={() => setVastuGrid(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)))}>Clear</button>
            <button style={S.btn(true)} onClick={() => alert("For full analysis with detailed defect detection, remedies, and report generation, use the dedicated Vastu Cross-Check tool (vastu_crosscheck.jsx)")}>
              Analyze Placements
            </button>
          </div>
        </div>
      </div>

      {/* Zone Details */}
      <div style={{ ...S.card, marginTop: 16 }}>
        <p style={S.label}>Direction-Wise Vastu Rules</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {Object.entries(VASTU_ZONES).map(([dir, z]) => (
            <div key={dir} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: z.color, fontSize: 13 }}>{z.symbol} {dir}</span>
                <span style={{ fontSize: 9, color: T.textMuted }}>{z.element}</span>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>{z.deity}</div>
              <div style={{ fontSize: 10, color: T.pos, lineHeight: 1.5 }}>✓ {z.ideal.join(", ")}</div>
              <div style={{ fontSize: 10, color: T.neg, lineHeight: 1.5 }}>✗ {z.avoid.join(", ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: MUHURTA (Placeholder with today's data)
  // ═══════════════════════════════════════════════════
  const renderMuhurta = () => (
    <div>
      <div style={{ ...S.cardGlow, marginBottom: 16 }}>
        <p style={S.label}>Today's Panchang</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
          <div><strong style={{ color: T.text }}>Tithi:</strong> Krishna Navami</div>
          <div><strong style={{ color: T.text }}>Nakshatra:</strong> Shravana (Moon)</div>
          <div><strong style={{ color: T.text }}>Yoga:</strong> Sadhya</div>
          <div><strong style={{ color: T.text }}>Karana:</strong> Taitila</div>
          <div><strong style={{ color: T.text }}>Moon Sign:</strong> ♑ Capricorn</div>
          <div><strong style={{ color: T.text }}>Paksha:</strong> Krishna</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={S.card}>
          <p style={{ ...S.label, color: T.pos }}>Auspicious Windows</p>
          {[
            { name: "Brahma Muhurta", time: "04:39–05:27", power: "supreme" },
            { name: "Abhijit Muhurta", time: "12:07–12:55", power: "supreme" },
            { name: "Jupiter Hora", time: "07:49–09:23", power: "high" },
            { name: "Venus Hora", time: "12:31–02:05", power: "high" },
            { name: "Moon Hora", time: "03:39–05:13", power: "high" },
          ].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}22`, fontSize: 11 }}>
              <span style={{ color: T.text }}>{w.name}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: T.textMuted }}>{w.time}</span>
                <span style={S.badge(w.power === "supreme" ? T.accent : T.pos)}>{w.power}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <p style={{ ...S.label, color: T.neg }}>Inauspicious Windows</p>
          {[
            { name: "Gulika Kaal", time: "06:15–07:49", severity: "high" },
            { name: "Rahu Kaal", time: "09:23–10:57", severity: "high" },
            { name: "Yamagandam", time: "02:05–03:39", severity: "medium" },
          ].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}22`, fontSize: 11 }}>
              <span style={{ color: T.text }}>{w.name}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: T.textMuted }}>{w.time}</span>
                <span style={S.badge(w.severity === "high" ? T.neg : T.warn)}>{w.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // TAB: PREDICTIONS
  // ═══════════════════════════════════════════════════
  const renderPredictions = () => {
    const predictions = [
      { system: "KP", cat: "Foreign Travel", score: 90, text: "Very strong indicators through H3+H9+H12 sub-lord chain.", color: T.pos },
      { system: "KP", cat: "Career", score: 63, text: "Career significators active through H2,6,10,11. Sun in 10th = authority.", color: T.accent },
      { system: "KP", cat: "Financial Gain", score: 63, text: "Venus as H11 sub-lord in 11th — textbook gain indicator.", color: T.accent },
      { system: "Nadi", cat: "Mars-Rahu Conjunction", score: 85, text: "Aggression, deceptive action. Remedy: Hanuman Chalisa daily.", color: T.warn },
      { system: "Nadi", cat: "Jupiter Transit", score: 85, text: "Jupiter transiting Ascendant — expansion, new beginnings.", color: T.pos },
      { system: "Parashari", cat: "Gajakesari Yoga", score: 80, text: "Jupiter kendra from Moon — wisdom and fortune activated.", color: T.pos },
      { system: "BG", cat: "Saturn-Sun Transit", score: 15, text: "Saturn conjunct natal Sun — career restructuring peak. Patience needed.", color: T.neg },
      { system: "KP", cat: "Health", score: 10, text: "H1,6,8,12 activation. Health monitoring required.", color: T.neg },
    ];

    return (
      <div style={S.card}>
        <p style={S.label}>Multi-Method Predictions — Current Period</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {predictions.sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: T.bgTer, borderRadius: T.radiusSm, borderLeft: `3px solid ${p.color}` }}>
              <div style={{ minWidth: 40, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{p.score}</div>
                <div style={{ fontSize: 8, color: T.textMuted }}>score</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{p.cat}</span>
                  <span style={S.badge(T.info)}>{p.system}</span>
                </div>
                <p style={{ fontSize: 11, color: T.textSec, margin: 0, lineHeight: 1.5 }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // TAB: SETTINGS (simplified)
  // ═══════════════════════════════════════════════════
  const renderSettings = () => (
    <div style={S.card}>
      <p style={S.label}>Profile & Settings</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12, color: T.textSec, lineHeight: 2 }}>
        <div>
          <div><strong style={{ color: T.text }}>Name:</strong> {CHART.name}</div>
          <div><strong style={{ color: T.text }}>DOB:</strong> {CHART.dob}</div>
          <div><strong style={{ color: T.text }}>Time:</strong> {CHART.time}</div>
          <div><strong style={{ color: T.text }}>Place:</strong> {CHART.place}</div>
          <div><strong style={{ color: T.text }}>Ascendant:</strong> {CHART.asc} ({CHART.ascDeg}°)</div>
        </div>
        <div>
          <div><strong style={{ color: T.text }}>Ayanamsha:</strong> Lahiri (23.581°)</div>
          <div><strong style={{ color: T.text }}>House System:</strong> Placidus</div>
          <div><strong style={{ color: T.text }}>Lagna Lord:</strong> {CHART.lagnaLord}</div>
          <div><strong style={{ color: T.text }}>Current Dasha:</strong> {CHART.currentDasha}</div>
          <div><strong style={{ color: T.text }}>Moon Sign:</strong> {CHART.moonSign}</div>
        </div>
      </div>
      <p style={{ fontSize: 10, color: T.textMuted, marginTop: 16, lineHeight: 1.6 }}>
        Silicon Siddhanta v2.0 — Vedic Intelligence Platform<br/>
        Engines: KP System + Parashari BPHS + Brajesh Gautam Method + Nadi Jyotish<br/>
        Data: Swiss Ephemeris via Python (skyfield + swisseph)
      </p>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // FLOATING BREATHING ORB
  // ═══════════════════════════════════════════════════
  const renderBreathingFloater = () => {
    const orbSize = breathExpanded ? 280 : 50;
    const innerSize = breathExpanded ? orbSize * breathOrbScale : 36;

    return (
      <>
        {/* Backdrop when expanded */}
        {breathExpanded && (
          <div onClick={() => { setBreathExpanded(false); stopBreathing(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9998, backdropFilter: "blur(4px)" }} />
        )}

        {/* Floating orb / expanded panel */}
        <div style={{
          position: "fixed",
          bottom: breathExpanded ? "50%" : 24,
          right: breathExpanded ? "50%" : 24,
          transform: breathExpanded ? "translate(50%, 50%)" : "none",
          zIndex: 9999,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {!breathExpanded ? (
            /* Mini orb */
            <div
              onClick={() => { setBreathOpen(!breathOpen); if (!breathOpen) setBreathExpanded(false); }}
              style={{
                width: 50, height: 50, borderRadius: "50%",
                background: breathRunning ? `radial-gradient(circle, ${breathColor}cc, ${breathColor}44)` : `radial-gradient(circle, ${T.accent}88, ${T.bgTer})`,
                boxShadow: breathRunning ? `0 0 20px ${breathColor}66` : T.shadow,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${breathRunning ? breathColor : T.border}`,
                transition: "all 0.3s",
                animation: breathRunning ? "none" : undefined,
              }}
            >
              {breathRunning ? (
                <span style={{ fontSize: 12, fontWeight: 800, color: T.text }}>{breathLabel}</span>
              ) : (
                <span style={{ fontSize: 22 }}>🌬️</span>
              )}
            </div>
          ) : (
            /* Expanded breathing panel */
            <div style={{
              width: 380, background: T.bgOverlay, border: `1px solid ${T.borderAcc}`,
              borderRadius: T.radiusLg, padding: 24, boxShadow: `0 8px 40px rgba(0,0,0,0.6)`,
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.accent }}>🌬️ Pranayama</div>
                  <div style={{ fontSize: 10, color: T.textMuted }}>Sadhguru · Sri Sri · Classical</div>
                </div>
                <button onClick={() => { setBreathExpanded(false); stopBreathing(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: T.textMuted }}>✕</button>
              </div>

              {/* Technique selector */}
              {!breathRunning && (
                <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
                  {BREATH_TECHNIQUES.map(tech => (
                    <div key={tech.id} onClick={() => setBreathTech(tech)} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 4,
                      borderRadius: T.radiusSm, cursor: "pointer",
                      background: breathTech.id === tech.id ? T.accentDim : "transparent",
                      border: `1px solid ${breathTech.id === tech.id ? T.accent : "transparent"}`,
                    }}>
                      <span style={{ fontSize: 18 }}>{tech.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: breathTech.id === tech.id ? T.accent : T.text }}>{tech.name}</div>
                        <div style={{ fontSize: 9, color: T.textMuted }}>{tech.teacher} · {tech.desc}</div>
                      </div>
                      <span style={{ fontSize: 9, color: T.textMuted }}>{tech.rounds}×</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Breathing Orb */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* Rings */}
                  {[1, 2].map(i => (
                    <div key={i} style={{
                      position: "absolute", width: innerSize + i * 24, height: innerSize + i * 24,
                      borderRadius: "50%", border: `1px solid ${breathColor}${i === 1 ? "22" : "11"}`,
                      transition: "all 0.3s",
                    }} />
                  ))}
                  {/* Core orb */}
                  <div style={{
                    width: innerSize, height: innerSize, borderRadius: "50%",
                    background: `radial-gradient(circle at 40% 35%, ${breathColor}cc, ${breathColor}44 60%, transparent)`,
                    boxShadow: `0 0 ${innerSize * 0.3}px ${breathColor}44`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease-out",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: 2 }}>{breathLabel}</div>
                    {breathRunning && <div style={{ fontSize: 9, color: `${T.text}88`, marginTop: 2 }}>{breathRound + 1}/{breathTech.rounds}</div>}
                  </div>
                </div>

                {/* Current technique name */}
                <div style={{ fontSize: 12, color: T.accent, fontWeight: 600, marginTop: 8 }}>{breathTech.icon} {breathTech.name}</div>
                {breathRunning && <div style={{ fontSize: 10, color: T.textMuted }}>Breath {breathCount + 1} · Round {breathRound + 1}</div>}
              </div>

              {/* Controls */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {!breathRunning ? (
                  <button onClick={startBreathing} style={{ ...S.btn(true), padding: "10px 32px" }}>▶ Begin</button>
                ) : (
                  <>
                    <button onClick={() => setBreathPaused(p => !p)} style={S.btn(breathPaused)}>{breathPaused ? "▶ Resume" : "⏸ Pause"}</button>
                    <button onClick={stopBreathing} style={S.btn(false)}>■ Stop</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mini menu (when orb clicked but not expanded) */}
          {breathOpen && !breathExpanded && (
            <div style={{
              position: "absolute", bottom: 60, right: 0, width: 220,
              background: T.bgOverlay, border: `1px solid ${T.border}`, borderRadius: T.radius,
              padding: 10, boxShadow: T.shadow,
            }}>
              <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 6 }}>Quick Breathe</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {BREATH_TECHNIQUES.slice(0, 5).map(tech => (
                  <div key={tech.id} onClick={() => { setBreathTech(tech); setBreathExpanded(true); setBreathOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 4, cursor: "pointer",
                    fontSize: 11, color: T.textSec, background: "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgTer}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span>{tech.icon}</span> {tech.name}
                  </div>
                ))}
              </div>
              <div onClick={() => { setBreathExpanded(true); setBreathOpen(false); }} style={{
                marginTop: 6, padding: "6px 8px", borderRadius: 4, cursor: "pointer",
                fontSize: 10, color: T.accent, textAlign: "center", border: `1px solid ${T.borderAcc}`,
              }}>
                View All Techniques →
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  // ═══════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════
  return (
    <div style={S.app}>
      {/* ── Top Navigation ── */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 24 }}>
          <span style={{ fontSize: 22, color: T.accent }}>🕉️</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.accent, letterSpacing: 0.5 }}>Silicon Siddhanta</div>
            <div style={{ fontSize: 9, color: T.textMuted }}>Vedic Intelligence Platform</div>
          </div>
        </div>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={S.navBtn(activeTab === tab.id)}>
            <span style={{ fontSize: 14 }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Sub Navigation (Astrology) ── */}
      {activeTab === "chart" && (
        <div style={S.subNav}>
          {CHART_SUBS.map(sub => (
            <button key={sub} onClick={() => setChartSub(sub)} style={S.subBtn(chartSub === sub)}>{sub}</button>
          ))}
        </div>
      )}

      {/* ── Page Content ── */}
      <div style={S.body}>
        {activeTab === "chart" && chartSub === "overview" && renderChartOverview()}
        {activeTab === "chart" && chartSub === "planets" && renderPlanets()}
        {activeTab === "chart" && chartSub === "houses" && renderHouses()}
        {activeTab === "chart" && chartSub === "dashas" && renderDashas()}
        {activeTab === "chart" && chartSub === "kp" && renderKP()}
        {activeTab === "chart" && chartSub === "yogas" && renderYogas()}
        {activeTab === "muhurta" && renderMuhurta()}
        {activeTab === "vastu" && renderVastu()}
        {activeTab === "predictions" && renderPredictions()}
        {activeTab === "settings" && renderSettings()}
      </div>

      {/* ── Floating Breathing Orb ── */}
      {renderBreathingFloater()}

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", padding: "16px 0", borderTop: `1px solid ${T.border}22`, fontSize: 9, color: T.textMuted }}>
        Silicon Siddhanta v2.0 · KP + Parashari + Nadi + BG Method · Swiss Ephemeris · {CHART.name}
      </div>
    </div>
  );
}
