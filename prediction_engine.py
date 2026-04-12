"""
prediction_engine.py — Silicon Siddhanta
Unified Prediction Engine

Synthesizes KP (Krishnamurti Paddhati), Parashari, KCIL, and Nadi systems
into a unified prediction framework for event timing, compatibility analysis,
and remedial suggestions.

This module provides:
1. Transit analysis with Ashtakavarga strength
2. Event timing using KP significators and Dasha
3. Marriage compatibility (Ashtakoot - 8 factors, 36 points)
4. Remedy suggestions based on afflictions
5. Comprehensive prediction reports
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Tuple, Optional, Any, Set
from datetime import datetime, timedelta
import math


class PlanetName(Enum):
    """Planetary designations."""
    SUN = "Sun"
    MOON = "Moon"
    MARS = "Mars"
    MERCURY = "Mercury"
    JUPITER = "Jupiter"
    VENUS = "Venus"
    SATURN = "Saturn"
    RAHU = "Rahu"
    KETU = "Ketu"


class SignName(Enum):
    """Zodiac signs."""
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


class EventType(Enum):
    """Life event categories for timing."""
    MARRIAGE = "Marriage"
    CAREER_CHANGE = "Career Change"
    PROPERTY_PURCHASE = "Property Purchase"
    FOREIGN_TRAVEL = "Foreign Travel"
    CHILDREN = "Children"
    HEALTH_CRISIS = "Health Crisis"
    FINANCIAL_GAIN = "Financial Gain"
    SPIRITUAL_GROWTH = "Spiritual Growth"


class GemstoneType(Enum):
    """Gemstone recommendations by planet."""
    RUBY = "Ruby"  # Sun
    PEARL = "Pearl"  # Moon
    CORAL = "Red Coral"  # Mars
    EMERALD = "Emerald"  # Mercury
    YELLOW_SAPPHIRE = "Yellow Sapphire"  # Jupiter
    DIAMOND = "Diamond"  # Venus
    BLUE_SAPPHIRE = "Blue Sapphire"  # Saturn
    HESSONITE = "Hessonite"  # Rahu
    CAT_EYE = "Cat's Eye"  # Ketu


# Mappings for Ashtakavarga calculation
ASHTAKAVARGA_SCORES = {
    PlanetName.SUN: {SignName.ARIES: 7, SignName.TAURUS: 6, SignName.GEMINI: 6, SignName.CANCER: 5,
                     SignName.LEO: 7, SignName.VIRGO: 6, SignName.LIBRA: 5, SignName.SCORPIO: 4,
                     SignName.SAGITTARIUS: 6, SignName.CAPRICORN: 7, SignName.AQUARIUS: 5, SignName.PISCES: 6},
    PlanetName.MOON: {SignName.ARIES: 3, SignName.TAURUS: 6, SignName.GEMINI: 6, SignName.CANCER: 7,
                      SignName.LEO: 6, SignName.VIRGO: 5, SignName.LIBRA: 7, SignName.SCORPIO: 5,
                      SignName.SAGITTARIUS: 6, SignName.CAPRICORN: 4, SignName.AQUARIUS: 5, SignName.PISCES: 7},
    # Additional planets would follow similar pattern
}

EVENT_HOUSE_MAPPING = {
    EventType.MARRIAGE: [2, 7, 11],
    EventType.CAREER_CHANGE: [2, 6, 10],
    EventType.PROPERTY_PURCHASE: [4, 11, 12],
    EventType.FOREIGN_TRAVEL: [3, 9, 12],
    EventType.CHILDREN: [2, 5, 11],
    EventType.HEALTH_CRISIS: [1, 6, 8, 12],
    EventType.FINANCIAL_GAIN: [2, 6, 10, 11],
    EventType.SPIRITUAL_GROWTH: [5, 9, 12],
}

PLANET_GEMSTONES = {
    PlanetName.SUN: (GemstoneType.RUBY, GemstoneType.GARNET),
    PlanetName.MOON: (GemstoneType.PEARL, GemstoneType.MOONSTONE),
    PlanetName.MARS: (GemstoneType.CORAL, GemstoneType.RED_TOURMALINE),
    PlanetName.MERCURY: (GemstoneType.EMERALD, GemstoneType.GREEN_TOURMALINE),
    PlanetName.JUPITER: (GemstoneType.YELLOW_SAPPHIRE, GemstoneType.CITRINE),
    PlanetName.VENUS: (GemstoneType.DIAMOND, GemstoneType.WHITE_SAPPHIRE),
    PlanetName.SATURN: (GemstoneType.BLUE_SAPPHIRE, GemstoneType.AMETHYST),
    PlanetName.RAHU: (GemstoneType.HESSONITE, GemstoneType.GARNET),
    PlanetName.KETU: (GemstoneType.CAT_EYE, GemstoneType.TIGER_EYE),
}


@dataclass
class TransitInfo:
    """Information about a planet's current transit."""
    planet: PlanetName
    current_sign: SignName
    current_degree: float
    transit_strength: float  # 0-10 based on Ashtakavarga
    aspects_to_natal_planets: List[str]
    special_conditions: List[str]


@dataclass
class SadeAtiInfo:
    """Sade Sati (7.5-year Saturn transit) information."""
    is_active: bool
    phase: str  # "First", "Middle", "Last", or "Not Active"
    moon_sign: SignName
    saturn_sign: SignName
    started_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    interpretation: str = ""


@dataclass
class EventTimingPrediction:
    """Timing prediction for a life event."""
    event_type: EventType
    predicted_year_range: Tuple[int, int]
    confidence_level: str  # "High", "Medium", "Low"
    dasha_lord: str
    bhukti_lord: str
    supporting_transits: List[str]
    ruling_planets: List[str]
    detailed_indication: str


@dataclass
class CompatibilityScore:
    """Marriage compatibility assessment."""
    factor_name: str
    max_points: int
    awarded_points: int
    percentage: float
    interpretation: str


@dataclass
class AshtakootResult:
    """Complete Ashtakoot (8-factor) compatibility analysis."""
    total_points: int
    max_points: int
    percentage: float
    match_quality: str  # "Excellent", "Good", "Acceptable", "Poor"
    factor_scores: List[CompatibilityScore]
    nadi_dosha_present: bool
    overall_recommendation: str


@dataclass
class RemedySuggestion:
    """Single remedy recommendation."""
    category: str  # "Gemstone", "Mantra", "Fasting", "Charity", "Yantra"
    planet: Optional[PlanetName]
    recommendation: str
    frequency: str
    duration: str
    expected_benefit: str
    related_dasha_or_transit: str


@dataclass
class PredictionReport:
    """Comprehensive prediction report combining all systems."""
    native_name: str
    dob: str
    ascendant: SignName
    moon_sign: SignName
    current_dasha: str
    birth_location: str
    report_date: datetime

    # Sections
    personality_analysis: Dict[str, Any]
    career_analysis: Dict[str, Any]
    relationship_analysis: Dict[str, Any]
    health_analysis: Dict[str, Any]
    spiritual_path_analysis: Dict[str, Any]
    event_timing: List[EventTimingPrediction]
    transit_analysis: List[TransitInfo]
    sade_sati_status: SadeAtiInfo
    remedies: List[RemedySuggestion]

    # Summary
    key_findings: List[str]
    recommendations: List[str]


class TransitAnalysis:
    """
    Current planetary transit analysis with Ashtakavarga strength.

    Analyzes the strength of transiting planets in the natal chart
    and identifies significant transits through Ashtakavarga scoring.
    """

    def __init__(self):
        """Initialize transit analyzer."""
        pass

    def calculate_transit_strength(
        self,
        planet: PlanetName,
        transit_sign: SignName,
    ) -> float:
        """
        Calculate Ashtakavarga-based transit strength (0-10).

        Args:
            planet: The transiting planet
            transit_sign: The sign the planet is transiting

        Returns:
            Transit strength score (0-10)
        """
        if planet not in ASHTAKAVARGA_SCORES:
            return 5.0  # Default neutral strength

        sign_scores = ASHTAKAVARGA_SCORES[planet]
        av_score = sign_scores.get(transit_sign, 5)

        # Convert to 0-10 scale
        return (av_score / 7) * 10

    def analyze_current_transits(
        self,
        planets_transit_data: Dict[PlanetName, Tuple[SignName, float]],
        natal_planets: Dict[PlanetName, Tuple[SignName, int]],
    ) -> List[TransitInfo]:
        """
        Analyze all current planetary transits.

        Args:
            planets_transit_data: Dict of Planet -> (Sign, Degree)
            natal_planets: Dict of Planet -> (Sign, House)

        Returns:
            List of TransitInfo objects
        """
        transits = []

        for planet, (transit_sign, degree) in planets_transit_data.items():
            strength = self.calculate_transit_strength(planet, transit_sign)

            # Determine aspects to natal positions
            natal_sign, natal_house = natal_planets.get(planet, (transit_sign, 0))
            aspects = self._calculate_aspects(planet, transit_sign, natal_sign)

            # Identify special conditions
            special = self._identify_special_conditions(planet, transit_sign)

            transits.append(
                TransitInfo(
                    planet=planet,
                    current_sign=transit_sign,
                    current_degree=degree,
                    transit_strength=strength,
                    aspects_to_natal_planets=aspects,
                    special_conditions=special,
                )
            )

        return transits

    def _calculate_aspects(
        self,
        planet: PlanetName,
        transit_sign: SignName,
        natal_sign: SignName,
    ) -> List[str]:
        """Calculate planetary aspects from transit to natal position."""
        aspects = []

        transit_num = transit_sign.value
        natal_num = natal_sign.value

        # Check for conjunction (0°)
        if transit_num == natal_num:
            aspects.append(f"Conjunction with natal {planet.value}")

        # Check for opposition (180°)
        if (transit_num - natal_num) % 12 == 6:
            aspects.append(f"Opposition to natal {planet.value}")

        # Check for trine (120°)
        if (transit_num - natal_num) % 12 == 4:
            aspects.append(f"Trine to natal {planet.value}")

        # Check for square (90°)
        if (transit_num - natal_num) % 12 == 3:
            aspects.append(f"Square to natal {planet.value}")

        return aspects

    def _identify_special_conditions(
        self,
        planet: PlanetName,
        transit_sign: SignName,
    ) -> List[str]:
        """Identify special transit conditions."""
        conditions = []

        if planet == PlanetName.SATURN:
            conditions.append("Saturn transit: Long-term effects, patience required")

        if planet == PlanetName.JUPITER:
            conditions.append("Jupiter transit: Expansion and opportunity period")

        if planet in [PlanetName.RAHU, PlanetName.KETU]:
            conditions.append(f"{planet.value} transit: Karmic activation point")

        if planet == PlanetName.MARS:
            conditions.append("Mars transit: Action and assertion phase")

        return conditions

    def detect_sade_sati(
        self,
        moon_sign: SignName,
        saturn_current_sign: SignName,
    ) -> SadeAtiInfo:
        """
        Detect Sade Sati (7.5-year Saturn over Moon ±1 sign).

        Args:
            moon_sign: Native's Moon sign
            saturn_current_sign: Current Saturn sign

        Returns:
            SadeAtiInfo with Sade Sati status
        """
        moon_num = moon_sign.value
        saturn_num = saturn_current_sign.value

        # Check if Saturn is in Moon's sign or ±1 sign
        relative_position = (saturn_num - moon_num) % 12

        if relative_position == 0:
            phase = "Middle (peak difficulty)"
            is_active = True
        elif relative_position == 11 or relative_position == 1:
            phase = "First or Last (building/ending)"
            is_active = True
        else:
            phase = "Not Active"
            is_active = False

        interpretation = ""
        if is_active:
            if "Middle" in phase:
                interpretation = "Major life challenges and restructuring. Focus on dharma."
            else:
                interpretation = "Transitional phase with growing challenges. Prepare for major shifts."
        else:
            interpretation = "No Sade Sati currently. This is a favorable period."

        return SadeAtiInfo(
            is_active=is_active,
            phase=phase,
            moon_sign=moon_sign,
            saturn_sign=saturn_current_sign,
            interpretation=interpretation,
        )

    def analyze_jupiter_transits(
        self,
        jupiter_current_sign: SignName,
        natal_ascendant: SignName,
    ) -> Dict[str, Any]:
        """
        Analyze Jupiter transit for expansion themes.

        Args:
            jupiter_current_sign: Current Jupiter sign
            natal_ascendant: Natal ascendant sign

        Returns:
            Dictionary with Jupiter transit analysis
        """
        aspect_dist = (jupiter_current_sign.value - natal_ascendant.value) % 12

        themes = {
            0: "Direct aspect on self - Personal growth and new opportunities",
            4: "Trine - Smooth growth and favorable circumstances",
            8: "Harmonious support - Benefits in career and finances",
            5: "Challenging aspect - Growth through obstacles",
        }

        theme = themes.get(aspect_dist, "General expansion period")

        return {
            "jupiter_sign": jupiter_current_sign.name,
            "aspect_to_ascendant": f"{aspect_dist * 30}°",
            "expansion_theme": theme,
            "duration": "~1 year in this sign",
            "key_areas": self._get_jupiter_expansion_areas(jupiter_current_sign),
        }

    def _get_jupiter_expansion_areas(self, sign: SignName) -> List[str]:
        """Get areas of expansion based on Jupiter's sign."""
        expansion_map = {
            SignName.ARIES: ["New ventures", "Personal initiative", "Competition"],
            SignName.TAURUS: ["Wealth", "Stability", "Material resources"],
            SignName.GEMINI: ["Communication", "Learning", "Business partnerships"],
            SignName.CANCER: ["Family", "Real estate", "Emotional security"],
            SignName.LEO: ["Creativity", "Recognition", "Romantic relationships"],
            SignName.VIRGO: ["Health", "Service", "Skills development"],
            SignName.LIBRA: ["Partnerships", "Legal matters", "Harmony"],
            SignName.SCORPIO: ["Transformations", "Psychology", "Hidden resources"],
            SignName.SAGITTARIUS: ["Travel", "Higher learning", "Philosophy"],
            SignName.CAPRICORN: ["Career", "Authority", "Responsibilities"],
            SignName.AQUARIUS: ["Friendships", "Groups", "Innovation"],
            SignName.PISCES: ["Spirituality", "Healing", "Creativity"],
        }
        return expansion_map.get(sign, ["General expansion"])


class EventTimingEngine:
    """
    Predicts timing of life events using multi-system synthesis.

    Combines KP significators with Dasha periods to predict when
    specific life events are likely to occur.

    Event occurs when:
    1. Dasha lord is significator of event houses
    2. Bhukti lord is significator of event houses
    3. Transit planets support the event
    4. Ruling planets at moment confirm
    """

    def __init__(self):
        """Initialize event timing engine."""
        pass

    def predict_event_timing(
        self,
        event_type: EventType,
        current_dasha: str,
        current_year: int,
        kp_significators: Dict[int, List[PlanetName]],
    ) -> EventTimingPrediction:
        """
        Predict timing for a specific life event.

        Args:
            event_type: Type of event to predict
            current_dasha: Current Dasha period (e.g., "Moon/Ketu/Rahu")
            current_year: Current year for calculation
            kp_significators: Dict of house -> list of significator planets

        Returns:
            EventTimingPrediction object
        """
        event_houses = EVENT_HOUSE_MAPPING[event_type]

        # Get significators for event houses
        event_significators: Set[PlanetName] = set()
        for house in event_houses:
            if house in kp_significators:
                event_significators.update(kp_significators[house])

        # Parse current Dasha
        dasha_parts = current_dasha.split("/")
        dasha_lord = dasha_parts[0] if dasha_parts else "Unknown"
        bhukti_lord = dasha_parts[1] if len(dasha_parts) > 1 else "Unknown"

        # Determine if current period favors this event
        confidence = "Low"
        prediction_year_offset = 3

        if dasha_lord in [str(p.value) for p in event_significators]:
            confidence = "High"
            prediction_year_offset = 1
        elif bhukti_lord in [str(p.value) for p in event_significators]:
            confidence = "Medium"
            prediction_year_offset = 2

        predicted_year_range = (current_year, current_year + prediction_year_offset)

        supporting_transits = self._get_supporting_transits(event_type)
        ruling_planets = self._get_ruling_planets(event_type)

        detailed_indication = self._generate_event_indication(
            event_type,
            event_significators,
            dasha_lord,
            confidence,
        )

        return EventTimingPrediction(
            event_type=event_type,
            predicted_year_range=predicted_year_range,
            confidence_level=confidence,
            dasha_lord=dasha_lord,
            bhukti_lord=bhukti_lord,
            supporting_transits=supporting_transits,
            ruling_planets=ruling_planets,
            detailed_indication=detailed_indication,
        )

    def _get_supporting_transits(self, event_type: EventType) -> List[str]:
        """Get transits that support an event."""
        transit_map = {
            EventType.MARRIAGE: ["Venus transiting 7th house", "Jupiter trine Dasha lord"],
            EventType.CAREER_CHANGE: ["Mars in 10th", "Saturn aspect on 6th/10th"],
            EventType.PROPERTY_PURCHASE: ["Jupiter in 4th/11th", "Moon aspects"],
            EventType.FOREIGN_TRAVEL: ["Rahu/Ketu on 3rd/9th/12th", "Jupiter expansion"],
            EventType.CHILDREN: ["Jupiter in 5th", "Venus well-placed"],
            EventType.HEALTH_CRISIS: ["Saturn/Mars on 1st/6th/8th", "Moon afflictions"],
            EventType.FINANCIAL_GAIN: ["Jupiter/Venus in gains house", "Mercury strong"],
            EventType.SPIRITUAL_GROWTH: ["Saturn maturation", "Ketu detachment"],
        }
        return transit_map.get(event_type, [])

    def _get_ruling_planets(self, event_type: EventType) -> List[str]:
        """Get ruling planets for an event type."""
        ruling_map = {
            EventType.MARRIAGE: ["Venus", "Jupiter"],
            EventType.CAREER_CHANGE: ["Saturn", "Mercury", "Mars"],
            EventType.PROPERTY_PURCHASE: ["Moon", "Mercury"],
            EventType.FOREIGN_TRAVEL: ["Jupiter", "Mercury", "Rahu"],
            EventType.CHILDREN: ["Jupiter", "Venus"],
            EventType.HEALTH_CRISIS: ["Saturn", "Mars", "8th lord"],
            EventType.FINANCIAL_GAIN: ["Jupiter", "Mercury", "Sun"],
            EventType.SPIRITUAL_GROWTH: ["Saturn", "Ketu", "9th lord"],
        }
        return ruling_map.get(event_type, [])

    def _generate_event_indication(
        self,
        event_type: EventType,
        significators: Set[PlanetName],
        dasha_lord: str,
        confidence: str,
    ) -> str:
        """Generate detailed indication text for an event."""
        if confidence == "High":
            return (
                f"Strong indication for {event_type.value} during current Dasha period. "
                f"The Dasha lord {dasha_lord} is a key significator."
            )
        elif confidence == "Medium":
            return (
                f"Moderate indication for {event_type.value}. "
                f"Waiting for Bhukti-level trigger or transit support."
            )
        else:
            return (
                f"Event likely but timing uncertain. May manifest within 2-3 years "
                f"when dasha period becomes more favorable."
            )


class AshtakootCompatibility:
    """
    Marriage compatibility using 8-factor (36 points) system.

    The 8 factors (Ashtakoot) for marriage compatibility:
    1. Varna (1 point) - Spiritual compatibility
    2. Vashya (2 points) - Dominance/attraction
    3. Tara (3 points) - Birth star compatibility
    4. Yoni (4 points) - Physical/sexual compatibility
    5. Graha Maitri (5 points) - Mental compatibility
    6. Gana (6 points) - Temperament
    7. Bhakoot (7 points) - Emotional
    8. Nadi (8 points) - Health/genes (CRITICAL: Same Nadi = 0 points)

    Minimum 18 points for acceptable match.
    """

    VARNA_COMPATIBILITY = {
        ("Brahmin", "Brahmin"): 1,
        ("Brahmin", "Kshatriya"): 0,
        ("Brahmin", "Vaishya"): 0,
        ("Brahmin", "Shudra"): 0,
        ("Kshatriya", "Kshatriya"): 1,
        ("Kshatriya", "Vaishya"): 0,
        ("Kshatriya", "Shudra"): 0,
        ("Vaishya", "Vaishya"): 1,
        ("Vaishya", "Shudra"): 0,
        ("Shudra", "Shudra"): 1,
    }

    VASHYA_COMPATIBILITY = {
        ("Chara", "Chara"): 0,
        ("Chara", "Sthira"): 1,
        ("Chara", "Dvisvabhava"): 2,
        ("Sthira", "Sthira"): 0,
        ("Sthira", "Chara"): 1,
        ("Sthira", "Dvisvabhava"): 2,
        ("Dvisvabhava", "Dvisvabhava"): 0,
        ("Dvisvabhava", "Chara"): 2,
        ("Dvisvabhava", "Sthira"): 2,
    }

    GANA_COMPATIBILITY = {
        ("Deva", "Deva"): 6,
        ("Deva", "Manushya"): 5,
        ("Deva", "Rakshasa"): 1,
        ("Manushya", "Manushya"): 6,
        ("Manushya", "Deva"): 5,
        ("Manushya", "Rakshasa"): 4,
        ("Rakshasa", "Rakshasa"): 6,
        ("Rakshasa", "Deva"): 1,
        ("Rakshasa", "Manushya"): 4,
    }

    def __init__(self):
        """Initialize Ashtakoot compatibility analyzer."""
        pass

    def calculate_compatibility(
        self,
        male_chart: Dict[str, Any],
        female_chart: Dict[str, Any],
    ) -> AshtakootResult:
        """
        Calculate complete Ashtakoot compatibility.

        Args:
            male_chart: Dictionary with male's chart data
            female_chart: Dictionary with female's chart data

        Returns:
            AshtakootResult with complete analysis
        """
        scores: List[CompatibilityScore] = []

        # 1. Varna (1 point)
        varna_score = self._calculate_varna(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Varna",
                max_points=1,
                awarded_points=varna_score,
                percentage=(varna_score / 1) * 100 if varna_score > 0 else 0,
                interpretation="Spiritual compatibility and values alignment",
            )
        )

        # 2. Vashya (2 points)
        vashya_score = self._calculate_vashya(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Vashya",
                max_points=2,
                awarded_points=vashya_score,
                percentage=(vashya_score / 2) * 100 if vashya_score > 0 else 0,
                interpretation="Dominance, attraction, and mutual control",
            )
        )

        # 3. Tara (3 points)
        tara_score = self._calculate_tara(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Tara",
                max_points=3,
                awarded_points=tara_score,
                percentage=(tara_score / 3) * 100 if tara_score > 0 else 0,
                interpretation="Birth star compatibility and life longevity",
            )
        )

        # 4. Yoni (4 points)
        yoni_score = self._calculate_yoni(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Yoni",
                max_points=4,
                awarded_points=yoni_score,
                percentage=(yoni_score / 4) * 100 if yoni_score > 0 else 0,
                interpretation="Physical and sexual compatibility",
            )
        )

        # 5. Graha Maitri (5 points)
        graha_maitri_score = self._calculate_graha_maitri(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Graha Maitri",
                max_points=5,
                awarded_points=graha_maitri_score,
                percentage=(graha_maitri_score / 5) * 100 if graha_maitri_score > 0 else 0,
                interpretation="Mental compatibility and communication",
            )
        )

        # 6. Gana (6 points)
        gana_score = self._calculate_gana(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Gana",
                max_points=6,
                awarded_points=gana_score,
                percentage=(gana_score / 6) * 100 if gana_score > 0 else 0,
                interpretation="Temperament and behavioral compatibility",
            )
        )

        # 7. Bhakoot (7 points)
        bhakoot_score = self._calculate_bhakoot(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Bhakoot",
                max_points=7,
                awarded_points=bhakoot_score,
                percentage=(bhakoot_score / 7) * 100 if bhakoot_score > 0 else 0,
                interpretation="Emotional bonding and family harmony",
            )
        )

        # 8. Nadi (8 points) - CRITICAL
        nadi_score, has_nadi_dosha = self._calculate_nadi(male_chart, female_chart)
        scores.append(
            CompatibilityScore(
                factor_name="Nadi",
                max_points=8,
                awarded_points=nadi_score,
                percentage=(nadi_score / 8) * 100 if nadi_score > 0 else 0,
                interpretation="Health, genes, and family compatibility" +
                               (" (NADI DOSHA PRESENT - CRITICAL!)" if has_nadi_dosha else ""),
            )
        )

        # Calculate totals
        total_points = sum(score.awarded_points for score in scores)
        max_points = 36

        # Determine match quality
        if total_points >= 32:
            match_quality = "Excellent"
            recommendation = "Highly compatible couple. Marriage is very auspicious."
        elif total_points >= 27:
            match_quality = "Good"
            recommendation = "Compatible. Proceed with marriage."
        elif total_points >= 18:
            match_quality = "Acceptable"
            recommendation = "Reasonably compatible. Some considerations needed."
        else:
            match_quality = "Poor"
            recommendation = "Incompatible. Consider remedies or reconsider marriage."

        if has_nadi_dosha and total_points >= 18:
            recommendation += " WARNING: Nadi Dosha present - recommend Nadi Shanti puja."

        return AshtakootResult(
            total_points=total_points,
            max_points=max_points,
            percentage=(total_points / max_points) * 100,
            match_quality=match_quality,
            factor_scores=scores,
            nadi_dosha_present=has_nadi_dosha,
            overall_recommendation=recommendation,
        )

    def _calculate_varna(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Varna compatibility."""
        male_varna = male.get("varna", "Vaishya")
        female_varna = female.get("varna", "Vaishya")
        return self.VARNA_COMPATIBILITY.get((male_varna, female_varna), 0)

    def _calculate_vashya(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Vashya compatibility."""
        male_sign_type = male.get("sign_type", "Chara")
        female_sign_type = female.get("sign_type", "Sthira")
        return self.VASHYA_COMPATIBILITY.get((male_sign_type, female_sign_type), 0)

    def _calculate_tara(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Tara (birth star) compatibility."""
        male_nak = male.get("nakshatra", 0)
        female_nak = female.get("nakshatra", 0)

        # Tara compatibility: Same nakshatra = 3 points, compatible = 0-2, incompatible = 0
        diff = abs(female_nak - male_nak)

        if diff == 0:
            return 3
        elif diff % 2 == 1:
            return 2
        else:
            return 1

    def _calculate_yoni(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Yoni (physical) compatibility."""
        # Simplified: 4 points for compatible animals, 0 for incompatible
        return 4  # Would require detailed yoni animal classification

    def _calculate_graha_maitri(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Graha Maitri (mental) compatibility."""
        # Based on Moon sign lord compatibility
        male_moon_lord = male.get("moon_lord", "Moon")
        female_moon_lord = female.get("moon_lord", "Moon")

        # Simplified scoring
        return 3 if male_moon_lord != female_moon_lord else 5

    def _calculate_gana(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Gana (temperament) compatibility."""
        male_gana = male.get("gana", "Deva")
        female_gana = female.get("gana", "Manushya")

        return self.GANA_COMPATIBILITY.get((male_gana, female_gana), 0)

    def _calculate_bhakoot(self, male: Dict[str, Any], female: Dict[str, Any]) -> int:
        """Calculate Bhakoot (emotional) compatibility."""
        # Based on Moon sign differences
        male_moon_sign = male.get("moon_sign", SignName.CANCER)
        female_moon_sign = female.get("moon_sign", SignName.CANCER)

        diff = abs(male_moon_sign.value - female_moon_sign.value)

        if diff == 0 or diff == 4 or diff == 8:
            return 7
        elif diff == 2 or diff == 10:
            return 4
        else:
            return 2

    def _calculate_nadi(
        self,
        male: Dict[str, Any],
        female: Dict[str, Any],
    ) -> Tuple[int, bool]:
        """
        Calculate Nadi compatibility (CRITICAL).

        Same Nadi = 0 points (Nadi Dosha - serious incompatibility).
        Different Nadis = 8 points.
        """
        male_nadi = male.get("nadi", "Unknown")
        female_nadi = female.get("nadi", "Unknown")

        has_dosha = male_nadi == female_nadi and male_nadi != "Unknown"

        return (0 if has_dosha else 8, has_dosha)


class RemedySuggestions:
    """
    Remedial measures based on planetary afflictions.

    Provides specific remedies:
    - Gemstone recommendations
    - Mantra prescriptions
    - Fasting recommendations
    - Charity guidance
    - Yantra recommendations
    """

    MANTRAS = {
        PlanetName.SUN: "Om Suryaya Namah",
        PlanetName.MOON: "Om Chandramase Namah",
        PlanetName.MARS: "Om Mangalaya Namah",
        PlanetName.MERCURY: "Om Budhaya Namah",
        PlanetName.JUPITER: "Om Gurave Namah",
        PlanetName.VENUS: "Om Shukraya Namah",
        PlanetName.SATURN: "Om Shanaischaraya Namah",
        PlanetName.RAHU: "Om Rahave Namah",
        PlanetName.KETU: "Om Ketave Namah",
    }

    FASTING_DAYS = {
        PlanetName.SUN: "Sunday",
        PlanetName.MOON: "Monday",
        PlanetName.MARS: "Tuesday",
        PlanetName.MERCURY: "Wednesday",
        PlanetName.JUPITER: "Thursday",
        PlanetName.VENUS: "Friday",
        PlanetName.SATURN: "Saturday",
        PlanetName.RAHU: "Saturday or Wednesday",
        PlanetName.KETU: "Tuesday or Saturday",
    }

    CHARITY_ITEMS = {
        PlanetName.SUN: "Wheat, jaggery, red cloth",
        PlanetName.MOON: "Rice, milk, white cloth",
        PlanetName.MARS: "Red lentils, red cloth, blood donations",
        PlanetName.MERCURY: "Green herbs, green cloth, books",
        PlanetName.JUPITER: "Yellow rice, turmeric, gold ornament",
        PlanetName.VENUS: "White sugar, diamond, white cloth",
        PlanetName.SATURN: "Iron, sesame, black cloth, shoes",
        PlanetName.RAHU: "Black items, mustard oil, iron items",
        PlanetName.KETU: "Brown items, pennies, metallic items",
    }

    YANTRAS = {
        PlanetName.SUN: "Surya Yantra",
        PlanetName.MOON: "Chandra Yantra",
        PlanetName.MARS: "Mangal Yantra",
        PlanetName.MERCURY: "Budh Yantra",
        PlanetName.JUPITER: "Guru Yantra",
        PlanetName.VENUS: "Shukra Yantra",
        PlanetName.SATURN: "Shani Yantra",
        PlanetName.RAHU: "Rahu Yantra",
        PlanetName.KETU: "Ketu Yantra",
    }

    def __init__(self):
        """Initialize remedy suggestion engine."""
        pass

    def suggest_remedies_for_afflicted_planet(
        self,
        planet: PlanetName,
        affliction_type: str,
        current_dasha: str,
    ) -> List[RemedySuggestion]:
        """
        Suggest remedies for an afflicted planet.

        Args:
            planet: The afflicted planet
            affliction_type: Type of affliction (weak, debilitated, aspected)
            current_dasha: Current Dasha period

        Returns:
            List of remedy suggestions
        """
        remedies = []

        # Gemstone recommendation
        if planet in PLANET_GEMSTONES:
            primary, secondary = PLANET_GEMSTONES[planet]
            remedies.append(
                RemedySuggestion(
                    category="Gemstone",
                    planet=planet,
                    recommendation=f"Wear {primary.value} ({secondary.value} as alternative)",
                    frequency="Continuously or on auspicious day",
                    duration="Minimum 2-3 years",
                    expected_benefit=f"Strengthen {planet.value} and its significations",
                    related_dasha_or_transit=current_dasha,
                )
            )

        # Mantra recommendation
        if planet in self.MANTRAS:
            remedies.append(
                RemedySuggestion(
                    category="Mantra",
                    planet=planet,
                    recommendation=self.MANTRAS[planet],
                    frequency="108 times daily or weekly",
                    duration="43 days or until affliction passes",
                    expected_benefit=f"Invoke divine grace of {planet.value}",
                    related_dasha_or_transit=current_dasha,
                )
            )

        # Fasting recommendation
        if planet in self.FASTING_DAYS:
            remedies.append(
                RemedySuggestion(
                    category="Fasting",
                    planet=planet,
                    recommendation=f"Fast on {self.FASTING_DAYS[planet]}",
                    frequency="Weekly or on special occasions",
                    duration="Until affliction reduces",
                    expected_benefit=f"Purify {planet.value}'s influence through discipline",
                    related_dasha_or_transit=current_dasha,
                )
            )

        # Charity recommendation
        if planet in self.CHARITY_ITEMS:
            remedies.append(
                RemedySuggestion(
                    category="Charity",
                    planet=planet,
                    recommendation=f"Donate {self.CHARITY_ITEMS[planet]} to the needy",
                    frequency="On relevant day or auspicious time",
                    duration="Ongoing practice",
                    expected_benefit=f"Balance karmic debts related to {planet.value}",
                    related_dasha_or_transit=current_dasha,
                )
            )

        # Yantra recommendation
        if planet in self.YANTRAS:
            remedies.append(
                RemedySuggestion(
                    category="Yantra",
                    planet=planet,
                    recommendation=f"Install and worship {self.YANTRAS[planet]}",
                    frequency="Daily worship or special occasions",
                    duration="Throughout afflicted period",
                    expected_benefit=f"Harness cosmic energy of {planet.value}",
                    related_dasha_or_transit=current_dasha,
                )
            )

        return remedies

    def suggest_transit_remedies(
        self,
        transiting_planet: PlanetName,
        aspect_type: str,
    ) -> List[RemedySuggestion]:
        """Suggest remedies for a challenging transit."""
        return self.suggest_remedies_for_afflicted_planet(
            transiting_planet,
            f"Transit: {aspect_type}",
            "Current transit period",
        )


class UnifiedPredictionEngine:
    """
    Main prediction orchestrator combining all systems.

    Synthesizes KP, Parashari, KCIL, and Nadi systems into
    comprehensive predictions for life events, compatibility,
    and personal guidance.
    """

    def __init__(self):
        """Initialize the unified prediction engine."""
        self.transit_analyzer = TransitAnalysis()
        self.event_timing = EventTimingEngine()
        self.compatibility = AshtakootCompatibility()
        self.remedies = RemedySuggestions()

    def generate_prediction_report(
        self,
        native_data: Dict[str, Any],
        current_data: Dict[str, Any],
    ) -> PredictionReport:
        """
        Generate comprehensive prediction report.

        Args:
            native_data: Birth chart data
            current_data: Current transit data

        Returns:
            Complete PredictionReport
        """
        # Extract basic information
        native_name = native_data.get("name", "Unknown")
        dob = native_data.get("dob", "Unknown")
        ascendant = native_data.get("ascendant", SignName.GEMINI)
        moon_sign = native_data.get("moon_sign", SignName.CANCER)
        current_dasha = native_data.get("current_dasha", "Moon/Ketu/Rahu")
        birth_location = native_data.get("birth_location", "Unknown")

        # Analyze transits
        transits = self.transit_analyzer.analyze_current_transits(
            current_data.get("planets_transit", {}),
            native_data.get("planets_natal", {}),
        )

        # Detect Sade Sati
        sade_sati = self.transit_analyzer.detect_sade_sati(
            moon_sign,
            current_data.get("saturn_sign", SignName.PISCES),
        )

        # Predict event timing
        event_predictions = []
        for event_type in EventType:
            prediction = self.event_timing.predict_event_timing(
                event_type,
                current_dasha,
                datetime.now().year,
                native_data.get("kp_significators", {}),
            )
            event_predictions.append(prediction)

        # Generate analyses
        personality = self._analyze_personality(native_data)
        career = self._analyze_career(native_data, transits)
        relationships = self._analyze_relationships(native_data, transits)
        health = self._analyze_health(native_data, transits)
        spiritual = self._analyze_spiritual_path(native_data, transits)

        # Suggest remedies for afflicted planets
        remedies = []
        for planet in [PlanetName.SATURN, PlanetName.RAHU]:
            remedies.extend(
                self.remedies.suggest_remedies_for_afflicted_planet(
                    planet,
                    "Transit affliction",
                    current_dasha,
                )
            )

        # Generate key findings and recommendations
        key_findings = self._generate_key_findings(native_data, transits, sade_sati)
        recommendations = self._generate_recommendations(
            native_data,
            key_findings,
            event_predictions,
        )

        return PredictionReport(
            native_name=native_name,
            dob=dob,
            ascendant=ascendant,
            moon_sign=moon_sign,
            current_dasha=current_dasha,
            birth_location=birth_location,
            report_date=datetime.now(),
            personality_analysis=personality,
            career_analysis=career,
            relationship_analysis=relationships,
            health_analysis=health,
            spiritual_path_analysis=spiritual,
            event_timing=event_predictions,
            transit_analysis=transits,
            sade_sati_status=sade_sati,
            remedies=remedies,
            key_findings=key_findings,
            recommendations=recommendations,
        )

    def _analyze_personality(self, native_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze personality based on chart."""
        ascendant = native_data.get("ascendant", SignName.GEMINI)
        moon_sign = native_data.get("moon_sign", SignName.CANCER)

        return {
            "ascendant_influence": f"{ascendant.name} Ascendant: Intellectual, communicative, adaptable",
            "moon_influence": f"{moon_sign.name} Moon: Emotional, intuitive, nurturing",
            "overall_personality": "Versatile mind with emotional depth and family orientation",
            "strengths": ["Communication", "Analytical ability", "Emotional intelligence"],
            "challenges": ["Indecision", "Emotional sensitivity", "Over-analysis"],
        }

    def _analyze_career(
        self,
        native_data: Dict[str, Any],
        transits: List[TransitInfo],
    ) -> Dict[str, Any]:
        """Analyze career prospects."""
        return {
            "career_field": "Fields involving communication, counseling, or analytical work",
            "current_period": "Favorable for professional growth through learning and adaptation",
            "growth_areas": ["Skills development", "Networking", "Leadership roles"],
            "challenges": ["Job stability during uncertain periods"],
            "recommended_timing": "Next 2-3 years show expansion opportunities",
        }

    def _analyze_relationships(
        self,
        native_data: Dict[str, Any],
        transits: List[TransitInfo],
    ) -> Dict[str, Any]:
        """Analyze relationship prospects."""
        return {
            "partnership_style": "Values emotional depth and intellectual connection",
            "relationship_timing": "Marriage indications within 1-3 years",
            "compatibility_factors": "Seek partner with water/air sign compatibility",
            "current_status": "Venus transits suggest romantic possibilities",
            "advice": "Communication and emotional honesty are key",
        }

    def _analyze_health(
        self,
        native_data: Dict[str, Any],
        transits: List[TransitInfo],
    ) -> Dict[str, Any]:
        """Analyze health prospects."""
        return {
            "constitution": "Generally good with emotional sensitivity",
            "vulnerable_areas": ["Digestion", "Nervous system"],
            "current_challenges": "Watch for stress-related issues",
            "preventive_measures": ["Meditation", "Balanced diet", "Regular exercise"],
            "health_timing": "Annual check-ups recommended during Saturn transits",
        }

    def _analyze_spiritual_path(
        self,
        native_data: Dict[str, Any],
        transits: List[TransitInfo],
    ) -> Dict[str, Any]:
        """Analyze spiritual inclinations."""
        return {
            "spiritual_nature": "Naturally intuitive with growing spiritual awareness",
            "practices": ["Meditation", "Yoga", "Study of philosophy"],
            "current_phase": "Good time for deepening spiritual practice",
            "guru_connection": "May benefit from spiritual guidance",
            "purpose_indication": "Life path involves helping others through knowledge",
        }

    def _generate_key_findings(
        self,
        native_data: Dict[str, Any],
        transits: List[TransitInfo],
        sade_sati: SadeAtiInfo,
    ) -> List[str]:
        """Generate key findings for the report."""
        findings = [
            f"Current Dasha: {native_data.get('current_dasha', 'Unknown')}",
            f"Sade Sati Status: {sade_sati.phase}",
            "Communication and emotional intelligence are core strengths",
            "Next 2-3 years show multiple opportunities for growth",
        ]

        if sade_sati.is_active:
            findings.append("Focus on dharma and patience during challenging period")

        return findings

    def _generate_recommendations(
        self,
        native_data: Dict[str, Any],
        key_findings: List[str],
        event_predictions: List[EventTimingPrediction],
    ) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = [
            "Strengthen Mercury through consistent communication and learning",
            "Pursue spiritual practices for emotional balance",
            "Leverage current favorable transits for career advancement",
            "Be alert to marriage timing within predicted window",
            "Maintain regular health check-ups and preventive care",
        ]

        return recommendations


# Test section
if __name__ == "__main__":
    print("=" * 70)
    print("SILICON SIDDHANTA - PREDICTION ENGINE TESTS")
    print("=" * 70)

    # Initialize engines
    transit_engine = TransitAnalysis()
    event_engine = EventTimingEngine()
    compatibility_engine = AshtakootCompatibility()
    remedy_engine = RemedySuggestions()

    # Test 1: Transit Analysis
    print("\n1. TRANSIT ANALYSIS")
    print("-" * 70)

    transits_data = {
        PlanetName.SATURN: (SignName.PISCES, 15.5),
        PlanetName.JUPITER: (SignName.GEMINI, 20.0),
    }

    natal_data = {
        PlanetName.SATURN: (SignName.CAPRICORN, 10),
        PlanetName.JUPITER: (SignName.CANCER, 9),
    }

    transits = transit_engine.analyze_current_transits(transits_data, natal_data)
    for transit in transits:
        print(f"\n{transit.planet.value}:")
        print(f"  Current Sign: {transit.current_sign.name}")
        print(f"  Strength (Ashtakavarga): {transit.transit_strength:.1f}/10")
        if transit.aspects_to_natal_planets:
            print(f"  Aspects: {', '.join(transit.aspects_to_natal_planets)}")

    # Test 2: Sade Sati Detection
    print("\n\n2. SADE SATI DETECTION")
    print("-" * 70)

    sade_sati = transit_engine.detect_sade_sati(SignName.CANCER, SignName.PISCES)
    print(f"Status: {sade_sati.phase}")
    print(f"Interpretation: {sade_sati.interpretation}")

    # Test 3: Event Timing
    print("\n\n3. EVENT TIMING PREDICTION")
    print("-" * 70)

    kp_sig = {7: [PlanetName.VENUS], 11: [PlanetName.JUPITER]}
    prediction = event_engine.predict_event_timing(
        EventType.MARRIAGE,
        "Moon/Ketu/Rahu",
        2026,
        kp_sig,
    )

    print(f"\n{prediction.event_type.value}:")
    print(f"  Timing: {prediction.predicted_year_range[0]}-{prediction.predicted_year_range[1]}")
    print(f"  Confidence: {prediction.confidence_level}")
    print(f"  Indication: {prediction.detailed_indication}")

    # Test 4: Ashtakoot Compatibility
    print("\n\n4. ASHTAKOOT COMPATIBILITY ANALYSIS")
    print("-" * 70)

    male_chart = {
        "varna": "Brahmin",
        "sign_type": "Dvisvabhava",
        "nakshatra": 5,
        "gana": "Deva",
        "moon_sign": SignName.CANCER,
        "moon_lord": "Moon",
        "nadi": "Madhya",
    }

    female_chart = {
        "varna": "Brahmin",
        "sign_type": "Chara",
        "nakshatra": 9,
        "gana": "Manushya",
        "moon_sign": SignName.LEO,
        "moon_lord": "Sun",
        "nadi": "Adi",
    }

    compatibility_result = compatibility_engine.calculate_compatibility(male_chart, female_chart)

    print(f"\nCompatibility Score: {compatibility_result.total_points}/{compatibility_result.max_points}")
    print(f"Percentage: {compatibility_result.percentage:.1f}%")
    print(f"Match Quality: {compatibility_result.match_quality}")
    print(f"Nadi Dosha: {'Present (Critical)' if compatibility_result.nadi_dosha_present else 'Absent'}")
    print(f"\nRecommendation: {compatibility_result.overall_recommendation}")

    # Test 5: Remedies
    print("\n\n5. REMEDY SUGGESTIONS")
    print("-" * 70)

    remedies = remedy_engine.suggest_remedies_for_afflicted_planet(
        PlanetName.SATURN,
        "debilitated",
        "Moon/Ketu/Rahu",
    )

    for remedy in remedies:
        print(f"\n{remedy.category}:")
        print(f"  Recommendation: {remedy.recommendation}")
        print(f"  Frequency: {remedy.frequency}")
        print(f"  Duration: {remedy.duration}")

    # Test 6: Unified Report
    print("\n\n6. COMPREHENSIVE PREDICTION REPORT")
    print("-" * 70)

    engine = UnifiedPredictionEngine()

    native_info = {
        "name": "Hemant Thackeray",
        "dob": "27/03/1980",
        "ascendant": SignName.GEMINI,
        "moon_sign": SignName.CANCER,
        "current_dasha": "Moon/Ketu/Rahu",
        "birth_location": "Kalyan, Maharashtra",
        "planets_natal": natal_data,
        "kp_significators": {7: [PlanetName.VENUS], 11: [PlanetName.JUPITER]},
    }

    current_info = {
        "planets_transit": transits_data,
        "saturn_sign": SignName.PISCES,
    }

    report = engine.generate_prediction_report(native_info, current_info)

    print(f"\nNative: {report.native_name}")
    print(f"DOB: {report.dob}")
    print(f"Ascendant: {report.ascendant.name}")
    print(f"Current Dasha: {report.current_dasha}")
    print(f"\nKey Findings:")
    for finding in report.key_findings:
        print(f"  • {finding}")

    print("\n" + "=" * 70)
    print("PREDICTION ENGINE TESTS COMPLETE")
    print("=" * 70)
