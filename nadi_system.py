"""
nadi_system.py — Silicon Siddhanta
Nadi Astrology Module

Implements Nadi Amsha calculation, Bhrigu Nandi Nadi principles,
Dhruva Nadi analysis, and Chandra Hari Moon-based Nadi interpretation.

This module provides precise Nadi divisions for sidereal longitudes
and planetary interpretation using traditional Vedic Nadi principles.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Tuple, Optional, Any
from abc import ABC, abstractmethod
import math


class SignType(Enum):
    """Zodiac sign classification based on quality."""
    CHARA = "Chara"      # Moveable: Aries, Cancer, Libra, Capricorn
    STHIRA = "Sthira"    # Fixed: Taurus, Leo, Scorpio, Aquarius
    DVISVABHAVA = "Dvisvabhava"  # Dual: Gemini, Virgo, Sagittarius, Pisces


class Zodiac(Enum):
    """Zodiac signs with their sign numbers (0-11) and types."""
    ARIES = (0, SignType.CHARA, "Aries", "Mesh")
    TAURUS = (1, SignType.STHIRA, "Taurus", "Vrishabha")
    GEMINI = (2, SignType.DVISVABHAVA, "Gemini", "Mithuna")
    CANCER = (3, SignType.CHARA, "Cancer", "Karka")
    LEO = (4, SignType.STHIRA, "Leo", "Simha")
    VIRGO = (5, SignType.DVISVABHAVA, "Virgo", "Kanya")
    LIBRA = (6, SignType.CHARA, "Libra", "Tula")
    SCORPIO = (7, SignType.STHIRA, "Scorpio", "Vrishchika")
    SAGITTARIUS = (8, SignType.DVISVABHAVA, "Sagittarius", "Dhanu")
    CAPRICORN = (9, SignType.CHARA, "Capricorn", "Makara")
    AQUARIUS = (10, SignType.STHIRA, "Aquarius", "Kumbha")
    PISCES = (11, SignType.DVISVABHAVA, "Pisces", "Meena")

    def __init__(self, number: int, sign_type: SignType, english: str, sanskrit: str):
        self.number = number
        self.sign_type = sign_type
        self.english = english
        self.sanskrit = sanskrit


class Planet(Enum):
    """Planetary indicators used in Nadi analysis."""
    SUN = "Sun"
    MOON = "Moon"
    MARS = "Mars"
    MERCURY = "Mercury"
    JUPITER = "Jupiter"
    VENUS = "Venus"
    SATURN = "Saturn"
    RAHU = "Rahu"
    KETU = "Ketu"


@dataclass
class NadiInfo:
    """Container for Nadi analysis results."""
    nadi_number: int
    nadi_name: str
    sign: Zodiac
    degree_start: float
    degree_end: float
    arcminute_position: float
    sign_type: SignType
    chara_characteristics: Optional[str] = None
    sthira_characteristics: Optional[str] = None
    dvisvabhava_characteristics: Optional[str] = None


@dataclass
class BhriguInterpretation:
    """Container for Bhrigu Nandi Nadi interpretation."""
    planet: Planet
    sign: Zodiac
    dharma_theme: str
    house_indication: str
    sign_before_meaning: str
    sign_after_meaning: str
    special_rules: List[str]


@dataclass
class DhruvaNadiEntry:
    """Single Dhruva Nadi section entry."""
    section_number: int
    nadi_range: Tuple[float, float]  # Start and end degrees
    ascendant_sign: Zodiac
    key_indications: List[str]
    longevity_indicator: str
    marriage_timing: str
    career_timing: str
    health_notes: str


class NadiAmsha:
    """
    Calculates the precise Nadi division for any sidereal longitude.

    The Nadi system divides the zodiac into 1800 sections (150 per sign).
    Each Nadi represents 12 arcminutes (0.2 degrees) of the zodiac.

    Different sign types have distinct Nadi nomenclature:
    - Chara (Moveable): Aries, Cancer, Libra, Capricorn
    - Sthira (Fixed): Taurus, Leo, Scorpio, Aquarius
    - Dvisvabhava (Dual): Gemini, Virgo, Sagittarius, Pisces
    """

    NADI_PER_SIGN = 150
    TOTAL_NADIS = 1800
    DEGREES_PER_SIGN = 30
    MINUTES_PER_NADI = 12
    DEGREES_PER_NADI = 0.2

    # Nadi nomenclature by sign type
    CHARA_NADI_NAMES = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
        "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
        "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
        "Vishakha", "Anuradha", "Jyeshtha", "Mool", "Purva Ashadha",
        "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani", "Krittika",
        "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya",
        "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
        "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mool", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini",
        # Continuing pattern for remaining Nadis...
        "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mool", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada",
        "Revati", "Ashwini", "Bharani", "Krittika", "Rohini",
        "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
        "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mool",
        "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani",
    ]

    STHIRA_NADI_NAMES = [
        "Mool", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini",
        "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mool", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada",
        "Revati", "Ashwini", "Bharani", "Krittika", "Rohini",
        "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
        "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mool",
        "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani",
        "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu",
        "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
        "Jyeshtha", "Mool", "Purva Ashadha", "Uttara Ashadha", "Shravana",
        "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
    ]

    DVISVABHAVA_NADI_NAMES = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
        "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
        "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
        "Vishakha", "Anuradha", "Jyeshtha", "Mool", "Purva Ashadha",
        "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani", "Krittika",
        "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya",
        "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
        "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mool", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini",
        "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mool", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada",
        "Revati", "Ashwini", "Bharani", "Krittika", "Rohini",
        "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
        "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
        "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mool",
    ]

    def __init__(self):
        """Initialize the Nadi Amsha calculator."""
        pass

    def get_nadi_for_longitude(self, longitude: float) -> NadiInfo:
        """
        Calculate the Nadi division for a given sidereal longitude.

        Args:
            longitude: Sidereal longitude in degrees (0-360)

        Returns:
            NadiInfo object containing Nadi details

        Raises:
            ValueError: If longitude is not in valid range
        """
        if not 0 <= longitude < 360:
            raise ValueError(f"Longitude must be between 0 and 360, got {longitude}")

        # Determine sign and degrees within sign
        sign_number = int(longitude // self.DEGREES_PER_SIGN)
        degrees_in_sign = longitude % self.DEGREES_PER_SIGN

        sign = Zodiac(sign_number)

        # Calculate Nadi number within the sign (0-149)
        nadi_in_sign = int(degrees_in_sign / self.DEGREES_PER_NADI)
        nadi_in_sign = min(nadi_in_sign, self.NADI_PER_SIGN - 1)

        # Get Nadi name based on sign type
        nadi_name = self._get_nadi_name(sign, nadi_in_sign)

        # Calculate degree positions
        degree_start = nadi_in_sign * self.DEGREES_PER_NADI
        degree_end = degree_start + self.DEGREES_PER_NADI
        arcminute_position = (degrees_in_sign % self.DEGREES_PER_NADI) * 60

        # Get sign-specific characteristics
        characteristics = self._get_nadi_characteristics(sign.sign_type)

        return NadiInfo(
            nadi_number=nadi_in_sign + 1,
            nadi_name=nadi_name,
            sign=sign,
            degree_start=degree_start,
            degree_end=degree_end,
            arcminute_position=arcminute_position,
            sign_type=sign.sign_type,
            chara_characteristics=characteristics[0] if sign.sign_type == SignType.CHARA else None,
            sthira_characteristics=characteristics[0] if sign.sign_type == SignType.STHIRA else None,
            dvisvabhava_characteristics=characteristics[0] if sign.sign_type == SignType.DVISVABHAVA else None,
        )

    def _get_nadi_name(self, sign: Zodiac, nadi_index: int) -> str:
        """Get Nadi name based on sign type and index."""
        if sign.sign_type == SignType.CHARA:
            return self.CHARA_NADI_NAMES[nadi_index % len(self.CHARA_NADI_NAMES)]
        elif sign.sign_type == SignType.STHIRA:
            return self.STHIRA_NADI_NAMES[nadi_index % len(self.STHIRA_NADI_NAMES)]
        else:  # DVISVABHAVA
            return self.DVISVABHAVA_NADI_NAMES[nadi_index % len(self.DVISVABHAVA_NADI_NAMES)]

    def _get_nadi_characteristics(self, sign_type: SignType) -> Tuple[str, ...]:
        """Get characteristics description for a sign type."""
        characteristics = {
            SignType.CHARA: ("Dynamic, initiatory, action-oriented nature. Represents beginnings and enterprise.",),
            SignType.STHIRA: ("Stable, fixed, enduring nature. Represents consolidation and permanence.",),
            SignType.DVISVABHAVA: ("Dual, flexible, communicative nature. Represents adaptability and learning.",),
        }
        return characteristics[sign_type]


class BhriguNandiNadi:
    """
    Interprets planetary positions using Bhrigu Nandi Nadi principles.

    The Bhrigu Nandi Nadi system provides interpretations based on:
    1. Planet-in-sign positions
    2. The sign BEFORE a planet (what feeds into it)
    3. The sign AFTER a planet (what flows from it)

    Core principles:
    - Jupiter: Shows native's dharma/purpose related to that house
    - Saturn: Shows karmic debts and delays in that house
    - Rahu: Shows obsessive desires related to that house
    - Ketu: Shows past-life expertise related to that house
    """

    PLANETARY_DHARMA = {
        Planet.JUPITER: {
            "theme": "Dharma and purpose",
            "keyword": "expansion",
            "interpretation": "Shows the native's dharma, higher purpose, and areas of natural expansion",
        },
        Planet.SATURN: {
            "theme": "Karma and delays",
            "keyword": "restriction",
            "interpretation": "Reveals karmic debts, limitations, discipline, and delayed rewards",
        },
        Planet.RAHU: {
            "theme": "Obsessive desires",
            "keyword": "craving",
            "interpretation": "Shows obsessive wants, material desires, and areas of illusion",
        },
        Planet.KETU: {
            "theme": "Past-life expertise",
            "keyword": "detachment",
            "interpretation": "Reveals past-life skills, detachment, and spiritual insights",
        },
    }

    HOUSE_INDICATIONS = {
        1: "Self, personality, health",
        2: "Wealth, family, speech",
        3: "Siblings, communication, short travel",
        4: "Mother, home, property, peace",
        5: "Children, creativity, romance",
        6: "Health, enemies, debts, service",
        7: "Spouse, partnerships, business",
        8: "Longevity, hidden matters, occult",
        9: "Father, fortune, long travel, spirituality",
        10: "Career, status, reputation",
        11: "Gains, friends, hopes",
        12: "Losses, isolation, spirituality, foreign lands",
    }

    def __init__(self):
        """Initialize Bhrigu Nandi Nadi interpreter."""
        pass

    def interpret_planet_in_sign(
        self,
        planet: Planet,
        sign: Zodiac,
        house: int,
    ) -> BhriguInterpretation:
        """
        Interpret a planet's position using Bhrigu Nandi principles.

        Args:
            planet: The planet being interpreted
            sign: The zodiac sign containing the planet
            house: The house number (1-12) for additional context

        Returns:
            BhriguInterpretation object
        """
        if planet not in self.PLANETARY_DHARMA:
            raise ValueError(f"Bhrigu interpretation not defined for {planet.value}")

        if not 1 <= house <= 12:
            raise ValueError(f"House must be between 1 and 12, got {house}")

        dharma_data = self.PLANETARY_DHARMA[planet]
        house_meaning = self.HOUSE_INDICATIONS[house]

        # Get sign before and after
        sign_before = Zodiac((sign.number - 1) % 12)
        sign_after = Zodiac((sign.number + 1) % 12)

        dharma_theme = f"{planet.value} in {sign.english}: {dharma_data['theme']}"

        special_rules = self._get_special_rules(planet, sign, house)

        return BhriguInterpretation(
            planet=planet,
            sign=sign,
            dharma_theme=dharma_theme,
            house_indication=f"House {house}: {house_meaning}",
            sign_before_meaning=f"Sign before ({sign_before.english}): What feeds into this position",
            sign_after_meaning=f"Sign after ({sign_after.english}): What flows from this position",
            special_rules=special_rules,
        )

    def _get_special_rules(self, planet: Planet, sign: Zodiac, house: int) -> List[str]:
        """Generate special interpretation rules for planet-sign-house combination."""
        rules = []

        # Jupiter special rules
        if planet == Planet.JUPITER:
            rules.append(f"Jupiter in {sign.english} expands and blesses house {house} matters")
            if sign.sign_type == SignType.CHARA:
                rules.append("In a Chara sign: Expansion is dynamic and quick")
            elif sign.sign_type == SignType.STHIRA:
                rules.append("In a Sthira sign: Expansion is slow but solid and lasting")
            else:
                rules.append("In a Dvisvabhava sign: Expansion fluctuates with circumstances")

        # Saturn special rules
        if planet == Planet.SATURN:
            rules.append(f"Saturn in {sign.english} tests and teaches through house {house}")
            rules.append("Look for delays, but eventual mastery after effort")
            if sign.sign_type == SignType.CHARA:
                rules.append("In a Chara sign: Tests come through new ventures")
            elif sign.sign_type == SignType.STHIRA:
                rules.append("In a Sthira sign: Tests are persistent and long-lasting")
            else:
                rules.append("In a Dvisvabhava sign: Tests are variable and intermittent")

        # Rahu special rules
        if planet == Planet.RAHU:
            rules.append(f"Rahu in {sign.english} creates obsessive focus on house {house} matters")
            rules.append("Can lead to both extreme desire and eventual disillusionment")

        # Ketu special rules
        if planet == Planet.KETU:
            rules.append(f"Ketu in {sign.english} shows past-life mastery in house {house}")
            rules.append("Natural talent but may lack motivation; path to spiritual growth")

        return rules


class DhruvaNadi:
    """
    Dhruva Nadi lookup for ascendant-based predictions.

    Dr. B.V. Raman's version divides the zodiac into 1800 sections.
    Each section has specific indications when it is the ascendant.
    Requires birth time accuracy of less than 1 minute for reliability.
    """

    def __init__(self):
        """Initialize Dhruva Nadi with lookup tables."""
        self._load_dhruva_nadi_tables()

    def _load_dhruva_nadi_tables(self) -> None:
        """Load the 1800 Dhruva Nadi section database."""
        # In production, this would load from a comprehensive database
        # For this implementation, we create a representative sample
        self.dhruva_sections: Dict[int, DhruvaNadiEntry] = {}

        # Generate representative entries across the zodiac
        # Each sign gets ~150 sections, for 12 signs = 1800 total
        section_count = 0
        for sign_num, sign in enumerate(Zodiac):
            for section_in_sign in range(150):
                section_count += 1

                # Calculate degree range
                degree_start = section_in_sign * 0.2
                degree_end = degree_start + 0.2

                # Create varied indications based on pattern
                indication_pattern = section_in_sign % 10

                indications = self._generate_indications(sign, indication_pattern)
                longevity = self._generate_longevity_indicator(section_in_sign)
                marriage_timing = self._generate_marriage_timing(section_in_sign)
                career_timing = self._generate_career_timing(section_in_sign)
                health_notes = self._generate_health_notes(section_in_sign)

                self.dhruva_sections[section_count] = DhruvaNadiEntry(
                    section_number=section_count,
                    nadi_range=(degree_start, degree_end),
                    ascendant_sign=sign,
                    key_indications=indications,
                    longevity_indicator=longevity,
                    marriage_timing=marriage_timing,
                    career_timing=career_timing,
                    health_notes=health_notes,
                )

    def _generate_indications(self, sign: Zodiac, pattern: int) -> List[str]:
        """Generate key life indications based on sign and pattern."""
        base_indications = {
            Zodiac.ARIES: "Leadership, enterprise, quick decision-making",
            Zodiac.TAURUS: "Wealth accumulation, stability, property ownership",
            Zodiac.GEMINI: "Communication, learning, multiple interests",
            Zodiac.CANCER: "Emotional depth, family focus, property",
            Zodiac.LEO: "Authority, creativity, recognition",
            Zodiac.VIRGO: "Service, analysis, practical work",
            Zodiac.LIBRA: "Partnership, balance, artistic pursuits",
            Zodiac.SCORPIO: "Transformation, depth, secretive matters",
            Zodiac.SAGITTARIUS: "Travel, philosophy, higher learning",
            Zodiac.CAPRICORN: "Ambition, responsibility, structural growth",
            Zodiac.AQUARIUS: "Humanitarian ideals, innovation, community",
            Zodiac.PISCES: "Spirituality, intuition, compassion",
        }

        base = base_indications.get(sign, "General indications")
        variations = [
            f"{base}. Strong early life advantages.",
            f"{base}. Challenges in middle life, rewards at end.",
            f"{base}. Fluctuating fortunes throughout life.",
            f"{base}. Slow but steady progress.",
            f"{base}. Sudden turns of fortune.",
        ]

        return [variations[pattern % len(variations)]]

    def _generate_longevity_indicator(self, section: int) -> str:
        """Generate longevity indicator."""
        pattern = section % 5
        indicators = [
            "Short span (Alpayu), 30-40 years",
            "Medium span (Madhyayu), 40-70 years",
            "Long span (Purnayu), 70+ years",
            "Very long span, exceptional longevity",
            "Variable, depends on remedies and conduct",
        ]
        return indicators[pattern]

    def _generate_marriage_timing(self, section: int) -> str:
        """Generate marriage timing prediction."""
        pattern = section % 4
        timings = [
            "Early marriage (before 25)",
            "Marriage in 25-30 age range",
            "Marriage in 30-40 age range",
            "Late marriage or may remain single",
        ]
        return timings[pattern]

    def _generate_career_timing(self, section: int) -> str:
        """Generate career success timing prediction."""
        pattern = section % 4
        timings = [
            "Early career success (by 25)",
            "Career establishment in 25-35 range",
            "Career peak in 35-50 range",
            "Career success after 50",
        ]
        return timings[pattern]

    def _generate_health_notes(self, section: int) -> str:
        """Generate health notes."""
        pattern = section % 5
        notes = [
            "Generally robust health",
            "Watch for digestive issues",
            "Prone to respiratory concerns",
            "Requires periodic health checks",
            "Past health challenges overcome by discipline",
        ]
        return notes[pattern]

    def lookup_ascendant_section(self, ascendant_longitude: float) -> DhruvaNadiEntry:
        """
        Lookup Dhruva Nadi indications for an ascendant position.

        Args:
            ascendant_longitude: Ascendant longitude in degrees (0-360)

        Returns:
            DhruvaNadiEntry with predictions for this ascendant
        """
        # Convert longitude to section number (1-1800)
        section_num = max(1, min(1800, int((ascendant_longitude / 360) * 1800) + 1))

        if section_num not in self.dhruva_sections:
            raise ValueError(f"Dhruva Nadi section {section_num} not found")

        return self.dhruva_sections[section_num]


class ChandraHariNadi:
    """
    Moon-based Nadi analysis using Chandra Hari principles.

    The Moon's Nadi position determines emotional and mental patterns.
    Cross-referenced with lunar nakshatra for deeper psychological analysis.
    """

    NAKSHATRA_LORDS = [
        "Ketu", "Venus", "Sun", "Moon", "Mars",
        "Rahu", "Jupiter", "Saturn", "Mercury",
        "Ketu", "Venus", "Sun", "Moon", "Mars",
        "Rahu", "Jupiter", "Saturn", "Mercury",
        "Ketu", "Venus", "Sun", "Moon", "Mars",
        "Rahu", "Jupiter", "Saturn", "Mercury",
        "Ketu", "Venus",
    ]

    EMOTIONAL_PATTERNS = {
        "Ketu": "Detached, spiritual, introspective, withdrawn tendencies",
        "Venus": "Affectionate, artistic, social, pleasure-seeking",
        "Sun": "Proud, authoritative, self-reliant, need for recognition",
        "Moon": "Emotional, nurturing, family-oriented, moody",
        "Mars": "Assertive, aggressive, competitive, passionate",
        "Rahu": "Ambitious, obsessive, worldly desires, restless",
        "Jupiter": "Optimistic, generous, philosophical, expansive",
        "Saturn": "Cautious, disciplined, serious, melancholic tendencies",
        "Mercury": "Curious, communicative, analytical, mentally active",
    }

    def __init__(self):
        """Initialize Chandra Hari Nadi analyzer."""
        pass

    def analyze_moon_nadi(
        self,
        moon_longitude: float,
        moon_nakshatra: int,
    ) -> Dict[str, Any]:
        """
        Analyze Moon's Nadi position and emotional patterns.

        Args:
            moon_longitude: Moon's sidereal longitude in degrees
            moon_nakshatra: Moon's nakshatra number (0-26)

        Returns:
            Dictionary with emotional pattern analysis
        """
        if not 0 <= moon_longitude < 360:
            raise ValueError("Moon longitude must be 0-360")

        if not 0 <= moon_nakshatra < 27:
            raise ValueError("Nakshatra must be 0-26")

        # Get nakshatra lord
        lord = self.NAKSHATRA_LORDS[moon_nakshatra]
        emotional_pattern = self.EMOTIONAL_PATTERNS.get(lord, "Unknown pattern")

        # Determine sign position
        sign_num = int(moon_longitude // 30)
        sign = Zodiac(sign_num)

        # Analyze Moon-Nadi interaction
        nadi_amsha = NadiAmsha()
        nadi_info = nadi_amsha.get_nadi_for_longitude(moon_longitude)

        return {
            "moon_sign": sign.english,
            "moon_nakshatra_lord": lord,
            "emotional_pattern": emotional_pattern,
            "nadi_position": nadi_info.nadi_name,
            "nadi_number": nadi_info.nadi_number,
            "mental_tendencies": self._get_mental_tendencies(lord, sign),
            "psychological_insights": self._get_psychological_insights(lord, sign),
        }

    def _get_mental_tendencies(self, lord: str, sign: Zodiac) -> List[str]:
        """Generate mental tendency descriptions."""
        lord_base = self.EMOTIONAL_PATTERNS.get(lord, "")

        sign_tendency = {
            Zodiac.ARIES: "Quick-thinking, impulsive, action-oriented",
            Zodiac.TAURUS: "Stubborn, steady, pleasure-focused",
            Zodiac.GEMINI: "Communicative, restless, scattered",
            Zodiac.CANCER: "Sensitive, protective, nostalgic",
            Zodiac.LEO: "Creative, dramatic, pride-conscious",
            Zodiac.VIRGO: "Analytical, critical, perfectionist",
            Zodiac.LIBRA: "Diplomatic, indecisive, relationship-focused",
            Zodiac.SCORPIO: "Intense, secretive, penetrating",
            Zodiac.SAGITTARIUS: "Philosophical, wandering, truth-seeking",
            Zodiac.CAPRICORN: "Ambitious, serious, responsible",
            Zodiac.AQUARIUS: "Idealistic, detached, group-oriented",
            Zodiac.PISCES: "Imaginative, escapist, intuitive",
        }

        return [lord_base, sign_tendency.get(sign, "")]

    def _get_psychological_insights(self, lord: str, sign: Zodiac) -> str:
        """Generate deeper psychological insights."""
        base_insight = f"Moon's lord {lord} in {sign.english} creates"

        combinations = {
            ("Ketu", Zodiac.CANCER): "spiritual detachment from family origins",
            ("Venus", Zodiac.CANCER): "deep emotional attachments and family bonds",
            ("Sun", Zodiac.CANCER): "conflict between pride and emotional need",
            ("Moon", Zodiac.CANCER): "strong emotional sensitivity and empathy",
            ("Mars", Zodiac.CANCER): "emotional intensity and family passion",
            ("Saturn", Zodiac.CANCER): "emotional barriers and delayed emotional release",
        }

        insight = combinations.get((lord, sign), "unique emotional configuration")
        return f"{base_insight} {insight}."


class NadiAnalysis:
    """
    Main Nadi astrology orchestrator combining all systems.

    Synthesizes Nadi Amsha, Bhrigu Nandi, Dhruva Nadi, and Chandra Hari
    into a unified analytical framework for comprehensive Nadi interpretation.
    """

    def __init__(self):
        """Initialize the Nadi Analysis system."""
        self.nadi_amsha = NadiAmsha()
        self.bhrigu_nandi = BhriguNandiNadi()
        self.dhruva_nadi = DhruvaNadi()
        self.chandra_hari = ChandraHariNadi()

    def comprehensive_nadi_analysis(
        self,
        ascendant_longitude: float,
        moon_longitude: float,
        moon_nakshatra: int,
        planets: Dict[Planet, Tuple[float, int]],
    ) -> Dict[str, Any]:
        """
        Perform comprehensive Nadi analysis.

        Args:
            ascendant_longitude: Ascendant longitude in degrees
            moon_longitude: Moon's longitude in degrees
            moon_nakshatra: Moon's nakshatra (0-26)
            planets: Dict of Planet -> (longitude, house) pairs

        Returns:
            Comprehensive Nadi analysis report
        """
        report = {
            "ascendant_nadi": self.nadi_amsha.get_nadi_for_longitude(ascendant_longitude),
            "dhruva_nadi_predictions": self.dhruva_nadi.lookup_ascendant_section(ascendant_longitude),
            "moon_nadi_analysis": self.chandra_hari.analyze_moon_nadi(
                moon_longitude,
                moon_nakshatra,
            ),
            "planetary_interpretations": {},
        }

        # Add Bhrigu Nandi interpretations for key planets
        for planet, (longitude, house) in planets.items():
            if planet in [Planet.JUPITER, Planet.SATURN, Planet.RAHU, Planet.KETU]:
                sign_num = int(longitude // 30)
                sign = Zodiac(sign_num)
                report["planetary_interpretations"][planet.value] = (
                    self.bhrigu_nandi.interpret_planet_in_sign(planet, sign, house)
                )

        return report


# Test section
if __name__ == "__main__":
    # Test with Hemant's chart
    # Ascendant: Gemini (at ~60-65 degrees)
    # Moon: Cancer (at ~95 degrees approx)

    print("=" * 70)
    print("SILICON SIDDHANTA - NADI SYSTEM TESTS")
    print("=" * 70)

    # Test 1: Nadi Amsha calculation
    print("\n1. NADI AMSHA CALCULATION")
    print("-" * 70)
    nadi_calc = NadiAmsha()

    test_longitudes = [65.0, 95.0, 0.0, 180.0]
    for lng in test_longitudes:
        nadi_info = nadi_calc.get_nadi_for_longitude(lng)
        print(f"\nLongitude {lng}°:")
        print(f"  Sign: {nadi_info.sign.english}")
        print(f"  Nadi #{nadi_info.nadi_number}: {nadi_info.nadi_name}")
        print(f"  Position: {nadi_info.degree_start}° - {nadi_info.degree_end}°")
        print(f"  Arcminute: {nadi_info.arcminute_position:.1f}'")

    # Test 2: Bhrigu Nandi interpretation
    print("\n\n2. BHRIGU NANDI NADI INTERPRETATION")
    print("-" * 70)
    bhrigu = BhriguNandiNadi()

    interpretation = bhrigu.interpret_planet_in_sign(
        Planet.JUPITER,
        Zodiac.GEMINI,
        house=1,
    )
    print(f"\nJupiter in Gemini (House 1):")
    print(f"  Dharma Theme: {interpretation.dharma_theme}")
    print(f"  House Meaning: {interpretation.house_indication}")
    print(f"  Before: {interpretation.sign_before_meaning}")
    print(f"  After: {interpretation.sign_after_meaning}")
    print(f"  Rules:")
    for rule in interpretation.special_rules:
        print(f"    • {rule}")

    # Test 3: Dhruva Nadi
    print("\n\n3. DHRUVA NADI LOOKUP")
    print("-" * 70)
    dhruva = DhruvaNadi()

    asc_section = dhruva.lookup_ascendant_section(65.0)
    print(f"\nAscendant at 65°:")
    print(f"  Sign: {asc_section.ascendant_sign.english}")
    print(f"  Section: {asc_section.section_number}/1800")
    print(f"  Indications: {asc_section.key_indications[0]}")
    print(f"  Longevity: {asc_section.longevity_indicator}")
    print(f"  Marriage Timing: {asc_section.marriage_timing}")
    print(f"  Career Timing: {asc_section.career_timing}")
    print(f"  Health: {asc_section.health_notes}")

    # Test 4: Chandra Hari
    print("\n\n4. CHANDRA HARI MOON NADI ANALYSIS")
    print("-" * 70)
    chandra = ChandraHariNadi()

    moon_analysis = chandra.analyze_moon_nadi(95.0, 9)  # Cancer, Ashlesha
    print(f"\nMoon at 95° in Nakshatra 9:")
    print(f"  Moon Sign: {moon_analysis['moon_sign']}")
    print(f"  Nakshatra Lord: {moon_analysis['moon_nakshatra_lord']}")
    print(f"  Nadi Position: {moon_analysis['nadi_position']}")
    print(f"  Emotional Pattern: {moon_analysis['emotional_pattern']}")
    print(f"  Mental Tendencies: {', '.join(moon_analysis['mental_tendencies'])}")
    print(f"  Psychology: {moon_analysis['psychological_insights']}")

    # Test 5: Comprehensive Nadi Analysis
    print("\n\n5. COMPREHENSIVE NADI ANALYSIS (Hemant's Chart)")
    print("-" * 70)
    nadi_system = NadiAnalysis()

    planets_data = {
        Planet.JUPITER: (200.0, 7),
        Planet.SATURN: (150.0, 5),
        Planet.RAHU: (250.0, 9),
        Planet.KETU: (70.0, 3),
    }

    full_analysis = nadi_system.comprehensive_nadi_analysis(
        ascendant_longitude=65.0,
        moon_longitude=95.0,
        moon_nakshatra=9,
        planets=planets_data,
    )

    print(f"\nAscendant Nadi: {full_analysis['ascendant_nadi'].nadi_name}")
    print(f"Moon Nadi: {full_analysis['moon_nadi_analysis']['nadi_position']}")
    print(f"\nDhruva Nadi Life Indications:")
    print(f"  {full_analysis['dhruva_nadi_predictions'].key_indications[0]}")

    print("\n" + "=" * 70)
    print("NADI SYSTEM TESTS COMPLETE")
    print("=" * 70)
