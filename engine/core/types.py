"""
core/types.py — Silicon Siddhanta
Unified type definitions shared across all astrological systems.

All modules (Parashari, KP, KCIL, Nadi) import from here
so planetary data flows seamlessly between systems.
"""

from dataclasses import dataclass, field
from enum import Enum, IntEnum
from typing import Dict, List, Optional, Tuple
from datetime import datetime


# ═══════════════════════════════════════════════════════════════════════════
# ENUMERATIONS
# ═══════════════════════════════════════════════════════════════════════════

class Planet(Enum):
    """Nine Vedic planets (Navagraha)."""
    SUN = "Sun"
    MOON = "Moon"
    MARS = "Mars"
    MERCURY = "Mercury"
    JUPITER = "Jupiter"
    VENUS = "Venus"
    SATURN = "Saturn"
    RAHU = "Rahu"
    KETU = "Ketu"

    @property
    def sanskrit(self) -> str:
        return {
            "Sun": "Surya", "Moon": "Chandra", "Mars": "Mangal",
            "Mercury": "Budha", "Jupiter": "Guru", "Venus": "Shukra",
            "Saturn": "Shani", "Rahu": "Rahu", "Ketu": "Ketu"
        }[self.value]


class Sign(IntEnum):
    """Twelve zodiac signs (Rashis), 0-indexed."""
    ARIES = 0
    TAURUS = 1
    GEMINI = 2
    CANCER = 3
    LEO = 4
    VIRGO = 5
    LIBRA = 6
    SCORPIO = 7
    SAGITTARIUS = 8
    CAPRICORN = 9
    AQUARIUS = 10
    PISCES = 11

    @property
    def sanskrit(self) -> str:
        names = [
            "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
            "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
        ]
        return names[self.value]

    @property
    def lord(self) -> "Planet":
        lords = [
            Planet.MARS, Planet.VENUS, Planet.MERCURY, Planet.MOON,
            Planet.SUN, Planet.MERCURY, Planet.VENUS, Planet.MARS,
            Planet.JUPITER, Planet.SATURN, Planet.SATURN, Planet.JUPITER
        ]
        return lords[self.value]

    @property
    def element(self) -> str:
        elements = ["Fire", "Earth", "Air", "Water"] * 3
        return elements[self.value]

    @property
    def quality(self) -> str:
        qualities = ["Chara", "Sthira", "Dwiswabhava"] * 4
        return qualities[self.value]


class Nakshatra(IntEnum):
    """27 Nakshatras (lunar mansions), 0-indexed."""
    ASHWINI = 0
    BHARANI = 1
    KRITTIKA = 2
    ROHINI = 3
    MRIGASHIRA = 4
    ARDRA = 5
    PUNARVASU = 6
    PUSHYA = 7
    ASHLESHA = 8
    MAGHA = 9
    PURVA_PHALGUNI = 10
    UTTARA_PHALGUNI = 11
    HASTA = 12
    CHITRA = 13
    SWATI = 14
    VISHAKHA = 15
    ANURADHA = 16
    JYESHTHA = 17
    MULA = 18
    PURVA_ASHADHA = 19
    UTTARA_ASHADHA = 20
    SHRAVANA = 21
    DHANISHTHA = 22
    SHATABHISHA = 23
    PURVA_BHADRAPADA = 24
    UTTARA_BHADRAPADA = 25
    REVATI = 26

    @property
    def lord(self) -> Planet:
        """Vimshottari dasha lord of this nakshatra."""
        sequence = [
            Planet.KETU, Planet.VENUS, Planet.SUN, Planet.MOON,
            Planet.MARS, Planet.RAHU, Planet.JUPITER, Planet.SATURN, Planet.MERCURY
        ]
        return sequence[self.value % 9]

    @property
    def pada_count(self) -> int:
        return 4

    @property
    def span_degrees(self) -> float:
        return 13.0 + 20.0 / 60.0  # 13°20'


class House(IntEnum):
    """Twelve bhavas (houses), 1-indexed."""
    H1 = 1    # Lagna / Ascendant
    H2 = 2    # Dhana (Wealth)
    H3 = 3    # Sahaja (Siblings)
    H4 = 4    # Sukha (Happiness/Mother)
    H5 = 5    # Putra (Children)
    H6 = 6    # Ripu (Enemies/Disease)
    H7 = 7    # Kalatra (Spouse)
    H8 = 8    # Ayu (Longevity)
    H9 = 9    # Bhagya (Fortune)
    H10 = 10  # Karma (Career)
    H11 = 11  # Labha (Gains)
    H12 = 12  # Vyaya (Loss/Moksha)

    @property
    def name_sanskrit(self) -> str:
        names = {
            1: "Tanu", 2: "Dhana", 3: "Sahaja", 4: "Sukha",
            5: "Putra", 6: "Ripu", 7: "Kalatra", 8: "Ayu",
            9: "Bhagya", 10: "Karma", 11: "Labha", 12: "Vyaya"
        }
        return names[self.value]


class Ayanamsha(Enum):
    """Ayanamsha models for tropical-to-sidereal conversion."""
    LAHIRI = "Lahiri"           # Indian govt standard (Chitrapaksha)
    KP = "KP"                   # KP system (KP Old / Krishnamurti)
    RAMAN = "Raman"             # B.V. Raman's ayanamsha
    TRUE_CHITRAPAKSHA = "True Chitrapaksha"


# ═══════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class GeoLocation:
    """Geographic coordinates for birth place."""
    name: str
    latitude: float   # Positive = North
    longitude: float  # Positive = East
    timezone: str      # IANA timezone string

    def __str__(self):
        ns = "N" if self.latitude >= 0 else "S"
        ew = "E" if self.longitude >= 0 else "W"
        return f"{self.name} ({abs(self.latitude):.4f}°{ns}, {abs(self.longitude):.4f}°{ew})"


@dataclass
class BirthData:
    """Complete birth data for chart calculation."""
    name: str
    datetime_utc: datetime       # Birth time in UTC
    datetime_local: datetime     # Birth time in local timezone
    location: GeoLocation
    ayanamsha: Ayanamsha = Ayanamsha.LAHIRI

    def __str__(self):
        return (f"{self.name} | {self.datetime_local.strftime('%d/%m/%Y %I:%M %p')} | "
                f"{self.location.name}")


@dataclass
class PlanetPosition:
    """Complete position data for a single planet."""
    planet: Planet
    longitude: float           # Sidereal longitude (0-360)
    latitude: float            # Celestial latitude
    speed: float               # Daily motion in degrees
    sign: Sign                 # Zodiac sign
    sign_degree: float         # Degree within sign (0-30)
    nakshatra: Nakshatra       # Lunar mansion
    nakshatra_pada: int        # Pada within nakshatra (1-4)
    nakshatra_lord: Planet     # Lord of nakshatra (dasha lord)
    house: Optional[int] = None  # House placement (1-12)
    is_retrograde: bool = False
    is_combust: bool = False
    is_exalted: bool = False
    is_debilitated: bool = False
    is_own_sign: bool = False
    is_mool_trikona: bool = False
    # KP sub-lord chain
    sub_lord: Optional[Planet] = None
    sub_sub_lord: Optional[Planet] = None

    @property
    def degree_display(self) -> str:
        """Human-readable degree (e.g., '15°23\'42\" Aries')."""
        d = int(self.sign_degree)
        m = int((self.sign_degree - d) * 60)
        s = int(((self.sign_degree - d) * 60 - m) * 60)
        retro = " (R)" if self.is_retrograde else ""
        return f"{d}°{m:02d}'{s:02d}\" {self.sign.name.title()}{retro}"


@dataclass
class HouseCusp:
    """House cusp data."""
    house: House
    longitude: float           # Sidereal longitude of cusp
    sign: Sign                 # Sign on cusp
    sign_degree: float         # Degree within sign
    lord: Planet               # Lord of cusp sign
    # KP fields
    nakshatra: Optional[Nakshatra] = None
    nakshatra_lord: Optional[Planet] = None
    sub_lord: Optional[Planet] = None
    sub_sub_lord: Optional[Planet] = None


@dataclass
class DashaPeriod:
    """A Vimshottari Dasha period (Maha/Antar/Pratyantar)."""
    lord: Planet
    start: datetime
    end: datetime
    level: str = "Maha"       # "Maha", "Antar", "Pratyantar"
    sub_periods: List["DashaPeriod"] = field(default_factory=list)

    @property
    def duration_years(self) -> float:
        return (self.end - self.start).days / 365.25


@dataclass
class YogaResult:
    """A detected yoga in the chart."""
    name: str
    sanskrit_name: str
    category: str              # "Dhana", "Raja", "Arishta", "Chandra", etc.
    planets_involved: List[Planet]
    houses_involved: List[int]
    strength: float            # 0.0 to 1.0
    description: str
    is_beneficial: bool


@dataclass
class AspectResult:
    """A planetary aspect."""
    aspecting_planet: Planet
    aspected_planet: Optional[Planet]
    aspected_house: int
    aspect_type: str           # "Full", "3/4", "1/2", "1/4"
    strength: float            # 0.0 to 1.0
    is_beneficial: bool


@dataclass
class PredictionResult:
    """A prediction from any system."""
    system: str                # "Parashari", "KP", "KCIL", "Nadi"
    category: str              # "Career", "Marriage", "Health", etc.
    prediction: str
    confidence: float          # 0.0 to 1.0
    supporting_factors: List[str]
    timing: Optional[str] = None
    remedies: List[str] = field(default_factory=list)


@dataclass
class BirthChart:
    """Complete birth chart with all computed data."""
    birth_data: BirthData
    ayanamsha_value: float     # Ayanamsha in degrees at birth
    julian_day: float          # Julian day number
    sidereal_time: float       # Local sidereal time

    # Core chart data
    planets: Dict[Planet, PlanetPosition] = field(default_factory=dict)
    houses: Dict[House, HouseCusp] = field(default_factory=dict)
    ascendant_degree: float = 0.0
    ascendant_sign: Sign = Sign.ARIES
    moon_sign: Sign = Sign.ARIES
    sun_sign: Sign = Sign.ARIES

    # Derived data (populated by analysis modules)
    dashas: List[DashaPeriod] = field(default_factory=list)
    yogas: List[YogaResult] = field(default_factory=list)
    aspects: List[AspectResult] = field(default_factory=list)
    predictions: List[PredictionResult] = field(default_factory=list)

    # Ashtakavarga
    planet_ashtakavarga: Dict[Planet, List[int]] = field(default_factory=dict)
    sarvashtakavarga: List[int] = field(default_factory=list)

    # KP specific
    kp_significators: Dict[int, List[Planet]] = field(default_factory=dict)
    ruling_planets: List[Planet] = field(default_factory=list)

    @property
    def lagna_lord(self) -> Planet:
        return self.ascendant_sign.lord

    def get_house_lord(self, house_num: int) -> Planet:
        h = House(house_num)
        if h in self.houses:
            return self.houses[h].lord
        return self.ascendant_sign.lord  # fallback

    def planets_in_house(self, house_num: int) -> List[Planet]:
        return [p for p, pos in self.planets.items() if pos.house == house_num]

    def get_planet(self, planet: Planet) -> PlanetPosition:
        return self.planets[planet]
