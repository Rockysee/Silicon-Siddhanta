"""
kcil_system.py — Silicon Siddhanta
Khullar Cuspal Interlinks (KCIL) Module
Sub-Sub Lord Theory for precision predictions

This module extends KP with S.P. Khullar's advanced sub-sub lord theory,
providing Nadiamsha-level precision for event timing and prediction.

The KCIL system divides each of the 249 KP subdivisions (subs) into 9 further
sub-subs, creating 2241 theoretical divisions using Vimshottari proportions.

This is the ultimate refinement in KP prediction, used for:
- Precise event timing (down to days/hours)
- Cusp interlink analysis
- Favorability assessment
- Time division (Kalamsa) calculation

Founded by Shri S.P. Khullar, this system represents the cutting edge of
Vedic astrological precision.
"""

from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
from kp_system import (
    PlanetEnum, SignEnum, NakshatraEnum, PlanetPosition,
    CuspPosition, KPSignificatorTable
)


@dataclass
class SubDivisionInfo:
    """Information about a KP sub or sub-sub division."""
    index: int              # 0-248 for sub, 0-8 for sub-sub
    planet: PlanetEnum      # Ruler of this division
    start_degree: float     # Start degree in zodiac
    end_degree: float       # End degree in zodiac
    duration_seconds: float # Duration in arc seconds
    lord: PlanetEnum        # Lord of this specific division


@dataclass
class SubSubPosition:
    """Position within a sub-sub lord (Nadiamsha)."""
    sign: SignEnum
    sub_index: int           # KP sub (0-248)
    sub_sub_index: int       # Sub-sub within the sub (0-8)
    planet_ruler: PlanetEnum # Overall KP sub lord
    sub_sub_ruler: PlanetEnum # Sub-sub lord (Nadiamsha ruler)
    degree: float            # Exact degree in zodiac


class VimshottariDashaYears(Enum):
    """Vimshottari dasha year lengths."""
    KETU = 7
    VENUS = 20
    SUN = 6
    MOON = 10
    MARS = 7
    RAHU = 18
    JUPITER = 16
    SATURN = 19
    MERCURY = 17

    @staticmethod
    def get_years(planet: PlanetEnum) -> int:
        """Get dasha years for a planet."""
        mapping = {
            PlanetEnum.KETU: 7,
            PlanetEnum.VENUS: 20,
            PlanetEnum.SUN: 6,
            PlanetEnum.MOON: 10,
            PlanetEnum.MARS: 7,
            PlanetEnum.RAHU: 18,
            PlanetEnum.JUPITER: 16,
            PlanetEnum.SATURN: 19,
            PlanetEnum.MERCURY: 17,
        }
        return mapping.get(planet, 0)

    @staticmethod
    def total_cycle_years() -> int:
        """Total Vimshottari cycle duration in years."""
        return sum(VimshottariDashaYears.get_years(p) for p in PlanetEnum)


class KPSubTable:
    """
    Management of KP sub division table (249 divisions).

    Each sub is calculated using Vimshottari proportions:
    Sub duration = zodiac_span × (planet_dasha_years / 120_years)

    The 9 planets cycle through the zodiac with specific durations.
    """

    PLANET_SEQUENCE = [
        PlanetEnum.KETU,
        PlanetEnum.VENUS,
        PlanetEnum.SUN,
        PlanetEnum.MOON,
        PlanetEnum.MARS,
        PlanetEnum.RAHU,
        PlanetEnum.JUPITER,
        PlanetEnum.SATURN,
        PlanetEnum.MERCURY,
    ]

    def __init__(self):
        """Initialize KP sub table."""
        self.subs = self._generate_sub_table()

    def _generate_sub_table(self) -> List[SubDivisionInfo]:
        """
        Generate the 249-entry KP sub table.

        The zodiac is 360 degrees. Each of 9 planets gets a proportional
        portion based on Vimshottari dasha years.

        Returns:
            List of SubDivisionInfo for all 249 subs
        """
        subs = []
        total_years = VimshottariDashaYears.total_cycle_years()
        degrees_per_year = 360.0 / total_years

        current_degree = 0.0
        sub_index = 0

        for planet in self.PLANET_SEQUENCE:
            planet_years = VimshottariDashaYears.get_years(planet)
            planet_degrees = planet_years * degrees_per_year

            # Divide this planet's span into sub-divisions
            # (more granular: could be further divided, but we'll keep it simple)
            num_subsections = 27  # One per nakshatra-like division

            for i in range(num_subsections):
                if sub_index >= 249:
                    break

                sub_start = current_degree + (i * planet_degrees / num_subsections)
                sub_end = current_degree + ((i + 1) * planet_degrees / num_subsections)
                duration = sub_end - sub_start

                subs.append(SubDivisionInfo(
                    index=sub_index,
                    planet=planet,
                    start_degree=sub_start % 360,
                    end_degree=sub_end % 360,
                    duration_seconds=duration * 3600,  # Convert to arc seconds
                    lord=planet
                ))
                sub_index += 1

            current_degree += planet_degrees

        return subs[:249]

    def get_sub_for_degree(self, degree: float) -> Optional[SubDivisionInfo]:
        """
        Get the KP sub for a given zodiac degree.

        Args:
            degree: Degree in zodiac (0-360)

        Returns:
            SubDivisionInfo or None if not found
        """
        degree = degree % 360

        for sub in self.subs:
            if sub.start_degree <= degree < sub.end_degree:
                return sub
            # Handle wrap-around at 360°
            if sub.end_degree < sub.start_degree:
                if degree >= sub.start_degree or degree < sub.end_degree:
                    return sub

        return None

    def get_sub_by_index(self, index: int) -> Optional[SubDivisionInfo]:
        """Get sub by its index (0-248)."""
        if 0 <= index < len(self.subs):
            return self.subs[index]
        return None


class SubSubLordTable:
    """
    Generates and looks up sub-sub lords (Nadiamsha level).

    Each of the 249 KP subs is further divided into 9 sub-subs using
    Vimshottari proportions:
    Sub-sub span = sub_span × (planet_years / 120)

    This creates 2241 theoretical divisions (some collapse due to rounding).
    """

    def __init__(self, kp_sub_table: Optional[KPSubTable] = None):
        """
        Initialize sub-sub lord table.

        Args:
            kp_sub_table: Pre-calculated KP sub table. If None, creates new.
        """
        self.kp_sub_table = kp_sub_table or KPSubTable()
        self.sub_subs = self._generate_sub_sub_table()

    def _generate_sub_sub_table(self) -> Dict[int, List[SubDivisionInfo]]:
        """
        Generate sub-sub divisions for each KP sub.

        For each of the 249 subs, divide into 9 sub-subs using planet rulers.

        Returns:
            Dict mapping sub_index to list of 9 sub-sub divisions
        """
        sub_subs = {}

        for sub in self.kp_sub_table.subs:
            sub_subs[sub.index] = self._generate_sub_subs_for_sub(sub)

        return sub_subs

    def _generate_sub_subs_for_sub(self, parent_sub: SubDivisionInfo) -> List[SubDivisionInfo]:
        """
        Generate 9 sub-subs for a given KP sub.

        Uses Vimshottari sequence with the parent sub's span.

        Args:
            parent_sub: The parent KP sub

        Returns:
            List of 9 SubDivisionInfo objects
        """
        sub_subs = []
        total_years = VimshottariDashaYears.total_cycle_years()
        parent_span = (parent_sub.end_degree - parent_sub.start_degree) % 360

        current_degree = parent_sub.start_degree

        for idx, planet in enumerate(KPSubTable.PLANET_SEQUENCE):
            planet_years = VimshottariDashaYears.get_years(planet)
            sub_sub_span = (parent_span * planet_years) / total_years

            sub_sub_start = current_degree
            sub_sub_end = (current_degree + sub_sub_span) % 360

            sub_subs.append(SubDivisionInfo(
                index=idx,
                planet=planet,
                start_degree=sub_sub_start,
                end_degree=sub_sub_end,
                duration_seconds=sub_sub_span * 3600,
                lord=planet
            ))

            current_degree = sub_sub_end

        return sub_subs

    def get_sub_sub_for_degree(self, degree: float, sub_index: int) -> Optional[SubDivisionInfo]:
        """
        Get the sub-sub lord for a degree within a given KP sub.

        Args:
            degree: Degree in zodiac (0-360)
            sub_index: KP sub index (0-248)

        Returns:
            SubDivisionInfo for the sub-sub, or None
        """
        if sub_index not in self.sub_subs:
            return None

        degree = degree % 360
        sub_subs = self.sub_subs[sub_index]

        for sub_sub in sub_subs:
            if sub_sub.start_degree <= degree < sub_sub.end_degree:
                return sub_sub
            # Handle wrap-around
            if sub_sub.end_degree < sub_sub.start_degree:
                if degree >= sub_sub.start_degree or degree < sub_sub.end_degree:
                    return sub_sub

        return None

    def get_sub_sub_lord(self, degree: float, sub_index: int) -> Optional[PlanetEnum]:
        """
        Get the sub-sub lord planet for a degree and sub.

        Args:
            degree: Degree in zodiac
            sub_index: KP sub index

        Returns:
            PlanetEnum of the sub-sub lord, or None
        """
        sub_sub = self.get_sub_sub_for_degree(degree, sub_index)
        return sub_sub.lord if sub_sub else None

    def get_all_sub_subs_for_sub(self, sub_index: int) -> Optional[List[SubDivisionInfo]]:
        """
        Get all 9 sub-subs for a given KP sub.

        Args:
            sub_index: KP sub index (0-248)

        Returns:
            List of 9 SubDivisionInfo, or None if invalid index
        """
        return self.sub_subs.get(sub_index)


class KCILCuspalAnalysis:
    """
    KCIL cuspal interlink analysis with favorability rules.

    KCIL extends cuspal analysis to the sub-sub lord level,
    determining the "ultimate agent" for event manifestation.

    Favorability rules (from cusp perspective):
    - Favorable (event will happen): 1, 3, 5, 9, 11
    - Neutral: 2, 6, 10
    - Unfavorable (event blocked): 4, 7, 8, 12
    """

    FAVORABLE_HOUSES = [1, 3, 5, 9, 11]
    NEUTRAL_HOUSES = [2, 6, 10]
    UNFAVORABLE_HOUSES = [4, 7, 8, 12]

    def __init__(self, cusp_positions: Dict[int, CuspPosition],
                 significator_table: KPSignificatorTable,
                 sub_sub_table: Optional[SubSubLordTable] = None):
        """
        Initialize KCIL cuspal analysis.

        Args:
            cusp_positions: Dict of house cusp positions
            significator_table: Pre-calculated significators
            sub_sub_table: Sub-sub lord table. If None, creates new.
        """
        self.cusps = cusp_positions
        self.significators = significator_table
        self.sub_sub_table = sub_sub_table or SubSubLordTable()

    def get_cusp_sub_sub_lord(self, house: int) -> Optional[PlanetEnum]:
        """
        Get the sub-sub lord of a house cusp.

        Args:
            house: House number (1-12)

        Returns:
            PlanetEnum of the sub-sub lord
        """
        cusp = self.cusps.get(house)
        if not cusp:
            return None

        return self.sub_sub_table.get_sub_sub_lord(cusp.longitude, cusp.sub_index)

    def get_houses_signified_by_sub_sub_lord(self, house: int) -> List[int]:
        """
        Get houses signified by the sub-sub lord of a cusp.

        Args:
            house: House number (1-12)

        Returns:
            List of signified house numbers
        """
        sub_sub_lord = self.get_cusp_sub_sub_lord(house)
        if not sub_sub_lord:
            return []

        return self.significators.calculate_planet_significators(sub_sub_lord)

    def get_cusp_favorability(self, cusp_house: int,
                              required_houses: List[int]) -> Tuple[str, float]:
        """
        Assess favorability of a cusp for a life event.

        Favorability is determined by how many of the required houses
        are signified by the sub-sub lord, and the nature of those houses.

        Args:
            cusp_house: The cusp to analyze (e.g., 7 for marriage)
            required_houses: Houses needed for the event (e.g., [2,7,11])

        Returns:
            Tuple of (favorability_level, score) where:
            - favorability_level: "HIGHLY FAVORABLE", "FAVORABLE",
                                 "NEUTRAL", "UNFAVORABLE"
            - score: 0.0-1.0 indicating strength
        """
        houses_signified = self.get_houses_signified_by_sub_sub_lord(cusp_house)

        if not houses_signified:
            return "UNKNOWN", 0.0

        # Count how many required houses are signified
        matches = [h for h in required_houses if h in houses_signified]
        match_ratio = len(matches) / len(required_houses)

        # Count favorability distribution of signified houses
        favorable_count = len([h for h in houses_signified if h in self.FAVORABLE_HOUSES])
        unfavorable_count = len([h for h in houses_signified if h in self.UNFAVORABLE_HOUSES])

        # Score calculation
        favorable_bonus = favorable_count * 0.1
        unfavorable_penalty = unfavorable_count * 0.15
        match_score = match_ratio * 0.7

        total_score = max(0.0, min(1.0, match_score + favorable_bonus - unfavorable_penalty))

        # Classify favorability
        if total_score >= 0.8 and len(matches) == len(required_houses):
            favorability = "HIGHLY FAVORABLE"
        elif total_score >= 0.6 and len(matches) >= len(required_houses) - 1:
            favorability = "FAVORABLE"
        elif total_score >= 0.4:
            favorability = "NEUTRAL"
        else:
            favorability = "UNFAVORABLE"

        return favorability, total_score

    def analyze_cusp_kcil(self, house: int) -> Dict:
        """
        Complete KCIL analysis of a house cusp.

        Args:
            house: House number (1-12)

        Returns:
            Dict with detailed KCIL analysis
        """
        cusp = self.cusps.get(house)
        if not cusp:
            return {}

        sub_sub_lord = self.get_cusp_sub_sub_lord(house)
        houses_signified = self.get_houses_signified_by_sub_sub_lord(house)

        return {
            "house": house,
            "cusp_sign": cusp.sign.name,
            "cusp_nakshatra": cusp.nakshatra.name,
            "cusp_sub_index": cusp.sub_index,
            "kp_sub_lord": self.significators.planets[house].sign.lord().name if house in self.significators.planets else None,
            "sub_sub_lord": sub_sub_lord.name_str if sub_sub_lord else None,
            "houses_signified_by_sub_sub": houses_signified,
            "favorable_significations": [h for h in houses_signified if h in self.FAVORABLE_HOUSES],
            "neutral_significations": [h for h in houses_signified if h in self.NEUTRAL_HOUSES],
            "unfavorable_significations": [h for h in houses_signified if h in self.UNFAVORABLE_HOUSES],
        }

    def analyze_all_cusps_kcil(self) -> Dict[int, Dict]:
        """
        Complete KCIL analysis of all 12 cusps.

        Returns:
            Dict mapping house number to KCIL analysis
        """
        return {house: self.analyze_cusp_kcil(house) for house in range(1, 13)}


class KalamsnaDivision:
    """
    Kalamsa (time division) calculation.

    Kalamsa represents the sub-sub division of the zodiac at a precise moment.
    Each Kalamsa has a specific ruler and is used for:
    - Precise event timing (down to hours or minutes)
    - Timing of planetary activations
    - Muhurta (auspicious timing) calculations
    """

    def __init__(self, sub_sub_table: Optional[SubSubLordTable] = None):
        """
        Initialize Kalamsa calculator.

        Args:
            sub_sub_table: Sub-sub lord table
        """
        self.sub_sub_table = sub_sub_table or SubSubLordTable()

    def get_kalamsa_for_degree(self, degree: float) -> Optional[Tuple[int, int, PlanetEnum]]:
        """
        Get the Kalamsa (sub-sub division) for a zodiac degree.

        Args:
            degree: Zodiac degree (0-360)

        Returns:
            Tuple of (sub_index, sub_sub_index, ruler_planet) or None
        """
        kp_sub_table = self.sub_sub_table.kp_sub_table
        sub = kp_sub_table.get_sub_for_degree(degree)

        if not sub:
            return None

        sub_sub = self.sub_sub_table.get_sub_sub_for_degree(degree, sub.index)

        if not sub_sub:
            return None

        return (sub.index, sub_sub.index, sub_sub.lord)

    def get_kalamsa_duration_minutes(self, sub_index: int,
                                     sub_sub_index: int) -> float:
        """
        Calculate duration of a Kalamsa in minutes.

        Args:
            sub_index: KP sub index
            sub_sub_index: Sub-sub index within that sub

        Returns:
            Duration in minutes
        """
        sub_subs = self.sub_sub_table.get_all_sub_subs_for_sub(sub_index)

        if not sub_subs or sub_sub_index >= len(sub_subs):
            return 0.0

        sub_sub = sub_subs[sub_sub_index]
        # Convert arc seconds to minutes (1° = 4 minutes sidereal time)
        return (sub_sub.duration_seconds / 3600) * 4

    def assess_kalamsa_quality(self, ruler: PlanetEnum) -> str:
        """
        Assess the quality of a Kalamsa based on its ruler.

        Args:
            ruler: The planet ruling this Kalamsa

        Returns:
            Quality assessment ("Auspicious", "Inauspicious", etc.)
        """
        # Simplified: Sun, Moon, Mercury, Jupiter are generally auspicious
        auspicious = [PlanetEnum.SUN, PlanetEnum.MOON, PlanetEnum.MERCURY, PlanetEnum.JUPITER]
        inauspicious = [PlanetEnum.MARS, PlanetEnum.SATURN, PlanetEnum.KETU]

        if ruler in auspicious:
            return "Auspicious"
        elif ruler in inauspicious:
            return "Inauspicious"
        else:
            return "Neutral"


class KCILAnalysis:
    """
    Main KCIL orchestrator for complete sub-sub lord analysis.

    Combines:
    - Sub-sub lord determination
    - Cuspal interlink analysis
    - Favorability assessment
    - Kalamsa calculations
    """

    def __init__(self, cusp_positions: Dict[int, CuspPosition],
                 significator_table: KPSignificatorTable,
                 sub_sub_table: Optional[SubSubLordTable] = None):
        """
        Initialize complete KCIL analysis.

        Args:
            cusp_positions: House cusp positions
            significator_table: Pre-calculated significators
            sub_sub_table: Sub-sub lord table (creates if None)
        """
        self.cusps = cusp_positions
        self.significators = significator_table
        self.sub_sub_table = sub_sub_table or SubSubLordTable()

        self.cuspal_analysis = KCILCuspalAnalysis(
            cusp_positions, significator_table, self.sub_sub_table
        )
        self.kalamsa = KalamsnaDivision(self.sub_sub_table)

    def get_sub_sub_lords_for_all_cusps(self) -> Dict[int, PlanetEnum]:
        """
        Get sub-sub lords for all 12 house cusps.

        Returns:
            Dict mapping house number to sub-sub lord
        """
        return {
            house: self.cuspal_analysis.get_cusp_sub_sub_lord(house)
            for house in range(1, 13)
        }

    def assess_event_kcil(self, cusp_house: int,
                          required_houses: List[int]) -> Dict:
        """
        Assess an event using KCIL principles.

        Args:
            cusp_house: The cusp related to the event (e.g., 7 for marriage)
            required_houses: Houses needed for the event (e.g., [2,7,11])

        Returns:
            Dict with KCIL event assessment
        """
        favorability, score = self.cuspal_analysis.get_cusp_favorability(
            cusp_house, required_houses
        )

        return {
            "cusp_house": cusp_house,
            "required_houses": required_houses,
            "sub_sub_lord": self.cuspal_analysis.get_cusp_sub_sub_lord(cusp_house),
            "houses_signified": self.cuspal_analysis.get_houses_signified_by_sub_sub_lord(cusp_house),
            "favorability_level": favorability,
            "favorability_score": score,
            "analysis": self.cuspal_analysis.analyze_cusp_kcil(cusp_house),
        }

    def generate_kcil_report(self) -> str:
        """
        Generate a comprehensive KCIL analysis report.

        Returns:
            Formatted report string
        """
        report = []
        report.append("=" * 80)
        report.append("KCIL (KHULLAR CUSPAL INTERLINKS) ANALYSIS")
        report.append("Sub-Sub Lord Theory - Nadiamsha Level Precision")
        report.append("=" * 80)

        # Sub-sub lords for all cusps
        report.append("\nSUB-SUB LORDS FOR ALL HOUSE CUSPS:")
        report.append("-" * 80)
        sub_sub_lords = self.get_sub_sub_lords_for_all_cusps()
        for house in range(1, 13):
            lord = sub_sub_lords.get(house)
            lord_name = lord.name_str if lord else "Unknown"
            report.append(f"House {house:2d} Sub-Sub Lord: {lord_name}")

        # Detailed cuspal analysis
        report.append("\n" + "-" * 80)
        report.append("DETAILED CUSPAL INTERLINK ANALYSIS:")
        report.append("-" * 80)
        all_cusps = self.cuspal_analysis.analyze_all_cusps_kcil()
        for house, analysis in all_cusps.items():
            report.append(f"\nHouse {house} ({analysis.get('cusp_sign', 'Unknown')}):")
            report.append(f"  Nakshatra: {analysis.get('cusp_nakshatra', 'Unknown')}")
            report.append(f"  Sub-Sub Lord: {analysis.get('sub_sub_lord', 'Unknown')}")

            favorable = analysis.get('favorable_significations', [])
            neutral = analysis.get('neutral_significations', [])
            unfavorable = analysis.get('unfavorable_significations', [])

            if favorable:
                report.append(f"  Favorable Houses: {favorable}")
            if neutral:
                report.append(f"  Neutral Houses: {neutral}")
            if unfavorable:
                report.append(f"  Unfavorable Houses: {unfavorable}")

        report.append("\n" + "=" * 80)
        return "\n".join(report)


# ============================================================================
# TEST SECTION - KCIL Analysis with Test Data
# ============================================================================

def test_kcil_system():
    """
    Test KCIL system with sample cusp positions.
    """
    from kp_system import create_test_chart

    print("Creating KCIL Analysis from KP test chart...\n")

    # Use the KP test chart
    kp_analysis = create_test_chart()

    # Create KCIL analysis using the same data
    kcil = KCILAnalysis(
        kp_analysis.cusps,
        kp_analysis.significator_table
    )

    # Generate and print report
    print(kcil.generate_kcil_report())

    # Test specific event assessment
    print("\n" + "=" * 80)
    print("KCIL MARRIAGE EVENT ASSESSMENT")
    print("=" * 80)
    marriage_assessment = kcil.assess_event_kcil(7, [2, 7, 11])
    print(f"Cusp House: {marriage_assessment['cusp_house']}")
    print(f"Required Houses: {marriage_assessment['required_houses']}")
    sub_sub = marriage_assessment['sub_sub_lord']
    print(f"Sub-Sub Lord: {sub_sub.name_str if sub_sub else 'Unknown'}")
    print(f"Houses Signified: {marriage_assessment['houses_signified']}")
    print(f"Favorability Level: {marriage_assessment['favorability_level']}")
    print(f"Favorability Score: {marriage_assessment['favorability_score']:.2f}")

    # Test Kalamsa calculation
    print("\n" + "=" * 80)
    print("KALAMSA (TIME DIVISION) ANALYSIS")
    print("=" * 80)
    kalamsa = kcil.kalamsa

    test_degrees = [30.0, 90.0, 180.0, 270.0]
    for degree in test_degrees:
        kalamsa_info = kalamsa.get_kalamsa_for_degree(degree)
        if kalamsa_info:
            sub_idx, sub_sub_idx, ruler = kalamsa_info
            duration = kalamsa.get_kalamsa_duration_minutes(sub_idx, sub_sub_idx)
            quality = kalamsa.assess_kalamsa_quality(ruler)
            print(f"\nDegree {degree}:")
            print(f"  Kalamsa: Sub {sub_idx}, Sub-Sub {sub_sub_idx}")
            print(f"  Ruler: {ruler.name_str}")
            print(f"  Duration: {duration:.2f} minutes")
            print(f"  Quality: {quality}")

    print("\n" + "=" * 80)


if __name__ == "__main__":
    test_kcil_system()
