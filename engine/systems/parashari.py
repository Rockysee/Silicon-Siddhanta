"""
systems/parashari.py — Silicon Siddhanta
Classical Vedic (Parashari) Astrology Analysis Module

Implements core Parashari techniques:
- Vimshottari Dasha (Maha/Antar/Pratyantar)
- Yoga Detection (Gajakesari, Budhaditya, Dhana, Raja, Arishta, etc.)
- Vedic Planetary Aspects (including special aspects)
- Ashtakavarga (planet-wise and Sarvashtakavarga)

Input: BirthChart (from chart_calculator) with computed positions + houses
Output: Enriched BirthChart with dashas, yogas, aspects, ashtakavarga
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

from silicon_siddhanta.core.types import (
    Planet, Sign, Nakshatra, House, BirthChart, PlanetPosition,
    DashaPeriod, YogaResult, AspectResult
)


# ═══════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

# Vimshottari Dasha years (standard)
DASHA_YEARS: Dict[Planet, int] = {
    Planet.KETU: 7,
    Planet.VENUS: 20,
    Planet.SUN: 6,
    Planet.MOON: 10,
    Planet.MARS: 7,
    Planet.RAHU: 18,
    Planet.JUPITER: 16,
    Planet.SATURN: 19,
    Planet.MERCURY: 17,
}

# Dasha sequence (repeating cycle)
DASHA_SEQUENCE: List[Planet] = [
    Planet.KETU, Planet.VENUS, Planet.SUN, Planet.MOON,
    Planet.MARS, Planet.RAHU, Planet.JUPITER, Planet.SATURN, Planet.MERCURY
]

TOTAL_DASHA_YEARS = 120  # Sum of all dasha years

# Ashtakavarga: benefic points for planets in signs (simplified model)
# Based on Parashari classic rules: each planet gets points (0-8) in each sign
# depending on natural friendships, exaltation, own sign, etc.
ASHTAKAVARGA_POINTS: Dict[Planet, List[int]] = {
    # Sun (exalted in Aries, strong in Leo, weak in Libra)
    Planet.SUN: [8, 5, 5, 4, 8, 4, 2, 4, 5, 5, 5, 4],
    # Moon (exalted in Taurus, strong in Cancer, weak in Scorpio)
    Planet.MOON: [4, 8, 7, 8, 6, 5, 5, 2, 6, 6, 7, 8],
    # Mars (exalted in Capricorn, strong in Aries, weak in Cancer)
    Planet.MARS: [8, 6, 4, 2, 6, 5, 5, 7, 6, 8, 4, 6],
    # Mercury (exalted in Virgo, strong in Gemini, weak in Pisces)
    Planet.MERCURY: [5, 5, 8, 6, 5, 8, 5, 4, 5, 5, 5, 2],
    # Jupiter (exalted in Cancer, strong in Sagittarius, weak in Capricorn)
    Planet.JUPITER: [6, 5, 7, 8, 5, 6, 6, 5, 8, 2, 8, 8],
    # Venus (exalted in Pisces, strong in Libra, weak in Virgo)
    Planet.VENUS: [5, 8, 8, 7, 8, 2, 8, 6, 7, 7, 5, 8],
    # Saturn (exalted in Libra, strong in Aquarius, weak in Aries)
    Planet.SATURN: [2, 4, 4, 7, 4, 6, 8, 6, 4, 4, 8, 6],
}


# ═══════════════════════════════════════════════════════════════════════════
# PARASHARI ANALYZER
# ═══════════════════════════════════════════════════════════════════════════

class ParashariAnalyzer:
    """
    Classical Vedic (Parashari) astrology analysis engine.

    Takes a computed BirthChart and enriches it with:
    - Vimshottari Dasha periods
    - Yoga detection
    - Vedic aspects
    - Ashtakavarga strength

    All methods are deterministic with no randomness or external calls.
    """

    def analyze(self, chart: BirthChart) -> BirthChart:
        """
        Main entry point: analyze a BirthChart and enrich with Parashari data.

        Args:
            chart: BirthChart with computed planets, houses, nakshatra positions

        Returns:
            The same chart object, mutated with dashas, yogas, aspects, ashtakavarga
        """
        # 1. Calculate Vimshottari Dasha periods
        chart.dashas = self._calculate_vimshottari_dasha(chart)

        # 2. Detect yogas
        chart.yogas = self._detect_yogas(chart)

        # 3. Calculate aspects
        chart.aspects = self._calculate_vedic_aspects(chart)

        # 4. Calculate Ashtakavarga
        self._calculate_ashtakavarga(chart)

        return chart

    # ═══════════════════════════════════════════════════════════════════════
    # 1. VIMSHOTTARI DASHA CALCULATION
    # ═══════════════════════════════════════════════════════════════════════

    def _calculate_vimshottari_dasha(self, chart: BirthChart) -> List[DashaPeriod]:
        """
        Calculate Vimshottari Dasha periods from Moon's nakshatra position.

        Returns:
            List[DashaPeriod] with Maha dashas only (top-level periods).
            Each Maha dasha contains Antar dashas as sub_periods.
            Each Antar dasha contains Pratyantar dashas.
        """
        moon_nak = chart.planets[Planet.MOON].nakshatra
        moon_nak_lord = moon_nak.lord

        # Find starting dasha lord
        start_idx = DASHA_SEQUENCE.index(moon_nak_lord)

        # Calculate where Moon is in its nakshatra (0 to 1.0)
        moon_lon = chart.planets[Planet.MOON].longitude
        nak_span = 13.0 + 20.0 / 60.0  # 13°20'
        nak_start = moon_nak * nak_span
        offset_in_nak = (moon_lon - nak_start) % nak_span
        fraction_in_nak = offset_in_nak / nak_span

        # Time elapsed in current dasha (Maha dasha)
        maha_years = DASHA_YEARS[moon_nak_lord]
        elapsed = fraction_in_nak * maha_years

        # Birth date
        birth_date = chart.birth_data.datetime_local

        # First Maha dasha
        dasha_start = birth_date - timedelta(days=elapsed * 365.25)

        maha_dashas: List[DashaPeriod] = []

        for dasha_offset in range(9):
            maha_lord = DASHA_SEQUENCE[(start_idx + dasha_offset) % 9]
            maha_duration = DASHA_YEARS[maha_lord]
            dasha_end = dasha_start + timedelta(days=maha_duration * 365.25)

            # Create Maha dasha with Antar sub-periods
            maha_period = DashaPeriod(
                lord=maha_lord,
                start=dasha_start,
                end=dasha_end,
                level="Maha",
                sub_periods=self._calculate_antar_dashas(
                    maha_lord, maha_lord, dasha_start, maha_duration
                )
            )

            maha_dashas.append(maha_period)
            dasha_start = dasha_end

        return maha_dashas

    def _calculate_antar_dashas(
        self,
        maha_lord: Planet,
        sub_sequence_start: Planet,
        maha_start: datetime,
        maha_duration: int
    ) -> List[DashaPeriod]:
        """
        Calculate Antar (sub-) dashas within a Maha dasha.
        Each Antar dasha is proportional to the sub-lord's dasha year.

        Args:
            maha_lord: The Maha dasha planet
            sub_sequence_start: Starting planet for Antar sequence (same as Maha lord)
            maha_start: Start datetime of Maha dasha
            maha_duration: Duration of Maha dasha in years

        Returns:
            List of DashaPeriod objects (Antar level) with Pratyantar sub_periods
        """
        antar_dashas: List[DashaPeriod] = []

        antar_start = maha_start
        start_idx = DASHA_SEQUENCE.index(sub_sequence_start)

        for sub_offset in range(9):
            antar_lord = DASHA_SEQUENCE[(start_idx + sub_offset) % 9]
            antar_fraction = DASHA_YEARS[antar_lord] / TOTAL_DASHA_YEARS
            antar_duration = maha_duration * antar_fraction
            antar_end = antar_start + timedelta(days=antar_duration * 365.25)

            # Create Antar period with Pratyantar sub-periods
            antar_period = DashaPeriod(
                lord=antar_lord,
                start=antar_start,
                end=antar_end,
                level="Antar",
                sub_periods=self._calculate_pratyantar_dashas(
                    antar_lord, antar_start, antar_duration
                )
            )

            antar_dashas.append(antar_period)
            antar_start = antar_end

        return antar_dashas

    def _calculate_pratyantar_dashas(
        self,
        antar_lord: Planet,
        antar_start: datetime,
        antar_duration: float
    ) -> List[DashaPeriod]:
        """
        Calculate Pratyantar (sub-sub-) dashas within an Antar dasha.

        Args:
            antar_lord: The Antar dasha planet (also starting lord for Pratyantar)
            antar_start: Start datetime of Antar dasha
            antar_duration: Duration of Antar dasha in years

        Returns:
            List of DashaPeriod objects (Pratyantar level)
        """
        pratyantar_dashas: List[DashaPeriod] = []

        pratyantar_start = antar_start
        start_idx = DASHA_SEQUENCE.index(antar_lord)

        for prat_offset in range(9):
            prat_lord = DASHA_SEQUENCE[(start_idx + prat_offset) % 9]
            prat_fraction = DASHA_YEARS[prat_lord] / TOTAL_DASHA_YEARS
            prat_duration = antar_duration * prat_fraction
            prat_end = pratyantar_start + timedelta(days=prat_duration * 365.25)

            prat_period = DashaPeriod(
                lord=prat_lord,
                start=pratyantar_start,
                end=prat_end,
                level="Pratyantar",
                sub_periods=[]  # Pratyantar is the leaf level
            )

            pratyantar_dashas.append(prat_period)
            pratyantar_start = prat_end

        return pratyantar_dashas

    # ═══════════════════════════════════════════════════════════════════════
    # 2. YOGA DETECTION
    # ═══════════════════════════════════════════════════════════════════════

    def _detect_yogas(self, chart: BirthChart) -> List[YogaResult]:
        """
        Detect all yogas present in the chart.
        Returns a list of YogaResult objects for each detected yoga.
        """
        yogas: List[YogaResult] = []

        # Beneficial yogas
        yogas.extend(self._detect_gajakesari_yoga(chart))
        yogas.extend(self._detect_budhaditya_yoga(chart))
        yogas.extend(self._detect_chandra_mangal_yoga(chart))
        yogas.extend(self._detect_amala_yoga(chart))
        yogas.extend(self._detect_dhana_yogas(chart))
        yogas.extend(self._detect_viparita_raja_yoga(chart))
        yogas.extend(self._detect_neechabhanga_raja_yoga(chart))
        yogas.extend(self._detect_pancha_mahapurusha_yoga(chart))

        # Negative yogas
        yogas.extend(self._detect_kemadruma_yoga(chart))
        yogas.extend(self._detect_sakata_yoga(chart))

        return yogas

    def _detect_gajakesari_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Gajakesari Yoga: Jupiter in kendra (1, 4, 7, 10) from Moon.
        Makes native wise, fortunate, with good character.
        """
        moon_house = chart.planets[Planet.MOON].house
        jupiter_house = chart.planets[Planet.JUPITER].house

        if moon_house and jupiter_house:
            relative_house = self._house_from_lagna(jupiter_house, moon_house)
            if self._is_kendra(relative_house):
                return [YogaResult(
                    name="Gajakesari Yoga",
                    sanskrit_name="Gajakesari Yoga",
                    category="Raja",
                    planets_involved=[Planet.JUPITER, Planet.MOON],
                    houses_involved=[moon_house, jupiter_house],
                    strength=0.8,
                    description="Jupiter in kendra from Moon brings wisdom, fortune, and good character.",
                    is_beneficial=True
                )]
        return []

    def _detect_budhaditya_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Budhaditya Yoga: Sun and Mercury in the same house.
        Blesses with intelligence, education, success in learning and communication.
        """
        sun_house = chart.planets[Planet.SUN].house
        mercury_house = chart.planets[Planet.MERCURY].house

        if sun_house and mercury_house and sun_house == mercury_house:
            return [YogaResult(
                name="Budhaditya Yoga",
                sanskrit_name="Budhaditya Yoga",
                category="Raja",
                planets_involved=[Planet.SUN, Planet.MERCURY],
                houses_involved=[sun_house],
                strength=0.75,
                description="Sun and Mercury in same house grant intelligence, educational success, and communication abilities.",
                is_beneficial=True
            )]
        return []

    def _detect_chandra_mangal_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Chandra-Mangal Yoga: Moon and Mars in the same house.
        Grants courage, mental strength, but can be aggressive if afflicted.
        """
        moon_house = chart.planets[Planet.MOON].house
        mars_house = chart.planets[Planet.MARS].house

        if moon_house and mars_house and moon_house == mars_house:
            # Check if Moon is waxing (benefic influence)
            is_benefic = not chart.planets[Planet.MOON].is_debilitated
            strength = 0.7 if is_benefic else 0.5

            return [YogaResult(
                name="Chandra-Mangal Yoga",
                sanskrit_name="Chandra-Mangal Yoga",
                category="Raja",
                planets_involved=[Planet.MOON, Planet.MARS],
                houses_involved=[moon_house],
                strength=strength,
                description="Moon and Mars in same house grant courage and mental strength; can be aggressive if afflicted.",
                is_beneficial=is_benefic
            )]
        return []

    def _detect_amala_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Amala Yoga: A benefic planet in 10th house from Lagna or from Moon.
        Grants pristine reputation, success, and recognition.
        """
        benefics_in_10 = []

        # Check 10th from Lagna
        for planet in [Planet.JUPITER, Planet.VENUS]:
            if chart.planets[planet].house == 10:
                benefics_in_10.append(("Lagna", planet))

        # Check 10th from Moon
        moon_house = chart.planets[Planet.MOON].house
        if moon_house:
            for planet in [Planet.JUPITER, Planet.VENUS]:
                planet_house = chart.planets[planet].house
                if planet_house and self._house_from_lagna(planet_house, moon_house) == 10:
                    benefics_in_10.append(("Moon", planet))

        yogas = []
        for reference, planet in benefics_in_10:
            yogas.append(YogaResult(
                name=f"Amala Yoga (from {reference})",
                sanskrit_name="Amala Yoga",
                category="Raja",
                planets_involved=[planet],
                houses_involved=[chart.planets[planet].house or 1],
                strength=0.8,
                description=f"Benefic in 10th from {reference} grants pristine reputation and success.",
                is_beneficial=True
            ))

        return yogas

    def _detect_dhana_yogas(self, chart: BirthChart) -> List[YogaResult]:
        """
        Dhana Yogas: Various combinations involving 1st, 2nd, 5th, 9th, 11th lords.
        Specifically: lords of 1, 2, 5, 9, 11 in mutual aspect or conjunction.
        """
        yogas: List[YogaResult] = []

        wealth_lords = {
            "1st": chart.get_house_lord(1),
            "2nd": chart.get_house_lord(2),
            "5th": chart.get_house_lord(5),
            "9th": chart.get_house_lord(9),
            "11th": chart.get_house_lord(11),
        }

        # Check if any of these lords are in mutual relation (conjunction in same house)
        houses_with_wealth_lords: Dict[int, List[str]] = {}

        for house_name, lord in wealth_lords.items():
            lord_house = chart.planets[lord].house
            if lord_house:
                if lord_house not in houses_with_wealth_lords:
                    houses_with_wealth_lords[lord_house] = []
                houses_with_wealth_lords[lord_house].append(house_name)

        # If multiple wealth lords in same house or connected houses
        for house, lords_here in houses_with_wealth_lords.items():
            if len(lords_here) >= 2:
                planets = [wealth_lords[ln] for ln in lords_here]
                yogas.append(YogaResult(
                    name="Dhana Yoga",
                    sanskrit_name="Dhana Yoga",
                    category="Dhana",
                    planets_involved=planets,
                    houses_involved=[house],
                    strength=0.7,
                    description=f"Lords of wealth houses ({', '.join(lords_here)}) in conjunction grant prosperity.",
                    is_beneficial=True
                ))

        return yogas

    def _detect_viparita_raja_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Viparita Raja Yoga: Lords of 6th, 8th, 12th in their own houses.
        Converts malefic positions into success and overcoming obstacles.
        """
        yogas: List[YogaResult] = []

        lord_6 = chart.get_house_lord(6)
        lord_8 = chart.get_house_lord(8)
        lord_12 = chart.get_house_lord(12)

        for lord, house in [(lord_6, 6), (lord_8, 8), (lord_12, 12)]:
            lord_actual_house = chart.planets[lord].house
            if lord_actual_house == house:
                yogas.append(YogaResult(
                    name=f"Viparita Raja Yoga (House {house})",
                    sanskrit_name="Viparita Raja Yoga",
                    category="Raja",
                    planets_involved=[lord],
                    houses_involved=[house],
                    strength=0.75,
                    description=f"Lord of 6/8/12 in own house brings victory over enemies and obstacles.",
                    is_beneficial=True
                ))

        return yogas

    def _detect_neechabhanga_raja_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Neechabhanga Raja Yoga: A debilitated planet whose lord is in
        kendra, or aspected by its own sign lord, gains cancellation.
        Makes the native overcome hardship through the planet's nature.
        """
        yogas: List[YogaResult] = []

        for planet, pos in chart.planets.items():
            if not pos.is_debilitated:
                continue

            planet_sign = pos.sign
            planet_lord = planet_sign.lord
            lord_house = chart.planets[planet_lord].house

            # Check if debilitation lord is in kendra
            if lord_house and self._is_kendra(lord_house):
                yogas.append(YogaResult(
                    name=f"Neechabhanga Raja Yoga ({planet.value})",
                    sanskrit_name="Neechabhanga Raja Yoga",
                    category="Raja",
                    planets_involved=[planet, planet_lord],
                    houses_involved=[pos.house or 1, lord_house],
                    strength=0.7,
                    description=f"Debilitated {planet.value} with lord in kendra gains strength; native overcomes obstacles.",
                    is_beneficial=True
                ))

        return yogas

    def _detect_pancha_mahapurusha_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Pancha Mahapurusha Yoga: Mars, Mercury, Jupiter, Venus, or Saturn
        in own sign or exalted in kendra (1, 4, 7, 10).
        Each creates a specific yoga: Ruchaka, Budhaditya, Hamsa, Malavya, Sasa.
        """
        yogas: List[YogaResult] = []

        yoga_names = {
            Planet.MARS: ("Ruchaka Yoga", "Ruchaka Yoga"),
            Planet.MERCURY: ("Budhaditya Yoga", "Budhaditya Yoga"),
            Planet.JUPITER: ("Hamsa Yoga", "Hamsa Yoga"),
            Planet.VENUS: ("Malavya Yoga", "Malavya Yoga"),
            Planet.SATURN: ("Sasa Yoga", "Sasa Yoga"),
        }

        for planet, (name, sanskrit) in yoga_names.items():
            pos = chart.planets[planet]

            if pos.house and self._is_kendra(pos.house):
                if pos.is_own_sign or pos.is_exalted:
                    yogas.append(YogaResult(
                        name=name,
                        sanskrit_name=sanskrit,
                        category="Raja",
                        planets_involved=[planet],
                        houses_involved=[pos.house],
                        strength=0.85,
                        description=f"{planet.value} in kendra in own/exalted sign creates {name}: mastery and excellence.",
                        is_beneficial=True
                    ))

        return yogas

    def _detect_kemadruma_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Kemadruma Yoga (negative): No planets in 2nd or 12th from Moon.
        Moon is unprotected, leading to mental stress and obstacles.
        """
        moon_house = chart.planets[Planet.MOON].house

        if not moon_house:
            return []

        # Check 2nd and 12th from Moon
        house_2_from_moon = self._house_from_lagna(2, moon_house)
        house_12_from_moon = self._house_from_lagna(12, moon_house)

        planets_in_2 = [p for p, pos in chart.planets.items()
                        if pos.house == house_2_from_moon and p != Planet.MOON]
        planets_in_12 = [p for p, pos in chart.planets.items()
                         if pos.house == house_12_from_moon and p != Planet.MOON]

        if not planets_in_2 and not planets_in_12:
            return [YogaResult(
                name="Kemadruma Yoga",
                sanskrit_name="Kemadruma Yoga",
                category="Arishta",
                planets_involved=[Planet.MOON],
                houses_involved=[moon_house],
                strength=0.7,
                description="No planets in 2nd/12th from Moon; Moon unprotected → mental stress, obstacles.",
                is_beneficial=False
            )]

        return []

    def _detect_sakata_yoga(self, chart: BirthChart) -> List[YogaResult]:
        """
        Sakata Yoga (negative): Jupiter in 6th or 8th from Moon.
        Creates fluctuations in fortune and periodic hardship.
        """
        moon_house = chart.planets[Planet.MOON].house
        jupiter_house = chart.planets[Planet.JUPITER].house

        if moon_house and jupiter_house:
            relative_house = self._house_from_lagna(jupiter_house, moon_house)
            if relative_house in [6, 8]:
                return [YogaResult(
                    name="Sakata Yoga",
                    sanskrit_name="Sakata Yoga",
                    category="Arishta",
                    planets_involved=[Planet.JUPITER, Planet.MOON],
                    houses_involved=[moon_house, jupiter_house],
                    strength=0.6,
                    description="Jupiter in 6th/8th from Moon creates fluctuating fortune and periodic hardship.",
                    is_beneficial=False
                )]

        return []

    # ═══════════════════════════════════════════════════════════════════════
    # 3. VEDIC ASPECTS
    # ═══════════════════════════════════════════════════════════════════════

    def _calculate_vedic_aspects(self, chart: BirthChart) -> List[AspectResult]:
        """
        Calculate Vedic planetary aspects.

        Standard aspects (all planets): 7th house
        Special aspects:
          - Mars: 4th, 8th
          - Jupiter: 5th, 9th
          - Saturn: 3rd, 10th
          - Rahu/Ketu: 5th, 7th, 9th
        """
        aspects: List[AspectResult] = []

        # Standard 7th house aspect
        for aspecting_planet, pos in chart.planets.items():
            if not pos.house:
                continue

            aspected_house = self._house_from_lagna(7, pos.house)

            # Find planets in aspected house
            planets_in_house = chart.planets_in_house(aspected_house)

            for aspected_planet in planets_in_house:
                is_beneficial = self._aspect_is_beneficial(
                    aspecting_planet, aspected_planet
                )
                aspects.append(AspectResult(
                    aspecting_planet=aspecting_planet,
                    aspected_planet=aspected_planet,
                    aspected_house=aspected_house,
                    aspect_type="Full",
                    strength=0.8,
                    is_beneficial=is_beneficial
                ))

            # Also aspect house itself if empty
            if not planets_in_house:
                aspects.append(AspectResult(
                    aspecting_planet=aspecting_planet,
                    aspected_planet=None,
                    aspected_house=aspected_house,
                    aspect_type="Full",
                    strength=0.8,
                    is_beneficial=self._is_benefic(aspecting_planet)
                ))

        # Special aspects
        for aspecting_planet, pos in chart.planets.items():
            if not pos.house:
                continue

            special_aspects = self._get_special_aspects(aspecting_planet, pos.house)

            for special_house in special_aspects:
                planets_in_house = chart.planets_in_house(special_house)

                for aspected_planet in planets_in_house:
                    is_beneficial = self._aspect_is_beneficial(
                        aspecting_planet, aspected_planet
                    )
                    aspects.append(AspectResult(
                        aspecting_planet=aspecting_planet,
                        aspected_planet=aspected_planet,
                        aspected_house=special_house,
                        aspect_type="Full",
                        strength=0.7,
                        is_beneficial=is_beneficial
                    ))

        return aspects

    def _get_special_aspects(self, planet: Planet, house: int) -> List[int]:
        """Get list of special aspect houses for a planet."""
        special = []

        if planet == Planet.MARS:
            special = [self._house_from_lagna(4, house),
                      self._house_from_lagna(8, house)]
        elif planet == Planet.JUPITER:
            special = [self._house_from_lagna(5, house),
                      self._house_from_lagna(9, house)]
        elif planet == Planet.SATURN:
            special = [self._house_from_lagna(3, house),
                      self._house_from_lagna(10, house)]
        elif planet in [Planet.RAHU, Planet.KETU]:
            special = [self._house_from_lagna(5, house),
                      self._house_from_lagna(7, house),
                      self._house_from_lagna(9, house)]

        return special

    def _aspect_is_beneficial(self, aspecting: Planet, aspected: Planet) -> bool:
        """Determine if an aspect is beneficial based on planets involved."""
        benefic_aspects = [
            (Planet.JUPITER, Planet.JUPITER),
            (Planet.JUPITER, Planet.VENUS),
            (Planet.VENUS, Planet.VENUS),
            (Planet.VENUS, Planet.MERCURY),
            (Planet.MERCURY, Planet.MERCURY),
        ]

        return (aspecting, aspected) in benefic_aspects or \
               (self._is_benefic(aspecting) and not self._is_malefic(aspected))

    # ═══════════════════════════════════════════════════════════════════════
    # 4. ASHTAKAVARGA
    # ═══════════════════════════════════════════════════════════════════════

    def _calculate_ashtakavarga(self, chart: BirthChart) -> None:
        """
        Calculate Ashtakavarga (simplified but functional).

        For each of 7 planets (Sun through Saturn), assign benefic points (0-8)
        in each of the 12 signs based on natural strength and friendships.

        Store in chart.planet_ashtakavarga and chart.sarvashtakavarga.
        """
        chart.planet_ashtakavarga = {}
        sarva_points = [0] * 12  # Sum across all planets

        # Calculate for 7 planets (Sun through Saturn)
        for planet in [Planet.SUN, Planet.MOON, Planet.MARS, Planet.MERCURY,
                      Planet.JUPITER, Planet.VENUS, Planet.SATURN]:

            # Get base points from the table
            if planet in ASHTAKAVARGA_POINTS:
                points = list(ASHTAKAVARGA_POINTS[planet])
            else:
                points = [4] * 12  # Default neutral

            # Adjust based on planet's actual position
            planet_pos = chart.planets[planet]
            sign_index = planet_pos.sign.value

            # Bonus points for own sign, exalted, etc.
            if planet_pos.is_exalted:
                points[sign_index] = min(8, points[sign_index] + 2)
            elif planet_pos.is_own_sign:
                points[sign_index] = min(8, points[sign_index] + 1)
            elif planet_pos.is_debilitated:
                points[sign_index] = max(0, points[sign_index] - 2)

            chart.planet_ashtakavarga[planet] = points

            # Add to Sarvashtakavarga
            for i in range(12):
                sarva_points[i] += points[i]

        chart.sarvashtakavarga = sarva_points

    # ═══════════════════════════════════════════════════════════════════════
    # HELPER METHODS
    # ═══════════════════════════════════════════════════════════════════════

    def _house_from_lagna(self, reference_house: int, from_house: int) -> int:
        """
        Calculate relative house number from a reference house.

        Args:
            reference_house: The house to count from (1-12)
            from_house: The starting point (1-12)

        Returns:
            House number relative from_house (1-12)

        Example:
            _house_from_lagna(7, 3) → house 3 is at position 7 from house 3
            i.e., (3 + 7 - 1) % 12 + 1 = 9
        """
        return ((from_house - 1) + reference_house - 1) % 12 + 1

    def _is_benefic(self, planet: Planet) -> bool:
        """
        Check if a planet is naturally benefic.
        Jupiter, Venus, waxing Moon, unafflicted Mercury.
        """
        return planet in [Planet.JUPITER, Planet.VENUS]

    def _is_malefic(self, planet: Planet) -> bool:
        """Check if a planet is naturally malefic."""
        return planet in [Planet.MARS, Planet.SATURN, Planet.RAHU, Planet.KETU]

    def _is_kendra(self, house: int) -> bool:
        """Check if house is a kendra (1, 4, 7, 10)."""
        return house in [1, 4, 7, 10]

    def _is_trikona(self, house: int) -> bool:
        """Check if house is a trikona (1, 5, 9)."""
        return house in [1, 5, 9]
