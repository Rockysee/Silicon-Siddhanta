"""
systems/nadi.py — Silicon Siddhanta
Nadi Astrology Module

Implements Nadi (predictive branch) astrology:
  1. Bhrigu Nandi Nadi Rules — planet-to-planet conjunction/aspect interpretations
  2. Nadi Amsha Positions — 4050-point zodiac division (150 amshas per nakshatra)
  3. Dhruva Nadi Analysis — Saturn/Jupiter transits, Sade Sati detection

All methods are 100% deterministic. No LLM involvement, no randomness.
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime
from silicon_siddhanta.core.types import (
    Planet, Sign, Nakshatra, House, BirthChart, PlanetPosition, PredictionResult
)


# ═══════════════════════════════════════════════════════════════════════════
# NADI DASHA YEARS (for reference in Sade Sati calculations)
# ═══════════════════════════════════════════════════════════════════════════

DASHA_YEARS = {
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


# ═══════════════════════════════════════════════════════════════════════════
# BHRIGU NANDI NADI CONJUNCTION/ASPECT RULES
# ═══════════════════════════════════════════════════════════════════════════

NADI_CONJUNCTION_RULES: Dict[Tuple[Planet, Planet], Dict] = {
    # Sun combinations
    (Planet.SUN, Planet.MOON): {
        "description": "Government connection, royal patronage, fame, leadership",
        "beneficial": True,
        "category": "Raja Yoga",
        "strength": 0.8,
    },
    (Planet.SUN, Planet.MARS): {
        "description": "Authority, military prowess, surgery, engineering skills, bold action",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.75,
    },
    (Planet.SUN, Planet.MERCURY): {
        "description": "Intelligence, commerce success, writing talent, intellectual pursuits",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.7,
    },
    (Planet.SUN, Planet.JUPITER): {
        "description": "Wisdom, spiritual knowledge, teaching ability, dharma-oriented life",
        "beneficial": True,
        "category": "Raja Yoga",
        "strength": 0.9,
    },
    (Planet.SUN, Planet.SATURN): {
        "description": "Delays in progress, father issues, hard work pays slowly, endurance needed",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.65,
    },
    (Planet.SUN, Planet.RAHU): {
        "description": "Eclipse effects, deception, foreign connections, unconventional power",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.6,
    },

    # Moon combinations
    (Planet.MOON, Planet.MARS): {
        "description": "Property gains, blood-related issues if afflicted, courage and action",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.7,
    },
    (Planet.MOON, Planet.MERCURY): {
        "description": "Business intelligence, adaptability, quick profit, communication skills",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.75,
    },
    (Planet.MOON, Planet.JUPITER): {
        "description": "Wealth accumulation, blessed children, learning, expansion, growth",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.85,
    },
    (Planet.MOON, Planet.SATURN): {
        "description": "Depression, delays, health issues, longevity yoga if strong, karma repayment",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.7,
    },
    (Planet.MOON, Planet.RAHU): {
        "description": "Obsessive thinking, emotional turmoil, foreign travel, hidden fears",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.65,
    },

    # Mars combinations
    (Planet.MARS, Planet.MERCURY): {
        "description": "Sharp intellect, competitive drive, success in debating, analytical mind",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.7,
    },
    (Planet.MARS, Planet.JUPITER): {
        "description": "Virtuous action, political success, expansion through courage, protection",
        "beneficial": True,
        "category": "Raja Yoga",
        "strength": 0.8,
    },
    (Planet.MARS, Planet.SATURN): {
        "description": "Accidents, surgery risk, discipline through hardship, accidents if afflicted",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.75,
    },
    (Planet.MARS, Planet.RAHU): {
        "description": "Aggression, conflicts, accidents, competitive strife, deceptive action",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.68,
    },

    # Mercury combinations
    (Planet.MERCURY, Planet.JUPITER): {
        "description": "Commerce success, intellectual authority, teaching, ethical trading",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.8,
    },
    (Planet.MERCURY, Planet.SATURN): {
        "description": "Technical skill, engineering, long-term strategic thinking, hard work",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.7,
    },
    (Planet.MERCURY, Planet.RAHU): {
        "description": "Cunning intellect, trade deception, fraud risk, unconventional thinking",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.6,
    },

    # Jupiter combinations
    (Planet.JUPITER, Planet.SATURN): {
        "description": "Dharma vs Karma tension, wisdom after struggle, delayed benefits, long-term gains",
        "beneficial": False,
        "category": "Raja Yoga",
        "strength": 0.7,
    },
    (Planet.JUPITER, Planet.RAHU): {
        "description": "Unconventional beliefs, deceptive expansion, foreign growth, illusion of gain",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.6,
    },

    # Saturn combinations
    (Planet.SATURN, Planet.RAHU): {
        "description": "Chronic hardship, delays, suffering, but ultimate stability if endured",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.75,
    },

    # Venus combinations
    (Planet.VENUS, Planet.RAHU): {
        "description": "Foreign spouse, unconventional romance, passion, relationship complexity",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.65,
    },
    (Planet.VENUS, Planet.JUPITER): {
        "description": "Devotion, spiritual marriage, artistic mastery, harmonious relationships",
        "beneficial": True,
        "category": "Raja Yoga",
        "strength": 0.8,
    },
    (Planet.VENUS, Planet.SATURN): {
        "description": "Long-lasting love after delays, karmic partnership, enduring bond",
        "beneficial": True,
        "category": "Dhana Yoga",
        "strength": 0.65,
    },

    # Rahu combinations
    (Planet.RAHU, Planet.KETU): {
        "description": "Nodal axis activation, karmic release, obsessive behavior",
        "beneficial": False,
        "category": "Arishta Yoga",
        "strength": 0.7,
    },
}


class NadiAnalyzer:
    """
    Nadi astrology analyzer for predictive chart enrichment.

    Adds to BirthChart:
      - Nadi amsha positions for each planet
      - Nadi type classification (Adi/Madhya/Antya)
      - Sade Sati and planetary transit analysis
      - Bhrigu Nandi conjunction interpretations
      - Predictions based on Nadi principles
    """

    def analyze(self, chart: BirthChart) -> BirthChart:
        """
        Analyze a birth chart using Nadi astrology principles.

        Args:
            chart: BirthChart with computed planets and houses

        Returns:
            Enriched BirthChart with nadi predictions and analysis
        """
        # 1. Compute Nadi amsha positions
        nadi_positions = self._compute_nadi_amshas(chart)

        # 2. Analyze Bhrigu Nandi conjunction rules
        self._analyze_conjunctions(chart)

        # 3. Perform Dhruva Nadi (transit-based) analysis
        self._analyze_dhruva_nadi(chart)

        return chart

    # ═════════════════════════════════════════════════════════════════════════
    # 1. NADI AMSHA CALCULATION (4050-point zodiac)
    # ═════════════════════════════════════════════════════════════════════════

    def _compute_nadi_amshas(self, chart: BirthChart) -> Dict[Planet, Tuple[int, str]]:
        """
        Divide the zodiac into 4050 Nadi amshas (150 per nakshatra).
        Classify each planet's amsha by Nadi type: Adi (Vata), Madhya (Pitta), Antya (Kapha).

        Returns:
            Dict[Planet → (amsha_number: 1-4050, nadi_type: "Adi"|"Madhya"|"Antya")]
        """
        nadi_positions = {}

        for planet, pos in chart.planets.items():
            # Each nakshatra spans 13°20' = 800 arc minutes
            # Within a nakshatra, divide into 150 amshas = 5.33' per amsha
            nakshatra_idx = pos.nakshatra.value  # 0-26
            sign_degree = pos.sign_degree  # 0-30

            # Global zodiac position in degrees (0-360)
            global_degree = nakshatra_idx * (13.0 + 20.0 / 60.0) + sign_degree

            # Convert to amsha number (1-4050)
            amsha_num = int((global_degree / 360.0) * 4050) + 1
            amsha_num = max(1, min(4050, amsha_num))  # Clamp to valid range

            # Classify by Nadi type (3 types, roughly equal distribution)
            # Adi (Vata): amshas 1-1350
            # Madhya (Pitta): amshas 1351-2700
            # Antya (Kapha): amshas 2701-4050
            if amsha_num <= 1350:
                nadi_type = "Adi"
            elif amsha_num <= 2700:
                nadi_type = "Madhya"
            else:
                nadi_type = "Antya"

            nadi_positions[planet] = (amsha_num, nadi_type)

        return nadi_positions

    # ═════════════════════════════════════════════════════════════════════════
    # 2. BHRIGU NANDI CONJUNCTION ANALYSIS
    # ═════════════════════════════════════════════════════════════════════════

    def _analyze_conjunctions(self, chart: BirthChart) -> None:
        """
        Detect planet-to-planet conjunctions and aspects.
        Apply Bhrigu Nandi Nadi rules to generate predictions.
        """
        # Conjunction distance threshold: ~8 degrees in same sign or adjacent signs
        conjunction_orb = 8.0

        for p1, pos1 in chart.planets.items():
            for p2, pos2 in chart.planets.items():
                if p1.value >= p2.value:  # Avoid duplicates
                    continue

                # Check if planets are in conjunction (same sign, within orb)
                if pos1.sign == pos2.sign:
                    distance = abs(pos1.sign_degree - pos2.sign_degree)
                    if distance <= conjunction_orb or (30.0 - distance) <= conjunction_orb:
                        # Planets in conjunction
                        self._add_conjunction_prediction(chart, p1, p2, distance)

    def _add_conjunction_prediction(
        self, chart: BirthChart, p1: Planet, p2: Planet, distance: float
    ) -> None:
        """
        Add a prediction based on planet conjunction using Bhrigu Nandi rules.
        """
        # Look up rule in both directions (p1, p2) and (p2, p1)
        rule = None
        for key in NADI_CONJUNCTION_RULES:
            if key == (p1, p2) or key == (p2, p1):
                rule = NADI_CONJUNCTION_RULES[key]
                break

        if not rule:
            return

        # Strength decreases with distance (closer = stronger)
        base_strength = rule["strength"]
        strength = base_strength * (1.0 - distance / 8.0)

        # Conjunction clarity: closer = higher confidence
        confidence = 0.85 if distance <= 3.0 else 0.7 if distance <= 6.0 else 0.55

        prediction = PredictionResult(
            system="Nadi",
            category=rule["category"],
            prediction=f"{p1.value}-{p2.value} Conjunction: {rule['description']}",
            confidence=confidence,
            supporting_factors=[
                f"Conjunction orb: {distance:.1f}°",
                f"Base strength: {base_strength:.2f}",
            ],
            timing=None,
        )

        chart.predictions.append(prediction)

    # ═════════════════════════════════════════════════════════════════════════
    # 3. DHRUVA NADI ANALYSIS (Transit-based predictions)
    # ═════════════════════════════════════════════════════════════════════════

    def _analyze_dhruva_nadi(self, chart: BirthChart) -> None:
        """
        Perform Dhruva Nadi analysis using current Saturn and Jupiter transits.

        Includes:
          - Sade Sati detection (Saturn in 12, 1, 2 from Moon sign)
          - Jupiter transit effects (favorable in 2, 5, 7, 9, 11 from Moon)
        """
        from datetime import datetime

        now = datetime.utcnow()

        # Get Moon's sign for reference
        moon_sign = chart.moon_sign

        # Analyze Saturn transit
        saturn_pos = chart.planets[Planet.SATURN]
        saturn_house_from_moon = self._house_distance(saturn_pos.sign, moon_sign)
        self._add_saturn_transit_prediction(chart, saturn_house_from_moon, now)

        # Analyze Jupiter transit
        jupiter_pos = chart.planets[Planet.JUPITER]
        jupiter_house_from_moon = self._house_distance(jupiter_pos.sign, moon_sign)
        self._add_jupiter_transit_prediction(chart, jupiter_house_from_moon)

    def _house_distance(self, from_sign: Sign, to_sign: Sign) -> int:
        """
        Calculate house distance from one sign to another.
        Returns 1-12 representing houses ahead.
        """
        distance = (to_sign.value - from_sign.value) % 12
        return distance if distance > 0 else 12

    def _add_saturn_transit_prediction(
        self, chart: BirthChart, saturn_house: int, now: datetime
    ) -> None:
        """
        Add Saturn transit prediction. Detect Sade Sati if applicable.
        """
        if saturn_house in [12, 1, 2]:
            # Sade Sati: Saturn in 12th, 1st, or 2nd from Moon
            phase_name = {12: "12th", 1: "1st", 2: "2nd"}[saturn_house]

            prediction = PredictionResult(
                system="Nadi",
                category="Sade Sati",
                prediction=f"Sade Sati active: Saturn in {phase_name} from Moon sign. "
                f"Period of 7.5 years brings challenges but spiritual growth.",
                confidence=0.9,
                supporting_factors=[
                    f"Saturn house from Moon: {saturn_house}",
                    f"Sade Sati is cyclical karmic purification period",
                ],
                timing="Current or upcoming 7.5-year cycle",
                remedies=[
                    "Regular Saturn worship and meditation",
                    "Chanting Saturn mantras (Om Sham Shanaischaraya Namah)",
                    "Acts of charity and service",
                    "Blue stone (Sapphire) if astrologically advised",
                ],
            )
            chart.predictions.append(prediction)
        else:
            # Saturn in other positions
            if saturn_house in [4, 5, 6, 7, 8, 9, 10, 11]:
                status = "favorable" if saturn_house in [7, 10] else "challenging"
                prediction = PredictionResult(
                    system="Nadi",
                    category="Saturn Transit",
                    prediction=f"Saturn transit in {saturn_house} from Moon: "
                    f"{status} influence. Focus on discipline and long-term planning.",
                    confidence=0.75,
                    supporting_factors=[f"Saturn house from Moon: {saturn_house}"],
                    timing="Current Saturn transit",
                )
                chart.predictions.append(prediction)

    def _add_jupiter_transit_prediction(
        self, chart: BirthChart, jupiter_house: int
    ) -> None:
        """
        Add Jupiter transit prediction based on house position relative to Moon.
        """
        favorable_houses = [2, 5, 7, 9, 11]

        if jupiter_house in favorable_houses:
            prediction = PredictionResult(
                system="Nadi",
                category="Jupiter Transit",
                prediction=f"Favorable Jupiter transit in {jupiter_house} from Moon. "
                f"Period of growth, wisdom, opportunity, and spiritual expansion.",
                confidence=0.85,
                supporting_factors=[
                    f"Jupiter in favorable house {jupiter_house}",
                    "Jupiter as benefic brings expansion and blessings",
                ],
                timing="Current Jupiter transit",
                remedies=[
                    "Jupiter worship (Brihaspati puja)",
                    "Chanting Jupiter mantra (Om Graam Graim Graum Sah Gurvaye Namah)",
                    "Yellow clothing and gemstones",
                    "Helping spiritual teachers and gurus",
                ],
            )
            chart.predictions.append(prediction)
        else:
            prediction = PredictionResult(
                system="Nadi",
                category="Jupiter Transit",
                prediction=f"Neutral/challenging Jupiter transit in {jupiter_house} from Moon. "
                f"Focus on inner growth and karmic understanding.",
                confidence=0.7,
                supporting_factors=[f"Jupiter in house {jupiter_house}"],
                timing="Current Jupiter transit",
            )
            chart.predictions.append(prediction)

    # ═════════════════════════════════════════════════════════════════════════
    # 4. HELPER METHODS
    # ═════════════════════════════════════════════════════════════════════════

    def _planets_in_same_sign(
        self, chart: BirthChart, sign: Sign, excluded: Planet = None
    ) -> List[Planet]:
        """Get all planets in a given sign."""
        planets = []
        for planet, pos in chart.planets.items():
            if excluded and planet == excluded:
                continue
            if pos.sign == sign:
                planets.append(planet)
        return planets

    def _conjunction_strength(self, distance_degrees: float) -> float:
        """
        Calculate conjunction strength (0-1) based on orb distance.
        Closer = stronger. 0° = 1.0, 8° = 0.0
        """
        if distance_degrees >= 8.0:
            return 0.0
        return 1.0 - (distance_degrees / 8.0)
