/**
 * vastu_crosscheck.jsx
 * Silicon Siddhanta — Vastu Purusha Cross-Check & Defect Analysis Tool
 *
 * Self-contained React component with:
 *  - Floor plan image upload (drag-and-drop + click)
 *  - Interactive 9x9 Vastu Purusha Mandala grid overlay
 *  - 45-deity position mapping
 *  - Room assignment to grid zones
 *  - Automated defect detection against classical Vastu rules
 *  - Remedy suggestions (classical + Brajesh Gautam teachings)
 *  - Optional birth chart integration (9th house, planetary dosh)
 *  - Comprehensive report generation
 *
 * Design: Vedic Mystic StyleKit (inline tokens)
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── Inline Theme Tokens (from vedic_theme.js) ───
const T = {
  bg: "#0b1120", bgSec: "#131b2e", bgTer: "#1a2340",
  bgCard: "rgba(19,27,46,0.8)", bgCardHov: "rgba(26,35,64,0.9)",
  bgOverlay: "rgba(11,17,32,0.95)",
  text: "#eef2f7", textSec: "#8b9cc0", textMuted: "#5a6b8a",
  textHL: "#fbbf24",
  accent: "#e5a100", accentHov: "#f5b800",
  indigo: "#6366f1", cyan: "#0ea5e9",
  pos: "#22c55e", neg: "#ef4444", warn: "#eab308", info: "#3b82f6",
  border: "#1e2a42", borderAcc: "rgba(229,161,0,0.25)",
  radius: "10px", radiusSm: "6px", radiusLg: "14px",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 20px rgba(0,0,0,0.5)",
  shadowCard: "0 2px 12px rgba(0,0,0,0.3)",
  shadowGlow: "0 0 20px rgba(229,161,0,0.08)",
};

// ─── Planet Colors ───
const PC = {
  Sun: "#FF8C00", Moon: "#B8C4D4", Mars: "#DC2626", Mercury: "#16A34A",
  Jupiter: "#EAB308", Venus: "#EC4899", Saturn: "#4F6BCC",
  Rahu: "#8B5CF6", Ketu: "#B45309",
};

// ─── 9x9 Vastu Purusha Mandala: 45 Deity Map ───
// Grid: row 0 = North edge, row 8 = South edge
// col 0 = West edge, col 8 = East edge
// Each cell: { deity, element, direction, nature }
const MANDALA_9x9 = (() => {
  const grid = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ deity: "", element: "", direction: "", nature: "neutral" }))
  );

  // ── 32 Outer Deities (Paridhi Devtas) ──
  // North row (row 0): W→E
  const northRow = [
    { deity: "Roga", element: "Air", nature: "inauspicious" },
    { deity: "Naga", element: "Air", nature: "mixed" },
    { deity: "Mukhya", element: "Air", nature: "auspicious" },
    { deity: "Bhallata", element: "Air", nature: "neutral" },
    { deity: "Soma", element: "Water", nature: "auspicious" },
    { deity: "Bhujaga", element: "Air", nature: "mixed" },
    { deity: "Aditi", element: "Water", nature: "auspicious" },
    { deity: "Diti", element: "Water", nature: "mixed" },
    { deity: "Isha", element: "Water", nature: "auspicious" },
  ];
  // East col (col 8): N→S
  const eastCol = [
    null, // Isha already placed
    { deity: "Parjanya", element: "Water", nature: "auspicious" },
    { deity: "Jayanta", element: "Water", nature: "auspicious" },
    { deity: "Indra", element: "Space", nature: "auspicious" },
    { deity: "Surya", element: "Fire", nature: "auspicious" },
    { deity: "Satya", element: "Fire", nature: "auspicious" },
    { deity: "Bhrisha", element: "Fire", nature: "mixed" },
    { deity: "Antariksha", element: "Space", nature: "neutral" },
    { deity: "Agni", element: "Fire", nature: "auspicious" },
  ];
  // South row (row 8): E→W
  const southRow = [
    null, // Agni already placed
    { deity: "Pusha", element: "Fire", nature: "mixed" },
    { deity: "Vitatha", element: "Fire", nature: "inauspicious" },
    { deity: "Brihatkshata", element: "Earth", nature: "neutral" },
    { deity: "Yama", element: "Earth", nature: "mixed" },
    { deity: "Gandharva", element: "Earth", nature: "neutral" },
    { deity: "Bhringraj", element: "Earth", nature: "mixed" },
    { deity: "Mriga", element: "Earth", nature: "neutral" },
    { deity: "Pitru", element: "Earth", nature: "inauspicious" },
  ];
  // West col (col 0): S→N
  const westCol = [
    null, // Pitru already at [8][0]
    { deity: "Dauvarik", element: "Earth", nature: "neutral" },
    { deity: "Sugriva", element: "Earth", nature: "mixed" },
    { deity: "Pushpdanta", element: "Air", nature: "neutral" },
    { deity: "Varun", element: "Water", nature: "auspicious" },
    { deity: "Asura", element: "Air", nature: "inauspicious" },
    { deity: "Shosha", element: "Air", nature: "inauspicious" },
    { deity: "Papyakshma", element: "Air", nature: "inauspicious" },
    null, // Roga already at [0][0]
  ];

  // Place North row
  northRow.forEach((d, i) => {
    grid[0][i] = { ...d, direction: "N" };
  });
  // Place East col
  eastCol.forEach((d, i) => {
    if (d) grid[i][8] = { ...d, direction: "E" };
  });
  // South row (E→W means index 8→0)
  southRow.forEach((d, i) => {
    if (d) grid[8][8 - i] = { ...d, direction: "S" };
  });
  // West col (S→N means index 8→0)
  westCol.forEach((d, i) => {
    if (d) grid[8 - i][0] = { ...d, direction: "W" };
  });

  // ── 13 Inner Deities (Antariksha Devtas) ──
  // Row 1 inner
  grid[1][1] = { deity: "Bhudhar", element: "Earth", direction: "NW", nature: "neutral" };
  grid[1][4] = { deity: "Apa", element: "Water", direction: "N", nature: "auspicious" };
  grid[1][7] = { deity: "Apavatsa", element: "Water", direction: "NE", nature: "auspicious" };

  // Row 2-3
  grid[2][2] = { deity: "Arya-ma", element: "Space", direction: "NW", nature: "auspicious" };
  grid[2][6] = { deity: "Savita", element: "Fire", direction: "NE", nature: "auspicious" };
  grid[3][1] = { deity: "Rudra", element: "Air", direction: "W", nature: "mixed" };
  grid[3][7] = { deity: "Savitri", element: "Fire", direction: "E", nature: "auspicious" };

  // Center (Brahmasthana) — rows 3-5, cols 3-5
  grid[3][3] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[3][5] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[4][3] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[4][4] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[4][5] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[5][3] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };
  grid[5][5] = { deity: "Brahma", element: "Space", direction: "Center", nature: "sacred" };

  // Row 5-7
  grid[5][1] = { deity: "Rajyakshma", element: "Earth", direction: "W", nature: "inauspicious" };
  grid[5][7] = { deity: "Vivasvan", element: "Fire", direction: "E", nature: "auspicious" };
  grid[6][2] = { deity: "Mitra", element: "Earth", direction: "SW", nature: "mixed" };
  grid[6][6] = { deity: "Mahendra", element: "Fire", direction: "SE", nature: "auspicious" };
  grid[7][1] = { deity: "Prithvidhara", element: "Earth", direction: "SW", nature: "neutral" };
  grid[7][4] = { deity: "Aryama", element: "Earth", direction: "S", nature: "mixed" };
  grid[7][7] = { deity: "Anil", element: "Fire", direction: "SE", nature: "neutral" };

  // Fill remaining empty inner cells as Brahma zone extensions
  for (let r = 1; r < 8; r++) {
    for (let c = 1; c < 8; c++) {
      if (!grid[r][c].deity) {
        grid[r][c] = { deity: "Brahma-zone", element: "Space", direction: "Center", nature: "sacred" };
      }
    }
  }

  return grid;
})();

// ─── Direction Zones for Room Mapping ───
const getDirectionZone = (row, col) => {
  if (row <= 2 && col <= 2) return "NW";
  if (row <= 2 && col >= 6) return "NE";
  if (row >= 6 && col <= 2) return "SW";
  if (row >= 6 && col >= 6) return "SE";
  if (row <= 2) return "N";
  if (row >= 6) return "S";
  if (col <= 2) return "W";
  if (col >= 6) return "E";
  return "Center";
};

// ─── Room Types ───
const ROOM_TYPES = [
  { id: "entrance", label: "Main Entrance", icon: "🚪", color: T.accent },
  { id: "kitchen", label: "Kitchen", icon: "🍳", color: "#f97316" },
  { id: "master_bed", label: "Master Bedroom", icon: "🛏️", color: T.indigo },
  { id: "bedroom", label: "Bedroom", icon: "🛌", color: "#8b5cf6" },
  { id: "bathroom", label: "Bathroom/Toilet", icon: "🚿", color: T.cyan },
  { id: "prayer", label: "Puja/Prayer Room", icon: "🕉️", color: T.accent },
  { id: "living", label: "Living Room", icon: "🛋️", color: T.pos },
  { id: "dining", label: "Dining Room", icon: "🍽️", color: "#14b8a6" },
  { id: "study", label: "Study/Office", icon: "📚", color: "#6366f1" },
  { id: "storage", label: "Storage/Utility", icon: "📦", color: T.textSec },
  { id: "staircase", label: "Staircase", icon: "🪜", color: "#a78bfa" },
  { id: "garage", label: "Garage/Parking", icon: "🚗", color: "#64748b" },
  { id: "garden", label: "Garden/Open", icon: "🌿", color: "#4ade80" },
  { id: "well_bore", label: "Well/Borewell", icon: "💧", color: "#38bdf8" },
  { id: "septic", label: "Septic Tank", icon: "🕳️", color: "#78716c" },
  { id: "empty", label: "Open/Empty", icon: "⬜", color: T.textMuted },
];

// ─── Classical Vastu Rules (Ideal Placements) ───
const IDEAL_PLACEMENTS = {
  entrance: {
    ideal: ["N", "NE", "E"],
    acceptable: ["NW"],
    avoid: ["SW", "S", "SE"],
    forbidden: ["SW"],
    reason: "North/East entrances invite positive energy (Isha, Parjanya). SW entrance activates Pitru/Nairitya zone — causes severe misfortune.",
    bgTeaching: "SW entrance = catastrophic. BG lists 36 disease types from SW door. Kop Bhavan (anger chamber) is SW."
  },
  kitchen: {
    ideal: ["SE"],
    acceptable: ["NW", "E", "S"],
    avoid: ["NE", "SW", "N"],
    forbidden: ["NE"],
    reason: "SE = Agni (fire) zone. Kitchen fire must align with Agni deity. NE kitchen pollutes sacred Isha zone.",
    bgTeaching: "Agni corner SE is the only truly correct kitchen placement. NW acceptable as Vayu feeds fire."
  },
  master_bed: {
    ideal: ["SW"],
    acceptable: ["S", "W", "NW"],
    avoid: ["NE", "SE"],
    forbidden: ["NE"],
    reason: "SW = earth element, stability, heavy energy for the household head. NE must remain light/sacred.",
    bgTeaching: "SW is Kop Bhavan — anger energy. Head of family sleeping here channels authority. Others should avoid SW."
  },
  bedroom: {
    ideal: ["S", "SW", "W"],
    acceptable: ["NW"],
    avoid: ["NE", "SE"],
    forbidden: [],
    reason: "Southern/Western zones provide restful earth energy. Children's bedroom best in West.",
    bgTeaching: "West = children's zone. NW bedroom causes restlessness (Vayu/air energy)."
  },
  bathroom: {
    ideal: ["NW", "W"],
    acceptable: ["S"],
    avoid: ["NE", "E", "Center", "SE"],
    forbidden: ["NE", "Center"],
    reason: "NW (Vayu) aids ventilation. Water drainage toward NW/W is ideal. NE bathroom pollutes sacred zone.",
    bgTeaching: "Toilet in NE = blocks divine blessings. BG emphasizes NE must be clean, light, open."
  },
  prayer: {
    ideal: ["NE"],
    acceptable: ["N", "E", "Center"],
    avoid: ["S", "SW", "SE", "W"],
    forbidden: ["S", "SW"],
    reason: "NE = Ishaan (Lord Shiva) zone, purest direction. All spiritual activities face NE.",
    bgTeaching: "NE is Ishaan Kon — the divine corner. Prayer room here maximizes spiritual energy. Must face East or North while praying."
  },
  living: {
    ideal: ["N", "NE", "E"],
    acceptable: ["NW", "Center"],
    avoid: ["SW"],
    forbidden: [],
    reason: "North/East zones encourage social interaction and positive energy flow.",
    bgTeaching: "Living room should be where guests first experience positive energy."
  },
  dining: {
    ideal: ["W", "E"],
    acceptable: ["N", "S"],
    avoid: ["SW", "SE"],
    forbidden: [],
    reason: "West dining is traditional. East dining catches morning energy.",
    bgTeaching: "Face East while eating — digestion improves with Sun energy."
  },
  study: {
    ideal: ["NE", "N", "E", "W"],
    acceptable: ["NW"],
    avoid: ["S", "SW"],
    forbidden: [],
    reason: "NE/North enhances concentration. West = Saraswati zone for education.",
    bgTeaching: "BG's education remedy: study facing East or North. West wall = yellow color for Saraswati. NE study maximizes Budh (Mercury) energy."
  },
  storage: {
    ideal: ["SW", "S", "W"],
    acceptable: ["NW"],
    avoid: ["NE", "Center"],
    forbidden: ["NE"],
    reason: "SW = heavy earth energy, ideal for storing heavy items. Keeps center and NE light.",
    bgTeaching: "Heavy storage in SW stabilizes Kop Bhavan energy. NE must always remain clutter-free."
  },
  staircase: {
    ideal: ["SW", "S", "W"],
    acceptable: ["NW"],
    avoid: ["NE", "Center"],
    forbidden: ["NE", "Center"],
    reason: "Staircase should ascend from N→S or E→W (lower ground to higher). SW weight is beneficial.",
    bgTeaching: "Staircase in NE blocks energy ascent. Clockwise rotation preferred."
  },
  garage: {
    ideal: ["NW", "SE"],
    acceptable: ["W", "S"],
    avoid: ["NE"],
    forbidden: ["NE"],
    reason: "NW (Vayu/movement) suits vehicles. SE acceptable for mechanical energy.",
    bgTeaching: "Vehicles = movement energy, aligned with Vayu (NW) or Agni (SE for engines)."
  },
  garden: {
    ideal: ["N", "NE", "E"],
    acceptable: ["NW"],
    avoid: ["SW"],
    forbidden: [],
    reason: "Open spaces should be in lighter zones (N/NE/E) per Brihat Samhita ground-level rules.",
    bgTeaching: "NE garden/open space = maximum cosmic energy reception."
  },
  well_bore: {
    ideal: ["NE", "N", "E"],
    acceptable: ["NW"],
    avoid: ["SW", "S", "SE"],
    forbidden: ["SW"],
    reason: "Water sources in NE attract prosperity (Isha/Parjanya zone). SW water = financial ruin per Brihat Samhita.",
    bgTeaching: "Water element belongs to NE. Underground water in SW = ancestral curse activation."
  },
  septic: {
    ideal: ["NW", "W"],
    acceptable: ["S"],
    avoid: ["NE", "E", "Center", "SE"],
    forbidden: ["NE", "Center"],
    reason: "Waste disposal in NW/W. Never in sacred NE or energy center.",
    bgTeaching: "Septic in NE = worst possible Vastu dosh. Blocks all spiritual and financial growth."
  },
  empty: {
    ideal: ["NE", "N", "E", "Center"],
    acceptable: ["NW"],
    avoid: [],
    forbidden: [],
    reason: "Open/empty space is auspicious in NE and Center (Brahmasthana).",
    bgTeaching: "Center must remain open — Brahmasthana. Any construction here = health problems."
  },
};

// ─── Severity Scoring ───
const getDefectSeverity = (roomId, zone) => {
  const rule = IDEAL_PLACEMENTS[roomId];
  if (!rule) return { level: "unknown", score: 0, color: T.textMuted };
  if (rule.ideal.includes(zone)) return { level: "Ideal", score: 100, color: T.pos };
  if (rule.acceptable.includes(zone)) return { level: "Acceptable", score: 75, color: "#86efac" };
  if (rule.forbidden.includes(zone)) return { level: "Critical Defect", score: 0, color: T.neg };
  if (rule.avoid.includes(zone)) return { level: "Defect", score: 25, color: T.warn };
  return { level: "Neutral", score: 50, color: T.info };
};

// ─── Classical + BG Remedies per Defect ───
const getRemedies = (roomId, zone) => {
  const severity = getDefectSeverity(roomId, zone);
  if (severity.score >= 75) return [];

  const remedies = [];
  const key = `${roomId}_${zone}`;

  // Universal remedies based on zone
  if (zone === "NE") {
    remedies.push(
      { type: "critical", text: "Remove or relocate immediately — NE must remain clean, light, and sacred.", source: "Classical + BG" },
      { type: "interim", text: "Place a Tulsi plant in NE corner to purify energy.", source: "BG" },
      { type: "interim", text: "Keep NE area very clean, well-lit. Use white/light blue colors.", source: "Classical" },
      { type: "mantra", text: "Chant 'Om Ishanaya Namah' 108 times facing NE every morning.", source: "Classical" }
    );
  }
  if (zone === "SW" && !["master_bed", "storage", "staircase"].includes(roomId)) {
    remedies.push(
      { type: "critical", text: "SW is Kop Bhavan — only heavy/stable elements belong here.", source: "BG" },
      { type: "interim", text: "Place heavy objects/furniture to ground the energy.", source: "Classical" }
    );
  }
  if (zone === "Center" && roomId !== "empty") {
    remedies.push(
      { type: "critical", text: "Brahmasthana (center) must remain open — construction here causes health issues.", source: "Classical + BG" },
      { type: "interim", text: "If relocation impossible, install a copper pyramid at center point.", source: "Classical" }
    );
  }

  // Room-specific remedies
  if (roomId === "entrance" && ["SW", "S"].includes(zone)) {
    remedies.push(
      { type: "remedy", text: "Install a lead/metal strip at the SW door threshold.", source: "BG" },
      { type: "remedy", text: "Hang a Vastu Dosh Nivaran Yantra above the entrance.", source: "Classical" },
      { type: "remedy", text: "Place a pair of elephants facing inward at the entrance.", source: "Classical" },
      { type: "color", text: "Paint entrance area in bright yellow/saffron to counter negative energy.", source: "BG" }
    );
  }
  if (roomId === "kitchen" && ["NE", "N"].includes(zone)) {
    remedies.push(
      { type: "remedy", text: "If relocation impossible, ensure cooking stove faces SE direction.", source: "Classical" },
      { type: "remedy", text: "Place a red/copper pyramid in SE corner of the kitchen.", source: "Classical" },
      { type: "color", text: "Use yellow/orange tiles in kitchen to invoke Agni energy.", source: "BG" }
    );
  }
  if (roomId === "bathroom" && zone === "NE") {
    remedies.push(
      { type: "critical", text: "This is the most severe Vastu dosh — toilet in Ishaan zone.", source: "BG" },
      { type: "remedy", text: "Install a Vastu Dosh Nivaran Yantra in NE. Keep bathroom door always closed.", source: "Classical" },
      { type: "remedy", text: "Place sea salt bowls in all 4 corners of the bathroom, change weekly.", source: "BG" },
      { type: "mantra", text: "Place a Shiva Linga image on outside of the bathroom door facing NE.", source: "Classical" }
    );
  }
  if (roomId === "prayer" && ["S", "SW", "W"].includes(zone)) {
    remedies.push(
      { type: "remedy", text: "Ensure deity faces East or North even if room is in wrong zone.", source: "Classical" },
      { type: "remedy", text: "Place crystals and copper vessels with water near the altar.", source: "BG" },
      { type: "interim", text: "Light a ghee lamp daily in the NE corner of the house to compensate.", source: "BG" }
    );
  }
  if (roomId === "well_bore" && ["SW", "S", "SE"].includes(zone)) {
    remedies.push(
      { type: "critical", text: "Underground water in SW/S = financial and health destruction.", source: "Classical (Brihat Samhita)" },
      { type: "remedy", text: "If bore cannot be closed, install a Varun Yantra nearby.", source: "Classical" },
      { type: "remedy", text: "Place heavy stone/rock over the bore area. Perform Vastu Shanti puja.", source: "BG" }
    );
  }

  // Generic fallback
  if (remedies.length === 0) {
    remedies.push(
      { type: "remedy", text: `Consider relocating ${ROOM_TYPES.find(r => r.id === roomId)?.label || roomId} to an ideal zone: ${IDEAL_PLACEMENTS[roomId]?.ideal.join(", ")}`, source: "Classical" },
      { type: "interim", text: "Perform Vastu Shanti Puja to mitigate directional defects.", source: "Classical" },
      { type: "color", text: "Use zone-appropriate colors to balance elemental energy.", source: "BG" }
    );
  }

  return remedies;
};

// ─── Pancha Bhoota Direction Map ───
const PANCHA_BHOOTA = {
  NE: { element: "Water", color: "#38bdf8", symbol: "💧" },
  E: { element: "Space/Ether", color: "#a78bfa", symbol: "✨" },
  SE: { element: "Fire", color: "#f97316", symbol: "🔥" },
  S: { element: "Earth", color: "#a16207", symbol: "🌍" },
  SW: { element: "Earth", color: "#92400e", symbol: "🏔️" },
  W: { element: "Air", color: "#94a3b8", symbol: "💨" },
  NW: { element: "Air", color: "#cbd5e1", symbol: "🌬️" },
  N: { element: "Water", color: "#0ea5e9", symbol: "🌊" },
  Center: { element: "Space/Akasha", color: "#c084fc", symbol: "🕉️" },
};

// ─── Nakshatras for Chart Integration ───
const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu",
  "Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta",
  "Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha",
  "Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
  "Uttara Bhadrapada","Revati"
];

const PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

// ─── 9th House Planet Donation Rules (from BG) ───
const NINTH_HOUSE_RULES = {
  Sun: { safe: ["Wheat", "Jaggery", "Copper", "Red cloth"], forbidden: ["Nothing specific"], note: "Donate to father figures / government servants." },
  Moon: { safe: ["Rice", "White cloth", "Silver", "Milk"], forbidden: ["Never donate water at night"], note: "Donate to mother figures / elderly women." },
  Mars: { safe: ["Red lentils (Masoor)", "Copper", "Red cloth"], forbidden: ["Never donate blood without chart check"], note: "Donate to younger siblings / athletes." },
  Mercury: { safe: ["Green moong", "Emerald energy items", "Books"], forbidden: ["Avoid donating to maternal aunt if Mercury afflicted"], note: "Donate to students / young girls." },
  Jupiter: { safe: ["Yellow items", "Turmeric", "Gold", "Chana dal"], forbidden: ["Never donate to fake gurus"], note: "Donate to genuine teachers / Brahmins." },
  Venus: { safe: ["White items", "Rice", "Perfume", "Silk"], forbidden: ["Avoid donating to women if Venus combust"], note: "Donate to married women / artists." },
  Saturn: { safe: ["Black sesame", "Iron", "Mustard oil", "Black cloth"], forbidden: ["Never donate shoes to strangers"], note: "Donate to laborers / disabled persons / elderly." },
  Rahu: { safe: ["Coconut", "Blue cloth", "Electronics to poor"], forbidden: ["Never donate at crossroads after dark"], note: "Donate to outcasts / foreign-origin people." },
  Ketu: { safe: ["Blankets", "Dog food", "Seven-grain mix"], forbidden: ["Avoid donating sharp objects"], note: "Donate to saints / stray animals / monks." },
};

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function VastuCrossCheck() {
  // ── Step State ──
  const [step, setStep] = useState(0);
  const STEPS = ["Upload Plan", "Configure Grid", "Mark Rooms", "Analysis", "Chart (Optional)", "Report"];

  // ── Floor Plan ──
  const [floorPlan, setFloorPlan] = useState(null);
  const [planName, setplanName] = useState("");
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  // ── Grid Assignments ──
  const [gridAssignments, setGridAssignments] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Grid Orientation ──
  const [northAt, setNorthAt] = useState("top"); // top, right, bottom, left

  // ── Birth Chart (optional) ──
  const [chartEnabled, setChartEnabled] = useState(false);
  const [chartData, setChartData] = useState({
    lagna: "", ninthHousePlanet: "", moonSign: "", nakshatra: "",
    planets: {}
  });

  // ── Analysis ──
  const [defects, setDefects] = useState([]);
  const [vastuScore, setVastuScore] = useState(0);

  // ─── FILE UPLOAD ───
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setplanName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFloorPlan(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setplanName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFloorPlan(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ─── GRID CELL CLICK ───
  const handleCellClick = (row, col) => {
    if (!selectedRoom) return;
    setGridAssignments(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = next[row][col] === selectedRoom ? null : selectedRoom;
      return next;
    });
  };

  // ─── RUN ANALYSIS ───
  const runAnalysis = useCallback(() => {
    const found = [];
    const scores = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const roomId = gridAssignments[r][c];
        if (!roomId) continue;
        const zone = getDirectionZone(r, c);
        const severity = getDefectSeverity(roomId, zone);
        const deity = MANDALA_9x9[r][c];
        const remedies = getRemedies(roomId, zone);
        const room = ROOM_TYPES.find(rt => rt.id === roomId);

        scores.push(severity.score);

        if (severity.score < 75) {
          found.push({
            room: room?.label || roomId,
            roomId,
            icon: room?.icon || "?",
            zone,
            row: r, col: c,
            deity: deity.deity,
            element: deity.element,
            severity: severity.level,
            score: severity.score,
            color: severity.color,
            reason: IDEAL_PLACEMENTS[roomId]?.reason || "",
            bgTeaching: IDEAL_PLACEMENTS[roomId]?.bgTeaching || "",
            ideal: IDEAL_PLACEMENTS[roomId]?.ideal || [],
            remedies,
          });
        }
      }
    }

    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    setVastuScore(avg);
    setDefects(found);
    setStep(3);
  }, [gridAssignments]);

  // ─── COMPUTE ZONE SUMMARY ───
  const zoneSummary = useMemo(() => {
    const zones = {};
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const roomId = gridAssignments[r][c];
        if (!roomId) continue;
        const zone = getDirectionZone(r, c);
        if (!zones[zone]) zones[zone] = [];
        const room = ROOM_TYPES.find(rt => rt.id === roomId);
        if (room && !zones[zone].find(z => z.id === roomId)) {
          zones[zone].push(room);
        }
      }
    }
    return zones;
  }, [gridAssignments]);

  // ─── DIRECTION-WISE REPORT ───
  const directionReport = useMemo(() => {
    const dirs = ["NE", "N", "NW", "E", "Center", "W", "SE", "S", "SW"];
    return dirs.map(dir => {
      const rooms = zoneSummary[dir] || [];
      const bhoot = PANCHA_BHOOTA[dir];
      const roomDefects = defects.filter(d => d.zone === dir);
      return { dir, rooms, bhoot, defects: roomDefects };
    });
  }, [zoneSummary, defects]);

  // ═══ STYLES ═══
  const S = {
    page: { minHeight: "100vh", background: `linear-gradient(135deg, ${T.bg} 0%, ${T.bgSec} 50%, ${T.bg} 100%)`, color: T.text, fontFamily: T.font, padding: 0 },
    header: { background: `linear-gradient(180deg, rgba(11,17,32,0.98) 0%, rgba(19,27,46,0.95) 100%)`, borderBottom: `1px solid ${T.borderAcc}`, padding: "16px 24px", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    title: { fontSize: 22, fontWeight: 700, color: T.accent, margin: 0, letterSpacing: "0.5px" },
    subtitle: { fontSize: 12, color: T.textSec, margin: 0 },
    card: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, boxShadow: T.shadowCard, backdropFilter: "blur(8px)" },
    cardGlow: { background: T.bgCard, border: `1px solid ${T.borderAcc}`, borderRadius: T.radius, padding: 20, boxShadow: T.shadowGlow, backdropFilter: "blur(8px)" },
    btn: (active) => ({ padding: "10px 20px", border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: T.font, background: active ? T.accent : T.bgTer, color: active ? T.bg : T.textSec, transition: "all 0.2s", boxShadow: active ? `0 0 12px rgba(229,161,0,0.3)` : "none" }),
    btnSm: (active) => ({ padding: "6px 14px", border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: T.font, background: active ? T.accent : T.bgTer, color: active ? T.bg : T.textSec, transition: "all 0.2s" }),
    stepBar: { display: "flex", gap: 4, padding: "12px 24px", background: T.bgSec, borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" },
    stepBtn: (active, done) => ({ padding: "8px 16px", border: "none", borderRadius: T.radiusSm, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: T.font, background: active ? `rgba(229,161,0,0.15)` : done ? `rgba(34,197,94,0.1)` : "transparent", color: active ? T.accent : done ? T.pos : T.textMuted, borderBottom: active ? `2px solid ${T.accent}` : "2px solid transparent", transition: "all 0.2s" }),
    label: { fontSize: 11, color: T.accent, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" },
    body: { padding: "20px 24px", maxWidth: 1200, margin: "0 auto" },
    gridCell: (assigned, isHover) => ({ width: "100%", aspectRatio: "1", border: `1px solid ${assigned ? T.borderAcc : T.border}`, borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 9, transition: "all 0.15s", background: assigned ? `rgba(229,161,0,0.12)` : isHover ? `rgba(99,102,241,0.08)` : "transparent", position: "relative" }),
    badge: (color) => ({ fontSize: 9, padding: "2px 7px", borderRadius: "999px", color, background: `${color}22`, fontWeight: 600 }),
    select: { background: T.bgTer, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text, fontFamily: T.font, fontSize: 12, padding: "8px 12px", outline: "none", width: "100%" },
  };

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 0 — Upload Floor Plan
  // ═══════════════════════════════════════════════════
  const renderUpload = () => (
    <div style={{ ...S.body }}>
      <p style={S.label}>Step 1 of 6 — Upload Floor Plan</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          ...S.card, minHeight: 300, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          border: `2px dashed ${isDragging ? T.accent : T.border}`,
          background: isDragging ? `rgba(229,161,0,0.05)` : T.bgCard,
          transition: "all 0.3s"
        }}
      >
        {floorPlan ? (
          <div style={{ textAlign: "center" }}>
            <img src={floorPlan} alt="Floor Plan" style={{ maxWidth: "100%", maxHeight: 400, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }} />
            <p style={{ color: T.pos, fontSize: 13, marginTop: 12 }}>Uploaded: {planName}</p>
            <p style={{ color: T.textMuted, fontSize: 11 }}>Click or drag to replace</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>📐</div>
            <p style={{ color: T.text, fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
              Drop your floor plan here
            </p>
            <p style={{ color: T.textSec, fontSize: 12, margin: 0 }}>
              or click to browse — supports JPG, PNG, PDF preview
            </p>
            <p style={{ color: T.textMuted, fontSize: 11, marginTop: 16, maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
              Upload your building/floor plan image. In the next step, you'll align the 9x9 Vastu Purusha Mandala grid over it and mark room positions.
            </p>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
      </div>

      <div style={{ ...S.card, marginTop: 16 }}>
        <p style={S.label}>Or Start Without Image</p>
        <p style={{ color: T.textSec, fontSize: 12, lineHeight: 1.7, margin: "0 0 12px" }}>
          You can skip the image upload and directly mark room positions on the Vastu grid. This works well if you know your floor plan layout.
        </p>
        <button style={S.btn(false)} onClick={() => setStep(1)}>
          Skip to Grid Configuration →
        </button>
      </div>

      {floorPlan && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button style={S.btn(true)} onClick={() => setStep(1)}>
            Continue to Grid Setup →
          </button>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 1 — Configure Grid Orientation
  // ═══════════════════════════════════════════════════
  const renderGridConfig = () => (
    <div style={S.body}>
      <p style={S.label}>Step 2 of 6 — Configure Grid Orientation</p>

      <div style={{ display: "grid", gridTemplateColumns: floorPlan ? "1fr 1fr" : "1fr", gap: 20 }}>
        {/* Left: Floor plan with overlay preview */}
        {floorPlan && (
          <div style={S.card}>
            <p style={{ ...S.label, color: T.indigo }}>Floor Plan Preview</p>
            <div style={{ position: "relative", borderRadius: T.radiusSm, overflow: "hidden" }}>
              <img src={floorPlan} alt="Plan" style={{ width: "100%", opacity: 0.4, display: "block" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "grid", gridTemplateColumns: "repeat(9,1fr)", gridTemplateRows: "repeat(9,1fr)", gap: 1, padding: 4 }}>
                {Array.from({ length: 81 }).map((_, i) => {
                  const r = Math.floor(i / 9), c = i % 9;
                  const deity = MANDALA_9x9[r][c];
                  return (
                    <div key={i} style={{ background: `rgba(229,161,0,0.08)`, border: `1px solid rgba(229,161,0,0.15)`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: T.accent, opacity: 0.8 }}>
                      {deity.deity.slice(0, 3)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right: Orientation config */}
        <div>
          <div style={S.card}>
            <p style={{ ...S.label }}>North Direction</p>
            <p style={{ color: T.textSec, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px" }}>
              Set which edge of your floor plan faces North. This aligns the Vastu Purusha grid correctly.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { val: "top", label: "↑ North at Top", desc: "Standard orientation" },
                { val: "right", label: "→ North at Right", desc: "Plan rotated 90° left" },
                { val: "bottom", label: "↓ North at Bottom", desc: "Plan inverted" },
                { val: "left", label: "← North at Left", desc: "Plan rotated 90° right" },
              ].map(opt => (
                <button
                  key={opt.val}
                  style={{ ...S.card, cursor: "pointer", textAlign: "center", border: `1px solid ${northAt === opt.val ? T.accent : T.border}`, background: northAt === opt.val ? `rgba(229,161,0,0.08)` : T.bgCard }}
                  onClick={() => setNorthAt(opt.val)}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: northAt === opt.val ? T.accent : T.text }}>{opt.label}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, marginTop: 16 }}>
            <p style={{ ...S.label, color: T.indigo }}>Vastu Purusha Mandala — 9x9</p>
            <p style={{ color: T.textSec, fontSize: 11, lineHeight: 1.6, margin: "0 0 8px" }}>
              The grid contains 45 deities governing 81 padas. Brahma occupies the center 9 cells (Brahmasthana).
              Direction zones: NE = Ishaan (Water), SE = Agni (Fire), SW = Nairitya (Earth), NW = Vayu (Air).
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {Object.entries(PANCHA_BHOOTA).map(([dir, b]) => (
                <span key={dir} style={{ ...S.badge(b.color), fontSize: 10 }}>
                  {b.symbol} {dir} — {b.element}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button style={S.btn(false)} onClick={() => setStep(0)}>← Back</button>
        <button style={S.btn(true)} onClick={() => setStep(2)}>Continue to Room Marking →</button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 2 — Mark Rooms on Grid
  // ═══════════════════════════════════════════════════
  const renderRoomMarking = () => (
    <div style={S.body}>
      <p style={S.label}>Step 3 of 6 — Mark Room Positions on Grid</p>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Left: Room palette */}
        <div>
          <div style={S.card}>
            <p style={{ ...S.label, fontSize: 10 }}>Select Room Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {ROOM_TYPES.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                    border: `1px solid ${selectedRoom === room.id ? room.color : T.border}`,
                    borderRadius: T.radiusSm, cursor: "pointer", fontSize: 11, fontFamily: T.font,
                    background: selectedRoom === room.id ? `${room.color}18` : "transparent",
                    color: selectedRoom === room.id ? room.color : T.textSec,
                    fontWeight: selectedRoom === room.id ? 700 : 400,
                    transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{room.icon}</span>
                  <span>{room.label}</span>
                </button>
              ))}
            </div>
            <p style={{ color: T.textMuted, fontSize: 10, marginTop: 12, lineHeight: 1.5 }}>
              Select a room type above, then click cells on the grid to assign. Click again to remove.
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ ...S.card, marginTop: 12 }}>
            <button
              style={{ ...S.btn(false), width: "100%", fontSize: 11 }}
              onClick={() => setGridAssignments(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)))}
            >
              Clear All Assignments
            </button>
          </div>
        </div>

        {/* Right: Grid */}
        <div>
          {/* Direction labels */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: T.accent, fontWeight: 700, letterSpacing: 2 }}>
              {PANCHA_BHOOTA.N.symbol} NORTH (Kubera/Soma)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* West label */}
            <div style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", fontSize: 11, color: T.textSec, fontWeight: 600, letterSpacing: 1 }}>
              WEST (Varun)
            </div>

            {/* Main grid */}
            <div style={{ flex: 1, position: "relative" }}>
              {floorPlan && (
                <img src={floorPlan} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15, borderRadius: T.radiusSm, pointerEvents: "none" }} />
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 2, position: "relative", zIndex: 1 }}>
                {Array.from({ length: 81 }).map((_, i) => {
                  const r = Math.floor(i / 9), c = i % 9;
                  const assigned = gridAssignments[r][c];
                  const deity = MANDALA_9x9[r][c];
                  const zone = getDirectionZone(r, c);
                  const room = assigned ? ROOM_TYPES.find(rt => rt.id === assigned) : null;
                  const bhoot = PANCHA_BHOOTA[zone];
                  const severity = assigned ? getDefectSeverity(assigned, zone) : null;

                  return (
                    <div
                      key={i}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        aspectRatio: "1", border: `1px solid ${assigned ? (severity && severity.score < 50 ? severity.color : T.borderAcc) : deity.nature === "sacred" ? "rgba(99,102,241,0.2)" : T.border}`,
                        borderRadius: 3, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", cursor: selectedRoom ? "pointer" : "default",
                        fontSize: 8, transition: "all 0.15s", position: "relative", overflow: "hidden",
                        background: assigned
                          ? `${room?.color || T.accent}18`
                          : deity.nature === "sacred"
                            ? `rgba(99,102,241,0.06)`
                            : "transparent",
                      }}
                    >
                      {assigned ? (
                        <>
                          <span style={{ fontSize: 14 }}>{room?.icon}</span>
                          <span style={{ fontSize: 7, color: room?.color, fontWeight: 600, marginTop: 1 }}>
                            {room?.label?.split(" ")[0]}
                          </span>
                          {severity && severity.score < 75 && (
                            <span style={{ position: "absolute", top: 1, right: 2, fontSize: 8, color: severity.color }}>
                              {severity.score === 0 ? "⛔" : "⚠️"}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: 7, color: deity.nature === "sacred" ? T.indigo : T.textMuted, fontWeight: deity.nature === "sacred" ? 600 : 400 }}>
                            {deity.deity.length > 6 ? deity.deity.slice(0, 5) + "." : deity.deity}
                          </span>
                          <span style={{ fontSize: 6, color: T.textMuted, marginTop: 1 }}>{zone}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* East label */}
            <div style={{ writingMode: "vertical-lr", fontSize: 11, color: T.textSec, fontWeight: 600, letterSpacing: 1 }}>
              EAST (Indra/Surya)
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 4 }}>
            <span style={{ fontSize: 12, color: T.textSec, fontWeight: 700, letterSpacing: 2 }}>
              {PANCHA_BHOOTA.S.symbol} SOUTH (Yama)
            </span>
          </div>

          {/* Zone summary */}
          {Object.keys(zoneSummary).length > 0 && (
            <div style={{ ...S.card, marginTop: 16 }}>
              <p style={{ ...S.label, fontSize: 10 }}>Zone Summary</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(zoneSummary).map(([zone, rooms]) => (
                  <div key={zone} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: "6px 10px", fontSize: 10 }}>
                    <span style={{ color: PANCHA_BHOOTA[zone]?.color || T.textSec, fontWeight: 700 }}>{zone}:</span>{" "}
                    <span style={{ color: T.textSec }}>{rooms.map(r => r.icon).join(" ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button style={S.btn(false)} onClick={() => setStep(1)}>← Back</button>
        <button style={S.btn(true)} onClick={runAnalysis}>
          Run Vastu Analysis →
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 3 — Analysis Results
  // ═══════════════════════════════════════════════════
  const renderAnalysis = () => {
    const criticalCount = defects.filter(d => d.score === 0).length;
    const defectCount = defects.filter(d => d.score === 25).length;
    const neutralCount = defects.filter(d => d.score === 50).length;

    return (
      <div style={S.body}>
        <p style={S.label}>Step 4 of 6 — Vastu Defect Analysis</p>

        {/* Score card */}
        <div style={{ ...S.cardGlow, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, color: T.textSec, margin: "0 0 4px" }}>Overall Vastu Score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: vastuScore >= 75 ? T.pos : vastuScore >= 50 ? T.warn : T.neg }}>
                  {vastuScore}
                </span>
                <span style={{ fontSize: 20, color: T.textMuted }}>/100</span>
              </div>
              <p style={{ fontSize: 12, color: vastuScore >= 75 ? T.pos : vastuScore >= 50 ? T.warn : T.neg, margin: "4px 0 0" }}>
                {vastuScore >= 85 ? "Excellent — Highly auspicious layout" :
                 vastuScore >= 70 ? "Good — Minor adjustments recommended" :
                 vastuScore >= 50 ? "Fair — Significant defects found" :
                 vastuScore >= 30 ? "Poor — Major remediation needed" :
                 "Critical — Immediate Vastu corrections required"}
              </p>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ textAlign: "center", padding: "8px 16px", background: T.bgTer, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.neg }}>{criticalCount}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>Critical</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px 16px", background: T.bgTer, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.warn }}>{defectCount}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>Defects</div>
              </div>
              <div style={{ textAlign: "center", padding: "8px 16px", background: T.bgTer, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.info }}>{neutralCount}</div>
                <div style={{ fontSize: 10, color: T.textMuted }}>Neutral</div>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: `rgba(139,156,192,0.12)`, overflow: "hidden" }}>
            <div style={{ width: `${vastuScore}%`, height: "100%", borderRadius: 4, background: vastuScore >= 75 ? T.pos : vastuScore >= 50 ? T.warn : T.neg, transition: "width 0.8s ease" }} />
          </div>
        </div>

        {/* Defects list */}
        {defects.length === 0 ? (
          <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🕉️</div>
            <p style={{ fontSize: 16, color: T.pos, fontWeight: 600 }}>No Vastu defects found!</p>
            <p style={{ fontSize: 12, color: T.textSec }}>All room placements align with classical Vastu principles.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {defects.sort((a, b) => a.score - b.score).map((d, idx) => (
              <div key={idx} style={{ ...S.card, borderLeft: `3px solid ${d.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                        {d.room} in {d.zone} Zone
                      </div>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                        Deity: {d.deity} | Element: {d.element} | Grid: [{d.row},{d.col}]
                      </div>
                    </div>
                  </div>
                  <span style={{ ...S.badge(d.color), fontSize: 10 }}>{d.severity}</span>
                </div>

                {/* Reasons */}
                <div style={{ marginTop: 10, padding: "8px 12px", background: T.bgTer, borderRadius: T.radiusSm, fontSize: 11, lineHeight: 1.6 }}>
                  <div style={{ color: T.textSec }}><strong style={{ color: T.text }}>Classical Rule:</strong> {d.reason}</div>
                  {d.bgTeaching && (
                    <div style={{ color: T.textSec, marginTop: 4 }}>
                      <strong style={{ color: T.accent }}>BG Teaching:</strong> {d.bgTeaching}
                    </div>
                  )}
                  <div style={{ color: T.textSec, marginTop: 4 }}>
                    <strong style={{ color: T.pos }}>Ideal zones:</strong> {d.ideal.join(", ")}
                  </div>
                </div>

                {/* Remedies */}
                {d.remedies.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 6px" }}>Remedies</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {d.remedies.map((rem, ri) => (
                        <div key={ri} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 10px", background: rem.type === "critical" ? `rgba(239,68,68,0.06)` : T.bgTer, borderRadius: T.radiusSm, fontSize: 11, lineHeight: 1.5 }}>
                          <span style={{ color: rem.type === "critical" ? T.neg : rem.type === "mantra" ? T.indigo : rem.type === "color" ? T.accent : T.pos, fontSize: 12, flexShrink: 0 }}>
                            {rem.type === "critical" ? "⛔" : rem.type === "mantra" ? "🙏" : rem.type === "color" ? "🎨" : rem.type === "interim" ? "⏳" : "✅"}
                          </span>
                          <div>
                            <span style={{ color: T.text }}>{rem.text}</span>
                            <span style={{ color: T.textMuted, fontSize: 9, marginLeft: 6 }}>({rem.source})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Direction-wise summary */}
        <div style={{ ...S.card, marginTop: 20 }}>
          <p style={S.label}>Direction-Wise Summary</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {directionReport.map(({ dir, rooms, bhoot, defects: defs }) => (
              <div key={dir} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 10, border: `1px solid ${defs.length > 0 ? T.warn : T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: bhoot.color, fontSize: 13 }}>{bhoot.symbol} {dir}</span>
                  {defs.length > 0 && <span style={{ ...S.badge(T.warn) }}>{defs.length} issues</span>}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{bhoot.element}</div>
                {rooms.length > 0 ? (
                  <div style={{ marginTop: 6, fontSize: 11, color: T.textSec }}>
                    {rooms.map(r => `${r.icon} ${r.label}`).join(", ")}
                  </div>
                ) : (
                  <div style={{ marginTop: 6, fontSize: 10, color: T.textMuted }}>No rooms assigned</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
          <button style={S.btn(false)} onClick={() => setStep(2)}>← Edit Rooms</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btn(false)} onClick={() => { setChartEnabled(true); setStep(4); }}>
              Add Birth Chart →
            </button>
            <button style={S.btn(true)} onClick={() => setStep(5)}>
              Generate Report →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 4 — Birth Chart Integration (Optional)
  // ═══════════════════════════════════════════════════
  const renderChartInput = () => (
    <div style={S.body}>
      <p style={S.label}>Step 5 of 6 — Birth Chart Integration (Optional)</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={S.card}>
          <p style={{ ...S.label, color: T.indigo }}>Basic Chart Details</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: T.textSec, display: "block", marginBottom: 4 }}>Lagna (Ascendant)</label>
              <select style={S.select} value={chartData.lagna} onChange={e => setChartData(p => ({ ...p, lagna: e.target.value }))}>
                <option value="">— Select —</option>
                {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: T.textSec, display: "block", marginBottom: 4 }}>Moon Sign (Rashi)</label>
              <select style={S.select} value={chartData.moonSign} onChange={e => setChartData(p => ({ ...p, moonSign: e.target.value }))}>
                <option value="">— Select —</option>
                {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: T.textSec, display: "block", marginBottom: 4 }}>Nakshatra (Birth Star)</label>
              <select style={S.select} value={chartData.nakshatra} onChange={e => setChartData(p => ({ ...p, nakshatra: e.target.value }))}>
                <option value="">— Select —</option>
                {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: T.textSec, display: "block", marginBottom: 4 }}>
                9th House Lord / Planet <span style={{ color: T.accent }}>(for donation rules)</span>
              </label>
              <select style={S.select} value={chartData.ninthHousePlanet} onChange={e => setChartData(p => ({ ...p, ninthHousePlanet: e.target.value }))}>
                <option value="">— Select —</option>
                {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 9th House Rules Display */}
        <div style={S.card}>
          <p style={{ ...S.label, color: T.accent }}>9th House Donation Rules (BG)</p>
          {chartData.ninthHousePlanet ? (
            <div>
              {(() => {
                const rule = NINTH_HOUSE_RULES[chartData.ninthHousePlanet];
                const pColor = PC[chartData.ninthHousePlanet] || T.accent;
                return (
                  <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: pColor, marginBottom: 8 }}>
                      {chartData.ninthHousePlanet} in 9th House
                    </div>
                    <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.7, marginBottom: 8 }}>
                      {rule.note}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: T.pos, fontWeight: 700 }}>SAFE DONATIONS:</span>
                      <div style={{ fontSize: 11, color: T.text, marginTop: 4 }}>
                        {rule.safe.join(" | ")}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: T.neg, fontWeight: 700 }}>FORBIDDEN:</span>
                      <div style={{ fontSize: 11, color: T.text, marginTop: 4 }}>
                        {rule.forbidden.join(" | ")}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p style={{ color: T.textMuted, fontSize: 12, lineHeight: 1.7 }}>
              Select a 9th house planet to see BG's specific donation rules. The 9th house governs fortune (Bhagya) and determines which donations are safe vs. harmful for your chart.
            </p>
          )}

          {/* Lagna-based recommendations */}
          {chartData.lagna && (
            <div style={{ marginTop: 16 }}>
              <p style={{ ...S.label, fontSize: 10, color: T.cyan }}>Lagna-Based Vastu Notes</p>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.7, background: T.bgTer, borderRadius: T.radiusSm, padding: 10 }}>
                {chartData.lagna === "Aries" || chartData.lagna === "Scorpio" ? "Mars-ruled Lagna: Strengthen SE (Agni) zone. Red accents beneficial. Avoid cold/blue in bedroom." :
                 chartData.lagna === "Taurus" || chartData.lagna === "Libra" ? "Venus-ruled Lagna: Enhance SE with pink/white decor. Bedroom aesthetics matter most. Garden in E/NE." :
                 chartData.lagna === "Gemini" || chartData.lagna === "Virgo" ? "Mercury-ruled Lagna: Study/office zone critical — must be NE/N/W. Green plants in N. Books facing East." :
                 chartData.lagna === "Cancer" ? "Moon-ruled Lagna: Water features in NE essential. Silver/white decor. Kitchen hygiene critical for health." :
                 chartData.lagna === "Leo" ? "Sun-ruled Lagna: East entrance most beneficial. Morning sunlight essential. Gold/orange in prayer room." :
                 chartData.lagna === "Sagittarius" || chartData.lagna === "Pisces" ? "Jupiter-ruled Lagna: Prayer room in NE is mandatory. Yellow/gold colors. Teaching/study space needed." :
                 chartData.lagna === "Capricorn" || chartData.lagna === "Aquarius" ? "Saturn-ruled Lagna: SW must be heavy/stable. Dark/muted tones OK. Structure and discipline in layout." :
                 "Customize colors and placements based on your Lagna lord's element."}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <button style={S.btn(false)} onClick={() => setStep(3)}>← Back to Analysis</button>
        <button style={S.btn(true)} onClick={() => setStep(5)}>Generate Full Report →</button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // RENDER: STEP 5 — Comprehensive Report
  // ═══════════════════════════════════════════════════
  const renderReport = () => {
    const criticalDefects = defects.filter(d => d.score === 0);
    const majorDefects = defects.filter(d => d.score === 25);
    const minorDefects = defects.filter(d => d.score === 50);
    const now = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    return (
      <div style={S.body}>
        {/* Report Header */}
        <div style={{ ...S.cardGlow, textAlign: "center", marginBottom: 20, padding: 30 }}>
          <div style={{ fontSize: 11, color: T.accent, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            Silicon Siddhanta
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: "0 0 4px", letterSpacing: 0.5 }}>
            Vastu Purusha Cross-Check Report
          </h1>
          <p style={{ fontSize: 12, color: T.textSec, margin: 0 }}>
            Generated: {now} | Method: Classical Vastu + Brajesh Gautam Teachings
          </p>
          {planName && <p style={{ fontSize: 11, color: T.textMuted, margin: "4px 0 0" }}>Plan: {planName}</p>}
        </div>

        {/* Executive Summary */}
        <div style={{ ...S.card, marginBottom: 16 }}>
          <p style={S.label}>Executive Summary</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: vastuScore >= 75 ? T.pos : vastuScore >= 50 ? T.warn : T.neg }}>{vastuScore}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Vastu Score</div>
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.neg }}>{criticalDefects.length}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Critical Defects</div>
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.warn }}>{majorDefects.length}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Major Defects</div>
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.info }}>{minorDefects.length}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>Minor Issues</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8 }}>
            {defects.length === 0 ? (
              <span style={{ color: T.pos }}>This layout has no detectable Vastu defects. All room placements conform to classical Vastu Purusha Mandala rules and Brajesh Gautam's directional teachings.</span>
            ) : (
              <>
                Analysis detected <strong style={{ color: T.neg }}>{criticalDefects.length} critical</strong> and{" "}
                <strong style={{ color: T.warn }}>{majorDefects.length} major</strong> Vastu defects.{" "}
                {criticalDefects.length > 0 && "Immediate remediation recommended for critical items. "}
                Priority should be given to{" "}
                {criticalDefects.length > 0
                  ? `${criticalDefects[0].room} placement (${criticalDefects[0].zone} zone)`
                  : majorDefects.length > 0
                    ? `${majorDefects[0].room} placement (${majorDefects[0].zone} zone)`
                    : "general optimization"}.
              </>
            )}
          </div>
        </div>

        {/* Direction-wise detailed analysis */}
        <div style={{ ...S.card, marginBottom: 16 }}>
          <p style={S.label}>Direction-Wise Analysis</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {directionReport.map(({ dir, rooms, bhoot, defects: defs }) => (
              <div key={dir} style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 12, border: `1px solid ${defs.length > 0 ? `${T.warn}44` : T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: bhoot.color, fontSize: 14 }}>{bhoot.symbol} {dir}</span>
                  <span style={{ fontSize: 10, color: T.textMuted }}>{bhoot.element}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6 }}>
                  {rooms.length > 0
                    ? rooms.map(r => `${r.icon} ${r.label}`).join(", ")
                    : <span style={{ color: T.textMuted, fontStyle: "italic" }}>Empty</span>}
                </div>
                {defs.length > 0 && (
                  <div style={{ marginTop: 6, fontSize: 10, color: T.warn }}>
                    {defs.map(d => `${d.severity}: ${d.room}`).join("; ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Defect Details */}
        {defects.length > 0 && (
          <div style={{ ...S.card, marginBottom: 16 }}>
            <p style={S.label}>Detailed Defect Register</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["#", "Room", "Current Zone", "Severity", "Score", "Ideal Zone(s)", "Deity Affected"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {defects.sort((a, b) => a.score - b.score).map((d, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}22` }}>
                      <td style={{ padding: "8px 10px", color: T.textMuted }}>{i + 1}</td>
                      <td style={{ padding: "8px 10px", color: T.text }}>{d.icon} {d.room}</td>
                      <td style={{ padding: "8px 10px", color: d.color, fontWeight: 600 }}>{d.zone}</td>
                      <td style={{ padding: "8px 10px" }}><span style={S.badge(d.color)}>{d.severity}</span></td>
                      <td style={{ padding: "8px 10px", color: d.color, fontWeight: 700 }}>{d.score}/100</td>
                      <td style={{ padding: "8px 10px", color: T.pos }}>{d.ideal.join(", ")}</td>
                      <td style={{ padding: "8px 10px", color: T.textSec }}>{d.deity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Consolidated Remedies */}
        {defects.length > 0 && (
          <div style={{ ...S.card, marginBottom: 16 }}>
            <p style={S.label}>Consolidated Remedy Plan</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Priority 1: Critical */}
              {criticalDefects.length > 0 && (
                <div style={{ background: `rgba(239,68,68,0.06)`, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: T.radiusSm, padding: 14 }}>
                  <p style={{ fontSize: 11, color: T.neg, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>
                    Priority 1 — Immediate Action Required
                  </p>
                  {criticalDefects.map((d, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{d.icon} {d.room} ({d.zone})</div>
                      {d.remedies.map((r, ri) => (
                        <div key={ri} style={{ fontSize: 11, color: T.textSec, marginLeft: 20, lineHeight: 1.7 }}>
                          {r.type === "critical" ? "⛔" : "•"} {r.text} <span style={{ color: T.textMuted, fontSize: 9 }}>({r.source})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Priority 2: Major */}
              {majorDefects.length > 0 && (
                <div style={{ background: `rgba(234,179,8,0.06)`, border: `1px solid rgba(234,179,8,0.15)`, borderRadius: T.radiusSm, padding: 14 }}>
                  <p style={{ fontSize: 11, color: T.warn, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>
                    Priority 2 — Recommended Changes
                  </p>
                  {majorDefects.map((d, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{d.icon} {d.room} ({d.zone})</div>
                      {d.remedies.map((r, ri) => (
                        <div key={ri} style={{ fontSize: 11, color: T.textSec, marginLeft: 20, lineHeight: 1.7 }}>
                          • {r.text} <span style={{ color: T.textMuted, fontSize: 9 }}>({r.source})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Priority 3: Minor */}
              {minorDefects.length > 0 && (
                <div style={{ background: `rgba(59,130,246,0.06)`, border: `1px solid rgba(59,130,246,0.15)`, borderRadius: T.radiusSm, padding: 14 }}>
                  <p style={{ fontSize: 11, color: T.info, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1, textTransform: "uppercase" }}>
                    Priority 3 — Optional Optimizations
                  </p>
                  {minorDefects.map((d, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{d.icon} {d.room} ({d.zone})</div>
                      {d.remedies.map((r, ri) => (
                        <div key={ri} style={{ fontSize: 11, color: T.textSec, marginLeft: 20, lineHeight: 1.7 }}>
                          • {r.text} <span style={{ color: T.textMuted, fontSize: 9 }}>({r.source})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Birth Chart Section (if provided) */}
        {chartEnabled && chartData.lagna && (
          <div style={{ ...S.card, marginBottom: 16, border: `1px solid ${T.borderAcc}` }}>
            <p style={S.label}>Birth Chart Integration</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <p style={{ fontSize: 10, color: T.indigo, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>Chart Details</p>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 2 }}>
                  <div><strong style={{ color: T.text }}>Lagna:</strong> {chartData.lagna}</div>
                  {chartData.moonSign && <div><strong style={{ color: T.text }}>Moon Sign:</strong> {chartData.moonSign}</div>}
                  {chartData.nakshatra && <div><strong style={{ color: T.text }}>Nakshatra:</strong> {chartData.nakshatra}</div>}
                  {chartData.ninthHousePlanet && <div><strong style={{ color: T.text }}>9th House Planet:</strong> {chartData.ninthHousePlanet}</div>}
                </div>
              </div>
              {chartData.ninthHousePlanet && (
                <div>
                  <p style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>Donation Protocol (BG)</p>
                  {(() => {
                    const rule = NINTH_HOUSE_RULES[chartData.ninthHousePlanet];
                    return (
                      <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.8 }}>
                        <div><span style={{ color: T.pos }}>Safe:</span> {rule.safe.join(", ")}</div>
                        <div><span style={{ color: T.neg }}>Forbidden:</span> {rule.forbidden.join(", ")}</div>
                        <div style={{ marginTop: 4, color: T.textMuted, fontStyle: "italic" }}>{rule.note}</div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vastu Shanti General Recommendations */}
        <div style={{ ...S.card, marginBottom: 16 }}>
          <p style={S.label}>General Vastu Recommendations</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 11, color: T.textSec, lineHeight: 1.7 }}>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 12 }}>
              <p style={{ fontSize: 10, color: T.pos, fontWeight: 700, margin: "0 0 6px" }}>BRAHMASTHANA (Center)</p>
              Keep the center of your home open and clutter-free. This is the Brahma zone — the cosmic navel. Any construction here disrupts the energy field of the entire house. If unavoidable, use a copper pyramid.
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 12 }}>
              <p style={{ fontSize: 10, color: PANCHA_BHOOTA.NE.color, fontWeight: 700, margin: "0 0 6px" }}>NE — ISHAAN ZONE</p>
              Must be the cleanest, lightest, and lowest zone. Ideal for prayer, meditation, water features. Never place toilet, kitchen, or heavy storage here. BG calls this the "divine reception zone."
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 12 }}>
              <p style={{ fontSize: 10, color: T.warn, fontWeight: 700, margin: "0 0 6px" }}>GROUND LEVEL RULE</p>
              Per Brihat Samhita: NE ground should be lowest, SW highest. Water should naturally flow from SW toward NE. Violating this ground slope inverts the energy hierarchy.
            </div>
            <div style={{ background: T.bgTer, borderRadius: T.radiusSm, padding: 12 }}>
              <p style={{ fontSize: 10, color: T.accent, fontWeight: 700, margin: "0 0 6px" }}>COLOR PROTOCOL (BG)</p>
              North wall = Green (Mercury). East wall = White/Cream (Sun). South wall = Red/Pink (Mars). West wall = Yellow (Jupiter/Education). NE = Light Blue. SW = Brown/Earth tones.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${T.border}`, marginTop: 20 }}>
          <p style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.8, margin: 0 }}>
            Silicon Siddhanta — Vastu Purusha Cross-Check Tool<br />
            Sources: Classical Vastu (Brihat Samhita, Mayamata, Manasara) + Brajesh Gautam Episode 11 Teachings<br />
            Confidence: Defect rules follow verified classical texts. BG-specific remedies tagged separately.
          </p>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
          <button style={S.btn(false)} onClick={() => setStep(3)}>← Back to Analysis</button>
          <button style={S.btn(false)} onClick={() => setStep(0)}>Start New Analysis</button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>🕉️ Vastu Purusha Cross-Check</h1>
          <p style={S.subtitle}>Floor Plan Analysis | Defect Detection | Remedy Engine</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...S.badge(T.accent), fontSize: 10 }}>Classical + BG Method</span>
          <span style={{ ...S.badge(T.indigo), fontSize: 10 }}>9x9 Mandala</span>
        </div>
      </div>

      {/* Step Bar */}
      <div style={S.stepBar}>
        {STEPS.map((s, i) => (
          <button
            key={i}
            style={S.stepBtn(step === i, i < step)}
            onClick={() => {
              if (i <= step || (i === 3 && step >= 2)) setStep(i);
            }}
          >
            {i < step ? "✓ " : `${i + 1}. `}{s}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && renderUpload()}
      {step === 1 && renderGridConfig()}
      {step === 2 && renderRoomMarking()}
      {step === 3 && renderAnalysis()}
      {step === 4 && renderChartInput()}
      {step === 5 && renderReport()}
    </div>
  );
}
