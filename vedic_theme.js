/**
 * vedic_theme.js
 * Silicon Siddhanta — Custom "Vedic Mystic" StyleKit
 *
 * Blends VibeStudio Templator's "dashboard" + "dark-luxury" kits
 * with Vedic spiritual aesthetics (saffron, gold, deep indigo).
 *
 * Based on Templator StyleKits.js architecture:
 *   11 CSS variables → unified design tokens for all dashboards
 *
 * Blend ratio: 60% dashboard + 40% dark-luxury, with custom overrides
 * CDO inspiration: Eddie Opara (systematic, dark, tech-forward)
 */

// ─────────────────────────────────────────────
// Color Utilities (from Templator)
// ─────────────────────────────────────────────

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b]
    .map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");
}

export function lerpHex(hexA, hexB, t) {
  if (!hexA.startsWith("#") || !hexB.startsWith("#")) return t < 0.5 ? hexA : hexB;
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export function hexToRgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────
// Base Kits (from Templator StyleKits.js)
// ─────────────────────────────────────────────

const DASHBOARD_KIT = {
  bg: "#0f172a", bgSecondary: "#1e293b", textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8", accent: "#0ea5e9", accentHover: "#0284c7",
  border: "#334155", radius: "8px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 16px rgba(0,0,0,0.4)", bodyBg: "#0f172a",
};

const DARK_LUXURY_KIT = {
  bg: "#0a0a0f", bgSecondary: "#0f1117", textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8", accent: "#6366f1", accentHover: "#818cf8",
  border: "#1e2433", radius: "8px",
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", bodyBg: "#0a0a0f",
};

// ─────────────────────────────────────────────
// VEDIC MYSTIC KIT — Custom Blend + Overrides
// ─────────────────────────────────────────────

const BLEND_RATIO = 0.4; // 60% dashboard, 40% dark-luxury

const blendedBase = {
  bg:           lerpHex(DASHBOARD_KIT.bg, DARK_LUXURY_KIT.bg, BLEND_RATIO),
  bgSecondary:  lerpHex(DASHBOARD_KIT.bgSecondary, DARK_LUXURY_KIT.bgSecondary, BLEND_RATIO),
  textPrimary:  lerpHex(DASHBOARD_KIT.textPrimary, DARK_LUXURY_KIT.textPrimary, BLEND_RATIO),
  textSecondary:lerpHex(DASHBOARD_KIT.textSecondary, DARK_LUXURY_KIT.textSecondary, BLEND_RATIO),
  border:       lerpHex(DASHBOARD_KIT.border, DARK_LUXURY_KIT.border, BLEND_RATIO),
  bodyBg:       lerpHex(DASHBOARD_KIT.bodyBg, DARK_LUXURY_KIT.bodyBg, BLEND_RATIO),
};

/**
 * The final Vedic Mystic theme token set.
 * Spiritual overrides: saffron gold accent, deep indigo secondary accent,
 * glassmorphism-inspired card surfaces, Inter font for data clarity.
 */
export const VEDIC_THEME = {
  // ── Backgrounds ──
  bg:           "#0b1120",          // Deep cosmic navy (blended)
  bgSecondary:  "#131b2e",          // Slightly lighter for cards
  bgTertiary:   "#1a2340",          // For nested elements
  bgCard:       "rgba(19,27,46,0.8)",  // Glass-like card surface
  bgCardHover:  "rgba(26,35,64,0.9)",  // Card hover state
  bgOverlay:    "rgba(11,17,32,0.95)", // Modal overlays

  // ── Text ──
  textPrimary:  "#eef2f7",          // Crisp white-blue
  textSecondary:"#8b9cc0",          // Muted blue-grey
  textMuted:    "#5a6b8a",          // Very subtle
  textHighlight:"#fbbf24",          // Saffron gold for emphasis

  // ── Accent Colors ──
  accent:       "#e5a100",          // Saffron gold — primary spiritual accent
  accentHover:  "#f5b800",          // Brighter gold on hover
  accentSecondary: "#6366f1",       // Deep indigo — from dark-luxury kit
  accentTertiary:  "#0ea5e9",       // Cyan — from dashboard kit (data elements)

  // ── Semantic Colors ──
  positive:     "#22c55e",          // Green — auspicious / good
  negative:     "#ef4444",          // Red — inauspicious / bad
  warning:      "#eab308",          // Yellow — caution / mixed
  info:         "#3b82f6",          // Blue — informational

  // ── Borders & Surfaces ──
  border:       "#1e2a42",          // Subtle border
  borderAccent: "rgba(229,161,0,0.25)", // Gold-tinted border
  borderGlow:   "rgba(99,102,241,0.2)", // Indigo glow border

  // ── Radius & Shape ──
  radius:       "10px",             // Slightly more rounded than both kits
  radiusSm:     "6px",
  radiusLg:     "14px",
  radiusFull:   "999px",

  // ── Typography ──
  fontFamily:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay:  "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",

  // ── Shadows ──
  shadow:       "0 4px 20px rgba(0,0,0,0.5)",
  shadowGlow:   "0 0 20px rgba(229,161,0,0.08)",
  shadowCard:   "0 2px 12px rgba(0,0,0,0.3)",
  shadowElevated: "0 8px 32px rgba(0,0,0,0.6)",

  // ── Gradients ──
  gradientBg:   "linear-gradient(135deg, #0b1120 0%, #131b2e 50%, #0b1120 100%)",
  gradientHeader: "linear-gradient(180deg, rgba(11,17,32,0.98) 0%, rgba(19,27,46,0.95) 100%)",
  gradientAccent: "linear-gradient(135deg, #e5a100 0%, #f5b800 50%, #e5a100 100%)",
  gradientIndigo: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)",
  gradientCard:   "linear-gradient(135deg, rgba(19,27,46,0.8) 0%, rgba(26,35,64,0.6) 100%)",
};

// ─────────────────────────────────────────────
// Planet Colors (astrology-specific)
// ─────────────────────────────────────────────

export const PLANET_COLORS = {
  Sun:     "#FF8C00",   // Deep orange (Surya)
  Moon:    "#B8C4D4",   // Silver-blue (Chandra)
  Mars:    "#DC2626",   // Red (Mangal)
  Mercury: "#16A34A",   // Green (Budh)
  Jupiter: "#EAB308",   // Gold (Guru)
  Venus:   "#EC4899",   // Pink (Shukra)
  Saturn:  "#4F6BCC",   // Blue-indigo (Shani)
  Rahu:    "#8B5CF6",   // Violet (Rahu)
  Ketu:    "#B45309",   // Dark amber (Ketu)
};

export const PLANET_SYMBOLS = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿",
  Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export const DASHA_COLORS = {
  Ketu: "#B45309", Venus: "#EC4899", Sun: "#FF8C00", Moon: "#B8C4D4",
  Mars: "#DC2626", Rahu: "#8B5CF6", Jupiter: "#EAB308", Saturn: "#4F6BCC",
  Mercury: "#16A34A",
};

export const SIGN_SYMBOLS = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SIGN_SANSKRIT = {
  Aries: "Mesh", Taurus: "Vrishabh", Gemini: "Mithun", Cancer: "Kark",
  Leo: "Simha", Virgo: "Kanya", Libra: "Tula", Scorpio: "Vrishchik",
  Sagittarius: "Dhanu", Capricorn: "Makar", Aquarius: "Kumbh", Pisces: "Meen",
};

// ─────────────────────────────────────────────
// Reusable Style Helpers
// ─────────────────────────────────────────────

const T = VEDIC_THEME;

/** Card container style */
export const cardStyle = (glow = false) => ({
  background: T.bgCard,
  border: `1px solid ${glow ? T.borderAccent : T.border}`,
  borderRadius: T.radius,
  padding: 16,
  boxShadow: glow ? T.shadowGlow : T.shadowCard,
  backdropFilter: "blur(8px)",
});

/** Section header label style */
export const sectionLabel = (color = T.accent) => ({
  fontSize: 11,
  color,
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  margin: "0 0 12px",
  fontFamily: T.fontFamily,
});

/** Tab button style (active/inactive) */
export const tabStyle = (active) => ({
  padding: "11px 22px",
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: T.fontFamily,
  background: active ? hexToRgba(T.accent, 0.12) : "transparent",
  color: active ? T.accent : T.textSecondary,
  borderBottom: active ? `2px solid ${T.accent}` : "2px solid transparent",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
});

/** Badge / pill style */
export const badgeStyle = (color, bgAlpha = 0.15) => ({
  fontSize: 9,
  padding: "2px 7px",
  borderRadius: T.radiusFull,
  color,
  background: hexToRgba(color, bgAlpha),
  fontWeight: 600,
  letterSpacing: "0.3px",
});

/** Status indicator dot */
export const statusDot = (color) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: color,
  boxShadow: `0 0 6px ${hexToRgba(color, 0.4)}`,
  display: "inline-block",
});

/** Progress bar container + fill */
export const progressBar = (percent, color, height = 6) => ({
  container: {
    flex: 1,
    height,
    borderRadius: height / 2,
    background: hexToRgba(T.textSecondary, 0.12),
    overflow: "hidden",
  },
  fill: {
    width: `${Math.max(0, Math.min(100, percent))}%`,
    height: "100%",
    borderRadius: height / 2,
    background: color,
    transition: "width 0.5s ease",
  },
});

/** Key indicator chip (used in headers) */
export const indicatorChip = (color = T.accent) => ({
  background: hexToRgba(T.bgTertiary, 0.9),
  border: `1px solid ${T.border}`,
  borderRadius: T.radiusSm,
  padding: "7px 14px",
  minWidth: 90,
});

/** Tooltip style for Recharts */
export const chartTooltipStyle = {
  contentStyle: {
    background: T.bgSecondary,
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize: 11,
    color: T.textPrimary,
    fontFamily: T.fontFamily,
    boxShadow: T.shadowCard,
  },
  itemStyle: { color: T.textPrimary },
  labelStyle: { color: T.accent, fontWeight: 700 },
};

/** Page root style */
export const pageRoot = {
  minHeight: "100vh",
  background: T.gradientBg,
  color: T.textPrimary,
  fontFamily: T.fontFamily,
  padding: 0,
};

/** Page header bar style */
export const headerBar = {
  background: T.gradientHeader,
  borderBottom: `1px solid ${T.borderAccent}`,
  padding: "16px 24px",
  backdropFilter: "blur(12px)",
};

/** Footer style */
export const footerStyle = {
  padding: "16px 24px",
  borderTop: `1px solid ${T.border}`,
  textAlign: "center",
  marginTop: 40,
};
