# Silicon Siddhanta — Engine Execution Guide

## Architecture Overview

```
silicon_siddhanta/
├── __init__.py              # Package root (v1.0.0)
├── __main__.py              # Module entry point
├── cli.py                   # Command-line interface (226 lines)
├── orchestrator.py          # Multi-system orchestrator (410 lines)
├── setup.py                 # pip-installable package
├── requirements.txt         # Dependencies
├── core/
│   ├── types.py             # Shared data models (338 lines)
│   └── chart_calculator.py  # Swiss Ephemeris computations (439 lines)
├── systems/
│   ├── parashari.py         # Classical Vedic: Dasha, Yogas, Aspects, Ashtakavarga (774 lines)
│   ├── kp_system.py         # KP: Significators, Ruling Planets, Event Timing (426 lines)
│   └── nadi.py              # Nadi: Bhrigu Nandi, Nadi Amsha, Transits (490 lines)
└── output/
    └── __init__.py           # (future: HTML/PDF report generators)
```

**Total: 3,103 lines of production Python code**

## Computation Pipeline

```
Birth Data (date, time, place)
    │
    ▼
Swiss Ephemeris (pyswisseph)
    │  Tropical planetary longitudes
    │  Placidus house cusps
    ▼
Ayanamsha Correction (Lahiri/KP/Raman)
    │  Sidereal longitudes
    │  Nakshatra, Pada, KP Sub-Lords
    ▼
┌─────────────┬──────────────┬────────────┐
│  PARASHARI  │     KP       │    NADI    │
│ ─────────── │ ──────────── │ ────────── │
│ Vimshottari │ Significator │ Bhrigu     │
│ Dasha       │ Table (4     │ Nandi      │
│ (3 levels)  │ levels)      │ Conjunct.  │
│             │              │ Rules (30+)│
│ Yoga Det.   │ Ruling       │            │
│ (11 types)  │ Planets      │ Nadi Amsha │
│             │              │ (4050 div) │
│ Vedic       │ Event        │            │
│ Aspects     │ Prediction   │ Sade Sati  │
│ (special)   │ (7 events)   │ Detection  │
│             │              │            │
│ Ashtaka-    │ Cuspal       │ Transit    │
│ varga       │ Analysis     │ Analysis   │
└─────────────┴──────────────┴────────────┘
    │               │              │
    ▼               ▼              ▼
         Unified BirthChart Object
         (predictions, dashas, yogas, aspects)
```

## Step-by-Step Installation

### Step 1: Install Python 3.8+
```bash
# macOS
brew install python3

# Windows
# Download from python.org

# Linux
sudo apt install python3 python3-pip
```

### Step 2: Install Dependencies
```bash
cd engine/
pip install -r requirements.txt
```

### Step 3: Verify Installation
```bash
python3 -c "import swisseph; print('Swiss Ephemeris OK')"
python3 -c "from timezonefinder import TimezoneFinder; print('TimezoneFinder OK')"
```

## Step-by-Step Usage

### Method 1: Command-Line Interface

#### Generate Birth Chart Summary
```bash
python3 -m silicon_siddhanta chart \
  --name "Hemant Thackeray" \
  --date 27/03/1980 \
  --time 11:45 \
  --place "Kalyan, Maharashtra" \
  --lat 19.2437 --lon 73.1355 \
  --tz "Asia/Kolkata"
```

#### Generate Full Report (all predictions)
```bash
python3 -m silicon_siddhanta chart \
  --name "Hemant Thackeray" \
  --date 27/03/1980 \
  --time 11:45 \
  --place "Kalyan, Maharashtra" \
  --lat 19.2437 --lon 73.1355 \
  --tz "Asia/Kolkata" \
  --report full
```

#### Show Vimshottari Dasha Periods
```bash
python3 -m silicon_siddhanta dasha \
  --name "Hemant Thackeray" \
  --date 27/03/1980 \
  --time 11:45 \
  --place "Kalyan, Maharashtra" \
  --lat 19.2437 --lon 73.1355 \
  --tz "Asia/Kolkata"
```

#### Show All Dashas (detailed)
```bash
python3 -m silicon_siddhanta dasha \
  --name "Hemant Thackeray" \
  --date 27/03/1980 \
  --time 11:45 \
  --place "Kalyan, Maharashtra" \
  --lat 19.2437 --lon 73.1355 \
  --tz "Asia/Kolkata" \
  --detail
```

#### Filter Predictions by Category
```bash
python3 -m silicon_siddhanta predict \
  --name "Hemant Thackeray" \
  --date 27/03/1980 \
  --time 11:45 \
  --place "Kalyan, Maharashtra" \
  --lat 19.2437 --lon 73.1355 \
  --tz "Asia/Kolkata" \
  --category Career
```

Available categories: Career, Marriage, Property, Children, Foreign Travel, Financial Gain, Health Issues

#### Use KP Ayanamsha
```bash
python3 -m silicon_siddhanta --ayanamsha kp chart \
  --name "Test" --date 01/01/2000 --time 12:00 \
  --place "Delhi" --lat 28.6139 --lon 77.2090 --tz "Asia/Kolkata"
```

### Method 2: Python API

```python
from silicon_siddhanta.orchestrator import SiliconSiddhanta
from silicon_siddhanta.core.types import Ayanamsha, Planet

# Initialize engine
engine = SiliconSiddhanta(Ayanamsha.LAHIRI)

# Generate chart
chart = engine.generate_chart(
    name="Hemant Thackeray",
    year=1980, month=3, day=27,
    hour=11, minute=45,
    place_name="Kalyan, Maharashtra",
    latitude=19.2437, longitude=73.1355,
    timezone_str="Asia/Kolkata"
)

# Print summary
print(engine.summary(chart))

# Get current dasha
print(f"Current Dasha: {engine.get_current_dasha(chart)}")

# Access planetary positions
for planet in Planet:
    pos = chart.planets[planet]
    print(f"{planet.value}: {pos.degree_display} (H{pos.house})")

# Access dashas
for dasha in chart.dashas:
    print(f"{dasha.lord.value}: {dasha.start} to {dasha.end}")

# Access yogas
for yoga in chart.yogas:
    print(f"{yoga.name}: {yoga.description}")

# Filter predictions
career_preds = engine.get_predictions(chart, category="Career")
for p in career_preds:
    print(f"[{p.system}] {p.prediction} ({p.confidence*100:.0f}%)")

# Access KP significators
for house_num, significators in chart.kp_significators.items():
    planets_str = ", ".join(p.value for p in significators)
    print(f"House {house_num}: {planets_str}")

# Access Ashtakavarga
for planet, scores in chart.planet_ashtakavarga.items():
    print(f"{planet.value}: {scores} (Total: {sum(scores)})")
```

## Validated Output (Hemant's Chart)

```
Ascendant:  Gemini (6.81°)
Moon Sign:  Cancer (Ashlesha Nakshatra, Pada 3)
Sun Sign:   Pisces (Uttara Bhadrapada)
Lagna Lord: Mercury (in 9th house)

Current Dasha: Moon-Ketu-Rahu
Gajakesari Yoga: PRESENT (Jupiter in kendra from Moon)

Mars + Jupiter + Rahu conjunct in Leo (3rd house)
Saturn retrograde in Leo (4th house)
Mercury + Ketu in Aquarius (9th house)
Sun in Pisces (10th house)
Venus in Aries (11th house)
```

## Key Technical Details

| Component | Technology |
|-----------|-----------|
| Astronomical Engine | Swiss Ephemeris (pyswisseph) |
| Ayanamsha | Lahiri (default), KP, Raman, True Chitrapaksha |
| House System | Placidus (default) |
| KP Sub-Lords | Full 249 subdivisions + 2241 sub-sub divisions |
| Dasha Levels | Maha → Antar → Pratyantar (3 levels) |
| Yoga Detection | 11 classical yogas |
| Nadi Rules | 30+ Bhrigu Nandi conjunction rules |
| Aspect Calculation | Standard + Mars/Jupiter/Saturn/Rahu-Ketu special aspects |

## What Each System Contributes

### Parashari (Classical Vedic)
- **Vimshottari Dasha**: Life period timing (120-year cycle, 3 levels deep)
- **Yoga Detection**: Gajakesari, Budhaditya, Pancha Mahapurusha, Dhana, Viparita Raja, etc.
- **Vedic Aspects**: 7th aspect (all planets) + special aspects (Mars 4/8, Jupiter 5/9, Saturn 3/10)
- **Ashtakavarga**: Benefic point scores across 12 signs for 7 planets

### KP (Krishnamurti Paddhati)
- **4-Level Significator Table**: Determines which planets activate which houses
- **Ruling Planets**: 6 planetary influences at any given moment
- **Event Prediction**: Marriage, Career, Property, Children, Foreign Travel, Finance, Health
- **Cuspal Analysis**: Sub-lord chain analysis for house promise fulfillment

### Nadi
- **Bhrigu Nandi Rules**: 30+ conjunction interpretations with confidence scores
- **Nadi Amsha**: 4050-division precision positions with Vata/Pitta/Kapha typing
- **Sade Sati Detection**: Saturn's 7.5-year transit pattern
- **Jupiter Transit**: Favorable/unfavorable periods with remedies
