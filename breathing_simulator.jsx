/**
 * breathing_simulator.jsx
 * ═══════════════════════════════════════════════════════════
 * Universal Pranayama & Kriya Breathing Simulator
 * Boltable: ZenFlo (Hemant's Stack) + Airjun
 *
 * Techniques:
 *   Sri Sri Ravi Shankar: Sudarshan Kriya, Nadi Shodhana, Bhastrika, Bhramari, Ujjayi, So-Hum
 *   Sadhguru: Isha Kriya, Simha Kriya, Shambhavi Prep
 *   Classical: Kapalabhati, Sitali/Sitkari, Box Breathing, 4-7-8 Relaxation
 *
 * Props API for theming — pass `theme` prop to override defaults.
 * Default theme: Vedic Mystic (cosmic navy + saffron gold)
 *
 * Usage:
 *   <BreathingSimulator />                          // default theme
 *   <BreathingSimulator theme={{ bg: "#fff", text: "#111", accent: "#6366f1" }} />
 *   <BreathingSimulator startTechnique="nadi_shodhana" />
 *   <BreathingSimulator compact={true} />            // mini mode for embed
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── Default Theme (Vedic Mystic) ───
const DEFAULT_THEME = {
  bg: "#0b1120",
  bgSec: "#131b2e",
  bgTer: "#1a2340",
  bgCard: "rgba(19,27,46,0.85)",
  text: "#eef2f7",
  textSec: "#8b9cc0",
  textMuted: "#5a6b8a",
  accent: "#e5a100",
  accentHov: "#f5b800",
  indigo: "#6366f1",
  cyan: "#0ea5e9",
  pos: "#22c55e",
  neg: "#ef4444",
  warn: "#eab308",
  border: "#1e2a42",
  radius: "12px",
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 24px rgba(0,0,0,0.4)",
  // Breathing orb colors
  orbInhale: "#e5a100",
  orbHold: "#6366f1",
  orbExhale: "#0ea5e9",
  orbIdle: "#1e2a42",
};

// ─── Technique Library ───
const TECHNIQUES = [
  // ── Sri Sri Ravi Shankar / Art of Living ──
  {
    id: "sudarshan_kriya",
    name: "Sudarshan Kriya",
    nameShort: "SK",
    teacher: "Sri Sri Ravi Shankar",
    tradition: "Art of Living",
    icon: "🌀",
    category: "kriya",
    difficulty: "intermediate",
    totalMinutes: 20,
    description: "Rhythmic cyclical breathing at three speeds — slow, medium, fast. The signature Art of Living practice for stress relief and emotional cleansing.",
    contraindications: "Uncontrolled hypertension, pregnancy (later stages), cardiac instability, seizure disorders.",
    phases: [
      { name: "Ujjayi (Slow)", inhale: 5, hold: 0, exhale: 7, rounds: 8, cue: "Gentle throat constriction, ocean sound", guide: "Breathe slowly through the throat. Hear the ocean." },
      { name: "Bhastrika (Prep)", inhale: 1, hold: 0, exhale: 1, rounds: 20, cue: "Rapid forceful belly pumps", guide: "Sharp belly pumps. In-out through nose." },
      { name: "Om Chanting", inhale: 3, hold: 0, exhale: 10, rounds: 3, cue: "Deep inhale, long Om exhale", guide: "Inhale deep. Chant OMMM on exhale." },
      { name: "SK Slow Cycle", inhale: 3, hold: 0, exhale: 4, rounds: 20, cue: "Slow rhythmic (8-12 bpm)", guide: "Slow steady rhythm. Let it flow." },
      { name: "SK Medium Cycle", inhale: 1.5, hold: 0, exhale: 1.5, rounds: 40, cue: "Medium speed, build intensity", guide: "Faster now. Stay with the rhythm." },
      { name: "SK Fast Cycle", inhale: 0.5, hold: 0, exhale: 0.5, rounds: 40, cue: "Rapid rhythmic breathing", guide: "Maximum speed. Let go completely." },
      { name: "Rest & Meditate", inhale: 0, hold: 0, exhale: 0, rounds: 1, cue: "Lie down, rest in silence", guide: "Rest. Observe the stillness within.", duration: 120 },
    ],
  },
  {
    id: "nadi_shodhana",
    name: "Nadi Shodhana",
    nameShort: "NS",
    teacher: "Both",
    tradition: "Classical / AOL / Isha",
    icon: "🌙",
    category: "pranayama",
    difficulty: "beginner",
    totalMinutes: 10,
    description: "Alternate nostril breathing. Balances left (Ida/Moon) and right (Pingala/Sun) energy channels. Calms the nervous system profoundly.",
    contraindications: "Cold/nasal blockage (wait until clear). Low blood pressure (practice seated).",
    phases: [
      { name: "Left Exhale", inhale: 0, hold: 0, exhale: 4, rounds: 1, cue: "Close right nostril, exhale left", guide: "Close right nostril with thumb. Exhale left.", nostril: "left" },
      { name: "Left Inhale", inhale: 4, hold: 0, exhale: 0, rounds: 1, cue: "Inhale through left nostril", guide: "Inhale slowly through left nostril.", nostril: "left" },
      { name: "Hold", inhale: 0, hold: 8, exhale: 0, rounds: 1, cue: "Close both, retain breath", guide: "Close both nostrils. Hold gently.", nostril: "both" },
      { name: "Right Exhale", inhale: 0, hold: 0, exhale: 8, rounds: 1, cue: "Open right, exhale slowly", guide: "Release right nostril. Exhale slowly.", nostril: "right" },
      { name: "Right Inhale", inhale: 4, hold: 0, exhale: 0, rounds: 1, cue: "Inhale through right nostril", guide: "Inhale slowly through right nostril.", nostril: "right" },
      { name: "Hold", inhale: 0, hold: 8, exhale: 0, rounds: 1, cue: "Close both, retain breath", guide: "Close both nostrils. Hold gently.", nostril: "both" },
      { name: "Left Exhale", inhale: 0, hold: 0, exhale: 8, rounds: 1, cue: "Open left, exhale slowly", guide: "Release left nostril. Exhale slowly.", nostril: "left" },
    ],
    repeatCycles: 9,
  },
  {
    id: "bhastrika",
    name: "Bhastrika",
    nameShort: "BH",
    teacher: "Both",
    tradition: "Classical / AOL",
    icon: "🔥",
    category: "pranayama",
    difficulty: "intermediate",
    totalMinutes: 5,
    description: "Bellows breath — rapid forceful diaphragm-powered inhalation and exhalation. Energizes body, clears channels, stokes digestive fire.",
    contraindications: "Hypertension, heart disease, pregnancy, hernia, recent surgery. Do not practice on full stomach.",
    phases: [
      { name: "Round 1 — Slow", inhale: 1, hold: 0, exhale: 1, rounds: 20, cue: "Belly-powered pumps, moderate pace", guide: "Forceful belly pumps. Equal in and out." },
      { name: "Rest", inhale: 4, hold: 0, exhale: 6, rounds: 3, cue: "Normal recovery breaths", guide: "Breathe naturally. Rest." },
      { name: "Round 2 — Medium", inhale: 0.75, hold: 0, exhale: 0.75, rounds: 20, cue: "Faster pumping rhythm", guide: "Increase speed. Stay controlled." },
      { name: "Rest", inhale: 4, hold: 0, exhale: 6, rounds: 3, cue: "Normal recovery breaths", guide: "Breathe naturally. Rest." },
      { name: "Round 3 — Fast", inhale: 0.5, hold: 0, exhale: 0.5, rounds: 20, cue: "Maximum speed", guide: "Full speed. Sharp belly pumps." },
      { name: "Final Rest", inhale: 4, hold: 4, exhale: 6, rounds: 5, cue: "Deep recovery breaths with hold", guide: "Deep inhale. Hold. Slow exhale. Feel the energy." },
    ],
  },
  {
    id: "bhramari",
    name: "Bhramari",
    nameShort: "BM",
    teacher: "Both",
    tradition: "Classical / AOL",
    icon: "🐝",
    category: "pranayama",
    difficulty: "beginner",
    totalMinutes: 5,
    description: "Bee breath — humming exhalation creates vibration through the skull. Instantly calms anxiety, lowers blood pressure, aids sleep.",
    contraindications: "Ear infections. Lie down if dizzy.",
    phases: [
      { name: "Inhale Deep", inhale: 3, hold: 0, exhale: 0, rounds: 1, cue: "Full breath through nose", guide: "Deep breath in through the nose." },
      { name: "Hum Exhale", inhale: 0, hold: 0, exhale: 9, rounds: 1, cue: "Long humming bee sound", guide: "Close ears. Hum like a bee. MMMMM..." },
    ],
    repeatCycles: 7,
  },
  {
    id: "ujjayi",
    name: "Ujjayi Pranayama",
    nameShort: "UJ",
    teacher: "Both",
    tradition: "Classical / AOL",
    icon: "🌊",
    category: "pranayama",
    difficulty: "beginner",
    totalMinutes: 10,
    description: "Ocean breath — gentle throat constriction creates a soft wave-like sound. The foundational yogic breath. Calms mind, warms body.",
    contraindications: "None significant. Reduce if feeling lightheaded.",
    phases: [
      { name: "Ujjayi Breath", inhale: 4, hold: 0, exhale: 6, rounds: 30, cue: "Throat whisper sound, gentle ocean waves", guide: "Constrict throat gently. Hear the ocean wave sound." },
    ],
  },
  {
    id: "so_hum",
    name: "So-Hum Meditation",
    nameShort: "SH",
    teacher: "Sri Sri Ravi Shankar",
    tradition: "Art of Living",
    icon: "🕊️",
    category: "meditation",
    difficulty: "beginner",
    totalMinutes: 15,
    description: "Mantra-breath synchronization. 'So' on inhale ('I am'), 'Hum' on exhale ('That'). Dissolves mental chatter into pure awareness.",
    contraindications: "None.",
    phases: [
      { name: "So — Inhale", inhale: 5, hold: 0, exhale: 0, rounds: 1, cue: "Mental 'SO' through entire inhale", guide: "Breathe in. Mentally say 'SOOO...'" , mantra: "So" },
      { name: "Hum — Exhale", inhale: 0, hold: 0, exhale: 7, rounds: 1, cue: "Mental 'HUM' through entire exhale", guide: "Breathe out. Mentally say 'HUMM...'", mantra: "Hum" },
    ],
    repeatCycles: 50,
  },
  // ── Sadhguru / Isha ──
  {
    id: "isha_kriya",
    name: "Isha Kriya",
    nameShort: "IK",
    teacher: "Sadhguru",
    tradition: "Isha Yoga",
    icon: "🧘",
    category: "kriya",
    difficulty: "beginner",
    totalMinutes: 18,
    description: "Three-stage practice: breath with affirmation ('I am not the body, I am not even the mind'), 'Aaa' exhalation from navel, silent meditation.",
    contraindications: "None. Suitable for all.",
    phases: [
      { name: "Stage 1 — Affirmation Breath", inhale: 5, hold: 0, exhale: 7, rounds: 24, cue: "Inhale: 'I am not the body' | Exhale: 'I am not even the mind'", guide: "Inhale — 'I am not the body'. Exhale — 'I am not even the mind'.", mantra: "I am not the body... I am not even the mind" },
      { name: "Stage 2 — Aaa Vibration", inhale: 3, hold: 0, exhale: 15, rounds: 7, cue: "Short inhale, long 'AAAHH' from navel", guide: "Quick inhale. Long 'AAAAHHH' from below the navel." },
      { name: "Stage 3 — Silent Meditation", inhale: 0, hold: 0, exhale: 0, rounds: 1, cue: "Eyes closed, gaze slightly upward", guide: "Sit still. Eyes closed. Face slightly upward. Observe.", duration: 300 },
    ],
  },
  {
    id: "simha_kriya",
    name: "Simha Kriya",
    nameShort: "SiK",
    teacher: "Sadhguru",
    tradition: "Isha Yoga",
    icon: "🦁",
    category: "kriya",
    difficulty: "intermediate",
    totalMinutes: 5,
    description: "Lion's breath — forceful exhale with tongue out, lion posture. Strengthens lungs, clears throat, boosts immunity. Sadhguru's recommended practice during COVID.",
    contraindications: "Recent facial surgery. Practice on empty stomach (2.5 hrs after meal).",
    phases: [
      { name: "Deep Inhale", inhale: 4, hold: 0, exhale: 0, rounds: 1, cue: "Fill lungs completely", guide: "Inhale fully through the nose." },
      { name: "Lion Exhale", inhale: 0, hold: 0, exhale: 3, rounds: 1, cue: "Mouth open, tongue out, forceful exhale", guide: "Open mouth wide. Tongue out. Forceful 'HAAAA!'" },
      { name: "Hold Empty", inhale: 0, hold: 5, exhale: 0, rounds: 1, cue: "Engage throat, hold breath out", guide: "Hold lungs empty. Engage throat lock." },
    ],
    repeatCycles: 12,
  },
  {
    id: "shambhavi_prep",
    name: "Shambhavi Prep Breath",
    nameShort: "SP",
    teacher: "Sadhguru",
    tradition: "Isha Yoga",
    icon: "👁️",
    category: "kriya",
    difficulty: "advanced",
    totalMinutes: 8,
    description: "Preparatory fluttering breath (Bhastrika variant) + AUM chanting as done before Shambhavi Mahamudra. Rapid breath followed by bandha engagement and Om.",
    contraindications: "Learn from certified Isha teacher. Hypertension caution.",
    phases: [
      { name: "Fluttering Breath", inhale: 0.4, hold: 0, exhale: 0.4, rounds: 60, cue: "Rapid diaphragm pulsation", guide: "Rapid belly-driven breathing. Stay loose." },
      { name: "Deep Inhale + Hold", inhale: 5, hold: 10, exhale: 0, rounds: 1, cue: "Full inhale, engage bandhas", guide: "Inhale fully. Engage root, belly, throat locks. Hold." },
      { name: "Slow Exhale", inhale: 0, hold: 0, exhale: 8, rounds: 1, cue: "Release locks, slow exhale", guide: "Release locks slowly. Exhale completely." },
      { name: "AUM Chant", inhale: 4, hold: 0, exhale: 12, rounds: 7, cue: "Inhale, chant AUM on exhale", guide: "Inhale deep. Chant AAAUUUMMM on exhale.", mantra: "AUM" },
      { name: "Silent Hold", inhale: 0, hold: 0, exhale: 0, rounds: 1, cue: "Stillness, eyes at ajna", guide: "Focus between eyebrows. Stillness.", duration: 60 },
    ],
  },
  // ── Classical ──
  {
    id: "kapalabhati",
    name: "Kapalabhati",
    nameShort: "KB",
    teacher: "Both",
    tradition: "Classical",
    icon: "💎",
    category: "pranayama",
    difficulty: "intermediate",
    totalMinutes: 8,
    description: "Skull-shining breath — passive inhale, forceful short exhale. Cleanses frontal brain, energizes system, tones abdominals.",
    contraindications: "Pregnancy, hernia, high BP, heart disease, recent abdominal surgery, epilepsy.",
    phases: [
      { name: "Round 1", inhale: 0.5, hold: 0, exhale: 0.3, rounds: 30, cue: "Passive inhale, sharp exhale pump", guide: "Belly snaps in on exhale. Inhale is passive." },
      { name: "Rest + Retention", inhale: 5, hold: 15, exhale: 8, rounds: 1, cue: "Deep breath, hold with bandhas", guide: "Deep inhale. Hold. Apply root lock. Slow exhale." },
      { name: "Round 2", inhale: 0.5, hold: 0, exhale: 0.3, rounds: 50, cue: "Increase count, same rhythm", guide: "More strokes this round. Stay sharp." },
      { name: "Rest + Retention", inhale: 5, hold: 15, exhale: 8, rounds: 1, cue: "Deep breath, hold with bandhas", guide: "Deep inhale. Hold. Root lock. Slow exhale." },
      { name: "Round 3", inhale: 0.5, hold: 0, exhale: 0.3, rounds: 70, cue: "Final round, maximum strokes", guide: "Final round. Push the count. Stay controlled." },
      { name: "Final Rest", inhale: 5, hold: 20, exhale: 10, rounds: 1, cue: "Long retention, feel the energy", guide: "Deepest inhale. Longest hold. Feel skull shining." },
    ],
  },
  {
    id: "sitali",
    name: "Sitali / Sitkari",
    nameShort: "ST",
    teacher: "Both",
    tradition: "Classical",
    icon: "❄️",
    category: "pranayama",
    difficulty: "beginner",
    totalMinutes: 5,
    description: "Cooling breath — inhale through curled tongue (Sitali) or clenched teeth (Sitkari). Cools body, reduces pitta, calms anger.",
    contraindications: "Asthma, bronchitis, cold weather. Low BP.",
    phases: [
      { name: "Cool Inhale", inhale: 4, hold: 0, exhale: 0, rounds: 1, cue: "Curl tongue / clench teeth, inhale cool air", guide: "Curl tongue (or teeth together). Inhale cool air through mouth." },
      { name: "Nose Exhale", inhale: 0, hold: 2, exhale: 6, rounds: 1, cue: "Close mouth, hold briefly, exhale nose", guide: "Close mouth. Brief hold. Exhale slowly through nose." },
    ],
    repeatCycles: 15,
  },
  {
    id: "box_breathing",
    name: "Box Breathing",
    nameShort: "BB",
    teacher: "Universal",
    tradition: "Modern / Military",
    icon: "⬜",
    category: "regulation",
    difficulty: "beginner",
    totalMinutes: 5,
    description: "Equal-ratio square breath (4-4-4-4). Used by Navy SEALs for stress regulation. Activates parasympathetic nervous system.",
    contraindications: "None significant.",
    phases: [
      { name: "Box Breath", inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 20, cue: "Equal sides: in-hold-out-hold", guide: "In 4... Hold 4... Out 4... Hold 4..." },
    ],
  },
  {
    id: "four_seven_eight",
    name: "4-7-8 Relaxation",
    nameShort: "478",
    teacher: "Dr. Andrew Weil",
    tradition: "Modern / Yogic-derived",
    icon: "😴",
    category: "regulation",
    difficulty: "beginner",
    totalMinutes: 5,
    description: "The 'natural tranquilizer' — inhale 4, hold 7, exhale 8 counts. Derived from Pranayama ratios. Highly effective for sleep and anxiety.",
    contraindications: "None. Reduce hold if dizzy.",
    phases: [
      { name: "4-7-8 Breath", inhale: 4, hold: 7, exhale: 8, rounds: 8, cue: "In through nose, hold, slow mouth exhale", guide: "Nose inhale 4... Hold 7... Mouth exhale 8..." },
    ],
  },
];

// ─── Category metadata ───
const CATEGORIES = {
  kriya: { label: "Kriya", color: "#e5a100", icon: "🌀" },
  pranayama: { label: "Pranayama", color: "#6366f1", icon: "🌬️" },
  meditation: { label: "Meditation", color: "#0ea5e9", icon: "🧘" },
  regulation: { label: "Regulation", color: "#22c55e", icon: "⬜" },
};

const DIFFICULTY_COLORS = { beginner: "#22c55e", intermediate: "#eab308", advanced: "#ef4444" };

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function BreathingSimulator({ theme: themeProp = {}, startTechnique, compact = false }) {
  const T = useMemo(() => ({ ...DEFAULT_THEME, ...themeProp }), [themeProp]);

  // ── State ──
  const [view, setView] = useState(startTechnique ? "session" : "library"); // library | session | complete
  const [selectedId, setSelectedId] = useState(startTechnique || null);
  const [filter, setFilter] = useState("all");

  // Session state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [roundInPhase, setRoundInPhase] = useState(0);
  const [breathState, setBreathState] = useState("idle"); // idle | inhale | hold | exhale | holdOut | rest
  const [timer, setTimer] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [orbScale, setOrbScale] = useState(0.4);
  const [sessionStats, setSessionStats] = useState({ breaths: 0, phases: 0, startTime: null });

  const intervalRef = useRef(null);
  const technique = useMemo(() => TECHNIQUES.find(t => t.id === selectedId), [selectedId]);

  // ── Clean up interval on unmount ──
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // ══════ BREATHING ENGINE ══════
  const tickEngine = useCallback(() => {
    if (!technique || isPaused) return;

    setTimer(prev => {
      const next = prev + 0.05;
      setTotalElapsed(te => te + 0.05);

      // Determine current phase
      const phases = technique.phases;
      let currentPhaseIdx;
      setPhaseIdx(pi => { currentPhaseIdx = pi; return pi; });

      if (currentPhaseIdx >= phases.length) {
        // Check repeat cycles
        const maxCycles = technique.repeatCycles || 1;
        setCycleCount(cc => {
          if (cc + 1 < maxCycles) {
            setPhaseIdx(0);
            setRoundInPhase(0);
            setBreathState("inhale");
            setTimer(0);
            return cc + 1;
          } else {
            // Complete
            setIsRunning(false);
            setView("complete");
            if (intervalRef.current) clearInterval(intervalRef.current);
            return cc;
          }
        });
        return 0;
      }

      const phase = phases[currentPhaseIdx];
      if (!phase) return 0;

      // If phase has a fixed duration (rest/meditation)
      if (phase.duration) {
        setBreathState("rest");
        setOrbScale(0.5);
        if (next >= phase.duration) {
          advancePhase(currentPhaseIdx, phases);
          return 0;
        }
        setPhaseDuration(phase.duration);
        return next;
      }

      // Normal breath cycle
      const inhaleT = phase.inhale || 0;
      const holdT = phase.hold || 0;
      const exhaleT = phase.exhale || 0;
      const holdOutT = phase.holdOut || 0;
      const cycleTime = inhaleT + holdT + exhaleT + holdOutT;

      if (cycleTime === 0) {
        // Meditation/rest phase without timing
        setBreathState("rest");
        setOrbScale(0.5);
        advancePhase(currentPhaseIdx, phases);
        return 0;
      }

      const posInCycle = next % cycleTime;
      let currentState, progress;

      if (posInCycle < inhaleT) {
        currentState = "inhale";
        progress = posInCycle / inhaleT;
        setOrbScale(0.4 + progress * 0.5);
      } else if (posInCycle < inhaleT + holdT) {
        currentState = "hold";
        progress = (posInCycle - inhaleT) / holdT;
        setOrbScale(0.9);
      } else if (posInCycle < inhaleT + holdT + exhaleT) {
        currentState = "exhale";
        progress = (posInCycle - inhaleT - holdT) / exhaleT;
        setOrbScale(0.9 - progress * 0.5);
      } else {
        currentState = "holdOut";
        progress = (posInCycle - inhaleT - holdT - exhaleT) / holdOutT;
        setOrbScale(0.4);
      }

      setBreathState(currentState);
      setPhaseDuration(cycleTime);

      // Check if completed a full cycle
      const prevCycles = Math.floor(prev / cycleTime);
      const nextCycles = Math.floor(next / cycleTime);
      if (nextCycles > prevCycles) {
        setSessionStats(s => ({ ...s, breaths: s.breaths + 1 }));
        setRoundInPhase(r => {
          const newR = r + 1;
          if (newR >= phase.rounds) {
            advancePhase(currentPhaseIdx, phases);
            return 0;
          }
          return newR;
        });
      }

      return next;
    });
  }, [technique, isPaused]);

  const advancePhase = (currentIdx, phases) => {
    setPhaseIdx(currentIdx + 1);
    setTimer(0);
    setRoundInPhase(0);
    setSessionStats(s => ({ ...s, phases: s.phases + 1 }));
  };

  // ── Start / Pause / Resume / Stop ──
  const startSession = () => {
    setPhaseIdx(0);
    setCycleCount(0);
    setRoundInPhase(0);
    setTimer(0);
    setTotalElapsed(0);
    setBreathState("idle");
    setOrbScale(0.4);
    setSessionStats({ breaths: 0, phases: 0, startTime: Date.now() });
    setIsRunning(true);
    setIsPaused(false);
    setView("session");
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      tickEngine();
    }, 50);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tickEngine, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isPaused, tickEngine]);

  const togglePause = () => setIsPaused(p => !p);

  const stopSession = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setBreathState("idle");
    setOrbScale(0.4);
  };

  const selectTechnique = (id) => {
    setSelectedId(id);
    stopSession();
    setView("session");
  };

  // ── Computed ──
  const currentPhase = technique?.phases?.[phaseIdx] || null;
  const totalPhases = technique?.phases?.length || 0;
  const repeatMax = technique?.repeatCycles || 1;
  const overallProgress = technique ? ((phaseIdx + (cycleCount * totalPhases)) / (totalPhases * repeatMax)) * 100 : 0;

  const breathLabel = breathState === "inhale" ? "INHALE" : breathState === "exhale" ? "EXHALE" : breathState === "hold" ? "HOLD" : breathState === "holdOut" ? "HOLD" : breathState === "rest" ? "REST" : "READY";
  const breathColor = breathState === "inhale" ? T.orbInhale : breathState === "exhale" ? T.orbExhale : breathState === "hold" || breathState === "holdOut" ? T.orbHold : T.orbIdle;

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // ═══ STYLES ═══
  const S = {
    page: { minHeight: compact ? "auto" : "100vh", background: compact ? "transparent" : `linear-gradient(135deg, ${T.bg} 0%, ${T.bgSec} 100%)`, color: T.text, fontFamily: T.font, overflow: "hidden" },
    header: { padding: compact ? "10px 16px" : "16px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: `${T.bg}ee`, backdropFilter: "blur(12px)" },
    title: { fontSize: compact ? 16 : 20, fontWeight: 700, color: T.accent, margin: 0 },
    card: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: compact ? 12 : 16, backdropFilter: "blur(8px)" },
    btn: (active) => ({ padding: compact ? "6px 12px" : "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: compact ? 11 : 13, fontWeight: 600, fontFamily: T.font, background: active ? T.accent : T.bgTer, color: active ? T.bg : T.textSec, transition: "all 0.2s", boxShadow: active ? `0 0 16px ${T.accent}44` : "none" }),
    btnSm: (active) => ({ padding: "5px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: T.font, background: active ? `${T.accent}22` : "transparent", color: active ? T.accent : T.textMuted, transition: "all 0.15s" }),
    badge: (color) => ({ fontSize: 9, padding: "2px 8px", borderRadius: "999px", color, background: `${color}18`, fontWeight: 600, display: "inline-block" }),
    label: { fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" },
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Technique Library
  // ═══════════════════════════════════════════════════
  const renderLibrary = () => {
    const cats = ["all", ...Object.keys(CATEGORIES)];
    const filtered = filter === "all" ? TECHNIQUES : TECHNIQUES.filter(t => t.category === filter);

    return (
      <div style={{ padding: compact ? "12px" : "20px 24px" }}>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={S.btnSm(filter === c)}>
              {c === "all" ? "All" : `${CATEGORIES[c].icon} ${CATEGORIES[c].label}`}
            </button>
          ))}
        </div>

        {/* Technique cards */}
        <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map(t => {
            const cat = CATEGORIES[t.category];
            return (
              <div
                key={t.id}
                onClick={() => selectTechnique(t.id)}
                style={{ ...S.card, cursor: "pointer", transition: "all 0.2s", borderColor: T.border }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: compact ? 20 : 28 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: T.text }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>{t.teacher}</div>
                    </div>
                  </div>
                  <span style={S.badge(DIFFICULTY_COLORS[t.difficulty])}>{t.difficulty}</span>
                </div>
                <p style={{ fontSize: 11, color: T.textSec, lineHeight: 1.6, margin: "0 0 8px" }}>
                  {t.description.slice(0, compact ? 80 : 150)}{t.description.length > (compact ? 80 : 150) ? "..." : ""}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={S.badge(cat.color)}>{cat.icon} {cat.label}</span>
                  <span style={{ fontSize: 10, color: T.textMuted }}>~{t.totalMinutes} min</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Breathing Orb (central animation)
  // ═══════════════════════════════════════════════════
  const renderOrb = () => {
    const size = compact ? 180 : 280;
    const innerSize = size * orbScale;
    const ringCount = 3;

    return (
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Outer rings */}
        {Array.from({ length: ringCount }).map((_, i) => {
          const ringSize = innerSize + (i + 1) * (compact ? 18 : 28);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: ringSize, height: ringSize,
                borderRadius: "50%",
                border: `1px solid ${breathColor}${Math.round(20 - i * 6).toString(16).padStart(2, "0")}`,
                transition: "all 0.3s ease-out",
              }}
            />
          );
        })}

        {/* Main orb */}
        <div style={{
          width: innerSize, height: innerSize, borderRadius: "50%",
          background: `radial-gradient(circle at 40% 35%, ${breathColor}cc, ${breathColor}44 60%, transparent 100%)`,
          boxShadow: `0 0 ${innerSize * 0.3}px ${breathColor}66, inset 0 0 ${innerSize * 0.2}px ${breathColor}44`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease-out",
        }}>
          <div style={{ fontSize: compact ? 14 : 22, fontWeight: 800, color: T.text, letterSpacing: 3, textShadow: `0 0 20px ${breathColor}` }}>
            {breathLabel}
          </div>
          {currentPhase?.mantra && breathState !== "idle" && breathState !== "rest" && (
            <div style={{ fontSize: compact ? 9 : 12, color: `${T.text}aa`, marginTop: 4, fontStyle: "italic", maxWidth: innerSize * 0.8, textAlign: "center", lineHeight: 1.4 }}>
              {breathState === "inhale" && currentPhase.mantra.includes("...") ? currentPhase.mantra.split("...")[0] + "..." : ""}
              {breathState === "exhale" && currentPhase.mantra.includes("...") ? currentPhase.mantra.split("...")[1] || currentPhase.mantra : ""}
              {!currentPhase.mantra.includes("...") ? currentPhase.mantra : ""}
            </div>
          )}
        </div>

        {/* Nostril indicator (for Nadi Shodhana) */}
        {currentPhase?.nostril && breathState !== "idle" && (
          <div style={{ position: "absolute", bottom: -10, fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            {currentPhase.nostril === "left" ? "◀ Left Nostril" : currentPhase.nostril === "right" ? "Right Nostril ▶" : "Both Closed ✕"}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Session View
  // ═══════════════════════════════════════════════════
  const renderSession = () => {
    if (!technique) return null;
    const cat = CATEGORIES[technique.category];

    return (
      <div style={{ padding: compact ? "12px" : "20px 24px", display: "flex", flexDirection: "column", gap: compact ? 12 : 20, minHeight: compact ? "auto" : "calc(100vh - 60px)" }}>
        {/* Technique info bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: compact ? 22 : 32 }}>{technique.icon}</span>
            <div>
              <div style={{ fontSize: compact ? 14 : 18, fontWeight: 700, color: T.text }}>{technique.name}</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>{technique.teacher} · {technique.tradition}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={S.badge(cat.color)}>{cat.label}</span>
            <span style={{ fontSize: 11, color: T.textMuted }}>~{technique.totalMinutes} min</span>
          </div>
        </div>

        {/* Main breathing area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: compact ? 12 : 20 }}>
          {/* Orb */}
          {renderOrb()}

          {/* Phase info */}
          {isRunning && currentPhase && (
            <div style={{ textAlign: "center", marginTop: compact ? 8 : 16 }}>
              <div style={{ fontSize: compact ? 13 : 16, fontWeight: 600, color: T.accent }}>
                {currentPhase.name}
              </div>
              <div style={{ fontSize: compact ? 10 : 12, color: T.textSec, marginTop: 4, maxWidth: 400, lineHeight: 1.6 }}>
                {currentPhase.guide}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, marginTop: 6 }}>
                Round {roundInPhase + 1}/{currentPhase.rounds}
                {repeatMax > 1 && ` · Cycle ${cycleCount + 1}/${repeatMax}`}
                {` · Phase ${phaseIdx + 1}/${totalPhases}`}
              </div>
            </div>
          )}

          {/* Pre-start info */}
          {!isRunning && view === "session" && (
            <div style={{ textAlign: "center", maxWidth: 500 }}>
              <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.8, margin: "0 0 12px" }}>
                {technique.description}
              </p>
              {technique.contraindications && (
                <p style={{ fontSize: 10, color: T.warn, lineHeight: 1.6, margin: "0 0 12px" }}>
                  ⚠️ {technique.contraindications}
                </p>
              )}
              {/* Phase preview */}
              <div style={{ ...S.card, textAlign: "left", marginTop: 12 }}>
                <p style={S.label}>Session Structure</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {technique.phases.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: i < technique.phases.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                      <span style={{ color: T.text }}>{i + 1}. {p.name}</span>
                      <span style={{ color: T.textMuted }}>
                        {p.duration ? `${Math.round(p.duration / 60)}m rest` : `${p.rounds}× (${[p.inhale && `${p.inhale}s in`, p.hold && `${p.hold}s hold`, p.exhale && `${p.exhale}s out`, p.holdOut && `${p.holdOut}s hold`].filter(Boolean).join(" → ")})`}
                      </span>
                    </div>
                  ))}
                </div>
                {repeatMax > 1 && (
                  <div style={{ fontSize: 10, color: T.accent, marginTop: 8 }}>↻ Repeat full sequence × {repeatMax} cycles</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isRunning && (
          <div style={{ width: "100%" }}>
            <div style={{ height: 4, borderRadius: 2, background: `${T.border}`, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(overallProgress, 100)}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${T.accent}, ${T.indigo})`, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: T.textMuted }}>
              <span>Elapsed: {formatTime(totalElapsed)}</span>
              <span>Breaths: {sessionStats.breaths}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {!isRunning ? (
            <>
              <button style={S.btn(false)} onClick={() => { stopSession(); setView("library"); }}>← Library</button>
              <button style={S.btn(true)} onClick={startSession}>
                ▶ Begin Practice
              </button>
            </>
          ) : (
            <>
              <button style={S.btn(false)} onClick={() => { stopSession(); setView("library"); }}>■ Stop</button>
              <button style={S.btn(isPaused)} onClick={togglePause}>
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  // RENDER: Complete View
  // ═══════════════════════════════════════════════════
  const renderComplete = () => {
    const duration = sessionStats.startTime ? Math.round((Date.now() - sessionStats.startTime) / 1000) : 0;

    return (
      <div style={{ padding: compact ? "12px" : "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: compact ? "auto" : "calc(100vh - 60px)", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
        <h2 style={{ fontSize: compact ? 18 : 24, fontWeight: 700, color: T.accent, margin: "0 0 8px" }}>
          Practice Complete
        </h2>
        <p style={{ fontSize: 13, color: T.textSec, margin: "0 0 24px" }}>
          {technique?.name} — {technique?.teacher}
        </p>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ ...S.card, textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.accent }}>{formatTime(duration)}</div>
            <div style={{ fontSize: 10, color: T.textMuted }}>Duration</div>
          </div>
          <div style={{ ...S.card, textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.indigo }}>{sessionStats.breaths}</div>
            <div style={{ fontSize: 10, color: T.textMuted }}>Breaths</div>
          </div>
          <div style={{ ...S.card, textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.cyan }}>{sessionStats.phases}</div>
            <div style={{ fontSize: 10, color: T.textMuted }}>Phases</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={S.btn(false)} onClick={() => { setView("library"); stopSession(); }}>← Library</button>
          <button style={S.btn(true)} onClick={startSession}>↻ Repeat</button>
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: compact ? 18 : 24 }}>🌬️</span>
          <div>
            <h1 style={S.title}>Pranayama Simulator</h1>
            {!compact && <p style={{ fontSize: 10, color: T.textMuted, margin: 0 }}>Sadhguru · Sri Sri · Classical</p>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={S.btnSm(view === "library")} onClick={() => { setView("library"); stopSession(); }}>Library</button>
          {technique && <button style={S.btnSm(view === "session")} onClick={() => setView("session")}>{technique.nameShort}</button>}
        </div>
      </div>

      {/* Content */}
      {view === "library" && renderLibrary()}
      {view === "session" && renderSession()}
      {view === "complete" && renderComplete()}
    </div>
  );
}
