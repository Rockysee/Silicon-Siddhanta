# Silicon Siddhanta - Vedic Astrology Engine

A comprehensive Vedic astrology computation engine powered by Swiss Ephemeris, integrating four major Jyotish systems:

- **Parashari** (Classical Vedic) - Yogas, Dashas, Aspects, Ashtakavarga
- **KP System** (Krishnamurti Paddhati) - Sub-Lord Theory, 249 Divisions, Significators
- **Nadi Astrology** - Bhrigu Nandi Nadi, Nadi Amsha, Dhruva Nadi
- **Brajesh Gautam Method** - Three Fortune Levels (Chart Promise + Dasha Activation + Transit Trigger)

## Features

- Swiss Ephemeris-based astronomical calculations (arc-second precision)
- Lahiri Ayanamsha with sidereal zodiac
- Placidus house system with KP sub-lord computation
- Vimshottari Dasha (Maha/Antar/Pratyantar - 3 levels)
- 10+ classical yoga detection (Gajakesari, Budhaditya, Pancha Mahapurusha, etc.)
- Full Ashtakavarga computation (planet-wise + Sarvashtakavarga)
- Multi-method prediction scoring with composite weighted assessment
- React-based UI dashboards for chart visualization
- Auspicious/inauspicious time window calculator (Muhurta, Hora, Rahu Kaal)

## Architecture

```
silicon_siddhanta/
  core/
    types.py           # Unified type definitions (Planet, Sign, Nakshatra, etc.)
    chart_calculator.py # Swiss Ephemeris integration + KP sub-lord table
  systems/
    parashari.py       # Classical Vedic analysis
    kp_system.py       # KP significator & prediction framework
    nadi.py            # Nadi conjunction rules & transit analysis
  orchestrator.py      # Unified pipeline: Birth Data -> All Systems
  cli.py               # Command-line interface
  __main__.py           # Module entry point
```

## Installation

```bash
pip install -r engine/requirements.txt
```

### Dependencies
- `pyswisseph>=2.10` - Swiss Ephemeris Python bindings
- `pytz>=2024.1` - Timezone handling
- `timezonefinder>=6.0` - Coordinate-to-timezone lookup
- `geopy>=2.4` - Geocoding

## Quick Start

### Python API
```python
from silicon_siddhanta.orchestrator import SiliconSiddhanta

engine = SiliconSiddhanta()
birth = engine.create_birth_data(
    name="Example",
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
python -m silicon_siddhanta chart --name "Example" --date 27/03/1980 --time 11:45 --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz Asia/Kolkata
python -m silicon_siddhanta dasha --name "Example" --date 27/03/1980 --time 11:45 --lat 19.2437 --lon 73.1355 --tz Asia/Kolkata --detail
python -m silicon_siddhanta predict --name "Example" --date 27/03/1980 --time 11:45 --lat 19.2437 --lon 73.1355 --tz Asia/Kolkata
```

## UI Dashboards (React/JSX)

Three interactive dashboards built with Recharts:

1. **silicon_siddhanta_ui.jsx** - Full birth chart (South/North Indian), planetary table, dasha timeline, KP system, predictions, Ashtakavarga
2. **auspicious_windows.jsx** - Daily/weekly/monthly auspicious & inauspicious time windows
3. **multi_method_predictions.jsx** - Four-method comparison with Silicon Siddhanta composite score

## Research Documents

The `research/` folder contains detailed reference material on each Jyotish system, YouTube transcript analyses, and an elite astrologer database.

## License

Private - All Rights Reserved
