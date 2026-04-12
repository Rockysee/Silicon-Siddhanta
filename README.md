# 🕉️ Silicon Siddhanta — Vedic Intelligence Platform v2.0

**Ancient Vedic wisdom meets modern computation.**

AI-powered Vedic astrology, 4-guru AI chatbot, Pranayama breathing simulator, Vastu analysis — built with Swiss Ephemeris, KP System, Parashari, Nadi Jyotish, and the Brajesh Gautam Method.

**Author:** Hemant Thackeray  
**Version:** 2.0 (April 2026)  
**License:** Private — All Rights Reserved

---

## Live Demo

Deploy the `deploy/` folder to any static host for an instant live site:

1. **Netlify Drop** (30 seconds): Drag `deploy/` to [app.netlify.com/drop](https://app.netlify.com/drop)
2. **GitHub Pages**: Settings → Pages → Source: `main` branch, `/deploy` folder

The unified `deploy/index.html` includes the full landing page with a floating 🧘 Guru AI chatbot orb.

---

## Project Structure

```
Silicon-Siddhanta/
│
├── README.md                          ← You are here
│
├── ── ASTROLOGY ENGINES ──
├── parashari.py                       ← Classical Vedic (Yogas, Dashas, Aspects, Ashtakavarga)
├── kp_system.py                       ← KP System (Sub-Lord Theory, 249 Divisions)
├── nadi_system.py                     ← Nadi Astrology (Bhrigu Nandi, Dhruva Nadi)
├── kcil_system.py                     ← KCIL System (Kalamsa-based analysis)
├── prediction_engine.py               ← Multi-method prediction scoring engine
├── test_engine_validation.py          ← Engine validation test suite
│
├── engine/                            ← Core engine package
│   ├── core/
│   │   ├── types.py                   ← Unified types (Planet, Sign, Nakshatra, etc.)
│   │   └── chart_calculator.py        ← Swiss Ephemeris integration + KP sub-lord table
│   ├── systems/
│   │   ├── parashari.py               ← Parashari system module
│   │   ├── kp_system.py               ← KP system module
│   │   └── nadi.py                    ← Nadi conjunction rules
│   ├── orchestrator.py                ← Unified pipeline: Birth Data → All Systems
│   ├── cli.py                         ← Command-line interface
│   ├── __main__.py                    ← Module entry point
│   ├── setup.py                       ← Package setup
│   └── requirements.txt               ← Python dependencies
│
├── ── UI COMPONENTS (React/JSX) ──
├── silicon_siddhanta_app.jsx          ← Main app orchestrator (1,200+ lines)
├── silicon_siddhanta_ui.jsx           ← Birth chart dashboard (South/North Indian)
├── multi_method_predictions.jsx       ← Four-method comparison with composite scoring
├── auspicious_windows.jsx             ← Muhurta, Hora, Rahu Kaal calculator
├── vastu_crosscheck.jsx               ← Vastu Purusha Mandala analysis (9×9 grid)
├── settings_panel.jsx                 ← User settings and configuration
├── vedic_theme.js                     ← Design system (50+ tokens, planet colors)
│
├── ── AI CHATBOTS ──
├── guru_chatbot.html                  ← 4-Guru AI Chatbot (standalone, 1032 lines)
├── guru_chatbot.jsx                   ← 4-Guru Chatbot (boltable React component)
├── brajesh_gautam_chatbot.jsx         ← BG Jyotish AI chatbot (934 lines)
├── brajesh_gautam_chatbot_preview.jsx ← BG chatbot preview version
│
├── ── BREATHING SIMULATOR ──
├── breathing_simulator.jsx            ← Pranayama simulator (14 techniques, 817 lines)
│
├── ── LANDING & DEPLOY ──
├── index.html                         ← Landing page
├── deploy/                            ← Production-ready deploy package
│   ├── index.html                     ← Unified (landing + floating guru chatbot)
│   ├── guru_chatbot.html              ← Standalone chatbot
│   ├── guru_chatbot.jsx               ← Boltable component
│   ├── netlify.toml                   ← Netlify config
│   ├── vercel.json                    ← Vercel config
│   └── deploy.sh                      ← Multi-platform deploy script
│
├── ── KNOWLEDGE BASE ──
├── research/                          ← 14 deep research documents
│   ├── 01_KP_SYSTEM_DEEP_RESEARCH.md
│   ├── 02_BRAJESH_GAUTAM_DEEP_RESEARCH.md
│   ├── 03_VEDIC_CLASSICS_DEEP_RESEARCH.md
│   ├── 04_NADI_AND_KCIL_DEEP_RESEARCH.md
│   ├── 05_BREAKTHROUGHS_50_YEARS.md
│   ├── 06_HEMANT_CHART_ANALYSIS.md
│   ├── 07–10_BRAJESH_GAUTAM_TEACHINGS (4 docs)
│   ├── 11_SOURCE_VERIFICATION_AUDIT.md
│   ├── 12–13_VASTU_TEACHINGS (2 docs)
│   └── 09_ELITE_ASTROLOGERS_DATABASE.md
│
├── brajesh_gautam_transcripts/        ← YouTube teaching transcripts
│   ├── extracted_teachings/           ← Structured teaching extractions
│   ├── hindi_raw/                     ← Raw Hindi transcripts
│   └── GOVT_ACADEMIC_CROSSREF.md      ← Cross-reference document
│
├── youtube_transcript_pipeline.py     ← YouTube transcript extraction pipeline
├── youtube-transcript-extractor.skill ← Cowork skill for transcript extraction
│
├── ── DOCUMENTATION ──
└── docs/                              ← Project documentation
    ├── ARCHITECTURE_AND_ANALYSIS.md   ← Comprehensive architecture document
    ├── ENGINE_GUIDE.md                ← Engine usage guide
    ├── EXECUTION_GUIDE.md             ← Step-by-step execution guide
    ├── QUICK_START.md                 ← Quick start guide
    ├── CHATBOT_BUILD_GUIDE.md         ← Chatbot build documentation
    ├── DEPLOY_GUIDE.md                ← 6 deployment methods
    ├── MODULE_OVERVIEW.md             ← Module descriptions
    ├── IMPLEMENTATION_SUMMARY.md      ← Implementation details
    ├── PARASHARI_README.md            ← Parashari system docs
    └── (+ 7 more reference documents)
```

---

## Astrology Engines

### Four Jyotish Systems

| System | File | Lines | Key Features |
|--------|------|-------|-------------|
| **Parashari** | `parashari.py` | 1,200+ | Yogas, Dashas, Aspects, Ashtakavarga, Divisional charts |
| **KP System** | `kp_system.py` | 900+ | Sub-Lord Theory, 249 Divisions, Significators, Ruling Planets |
| **Nadi** | `nadi_system.py` | 900+ | Bhrigu Nandi Nadi, Nadi Amsha, Transit overlay |
| **KCIL** | `kcil_system.py` | 700+ | Kalamsa-based cuspal interlinks |

### Prediction Engine

`prediction_engine.py` (1,200+ lines) combines all four systems with weighted composite scoring to generate predictions with confidence levels.

### Installation

```bash
pip install -r engine/requirements.txt
```

**Dependencies:** `pyswisseph>=2.10`, `pytz>=2024.1`, `timezonefinder>=6.0`, `geopy>=2.4`

### Python API

```python
from silicon_siddhanta.orchestrator import SiliconSiddhanta

engine = SiliconSiddhanta()
birth = engine.create_birth_data(
    name="Hemant",
    date_str="27/03/1980",
    time_str="11:45",
    place="Kalyan, India",
    lat=19.2437, lon=73.1355, tz_name="Asia/Kolkata"
)
chart = engine.generate_chart(birth)
print(engine.summary(chart))
```

### CLI

```bash
python -m silicon_siddhanta chart --name "Hemant" --date 27/03/1980 --time 11:45 --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz Asia/Kolkata
python -m silicon_siddhanta dasha --detail
python -m silicon_siddhanta predict
```

---

## 4-Guru AI Chatbot

An AI-intelligent chatbot featuring four spiritual teachers, each with a deep knowledge graph and unique conversational style.

### Gurus

| Guru | Specialty | Style |
|------|-----------|-------|
| **Brajesh Gautam** 🪐 | Vedic Astrology, Cosmic WiFi | Bilingual Hindi-English, tech analogies |
| **Sadhguru** 🔱 | Inner Engineering, Yoga | Provocative questions, paradoxes |
| **Sri Sri Ravi Shankar** 🙏 | Sudarshan Kriya, Meditation | Gentle wisdom, breathing focus |
| **Siddha Sage** 🧘 | Siddha tradition, Vasi Yoga | Ancient mystical, Tamil heritage |

### AI Engine Architecture

The chatbot uses a multi-layer intelligence system (not simple keyword matching):

1. **Intent Detection** — 10 intents (LEARN, PRACTICE, PERSONAL, COMFORT, DEBATE, REMEDY, COMPARE, STORY, GREETING, META) detected via regex pattern matching with priority scoring
2. **Entity Extraction** — 9 entity types (planet, chakra, technique, emotion, lifeArea, concept, food, herb, vastu) extracted from user messages
3. **Knowledge Graph Walker** — Recursive `searchGraph()` traverses each guru's deep nested knowledge graph to find relevant nodes
4. **Conversation State Machine** — Tracks guru, history, entities, mood (neutral/seeking/distressed/curious/challenging), mentioned planets/topics, turn count
5. **Per-Intent Response Builders** — 8 specialized functions compose responses differently per intent (comfort gives breathing exercises, debate challenges back, personal reads Hemant's chart, etc.)

### Files

- `guru_chatbot.html` — Standalone 4-guru chatbot with landing page (1,032 lines)
- `guru_chatbot.jsx` — Boltable React component with props API for ZenFlo/Airjun integration
- `brajesh_gautam_chatbot.jsx` — Earlier single-guru version (Brajesh only, 934 lines)

### Boltable Props API

```jsx
<GuruChatbot
  theme={{ bg: "#0b1120", accent: "#e5a100" }}
  startGuru="sadhguru"
  compact={true}
  position="bottom-right"
/>
```

---

## Breathing Simulator

14 Pranayama and Kriya techniques with real-time animated guidance.

### Techniques

- **Sri Sri Ravi Shankar:** Sudarshan Kriya, Nadi Shodhana, Bhastrika, Bhramari, Ujjayi, So-Hum
- **Sadhguru:** Isha Kriya, Simha Kriya, Shambhavi Prep
- **Classical:** Kapalabhati, Sitali/Sitkari, Box Breathing, 4-7-8 Relaxation

### Features

- Animated breathing orb (inhale/hold/exhale phases)
- 3-state floating widget (mini orb → technique selector → full simulator)
- Boltable React component with theme props

---

## Vastu Analysis

`vastu_crosscheck.jsx` (1,600+ lines) implements the complete Vastu Purusha Mandala:

- 9×9 grid with 45 deity positions (Brahma center, Isha NE, Agni SE, etc.)
- Room-to-zone validation against classical texts
- Directional remedies per Brihat Samhita, Mayamata, Manasara
- South Indian tradition overlay

---

## Design System

`vedic_theme.js` provides 50+ design tokens following the **Vedic Mystic StyleKit**:

- **Colors:** Cosmic navy (#0b1120), saffron gold (#e5a100), indigo (#6366f1), cyan (#0ea5e9)
- **Planet colors:** Sun (gold), Moon (silver), Mars (red), Mercury (green), Jupiter (yellow), Venus (pink), Saturn (dark blue), Rahu (indigo), Ketu (grey)
- **Typography:** Inter font family, 8 weight variants
- **Spacing, shadows, borders:** Consistent across all components

---

## Research Documents

14 deep research documents in `research/` covering:

- KP System theory and implementation
- Brajesh Gautam's complete teachings (Cosmic WiFi, Three Fortune Levels, Planet Behavior)
- Vedic classics (BPHS, Jataka Parijata, Phaladeepika)
- Nadi and KCIL system analysis
- 50 years of astrological breakthroughs
- Hemant's personal chart analysis
- Elite astrologers database
- Vastu teachings and enrichment
- Source verification audit

---

## Deployment

The `deploy/` folder is a self-contained package ready for any static host:

| Method | Time | Command/Action |
|--------|------|---------------|
| **Netlify Drop** | 30 sec | Drag `deploy/` to app.netlify.com/drop |
| **Vercel** | 1 min | `vercel deploy --prod` |
| **GitHub Pages** | 2 min | Settings → Pages → /deploy |
| **Surge** | 1 min | `surge deploy/` |
| **Local Preview** | Instant | `cd deploy && python -m http.server 8080` |

See `docs/DEPLOY_GUIDE.md` for detailed step-by-step instructions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Astro Engine | Python 3.10+, Swiss Ephemeris (pyswisseph) |
| UI Framework | React 18, Recharts, Tailwind-compatible |
| Design System | Vedic Mystic StyleKit (vedic_theme.js) |
| AI Chatbot | Vanilla JS + React (intent detection, entity extraction, knowledge graphs) |
| Breathing | React with CSS animations |
| Deploy | Netlify, Vercel, GitHub Pages, Surge |
| Data | 14 research docs, 30+ YouTube transcripts, 50+ teaching extractions |

---

*Built with dedication by Hemant Thackeray — merging practitioner-level Jyotish knowledge with modern software engineering. Every calculation verified against Swiss Ephemeris. Every teaching traced to its source.*
