# Silicon Siddhanta - KP & KCIL System Modules

Production-quality Python modules for Vedic astrology analysis using Krishnamurti Paddhati and Khullar Cuspal Interlinks.

## File 1: kp_system.py (30 KB, ~900 lines)

### Overview
Enhanced KP (Krishnamurti Paddhati) analysis layer providing significator determination, ruling planets calculation, cuspal analysis, and event prediction.

### Core Classes

#### 1. **KPSignificatorTable**
Builds complete significator analysis for all planets and houses.

**Rules Implemented:**
- Rule 1: Planet signifies houses owned by its star lord
- Rule 2: Planet owns houses it occupies in sign
- Rule 3: Planet signifies its house of occupation

**Key Methods:**
- `calculate_planet_significators(planet)` - Get all signified houses
- `get_significators_for_house(house)` - Get planets signifying a house with strength ranking
- `calculate_all_significators()` - Complete matrix of all significators

#### 2. **RulingPlanets**
Calculates the 5 ruling planets for any given moment.

**The 5 Ruling Planets:**
1. Ascendant Sign Lord
2. Ascendant Star Lord (nakshatra lord)
3. Moon Sign Lord
4. Moon Star Lord (nakshatra lord)
5. Day Lord (Sunday=Sun, Monday=Moon, etc.)

**Applications:** Timing verification, prashna (horary) astrology, event prediction

#### 3. **CuspalAnalysis**
Analyzes all 12 house cusps for event materialization.

**Determines:**
- Sign Lord, Star Lord, Sub Lord of each cusp
- Houses signified by the Sub Lord
- Whether an event will materialize

**KP Principle:** Event manifests if cuspal sub-lord signifies the required houses

#### 4. **KPEventPredictor**
Predicts timing of life events using KP principles.

**Event Categories Implemented:**
- Marriage/Partnership (houses 2, 7, 11)
- Career/Profession (houses 2, 6, 10)
- Health Recovery (houses 1, 5, 11)
- Health Issues (houses 6, 8, 12)
- Birth of Children (houses 2, 5, 11)
- Travel Abroad (houses 3, 9, 12)
- Property Acquisition (houses 4, 11, 12)

**Timing Method:** Event occurs during Dasha/Bhukti of significators that are also Ruling Planets

#### 5. **KPAnalysis**
Main orchestrator for complete KP analysis.

**Integrates:**
- Significator calculation
- Ruling planets determination
- Cuspal analysis
- Event prediction

**Output:** Comprehensive analysis report with house-by-house significators, ruling planets, and event predictions

### Enumerations

- **PlanetEnum**: All 9 planets with Vimshottari dasha years
- **NakshatraEnum**: 27 nakshatras with Vimshottari lords
- **SignEnum**: 12 zodiac signs with sidereal lords

### Data Structures

- **PlanetPosition**: Represents planet location (longitude, sign, nakshatra, KP sub)
- **CuspPosition**: Represents house cusp (longitude, sign, nakshatra, KP sub)
- **Significators**: Result structure for significator analysis

### Test Implementation

Includes `create_test_chart()` using Hemant's chart data:
- Ascendant: Gemini (sidereal)
- Moon: Cancer, Ashlesha nakshatra
- Complete Placidus house system

## File 2: kcil_system.py (25 KB, ~800 lines)

### Overview
Khullar Cuspal Interlinks (KCIL) module extending KP with sub-sub lord theory for Nadiamsha-level precision.

### Core Classes

#### 1. **KPSubTable**
Management of 249-entry KP sub division table.

**Calculation Method:**
- Sub duration = zodiac_span × (planet_dasha_years / 120_years)
- Vimshottari proportions applied to full zodiac
- 249 divisions representing Vimshottari cycle

**Key Methods:**
- `get_sub_for_degree(degree)` - Get sub at specific degree
- `get_sub_by_index(index)` - Look up sub by index

#### 2. **SubSubLordTable**
Generates and manages 2241 sub-sub lord divisions.

**Structure:**
- Each of 249 KP subs divided into 9 sub-subs
- Uses Vimshottari proportions for each sub-sub span
- Nadiamsha-level precision for event timing

**Key Methods:**
- `get_sub_sub_for_degree(degree, sub_index)` - Get sub-sub at degree
- `get_sub_sub_lord(degree, sub_index)` - Get ruling planet
- `get_all_sub_subs_for_sub(sub_index)` - Get all 9 sub-subs for a sub

#### 3. **KCILCuspalAnalysis**
KCIL cuspal interlink analysis with favorability rules.

**Favorability Classification:**
- Favorable (1, 3, 5, 9, 11) - Event will happen
- Neutral (2, 6, 10) - Event may happen
- Unfavorable (4, 7, 8, 12) - Event blocked

**Key Methods:**
- `get_cusp_sub_sub_lord(house)` - Get ultimate agent
- `get_houses_signified_by_sub_sub_lord(house)` - Get significations
- `get_cusp_favorability(cusp_house, required_houses)` - Assess event probability (0-1 score)

#### 4. **KalamsnaDivision**
Time division calculation at Kalamsa level.

**Applications:**
- Precise event timing (down to hours/minutes)
- Muhurta (auspicious timing) calculations
- Planetary activation timing

**Key Methods:**
- `get_kalamsa_for_degree(degree)` - Get Kalamsa ruler and index
- `get_kalamsa_duration_minutes(sub_index, sub_sub_index)` - Duration in minutes
- `assess_kalamsa_quality(ruler)` - Auspiciousness assessment

#### 5. **KCILAnalysis**
Main KCIL orchestrator.

**Integrates:**
- Sub-sub lord determination
- Cuspal interlink analysis
- Favorability assessment
- Kalamsa calculations

**Output:** Comprehensive KCIL report with all cusps analyzed at Nadiamsha precision

### Supporting Classes

- **SubDivisionInfo**: Represents a KP sub or sub-sub with all details
- **SubSubPosition**: Position within sub-sub lord (Nadiamsha)
- **VimshottariDashaYears**: Dasha duration enum for all planets

### Test Implementation

Tests against KP test chart data with:
- Marriage event assessment (7th cusp, houses 2,7,11)
- Kalamsa analysis at 4 test degrees
- Full report generation

## Key Features

### Type Safety
- Full type hints throughout both modules
- Enum-based planets, signs, nakshatras
- Dataclass structures for clarity

### Vedic Accuracy
- Vimshottari dasha cycle (120-year cycle)
- Sidereal zodiac signs
- 27 nakshatras with proper lords
- KP sub table (249 divisions)
- Sub-sub lords (Nadiamsha precision)

### Production Quality
- Comprehensive docstrings (module, class, method level)
- Clean error handling
- Logical organization
- Extensible architecture
- Test sections with real data

### Integration Ready
- Compatible with Swiss Ephemeris (via position data)
- Works with any ephemeris providing planet positions
- Modular design for easy extension

## Usage Example

```python
from kp_system import KPAnalysis, create_test_chart

# Create analysis with planetary and house data
analysis = create_test_chart()

# Get significators for a house
sigs = analysis.get_significators_for_house(7)  # Marriage house

# Get ruling planets
ruling = analysis.get_all_ruling_planets()

# Predict events
predictions = analysis.predict_events(['marriage', 'career'])

# Generate report
print(analysis.generate_report())
```

## Architecture

```
Silicon Siddhanta
├── kp_system.py
│   ├── Enums (Planet, Sign, Nakshatra)
│   ├── Data Structures (Position, Cusp)
│   ├── KPSignificatorTable (house significations)
│   ├── RulingPlanets (5 ruling planets)
│   ├── CuspalAnalysis (cusp materialization)
│   ├── KPEventPredictor (life event timing)
│   └── KPAnalysis (main orchestrator)
│
└── kcil_system.py
    ├── KPSubTable (249-sub management)
    ├── SubSubLordTable (2241 divisions)
    ├── KCILCuspalAnalysis (interlinks)
    ├── KalamsnaDivision (time divisions)
    └── KCILAnalysis (main orchestrator)
```

## Testing

Both modules include built-in test sections:

```bash
python3 kp_system.py      # KP analysis with test chart
python3 kcil_system.py    # KCIL analysis with test chart
```

All tests use Hemant's chart data for consistency and can be easily adapted for other charts.

## Standards Compliance

- PEP 8 code style
- Type hints for all parameters and returns
- Comprehensive docstring coverage
- No external dependencies except standard library
- Python 3.7+ compatible

---

**Created:** 2026-04-11  
**Format:** Production-grade Vedic astrology engine  
**Language:** Python 3  
**Size:** ~55 KB combined, ~1800 lines
