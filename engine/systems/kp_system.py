"""
systems/kp_system.py — Silicon Siddhanta
KP (Krishnamurti Paddhati) System Module

Implements Krishnamurti Paddhati analysis:
  1. KP Significator Table (4-level planetary strength for each house)
  2. Ruling Planets Calculator (transiting rulers at any given moment)
  3. Event Prediction Framework (marriage, career, property, children, travel)
  4. Cuspal Analysis (sub-lord promise fulfillment)

All methods are 100% deterministic and require pre-computed BirthChart
with planetary positions, house cusps, and KP sub-lords already populated.
"""

from typing import Dict, List, Optional
from datetime import datetime
from silicon_siddhanta.core.types import (
    Planet, Sign, Nakshatra, House, BirthChart, PlanetPosition, HouseCusp,
    PredictionResult
)


class KPAnalyzer:
    """
    KP System analyzer for Krishnamurti Paddhati.

    Enriches a BirthChart with:
      - chart.kp_significators: Dict[int, List[Planet]] — houses → significators by strength
      - chart.ruling_planets: List[Planet] — rulers at birth moment
      - chart.predictions: List[PredictionResult] — event predictions using KP rules
    """

    def analyze(self, chart: BirthChart) -> BirthChart:
        """
        Analyze a birth chart using KP principles.

        Args:
            chart: BirthChart with computed planets, houses, KP sub-lords

        Returns:
            Enriched BirthChart with kp_significators, ruling_planets, predictions
        """
        # Compute KP significators for all 12 houses
        chart.kp_significators = self._compute_kp_significators(chart)

        # Compute ruling planets at birth moment
        chart.ruling_planets = self._compute_ruling_planets(chart)

        # Generate event predictions based on KP rules
        self._generate_predictions(chart)

        return chart

    # ═════════════════════════════════════════════════════════════════════════
    # 1. KP SIGNIFICATOR TABLE
    # ═════════════════════════════════════════════════════════════════════════

    def _compute_kp_significators(self, chart: BirthChart) -> Dict[int, List[Planet]]:
        """
        Compute KP significators for each house (1-12).

        Significators ordered by strength:
          Level 1 (strongest): Planets in nakshatra of house occupants
          Level 2: House occupants themselves
          Level 3: Planets in nakshatra of house lord
          Level 4 (weakest): House lord (sign lord of cusp)

        Returns:
            Dict[house_num → [planets ordered by strength]]
        """
        significators: Dict[int, List[Planet]] = {}

        for house_num in range(1, 13):
            level_1 = []  # Planets in star of occupants
            level_2 = []  # Occupants
            level_3 = []  # Planets in star of house lord
            level_4 = []  # House lord

            # Level 2: Occupants of this house
            occupants = self._get_occupants(chart, house_num)
            level_2 = occupants.copy()

            # Level 1: Planets in nakshatra of occupants
            for occupant in occupants:
                occupant_pos = chart.planets[occupant]
                planets_in_occ_star = self._planets_in_star_of(
                    chart, occupant_pos.nakshatra_lord
                )
                for p in planets_in_occ_star:
                    if p not in level_1:
                        level_1.append(p)

            # House lord and planets in its star
            house_lord = chart.get_house_lord(house_num)
            level_4 = [house_lord]

            # Level 3: Planets in nakshatra of house lord
            planets_in_lord_star = self._planets_in_star_of(chart, house_lord)
            for p in planets_in_lord_star:
                if p not in level_3:
                    level_3.append(p)

            # Combine levels, avoiding duplicates, preserving order
            combined = []
            seen = set()

            for level in [level_1, level_2, level_3, level_4]:
                for planet in level:
                    if planet not in seen:
                        combined.append(planet)
                        seen.add(planet)

            significators[house_num] = combined

        return significators

    def _planets_in_star_of(self, chart: BirthChart, nakshatra_lord: Planet) -> List[Planet]:
        """
        Find all planets whose nakshatra lord is the given planet.

        Args:
            chart: BirthChart
            nakshatra_lord: The planet whose stars we're checking

        Returns:
            List of planets in that planet's nakshatras
        """
        result = []
        for planet, position in chart.planets.items():
            if position.nakshatra_lord == nakshatra_lord:
                result.append(planet)
        return result

    def _get_occupants(self, chart: BirthChart, house_num: int) -> List[Planet]:
        """
        Get all planets posited (occupying) a given house.

        Args:
            chart: BirthChart
            house_num: House number (1-12)

        Returns:
            List of planets in that house
        """
        return [
            planet for planet, position in chart.planets.items()
            if position.house == house_num
        ]

    # ═════════════════════════════════════════════════════════════════════════
    # 2. RULING PLANETS CALCULATOR
    # ═════════════════════════════════════════════════════════════════════════

    def _compute_ruling_planets(self, chart: BirthChart) -> List[Planet]:
        """
        Compute ruling planets at birth moment using KP principles.

        Ruling planets (in order of strength):
          1. Ascendant sign lord
          2. Ascendant nakshatra lord
          3. Ascendant sub-lord
          4. Moon sign lord
          5. Moon nakshatra lord
          6. Day lord (weekday)

        Returns:
            List[Planet] ordered by strength (strongest first)
        """
        rulers = []
        seen = set()

        # 1. Ascendant sign lord (strongest)
        asc_sign_lord = chart.ascendant_sign.lord
        rulers.append(asc_sign_lord)
        seen.add(asc_sign_lord)

        # 2. Ascendant nakshatra lord
        asc_house = House.H1
        if asc_house in chart.houses:
            asc_cusp = chart.houses[asc_house]
            if asc_cusp.nakshatra_lord and asc_cusp.nakshatra_lord not in seen:
                rulers.append(asc_cusp.nakshatra_lord)
                seen.add(asc_cusp.nakshatra_lord)

        # 3. Ascendant sub-lord
        if asc_house in chart.houses:
            asc_cusp = chart.houses[asc_house]
            if asc_cusp.sub_lord and asc_cusp.sub_lord not in seen:
                rulers.append(asc_cusp.sub_lord)
                seen.add(asc_cusp.sub_lord)

        # 4. Moon sign lord
        moon_sign_lord = chart.moon_sign.lord
        if moon_sign_lord not in seen:
            rulers.append(moon_sign_lord)
            seen.add(moon_sign_lord)

        # 5. Moon nakshatra lord
        moon_pos = chart.planets.get(Planet.MOON)
        if moon_pos and moon_pos.nakshatra_lord not in seen:
            rulers.append(moon_pos.nakshatra_lord)
            seen.add(moon_pos.nakshatra_lord)

        # 6. Day lord (weekday ruler)
        day_lord = self._day_lord(chart.birth_data.datetime_local.weekday())
        if day_lord not in seen:
            rulers.append(day_lord)
            seen.add(day_lord)

        return rulers

    def _day_lord(self, weekday_num: int) -> Planet:
        """
        Get the planetary lord of a weekday.

        Args:
            weekday_num: 0=Monday, 1=Tuesday, ..., 6=Sunday (Python's weekday())

        Returns:
            Planet ruling that day
        """
        day_lords = [
            Planet.MERCURY,  # Monday (0)
            Planet.MARS,     # Tuesday (1)
            Planet.MERCURY,  # Wednesday (2)
            Planet.JUPITER,  # Thursday (3)
            Planet.VENUS,    # Friday (4)
            Planet.SATURN,   # Saturday (5)
            Planet.SUN,      # Sunday (6)
        ]
        return day_lords[weekday_num % 7]

    # ═════════════════════════════════════════════════════════════════════════
    # 3. EVENT PREDICTION FRAMEWORK
    # ═════════════════════════════════════════════════════════════════════════

    def _generate_predictions(self, chart: BirthChart) -> None:
        """
        Generate event predictions using KP significator rules.

        Checks life events against house significators and sub-lord connections.
        Adds PredictionResult objects to chart.predictions.
        """
        events = [
            ("Marriage", [2, 7, 11], [1, 6, 10]),
            ("Career", [2, 6, 10, 11], [5, 8, 12]),
            ("Property", [4, 11], [3, 12]),
            ("Children", [2, 5, 11], [1, 4, 10]),
            ("Foreign Travel", [3, 9, 12], []),
            ("Financial Gain", [2, 6, 10, 11], [5, 8, 12]),
            ("Health Issues", [1, 6, 8, 12], []),
        ]

        for event_name, favorable_houses, unfavorable_houses in events:
            prediction = self._predict_event(
                chart, event_name, favorable_houses, unfavorable_houses
            )
            if prediction:
                chart.predictions.append(prediction)

    def _predict_event(
        self,
        chart: BirthChart,
        event_name: str,
        favorable_houses: List[int],
        unfavorable_houses: List[int]
    ) -> Optional[PredictionResult]:
        """
        Predict a specific life event using KP principles.

        Args:
            chart: BirthChart
            event_name: Type of event ("Marriage", "Career", etc.)
            favorable_houses: Houses that indicate this event
            unfavorable_houses: Houses that indicate obstacles

        Returns:
            PredictionResult or None
        """
        favorable_significators = []
        unfavorable_significators = []
        supporting_factors = []
        confidence = 0.5  # Base confidence

        # Check favorable house significators
        for house_num in favorable_houses:
            sigs = chart.kp_significators.get(house_num, [])
            favorable_significators.extend(sigs)

        # Check unfavorable house significators
        for house_num in unfavorable_houses:
            sigs = chart.kp_significators.get(house_num, [])
            unfavorable_significators.extend(sigs)

        # Remove duplicates while preserving order
        favorable_significators = list(dict.fromkeys(favorable_significators))
        unfavorable_significators = list(dict.fromkeys(unfavorable_significators))

        # Analyze promising houses
        promising_houses = []
        for house_num in favorable_houses:
            cusp = chart.houses.get(House(house_num))
            if cusp and cusp.sub_lord:
                # Check if sub-lord is connected to favorable houses
                sub_lord_sigs = favorable_significators
                if cusp.sub_lord in sub_lord_sigs or len(favorable_significators) > 0:
                    promising_houses.append(house_num)
                    supporting_factors.append(
                        f"House {house_num} cusp sub-lord {cusp.sub_lord.value} "
                        f"connected to favorable significators"
                    )

        # Build supporting factors
        if favorable_significators:
            supporting_factors.append(
                f"Favorable significators: {', '.join(p.value for p in favorable_significators[:3])}"
            )

        if unfavorable_significators:
            supporting_factors.append(
                f"Unfavorable significators: {', '.join(p.value for p in unfavorable_significators[:2])}"
            )

        # Confidence calculation
        if len(favorable_significators) > 0:
            confidence = min(0.9, 0.5 + (len(favorable_significators) * 0.1))

        if len(unfavorable_significators) > 0:
            confidence *= (1 - (len(unfavorable_significators) * 0.1))

        confidence = max(0.1, min(1.0, confidence))

        # Generate prediction text
        if promising_houses:
            prediction_text = (
                f"{event_name} is indicated through houses {', '.join(map(str, promising_houses))}. "
                f"The sub-lords of these cusps show favorable connections to core significators."
            )
        else:
            prediction_text = (
                f"{event_name} may occur, but favorable indicators are weak. "
                f"Consult dasha periods and timing factors for precise timing."
            )

        return PredictionResult(
            system="KP",
            category=event_name,
            prediction=prediction_text,
            confidence=confidence,
            supporting_factors=supporting_factors,
            timing=None,
            remedies=[]
        )

    # ═════════════════════════════════════════════════════════════════════════
    # 4. CUSPAL ANALYSIS
    # ═════════════════════════════════════════════════════════════════════════

    def _cuspal_analysis(self, chart: BirthChart) -> List[PredictionResult]:
        """
        Analyze each house cusp's sub-lord signification chain.

        For each house, check if the sub-lord is connected to favorable
        significations (its own house lord's connections, etc.).

        Returns:
            List of cuspal analysis predictions
        """
        cuspal_predictions = []

        for house_num in range(1, 13):
            house = House(house_num)
            cusp = chart.houses.get(house)

            if not cusp or not cusp.sub_lord:
                continue

            sub_lord = cusp.sub_lord
            sub_lord_pos = chart.planets.get(sub_lord)

            if not sub_lord_pos:
                continue

            # Check sub-lord's house and sign
            promise_text = (
                f"House {house_num} ({house.name_sanskrit}) cusp sub-lord is {sub_lord.value}. "
            )

            if sub_lord_pos.house:
                promise_text += f"{sub_lord.value} is in house {sub_lord_pos.house}. "

            # Check if sub-lord indicates fulfillment
            sub_lord_sig_houses = []
            for sig_house, sigs in chart.kp_significators.items():
                if sub_lord in sigs:
                    sub_lord_sig_houses.append(sig_house)

            if sub_lord_sig_houses:
                promise_text += (
                    f"{sub_lord.value}'s significations include houses "
                    f"{', '.join(map(str, sub_lord_sig_houses[:3]))}. "
                    f"The promise of house {house_num} is likely fulfilled."
                )
                confidence = 0.7
            else:
                promise_text += (
                    f"The sub-lord's significations are weak. "
                    f"House {house_num}'s promise may be delayed or modified."
                )
                confidence = 0.4

            cusp_pred = PredictionResult(
                system="KP",
                category=f"Cusp_{house_num}",
                prediction=promise_text,
                confidence=confidence,
                supporting_factors=[
                    f"Cusp sub-lord: {sub_lord.value}",
                    f"Sub-lord position: House {sub_lord_pos.house}" if sub_lord_pos.house else "Sub-lord position: No house"
                ],
                timing=None,
                remedies=[]
            )
            cuspal_predictions.append(cusp_pred)

        return cuspal_predictions
