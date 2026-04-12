import { useState } from "react";
import { VEDIC_THEME, PLANET_COLORS, PLANET_SYMBOLS, cardStyle, sectionLabel, tabStyle, badgeStyle, indicatorChip, chartTooltipStyle, pageRoot, headerBar, footerStyle, hexToRgba } from "./vedic_theme.js";

const T = VEDIC_THEME;

// ═══════════════════════════════════════════════════════════════
// ALL DATA — Computed via Swiss Ephemeris for Hemant Thackeray
// Birth: 27/03/1980, 11:45 AM, Kalyan | Location: Kalyan, Maharashtra
// Date generated: Saturday, 11 April 2026
// ═══════════════════════════════════════════════════════════════

const TODAY = {
  date: "Saturday, 11 April 2026",
  location: "Kalyan, Maharashtra (19.24°N, 73.14°E)",
  sunrise: "06:15 AM",
  sunset: "06:48 PM",
  dayDuration: "12h 33m",
  panchang: {
    tithi: "Krishna Navami (9)",
    paksha: "Krishna",
    nakshatra: "Shravana",
    nakshatraLord: "Moon",
    yoga: "Sadhya",
    karana: "Taitila",
    moonSign: "Capricorn",
  },
  dasha: {
    maha: "Moon",
    antar: "Ketu",
    pratyantar: "Rahu",
    mahaRange: "20/09/2018 – 19/09/2028",
    antarRange: "20/12/2025 – 20/07/2026",
    interpretation: "Introspection, spiritual growth, unexpected changes. Moon in own sign (H2) gives emotional-financial focus. Ketu in H9 drives philosophical detachment."
  },
};

const TRANSITS = [
  { planet: "Sun", sign: "Pisces", degree: "27°34'", nakshatra: "Revati", house: 10, retrograde: false, natalAspect: null },
  { planet: "Moon", sign: "Capricorn", degree: "14°18'", nakshatra: "Shravana", house: 8, retrograde: false, natalAspect: null },
  { planet: "Mars", sign: "Pisces", degree: "7°13'", nakshatra: "U.Bhadra", house: 10, retrograde: false, natalAspect: null },
  { planet: "Mercury", sign: "Pisces", degree: "1°06'", nakshatra: "P.Bhadra", house: 10, retrograde: false, natalAspect: null },
  { planet: "Jupiter", sign: "Gemini", degree: "22°24'", nakshatra: "Punarvasu", house: 1, retrograde: false, natalAspect: "Transit over Ascendant (expansion, new beginnings)" },
  { planet: "Venus", sign: "Aries", degree: "20°32'", nakshatra: "Bharani", house: 11, retrograde: false, natalAspect: null },
  { planet: "Saturn", sign: "Pisces", degree: "12°38'", nakshatra: "U.Bhadra", house: 10, retrograde: false, natalAspect: "CONJUNCT natal Sun (0.5° orb) — career pressure/transformation" },
  { planet: "Rahu", sign: "Aquarius", degree: "12°36'", nakshatra: "Shatabhisha", house: 9, retrograde: true, natalAspect: "Near natal Mercury (3.8° orb) — unconventional thinking" },
  { planet: "Ketu", sign: "Leo", degree: "12°36'", nakshatra: "Magha", house: 3, retrograde: true, natalAspect: "Near natal Jupiter (4.6° orb) — spiritual detachment" },
];

const INAUSPICIOUS_WINDOWS = [
  { name: "Gulika Kaal", start: "06:15 AM", end: "07:49 AM", severity: "high", description: "Son of Saturn. Avoid new beginnings, investments, travel starts." },
  { name: "Rahu Kaal", start: "09:23 AM", end: "10:57 AM", severity: "high", description: "Rahu's shadow period. Avoid signing documents, starting ventures, important meetings." },
  { name: "Yamagandam", start: "02:05 PM", end: "03:39 PM", severity: "medium", description: "Yama's period. Avoid risky activities, medical procedures, major decisions." },
];

const AUSPICIOUS_WINDOWS = [
  { name: "Brahma Muhurta", start: "04:39 AM", end: "05:27 AM", power: "supreme", description: "Creator's hour. Best for meditation, mantra, spiritual practice, study." },
  { name: "Jupiter Hora", start: "07:49 AM", end: "09:23 AM", power: "high", description: "Jupiter's planetary hour. Excellent for education, legal matters, religious acts." },
  { name: "Abhijit Muhurta", start: "12:07 PM", end: "12:55 PM", power: "supreme", description: "Victory Muhurta. The single most auspicious window. Good for ALL new beginnings." },
  { name: "Venus Hora", start: "12:31 PM", end: "02:05 PM", power: "high", description: "Venus's hour. Ideal for relationships, arts, luxury purchases, beauty." },
  { name: "Mercury Hora", start: "02:05 PM", end: "03:39 PM", power: "moderate", description: "Mercury's hour. Good for communication, business deals, writing. (Overlaps Yamagandam — proceed with awareness)" },
  { name: "Moon Hora", start: "03:39 PM", end: "05:13 PM", power: "high", description: "Moon's hour. Favorable for public matters, travel, emotional decisions, home." },
];

const HORA_TIMELINE = [
  { lord: "Saturn", start: "06:15 AM", end: "07:49 AM", benefic: false, current: false },
  { lord: "Jupiter", start: "07:49 AM", end: "09:23 AM", benefic: true, current: false },
  { lord: "Mars", start: "09:23 AM", end: "10:57 AM", benefic: false, current: false },
  { lord: "Sun", start: "10:57 AM", end: "12:31 PM", benefic: false, current: false },
  { lord: "Venus", start: "12:31 PM", end: "02:05 PM", benefic: true, current: false },
  { lord: "Mercury", start: "02:05 PM", end: "03:39 PM", benefic: true, current: false },
  { lord: "Moon", start: "03:39 PM", end: "05:13 PM", benefic: true, current: false },
  { lord: "Saturn", start: "05:13 PM", end: "06:48 PM", benefic: false, current: false },
];

const WEEKLY = [
  { day: "Sat 11/04", moon: "Capricorn", nak: "Shravana", houseFromMoon: 7, tithi: "Kri-9", rating: "good", note: "Moon in 7th from natal — partnerships, public dealings favorable. Abhijit Muhurta strong." },
  { day: "Sun 12/04", moon: "Capricorn", nak: "Dhanishtha", houseFromMoon: 7, tithi: "Kri-10", rating: "good", note: "Sunday + Moon in 7th. Fatherly blessings, authority matters work well." },
  { day: "Mon 13/04", moon: "Aquarius", nak: "Shatabhisha", houseFromMoon: 8, tithi: "Kri-11", rating: "caution", note: "⚠ Moon in 8th from natal — avoid risks. Krishna Ekadashi — powerful fasting day for spiritual merit." },
  { day: "Tue 14/04", moon: "Aquarius", nak: "P.Bhadrapada", houseFromMoon: 8, tithi: "Kri-12", rating: "caution", note: "⚠ Moon in 8th continues. Sun enters Aries (Mesha Sankranti) — Hindu New Year for some traditions. Avoid major investments." },
  { day: "Wed 15/04", moon: "Pisces", nak: "U.Bhadrapada", houseFromMoon: 9, tithi: "Kri-13", rating: "good", note: "Moon in 9th from natal — fortune, dharma, long journeys favored. Good for spiritual activities." },
  { day: "Thu 16/04", moon: "Pisces", nak: "Revati", houseFromMoon: 9, tithi: "Kri-14", rating: "mixed", note: "Amavasya approaches. Moon in 9th still good. Avoid evening activities. Pitru Tarpan recommended." },
  { day: "Fri 17/04", moon: "Aries", nak: "Ashwini", houseFromMoon: 10, tithi: "Shu-1", rating: "good", note: "New lunar month begins! Moon in 10th from natal — career action day. Shukla Pratipada — fresh starts." },
];

const MONTHLY_EVENTS = [
  { date: "13 Apr", type: "spiritual", event: "Krishna Ekadashi", impact: "Powerful fasting day. Chant Vishnu Sahasranama. Donate food.", icon: "🙏" },
  { date: "14 Apr", type: "planetary", event: "Sun enters Aries (Mesha Sankranti)", impact: "Solar new year energy. New career initiatives favored AFTER this date. Hemant's 10th lord transiting own sign.", icon: "☉" },
  { date: "16-17 Apr", type: "lunar", event: "Amavasya (New Moon)", impact: "Introspective period. Avoid major launches. Good for Pitru Tarpan, ending old patterns.", icon: "🌑" },
  { date: "18 Apr", type: "critical", event: "Saturn exact conjunct natal Sun", impact: "⚠ CRITICAL: Career transformation peak. Authority challenges, restructuring pressure. Stay disciplined. Do NOT make impulsive career decisions.", icon: "⚠" },
  { date: "27 Apr", type: "spiritual", event: "Shukla Ekadashi", impact: "Auspicious fasting. Good for starting spiritual practices. Donate to needy.", icon: "🙏" },
  { date: "30 Apr", type: "lunar", event: "Purnima (Full Moon)", impact: "Peak lunar energy. Emotions high. Good for meditation, charity, completing projects.", icon: "🌕" },
  { date: "12 May", type: "spiritual", event: "Krishna Ekadashi", impact: "Fasting day. Inner purification. Mercury may shift signs — watch for communication changes.", icon: "🙏" },
  { date: "15 May", type: "planetary", event: "Sun enters Taurus (Vrishabha Sankranti)", impact: "Sun moves to 12th from natal — low vitality period begins. Focus on rest, spiritual growth, behind-the-scenes work.", icon: "☉" },
  { date: "15-16 May", type: "lunar", event: "Amavasya (New Moon)", impact: "Second Amavasya in this period. Quiet introspection. Plan but don't act on major decisions.", icon: "🌑" },
  { date: "20 Jul 2026", type: "dasha", event: "Moon-Ketu Antar Dasha ends → Moon-Venus begins", impact: "Significant shift! Venus Bhukti brings romance, luxury, creativity, financial improvements. The challenging Ketu period concludes.", icon: "🔄" },
];

const TABS = ["Today", "This Week", "This Month", "Transits"];

// ═══════════════════════════════════════════════════════════════
// STYLE HELPERS & ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const pulsingDot = `
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px ${hexToRgba(T.accent, 0.5)}, inset 0 0 4px ${hexToRgba(T.accent, 0.3)}; }
    50% { box-shadow: 0 0 16px ${hexToRgba(T.accent, 0.8)}, inset 0 0 6px ${hexToRgba(T.accent, 0.5)}; }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const PanchangCard = () => (
  <div style={{ ...cardStyle(), transition: "all 0.3s ease" }}>
    <h3 style={sectionLabel(T.accent)}>PANCHANG</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { label: "Tithi", value: TODAY.panchang.tithi },
        { label: "Nakshatra", value: `${TODAY.panchang.nakshatra} (${TODAY.panchang.nakshatraLord})` },
        { label: "Yoga", value: TODAY.panchang.yoga },
        { label: "Karana", value: TODAY.panchang.karana },
        { label: "Moon Sign", value: TODAY.panchang.moonSign },
        { label: "Paksha", value: TODAY.panchang.paksha },
      ].map((item, i) => (
        <div key={i}>
          <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 600, letterSpacing: 0.5 }}>{item.label}</div>
          <div style={{ fontSize: 12, color: T.textPrimary, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const DashaCard = () => (
  <div style={{ ...cardStyle(true), transition: "all 0.3s ease" }}>
    <h3 style={sectionLabel(T.accent)}>CURRENT DASHA PERIOD</h3>
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
      {[
        { level: "Maha", lord: TODAY.dasha.maha },
        { level: "Antar", lord: TODAY.dasha.antar },
        { level: "Pratyantar", lord: TODAY.dasha.pratyantar },
      ].map((d, i) => (
        <div key={i} style={{
          flex: 1, textAlign: "center", padding: "8px 6px",
          background: hexToRgba(T.bgTertiary, 0.5),
          borderRadius: T.radiusSm,
          border: `1px solid ${hexToRgba(PLANET_COLORS[d.lord], 0.25)}`,
          transition: "all 0.2s ease",
          cursor: "default",
        }}>
          <div style={{ fontSize: 9, color: T.textMuted }}>{d.level}</div>
          <div style={{ fontSize: 20, color: PLANET_COLORS[d.lord] }}>{PLANET_SYMBOLS[d.lord]}</div>
          <div style={{ fontSize: 12, color: PLANET_COLORS[d.lord], fontWeight: 700 }}>{d.lord}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 10, color: T.textSecondary, lineHeight: 1.5 }}>{TODAY.dasha.interpretation}</div>
    <div style={{ fontSize: 9, color: T.textMuted, marginTop: 8 }}>Antar period: {TODAY.dasha.antarRange}</div>
  </div>
);

const TimeWindow = ({ item, type }) => {
  const isGood = type === "auspicious";
  const isSupreme = isGood && item.power === "supreme";

  const borderColor = isGood ? T.borderAccent : hexToRgba(T.negative, 0.25);
  const bgColor = isGood ? hexToRgba(T.positive, 0.08) : hexToRgba(T.negative, 0.08);
  const accentColor = isGood ? T.positive : T.negative;
  const sevOrPow = isGood ? item.power : item.severity;
  const dots = sevOrPow === "supreme" ? "●●●●●" : sevOrPow === "high" ? "●●●●○" : sevOrPow === "medium" ? "●●●○○" : "●●○○○";

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: T.radiusSm,
      padding: 12,
      marginBottom: 8,
      backdropFilter: "blur(4px)",
      transition: "all 0.25s ease",
      cursor: "default",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: accentColor, display: "flex", alignItems: "center", gap: 6 }}>
              {isSupreme && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: accentColor, animation: "pulse 2s infinite" }} />}
              {item.name}
            </span>
            <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 0, marginTop: 2, display: "block" }}>{dots}</span>
          </div>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: T.textPrimary,
          background: hexToRgba(T.textSecondary, 0.08), padding: "6px 12px", borderRadius: T.radiusSm,
          fontFamily: "monospace",
          transition: "all 0.2s ease",
        }}>
          {item.start} — {item.end}
        </div>
      </div>
      <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 8, lineHeight: 1.4 }}>{item.description}</div>
    </div>
  );
};

const HoraTimeline = () => (
  <div style={{ ...cardStyle(), transition: "all 0.3s ease" }}>
    <h3 style={sectionLabel(T.accent)}>PLANETARY HOURS (HORA) — {TODAY.date}</h3>
    <div style={{ display: "flex", borderRadius: T.radiusSm, overflow: "hidden", height: 48, marginBottom: 14, boxShadow: T.shadowCard }}>
      {HORA_TIMELINE.map((h, i) => (
        <div key={i} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: h.benefic ? hexToRgba(T.positive, 0.18) : hexToRgba(T.negative, 0.12),
          borderRight: i < 7 ? `1px solid ${T.border}` : "none",
          cursor: "default",
          transition: "all 0.2s ease",
        }} title={`${h.lord}: ${h.start} - ${h.end}`}>
          <span style={{ fontSize: 16, color: PLANET_COLORS[h.lord] }}>{PLANET_SYMBOLS[h.lord]}</span>
          <span style={{ fontSize: 8, color: T.textMuted, marginTop: 2 }}>{h.lord.slice(0, 3)}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 16, fontSize: 10, marginBottom: 12, flexWrap: "wrap" }}>
      <span style={{ color: T.positive, fontWeight: 600 }}>■ Benefic (Jupiter, Venus, Mercury, Moon)</span>
      <span style={{ color: T.negative, fontWeight: 600 }}>■ Malefic (Saturn, Mars, Sun)</span>
    </div>
    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
      {HORA_TIMELINE.map((h, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "6px 8px",
          background: hexToRgba(T.bgTertiary, 0.3),
          borderRadius: T.radiusSm,
          transition: "all 0.2s ease",
        }}>
          <span style={{ fontSize: 16, width: 28, textAlign: "center", color: PLANET_COLORS[h.lord] }}>{PLANET_SYMBOLS[h.lord]}</span>
          <span style={{ fontSize: 11, color: T.textPrimary, fontWeight: 600, minWidth: 70 }}>{h.lord}</span>
          <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: "monospace" }}>{h.start} – {h.end}</span>
          <span style={{
            fontSize: 9, marginLeft: "auto", padding: "3px 8px", borderRadius: T.radiusSm,
            background: h.benefic ? hexToRgba(T.positive, 0.16) : hexToRgba(T.negative, 0.12),
            color: h.benefic ? T.positive : T.negative, fontWeight: 600,
            transition: "all 0.2s ease",
          }}>{h.benefic ? "BENEFIC" : "MALEFIC"}</span>
        </div>
      ))}
    </div>
  </div>
);

const WeeklyView = () => (
  <div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {WEEKLY.map((d, i) => {
        const color = d.rating === "good" ? T.positive : d.rating === "caution" ? T.negative : T.accent;
        const bg = d.rating === "good" ? hexToRgba(T.positive, 0.08) : d.rating === "caution" ? hexToRgba(T.negative, 0.08) : hexToRgba(T.accent, 0.08);
        const borderColor = d.rating === "good" ? hexToRgba(T.positive, 0.25) : d.rating === "caution" ? hexToRgba(T.negative, 0.25) : hexToRgba(T.accent, 0.25);
        return (
          <div key={i} style={{
            ...cardStyle(),
            background: bg,
            border: `1px solid ${borderColor}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.textPrimary, minWidth: 80 }}>{d.day}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: T.radiusSm,
                  background: hexToRgba(color, 0.18), color,
                  transition: "all 0.2s ease",
                }}>{d.rating === "good" ? "✓ FAVORABLE" : d.rating === "caution" ? "⚠ CAUTION" : "◐ MIXED"}</span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 10, color: T.textSecondary, flexWrap: "wrap" }}>
                <span>☽ {d.moon} ({d.nak})</span>
                <span>H{d.houseFromMoon} from Moon</span>
                <span>{d.tithi}</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 10, lineHeight: 1.5 }}>{d.note}</div>
          </div>
        );
      })}
    </div>
    <div style={{
      marginTop: 18, padding: 16,
      background: hexToRgba(T.accent, 0.08),
      borderRadius: T.radius,
      border: `1px solid ${hexToRgba(T.accent, 0.25)}`,
      backdropFilter: "blur(4px)",
      transition: "all 0.3s ease",
    }}>
      <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>WEEKLY GUIDANCE (Moon-Ketu-Rahu Period)</div>
      <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>
        This week Saturn is exactly conjunct your natal Sun (0.5° orb) — the tightest transit impact of the year. Career matters demand patience and strategic restructuring, not impulsive action. Jupiter transiting your 1st house (Ascendant) provides protective expansion. Best days for action: Saturday (today), Sunday, Friday. Avoid starting new ventures on Monday-Tuesday when Moon crosses your 8th house.
      </div>
    </div>
  </div>
);

const MonthlyView = () => (
  <div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {MONTHLY_EVENTS.map((e, i) => {
        const typeColors = {
          spiritual: { bg: hexToRgba(T.accentSecondary, 0.08), border: hexToRgba(T.accentSecondary, 0.25), accent: T.accentSecondary },
          planetary: { bg: hexToRgba(T.accent, 0.08), border: hexToRgba(T.accent, 0.25), accent: T.accent },
          lunar: { bg: hexToRgba(T.textSecondary, 0.08), border: hexToRgba(T.textSecondary, 0.25), accent: T.textSecondary },
          critical: { bg: hexToRgba(T.negative, 0.10), border: hexToRgba(T.negative, 0.3), accent: T.negative },
          dasha: { bg: hexToRgba(T.positive, 0.08), border: hexToRgba(T.positive, 0.25), accent: T.positive },
        };
        const c = typeColors[e.type] || typeColors.planetary;
        return (
          <div key={i} style={{
            ...cardStyle(),
            background: c.bg,
            border: `1px solid ${c.border}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.accent }}>{e.event}</span>
                  <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, fontFamily: "monospace" }}>{e.date}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 8, lineHeight: 1.5 }}>{e.impact}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Monthly Summary */}
    <div style={{ marginTop: 22, ...cardStyle() }}>
      <h3 style={sectionLabel(T.accent)}>MONTHLY OVERVIEW (APRIL-MAY 2026)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{
          padding: 14, background: hexToRgba(T.negative, 0.08),
          borderRadius: T.radiusSm, border: `1px solid ${hexToRgba(T.negative, 0.25)}`,
          transition: "all 0.2s ease",
        }}>
          <div style={{ fontSize: 11, color: T.negative, fontWeight: 700, marginBottom: 8 }}>CHALLENGES</div>
          <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>
            Saturn conjunct natal Sun (exact ~18 Apr) — career restructuring pressure, authority conflicts. Jupiter in 12th from Moon — hidden expenses, spiritual calling but material setbacks. Moon-Ketu Bhukti continues until July — detachment from worldly pursuits.
          </div>
        </div>
        <div style={{
          padding: 14, background: hexToRgba(T.positive, 0.08),
          borderRadius: T.radiusSm, border: `1px solid ${hexToRgba(T.positive, 0.25)}`,
          transition: "all 0.2s ease",
        }}>
          <div style={{ fontSize: 11, color: T.positive, fontWeight: 700, marginBottom: 8 }}>OPPORTUNITIES</div>
          <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>
            Jupiter transit over Ascendant (Gemini) — personal expansion, new identity, wisdom growth. Venus in 11th house — gains through women, arts, luxury networks. Sun enters Aries (14 Apr) — fresh solar energy for career reboot. Sade Sati NOT active — Saturn pressure is specific, not systemic.
          </div>
        </div>
      </div>
      <div style={{
        padding: 12, background: hexToRgba(T.accentSecondary, 0.08),
        borderRadius: T.radiusSm, border: `1px solid ${hexToRgba(T.accentSecondary, 0.25)}`,
        transition: "all 0.2s ease",
      }}>
        <div style={{ fontSize: 11, color: T.accentSecondary, fontWeight: 700, marginBottom: 6 }}>REMEDIES FOR THIS PERIOD</div>
        <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>
          1. Surya Namaskar at sunrise daily (Saturn on natal Sun remedy).
          2. Chant "Om Namah Shivaya" 108 times on Saturdays (Saturn pacification).
          3. Donate black sesame seeds on Saturdays.
          4. Wear Pearl (Moon Maha Dasha support) on right ring finger — set in silver, worn on Monday.
          5. Ketu pacification: Donate blankets to the needy, feed stray dogs.
          6. Observe Ekadashi fasts (13 Apr, 27 Apr, 12 May).
          7. Meditation during Brahma Muhurta (4:39 AM) — aligns with Moon-Ketu spiritual energy.
        </div>
      </div>
    </div>
  </div>
);

const TransitsView = () => (
  <div>
    <h3 style={{ ...sectionLabel(T.textSecondary), margin: "0 0 14px" }}>CURRENT TRANSITS OVER NATAL CHART</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {TRANSITS.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          background: t.natalAspect ? hexToRgba(T.accent, 0.08) : hexToRgba(T.bgTertiary, 0.5),
          border: `1px solid ${t.natalAspect ? hexToRgba(T.accent, 0.25) : T.border}`,
          borderRadius: T.radiusSm,
          transition: "all 0.2s ease",
          cursor: "default",
        }}>
          <span style={{ fontSize: 24, color: PLANET_COLORS[t.planet] }}>{PLANET_SYMBOLS[t.planet]}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: PLANET_COLORS[t.planet] }}>{t.planet}</span>
              <span style={{ fontSize: 11, color: T.textSecondary }}>{t.degree} {t.sign}</span>
              <span style={{ fontSize: 10, color: T.textMuted }}>({t.nakshatra})</span>
              <span style={{ fontSize: 10, color: T.accent, fontWeight: 700, background: hexToRgba(T.accent, 0.15), padding: "2px 6px", borderRadius: T.radiusSm }}>H{t.house}</span>
              {t.retrograde && <span style={{ fontSize: 9, color: T.warning, background: hexToRgba(T.warning, 0.15), padding: "2px 6px", borderRadius: T.radiusSm, fontWeight: 700 }}>R</span>}
            </div>
            {t.natalAspect && (
              <div style={{ fontSize: 11, color: T.accent, marginTop: 6, fontWeight: 600 }}>
                {t.natalAspect}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Key Transit Interpretations */}
    <div>
      <h3 style={{ ...sectionLabel(T.textSecondary), margin: "0 0 12px" }}>CRITICAL TRANSIT ALERTS</h3>
      {[
        { title: "Saturn conjunct Natal Sun (0.5° orb)", severity: "high", text: "The most significant current transit. Saturn at 12°38' Pisces is sitting exactly on your natal Sun at 13°09' Pisces (10th house). This brings career restructuring, authority challenges, delays in recognition. Father/boss relationships strained. This transit will be exact around April 18 and remains within 2° orb through May. Stay disciplined, avoid confrontation with superiors." },
        { title: "Rahu near Natal Mercury (3.8° orb)", severity: "medium", text: "Transit Rahu in Aquarius approaching your natal Mercury in the 9th house. Unconventional thinking, foreign connections activated. Good for technology, research, unorthodox learning. Beware of miscommunication, deception in documents." },
        { title: "Ketu near Natal Jupiter (4.6° orb)", severity: "medium", text: "Transit Ketu approaching natal Jupiter in Leo (3rd house). Spiritual detachment from knowledge pursuits. Good for meditation, esoteric studies. May reduce interest in material expansion. Siblings may need support." },
        { title: "Jupiter on Ascendant (Gemini)", severity: "positive", text: "Jupiter transiting through your 1st house is the silver lining. Personal growth, wisdom, new opportunities in education and communication. Your appearance, health, and personal brand expand. This protective transit helps buffer Saturn's pressure on your Sun." },
      ].map((alert, i) => {
        const sev = {
          high: { bg: hexToRgba(T.negative, 0.10), border: hexToRgba(T.negative, 0.3), color: T.negative },
          medium: { bg: hexToRgba(T.accent, 0.08), border: hexToRgba(T.accent, 0.25), color: T.accent },
          positive: { bg: hexToRgba(T.positive, 0.08), border: hexToRgba(T.positive, 0.25), color: T.positive },
        };
        const s = sev[alert.severity];
        return (
          <div key={i} style={{
            ...cardStyle(),
            background: s.bg,
            border: `1px solid ${s.border}`,
            marginBottom: 10,
            transition: "all 0.3s ease",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 8 }}>{alert.title}</div>
            <div style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6 }}>{alert.text}</div>
          </div>
        );
      })}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState("Today");

  return (
    <div style={{ ...pageRoot }}>
      <style>{pulsingDot}</style>

      {/* Header */}
      <div style={{ ...headerBar }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: T.textPrimary }}>
              <span style={{ color: T.accent }}>SILICON SIDDHANTA</span>
              <span style={{ color: T.textMuted, fontSize: 12, fontWeight: 400, marginLeft: 10 }}>Muhurta & Predictions</span>
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>Hemant Thackeray</div>
            <div style={{ fontSize: 10, color: T.textSecondary }}>27/03/1980, 11:45 AM, Kalyan | Gemini Asc, Cancer Moon</div>
          </div>
        </div>

        {/* Date & Sun Info Bar */}
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {[
            { label: "Date", value: TODAY.date, color: T.textPrimary },
            { label: "Sunrise", value: `☉↑ ${TODAY.sunrise}`, color: PLANET_COLORS.Sun },
            { label: "Sunset", value: `☉↓ ${TODAY.sunset}`, color: PLANET_COLORS.Sun },
            { label: "Day", value: TODAY.dayDuration, color: T.textSecondary },
            { label: "Dasha", value: `${TODAY.dasha.maha}-${TODAY.dasha.antar}-${TODAY.dasha.pratyantar}`, color: T.accent },
          ].map((item, i) => (
            <div key={i} style={{
              background: hexToRgba(T.bgSecondary, 0.6),
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm,
              padding: "6px 12px",
              transition: "all 0.2s ease",
              backdropFilter: "blur(2px)",
            }}>
              <div style={{ fontSize: 8, color: T.textMuted, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", background: hexToRgba(T.bg, 0.5),
        borderBottom: `1px solid ${T.border}`, overflow: "auto",
        backdropFilter: "blur(4px)",
      }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxWidth: 960, margin: "0 auto" }}>

        {activeTab === "Today" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <PanchangCard />
              <DashaCard />
            </div>

            {/* Auspicious Windows */}
            <h3 style={sectionLabel(T.positive)}>✓ AUSPICIOUS WINDOWS</h3>
            {AUSPICIOUS_WINDOWS.map((w, i) => <TimeWindow key={i} item={w} type="auspicious" />)}

            <h3 style={sectionLabel(T.negative)}>✗ INAUSPICIOUS WINDOWS</h3>
            {INAUSPICIOUS_WINDOWS.map((w, i) => <TimeWindow key={i} item={w} type="inauspicious" />)}

            <div style={{ marginTop: 20 }}>
              <HoraTimeline />
            </div>
          </div>
        )}

        {activeTab === "This Week" && <WeeklyView />}
        {activeTab === "This Month" && <MonthlyView />}
        {activeTab === "Transits" && <TransitsView />}

      </div>

      {/* Footer */}
      <div style={{ ...footerStyle }}>
        <div style={{ fontSize: 9, color: T.textMuted }}>
          Silicon Siddhanta v1.0.0 | Swiss Ephemeris | Lahiri Ayanamsha 24.2242° | Computed: {TODAY.date}
        </div>
      </div>
    </div>
  );
}
