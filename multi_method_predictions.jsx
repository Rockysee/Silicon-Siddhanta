import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { VEDIC_THEME, PLANET_COLORS, PLANET_SYMBOLS, cardStyle, sectionLabel, badgeStyle, progressBar, chartTooltipStyle, pageRoot, headerBar, footerStyle, hexToRgba } from "./vedic_theme.js";

const T = VEDIC_THEME;

// ═══════════════════════════════════════════════════════════════
// MULTI-METHOD PREDICTION DATA
// Computed by Silicon Siddhanta Engine | Swiss Ephemeris
// For: Hemant Thackeray | 27/03/1980, 11:45 AM, Kalyan
// Date: 11 April 2026
// ═══════════════════════════════════════════════════════════════

const METHODS = [
  {
    id: "brajesh",
    name: "Brajesh Gautam Method",
    subtitle: "Consciousness + KP + Parashari (Three Fortune Levels)",
    score: 53,
    color: "#A855F7",
    icon: "🔮",
    components: [
      { name: "Chart Promise", score: 47, max: 100, items: [
        { text: "Moon in own sign Cancer (H2): Strong emotional/financial base", points: "+15", good: true },
        { text: "Gajakesari Yoga (Jupiter kendra from Moon): Wisdom, fortune", points: "+12", good: true },
        { text: "Lagna lord Mercury in 9th house: Fortune through intellect", points: "+10", good: true },
        { text: "Sun in 10th house (Karma Bhava): Natural authority", points: "+8", good: true },
        { text: "Venus in 11th house (Labha): Gains through arts/women", points: "+8", good: true },
        { text: "Mars+Jupiter+Rahu in 3rd: Courage but inner conflict", points: "+2", good: true },
        { text: "Saturn(R) in 4th: Delayed domestic peace", points: "−5", good: false },
        { text: "4 Retrograde planets: Past karma pulling life backward", points: "−3", good: false },
      ]},
      { name: "Dasha Activation", score: 15, max: 100, items: [
        { text: "Moon Maha Dasha: Emotional focus, public life, finances", points: "+10", good: true },
        { text: "Dasha lord Moon in own sign: Strongly placed lord", points: "+8", good: true },
        { text: "Ketu Bhukti: Detachment, sudden changes, spiritual pull", points: "−3", good: false },
        { text: "Rahu Pratyantar: Confusion within spiritual period", points: "−2", good: false },
      ]},
      { name: "Transit Trigger", score: -9, max: 100, items: [
        { text: "Saturn conjunct natal Sun (0.5°): Career restructuring PEAK", points: "−15", good: false },
        { text: "Jupiter transiting Ascendant: Personal expansion, protection", points: "+12", good: true },
        { text: "Jupiter 12th from Moon: Hidden expenses, spiritual calling", points: "−5", good: false },
        { text: "Ketu near natal Jupiter: Spiritual wisdom, reduced expansion", points: "−2", good: false },
      ]},
    ],
    interpretation: "Brajesh Gautam's 'Three Fortune Levels' show strong CHART PROMISE (natal strength is excellent — Gajakesari Yoga, Moon own sign, Mercury in 9th). The DASHA ACTIVATION is moderately positive (Moon in own sign as dasha lord). However, the TRANSIT TRIGGER is currently negative due to Saturn sitting exactly on your natal Sun. Per Brajesh's 'Cosmic WiFi' analogy — your signal is strong but there's interference. Patience and spiritual practice will clear the channel.",
  },
  {
    id: "kp",
    name: "KP System",
    subtitle: "Krishnamurti Paddhati (Sub-Lord Significators)",
    score: 82,
    color: "#3B82F6",
    icon: "🎯",
    components: [
      { name: "Career Signification", score: 63, max: 100, items: [
        { text: "H10 cusp sub-lord Venus: Connected to 11th (gains) + 12th", points: "+5", good: true },
        { text: "Career significators (H2,6,10,11): Strong activation", points: "+8", good: true },
      ]},
      { name: "Financial Promise", score: 72, max: 100, items: [
        { text: "H11 cusp sub-lord Venus in 11th: Strong gain indicator", points: "+10", good: true },
        { text: "H2 cusp sub-lord Rahu: Occupant of 3rd, risk element", points: "−3", good: false },
      ]},
      { name: "Foreign Travel", score: 90, max: 100, items: [
        { text: "H3+H9+H12 sub-lords all connected: Highly indicated", points: "+12", good: true },
      ]},
      { name: "Current Period KP", score: 60, max: 100, items: [
        { text: "Moon signifies H1,2: Self and finances activated", points: "+5", good: true },
        { text: "Ketu signifies H6,9: Health watch + spiritual focus", points: "−2", good: false },
      ]},
    ],
    interpretation: "KP system analysis is the most optimistic at 82%. The sub-lord chain analysis shows strong financial gains (Venus as H11 sub-lord in 11th itself — a textbook KP gain indicator). Foreign travel is 90% indicated. Career is modestly positive despite Saturn's transit. The KP approach weights house cuspal sub-lords heavily, and your cusps have strong connections to gain houses (2, 6, 10, 11).",
  },
  {
    id: "parashari",
    name: "Classical Parashari",
    subtitle: "BPHS Framework (Yogas + Dasha + Ashtakavarga)",
    score: 92,
    color: "#22C55E",
    icon: "📜",
    components: [
      { name: "Yoga Strength", score: 85, max: 100, items: [
        { text: "Gajakesari Yoga: Wisdom, good character, fortune", points: "+15", good: true },
        { text: "Moon in own sign: Emotional stability, financial instinct", points: "+10", good: true },
        { text: "Sun in 10th: Natural authority", points: "+8", good: true },
        { text: "Lagna lord in 9th: Dharma-karma alignment", points: "+8", good: true },
      ]},
      { name: "Dasha Quality", score: 75, max: 100, items: [
        { text: "Moon Dasha with Moon in own sign: Strong period", points: "+8", good: true },
        { text: "4 planets in 3rd: Courage but restlessness", points: "+3", good: true },
        { text: "Saturn(R) in 4th: Domestic challenges", points: "−5", good: false },
      ]},
      { name: "Transit Impact", score: 50, max: 100, items: [
        { text: "Jupiter on Ascendant: Expansion + protection", points: "+8", good: true },
        { text: "Saturn conjunct natal Sun: Career pressure", points: "−10", good: false },
        { text: "Saturn low Ashtakavarga in Pisces: More challenging", points: "−3", good: false },
      ]},
    ],
    interpretation: "Classical Parashari gives the highest natal score at 92% — your birth chart has strong fundamentals. Gajakesari Yoga, Moon in own sign, Sun in 10th, and Lagna lord in 9th are all classical indicators of a fortunate chart. The Parashari system weights natal promise higher than transits, which is why it scores highest. The current transit challenge (Saturn on Sun) is seen as temporary compared to permanent yogas.",
  },
  {
    id: "nadi",
    name: "Nadi Astrology",
    subtitle: "Bhrigu Nandi Nadi (Conjunction Rules + Transits)",
    score: 71,
    color: "#F59E0B",
    icon: "🌿",
    components: [
      { name: "Natal Conjunctions", score: 65, max: 100, items: [
        { text: "Mars-Jupiter conjunction: Virtuous action, political success", points: "+10", good: true },
        { text: "Moon own sign: Strong Jal Tatva, emotional intelligence", points: "+8", good: true },
        { text: "Jupiter-Rahu (Guru Chandal): Unconventional wisdom, deception risk", points: "−5", good: false },
        { text: "Ketu in Aquarius: Spiritual detachment", points: "+3", good: true },
      ]},
      { name: "Transit Analysis", score: 55, max: 100, items: [
        { text: "Saturn on natal Sun: Father/authority karmic debt surfacing", points: "−8", good: false },
        { text: "Sade Sati NOT active: No systemic Saturn pressure", points: "+5", good: true },
        { text: "Jupiter on Ascendant: Guru's blessings on personality", points: "+8", good: true },
      ]},
    ],
    interpretation: "Nadi astrology scores 71% — moderately favorable. The Bhrigu Nandi rules highlight Mars-Jupiter conjunction as a strong positive (virtuous action, expansion through courage). However, Guru Chandal Yoga (Jupiter-Rahu) creates a mixed spiritual outlook. The key Nadi insight: Saturn on your natal Sun is framed as 'father/authority karmic debt surfacing' — a specific karmic lesson that must be experienced, not avoided. The absence of Sade Sati is a significant relief.",
  },
];

const COMPOSITE = {
  score: 75,
  weights: { "Parashari": 30, "KP": 25, "Nadi": 20, "Brajesh Gautam": 25 },
  contributions: { "Parashari": 27.6, "KP": 20.5, "Nadi": 14.2, "Brajesh Gautam": 13.2 },
  assessment: "FAVORABLE — Good period for growth and action",
  overallGuidance: "Your chart has strong natal promise (Gajakesari Yoga, Moon own sign, Sun in 10th). All four methods agree on these fundamentals. The current challenge is Saturn sitting exactly on your natal Sun — this is the dominant theme until Saturn moves past 15° Pisces. Jupiter on your Ascendant is the protective factor. The Moon-Ketu dasha period ends July 2026, after which Moon-Venus begins — bringing significant positive shifts in relationships, finances, and creativity. Strategic patience now yields major rewards in the Venus Bhukti starting July 2026.",
  actions: {
    do: [
      "Use Jupiter-on-Ascendant energy for personal branding and learning",
      "Spiritual practices during Brahma Muhurta (align with Moon-Ketu energy)",
      "Prepare for Venus Bhukti (July 2026) — plan creative/financial projects now",
      "Foreign travel highly indicated — pursue international opportunities",
      "Build financial reserves (Moon Dasha + H11 Venus = gains through patience)",
    ],
    dont: [
      "Make impulsive career changes (Saturn on Sun = restructuring, not revolution)",
      "Confront authority figures directly (Saturn demands humility before superiors)",
      "Start major ventures during Rahu Kaal (9:23-10:57 AM today)",
      "Ignore health signals (Moon-Ketu can bring sudden health episodes)",
      "Neglect spiritual practice (Ketu Bhukti rewards inner work, punishes pure materialism)",
    ],
  },
};

const radarData = METHODS.map(m => ({ method: m.name.split(" ")[0], score: m.score }));

const barData = Object.entries(COMPOSITE.contributions).map(([name, val]) => ({
  name: name.length > 10 ? name.slice(0, 10) + "…" : name,
  fullName: name,
  value: parseFloat(val.toFixed(1)),
  weight: COMPOSITE.weights[name],
}));

const BAR_COLORS = { "Parashari": "#22C55E", "KP": "#3B82F6", "Nadi": "#F59E0B", "Brajesh Gau…": "#A855F7", "Brajesh Gautam": "#A855F7" };

export default function App() {
  const [expandedMethod, setExpandedMethod] = useState(null);

  const getScoreColor = (s) => s >= 80 ? T.positive : s >= 60 ? T.info : s >= 40 ? T.warning : T.negative;
  const getScoreLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Moderate" : "Challenging";

  // Keyframe animations for glassmorphism and glow effects
  const styleSheet = `
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.4), 0 2px 12px rgba(0,0,0,0.3); }
      50% { box-shadow: 0 0 30px rgba(34,197,94,0.6), 0 2px 12px rgba(0,0,0,0.3); }
    }
    @keyframes expand-in {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 1000px; }
    }
    .pulse-border { animation: pulse-glow 2s ease-in-out infinite; }
    .expand-transition { animation: expand-in 0.3s ease-out; }
  `;

  return (
    <div style={pageRoot}>
      <style>{styleSheet}</style>

      {/* Header */}
      <div style={{
        ...headerBar,
        backdropFilter: "blur(12px)",
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: T.accent }}>
          <span>SILICON SIDDHANTA</span>
          <span style={{ color: T.textSecondary, fontSize: 12, fontWeight: 400, marginLeft: 8 }}>Multi-Method Prediction Analysis</span>
        </h1>
        <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
          Hemant Thackeray | 27/03/1980, 11:45 AM, Kalyan | Analysis Date: 11 April 2026
        </div>
      </div>

      <div style={{ padding: "16px 20px", maxWidth: 950, margin: "0 auto" }}>

        {/* Composite Score Hero — with Gradient Border Glow */}
        <div style={{
          ...cardStyle(true),
          background: T.gradientCard,
          border: `2px solid ${T.borderAccent}`,
          textAlign: "center",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle gradient glow overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${hexToRgba(T.accent, 0.05)}, transparent)`,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={sectionLabel(T.accent)}>SILICON SIDDHANTA COMPOSITE SCORE</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: getScoreColor(COMPOSITE.score), lineHeight: 1 }}>
              {COMPOSITE.score}%
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(COMPOSITE.score), marginTop: 4 }}>
              {getScoreLabel(COMPOSITE.score)} — {COMPOSITE.assessment}
            </div>
            <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 12, maxWidth: 700, margin: "12px auto 0", lineHeight: 1.6 }}>
              {COMPOSITE.overallGuidance}
            </div>
          </div>
        </div>

        {/* Method Comparison Cards — with Subtle Glow Borders */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
          {METHODS.map(m => (
            <div key={m.id} onClick={() => setExpandedMethod(expandedMethod === m.id ? null : m.id)}
              style={{
                ...cardStyle(),
                background: expandedMethod === m.id ? hexToRgba(m.color, 0.08) : T.bgCard,
                border: `1.5px solid ${expandedMethod === m.id ? hexToRgba(m.color, 0.4) : T.border}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: expandedMethod === m.id ? `0 0 16px ${hexToRgba(m.color, 0.25)}, 0 2px 12px rgba(0,0,0,0.3)` : T.shadowCard,
              }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary }}>{m.name}</div>
              <div style={{ fontSize: 9, color: T.textSecondary, marginTop: 2, lineHeight: 1.3 }}>{m.subtitle}</div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={progressBar(m.score, m.color).container}>
                  <div style={progressBar(m.score, m.color).fill} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: m.color }}>{m.score}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Method Detail — with Smooth Transition */}
        {expandedMethod && (() => {
          const m = METHODS.find(x => x.id === expandedMethod);
          if (!m) return null;
          return (
            <div className="expand-transition" style={{
              ...cardStyle(true),
              background: hexToRgba(m.color, 0.06),
              border: `1.5px solid ${hexToRgba(m.color, 0.3)}`,
              marginBottom: 20,
              boxShadow: `0 0 16px ${hexToRgba(m.color, 0.15)}, 0 2px 12px rgba(0,0,0,0.3)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: T.textSecondary }}>{m.subtitle}</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 28, fontWeight: 900, color: m.color }}>{m.score}%</span>
              </div>

              {m.components.map((comp, ci) => (
                <div key={ci} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary }}>{comp.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: getScoreColor(comp.score) }}>{comp.score}/{comp.max}</span>
                  </div>
                  <div style={progressBar(comp.score, m.color).container}>
                    <div style={progressBar(comp.score, m.color).fill} />
                  </div>
                  {comp.items.map((item, ii) => (
                    <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "3px 0", fontSize: 11 }}>
                      <span style={{ color: item.good ? T.positive : T.negative, fontWeight: 700, minWidth: 14 }}>{item.good ? "+" : "−"}</span>
                      <span style={{ color: T.textSecondary, flex: 1 }}>{item.text}</span>
                      <span style={{ color: item.good ? T.positive : T.negative, fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>{item.points}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ marginTop: 12, padding: 12, background: hexToRgba(T.bgTertiary, 0.8), borderRadius: T.radiusSm, border: `1px solid ${hexToRgba(m.color, 0.1)}` }}>
                <div style={{ fontSize: 10, color: m.color, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>INTERPRETATION</div>
                <div style={{ fontSize: 11, color: T.textPrimary, lineHeight: 1.6 }}>{m.interpretation}</div>
              </div>
            </div>
          );
        })()}

        {/* Charts Side by Side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{...cardStyle()}}>
            <h3 style={sectionLabel(T.accent)}>METHOD COMPARISON</h3>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={hexToRgba(T.textSecondary, 0.2)} />
                  <PolarAngleAxis dataKey="method" tick={{ fill: T.textSecondary, fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: T.textMuted, fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke={T.accent} fill={T.accent} fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...cardStyle()}}>
            <h3 style={sectionLabel(T.accent)}>WEIGHTED CONTRIBUTION TO COMPOSITE</h3>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: T.textSecondary, fontSize: 9 }} />
                  <YAxis tick={{ fill: T.textMuted, fontSize: 9 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={Object.values(BAR_COLORS)[i] || T.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DO / DON'T — Improved Visual Hierarchy */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{
            ...cardStyle(),
            background: hexToRgba(T.positive, 0.06),
            border: `1.5px solid ${hexToRgba(T.positive, 0.25)}`,
            boxShadow: `0 0 12px ${hexToRgba(T.positive, 0.1)}, 0 2px 8px rgba(0,0,0,0.2)`,
          }}>
            <h3 style={{ fontSize: 13, color: T.positive, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 18 }}>✓</span>DO (This Period)
            </h3>
            {COMPOSITE.actions.do.map((a, i) => (
              <div key={i} style={{ fontSize: 11, color: T.textPrimary, padding: "6px 0", lineHeight: 1.5, display: "flex", gap: 8 }}>
                <span style={{ color: T.positive, fontWeight: 700, minWidth: 16, flexShrink: 0 }}>{i + 1}.</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
          <div style={{
            ...cardStyle(),
            background: hexToRgba(T.negative, 0.06),
            border: `1.5px solid ${hexToRgba(T.negative, 0.25)}`,
            boxShadow: `0 0 12px ${hexToRgba(T.negative, 0.1)}, 0 2px 8px rgba(0,0,0,0.2)`,
          }}>
            <h3 style={{ fontSize: 13, color: T.negative, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 18 }}>✗</span>DON'T (This Period)
            </h3>
            {COMPOSITE.actions.dont.map((a, i) => (
              <div key={i} style={{ fontSize: 11, color: T.textPrimary, padding: "6px 0", lineHeight: 1.5, display: "flex", gap: 8 }}>
                <span style={{ color: T.negative, fontWeight: 700, minWidth: 16, flexShrink: 0 }}>{i + 1}.</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dasha Transition Alert — with Pulsing Border Animation */}
        <div className="pulse-border" style={{
          ...cardStyle(true),
          background: hexToRgba(T.positive, 0.08),
          border: `2px solid ${hexToRgba(T.positive, 0.35)}`,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🔄</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.positive }}>UPCOMING SHIFT: Moon-Venus Bhukti (July 2026)</div>
              <div style={{ fontSize: 10, color: T.textSecondary }}>The challenging Ketu Bhukti ends → Venus brings major positive change</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.textPrimary, lineHeight: 1.6, marginTop: 6 }}>
            All four methods agree: when Moon-Venus Antar Dasha begins (approx. 20 July 2026), expect significant improvements in relationships, creativity, finances, and luxury. Venus is placed in your 11th house (gains) in Aries — an action-oriented Venus that delivers tangible material results. The current Ketu period is preparation; Venus is the harvest. Use these months to plant seeds for what you want Venus to bring.
          </div>
        </div>

        {/* Method Weight Explanation */}
        <div style={{
          ...cardStyle(),
          background: hexToRgba(T.bgTertiary, 0.6),
        }}>
          <h3 style={sectionLabel(T.accent)}>HOW THE COMPOSITE SCORE IS CALCULATED</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
            {METHODS.map(m => (
              <div key={m.id} style={{
                textAlign: "center",
                padding: 8,
                background: hexToRgba(T.bgTertiary, 0.8),
                border: `1px solid ${hexToRgba(m.color, 0.2)}`,
                borderRadius: T.radiusSm,
              }}>
                <div style={{ fontSize: 9, color: T.textSecondary }}>Weight</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{COMPOSITE.weights[m.name.split(" (")[0].replace(" Method", "")] || COMPOSITE.weights[Object.keys(COMPOSITE.weights).find(k => m.name.includes(k.split(" ")[0]))]}%</div>
                <div style={{ fontSize: 9, color: T.textMuted }}>{m.name.split(" ")[0]}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: T.textSecondary, lineHeight: 1.5 }}>
            Parashari (30%): Highest weight because it evaluates permanent chart strength. KP (25%): Precise sub-lord chain analysis for event timing. Brajesh Gautam (25%): Integrates consciousness framework with practical KP. Nadi (20%): Supplementary conjunction and transit rules. The composite balances natal promise with current period dynamics.
          </div>
        </div>
      </div>

      <div style={{
        ...footerStyle,
        borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{ fontSize: 9, color: T.textMuted }}>
          Silicon Siddhanta v1.0.0 | Multi-Method Vedic Analysis | Swiss Ephemeris | Lahiri 24.2242°
        </div>
      </div>
    </div>
  );
}
