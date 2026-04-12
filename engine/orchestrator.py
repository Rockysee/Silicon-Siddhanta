"""
orchestrator.py — Silicon Siddhanta
Unified Prediction Engine

Ties together all astrological systems:
  - Parashari (classical Vedic)
  - KP (Krishnamurti Paddhati)
  - Nadi (predictive branch)

Provides a single entry point for:
  - Chart calculation
  - Multi-system analysis
  - Prediction aggregation
  - Human-readable summaries

All calculations are deterministic and mathematically sound.
"""

from typing import List, Optional
from datetime import datetime

from silicon_siddhanta.core.types import (
    BirthChart, BirthData, Planet, Ayanamsha, PredictionResult, GeoLocation
)
from silicon_siddhanta.core.chart_calculator import ChartCalculator


class SiliconSiddhanta:
    """
    Unified Vedic astrology prediction engine.

    Orchestrates multiple astrological systems to generate comprehensive
    birth chart analysis and predictions.

    Example:
        engine = SiliconSiddhanta()
        chart = engine.generate_chart(
            name="Hemant",
            year=1980, month=3, day=27, hour=11, minute=45,
            place_name="Kalyan", latitude=19.2183, longitude=73.1305,
            timezone_str="Asia/Kolkata"
        )
        print(engine.summary(chart))
    """

    def __init__(self, ayanamsha: Ayanamsha = Ayanamsha.LAHIRI):
        """
        Initialize the prediction engine.

        Args:
            ayanamsha: Ayanamsha model to use (default: Lahiri/Chitrapaksha)
        """
        self.calculator = ChartCalculator(ayanamsha)
        self.ayanamsha = ayanamsha

        # Import system analyzers lazily to avoid circular imports
        try:
            from silicon_siddhanta.systems.kp_system import KPAnalyzer

            self.kp = KPAnalyzer()
        except ImportError:
            self.kp = None

        try:
            from silicon_siddhanta.systems.nadi import NadiAnalyzer

            self.nadi = NadiAnalyzer()
        except ImportError:
            self.nadi = None

        try:
            from silicon_siddhanta.systems.parashari import ParashariAnalyzer
            self.parashari = ParashariAnalyzer()
        except ImportError:
            self.parashari = None

    def generate_chart(
        self,
        name: str,
        year: int,
        month: int,
        day: int,
        hour: int,
        minute: int,
        second: int = 0,
        place_name: str = "",
        latitude: float = 0.0,
        longitude: float = 0.0,
        timezone_str: str = "",
    ) -> BirthChart:
        """
        Generate a complete multi-system birth chart.

        Pipeline:
          1. Create BirthData from input parameters
          2. Calculate base chart (planets, houses, aspects)
          3. Run Parashari analysis (dashas, yogas, aspects)
          4. Run KP analysis (significators, ruling planets)
          5. Run Nadi analysis (conjunctions, transits)

        Args:
            name: Native's name
            year: Birth year
            month: Birth month (1-12)
            day: Birth day (1-31)
            hour: Birth hour (0-23)
            minute: Birth minute (0-59)
            second: Birth second (0-59), default 0
            place_name: Birth place name, default ""
            latitude: Birth latitude, default 0.0
            longitude: Birth longitude, default 0.0
            timezone_str: IANA timezone string (e.g., "Asia/Kolkata"), default ""

        Returns:
            BirthChart with all systems analyzed

        Raises:
            ValueError: If date/time parameters are invalid
        """
        # 1. Create birth data
        birth = self.calculator.create_birth_data(
            name=name,
            year=year,
            month=month,
            day=day,
            hour=hour,
            minute=minute,
            second=second,
            place_name=place_name,
            latitude=latitude,
            longitude=longitude,
            timezone_str=timezone_str,
        )

        # 2. Calculate base chart
        chart = self.calculator.calculate_chart(birth)

        # 3. Run system-specific analyses
        # (Order: Parashari → KP → Nadi for dependency flow)
        if self.parashari:
            chart = self.parashari.analyze(chart)

        if self.kp:
            chart = self.kp.analyze(chart)

        if self.nadi:
            chart = self.nadi.analyze(chart)

        return chart

    def get_predictions(
        self, chart: BirthChart, category: Optional[str] = None
    ) -> List[PredictionResult]:
        """
        Retrieve predictions from a chart, optionally filtered by category.

        Args:
            chart: BirthChart with predictions
            category: Optional category filter (e.g., "Career", "Marriage", "Health")

        Returns:
            List of PredictionResult objects
        """
        if category:
            return [
                p
                for p in chart.predictions
                if p.category.lower() == category.lower()
            ]
        return chart.predictions

    def get_current_dasha(self, chart: BirthChart) -> str:
        """
        Get the current Vimshottari dasha at the moment of calculation.

        Format: "Maha-Antar-Pratyantar" (e.g., "Saturn-Mercury-Jupiter")

        Args:
            chart: BirthChart with dasha periods

        Returns:
            Dasha string in format "Maha-Antar-Pratyantar"
        """
        now = datetime.utcnow()
        maha = antar = praty = "Unknown"

        for md in chart.dashas:
            if md.start <= now <= md.end:
                maha = md.lord.value
                for ad in md.sub_periods:
                    if ad.start <= now <= ad.end:
                        antar = ad.lord.value
                        for pd in ad.sub_periods:
                            if pd.start <= now <= pd.end:
                                praty = pd.lord.value
                                break
                        break
                break

        return f"{maha}-{antar}-{praty}"

    def summary(self, chart: BirthChart) -> str:
        """
        Generate a human-readable birth chart summary.

        Includes:
          - Basic chart data (ascendant, moon, sun signs)
          - Planetary positions table
          - Current dasha
          - Top yogas
          - Key predictions from each system
          - House information

        Args:
            chart: BirthChart to summarize

        Returns:
            Formatted text summary
        """
        lines = []

        # Header
        lines.append("╔════════════════════════════════════════════════════════════╗")
        lines.append(f"║  SILICON SIDDHANTA — {chart.birth_data.name:<45} ║")
        lines.append("╚════════════════════════════════════════════════════════════╝")
        lines.append("")

        # Birth data
        lines.append("─── BIRTH DATA ───")
        lines.append(f"  Name:      {chart.birth_data.name}")
        lines.append(f"  Birth:     {chart.birth_data.datetime_local.strftime('%d/%m/%Y %H:%M:%S')}")
        lines.append(f"  Location:  {chart.birth_data.location.name}")
        lines.append(f"             {chart.birth_data.location.latitude:.4f}°, {chart.birth_data.location.longitude:.4f}°")
        lines.append(f"  Ayanamsha: Lahiri ({chart.ayanamsha_value:.4f}°)")
        lines.append("")

        # Key signs
        lines.append("─── KEY INDICATORS ───")
        lines.append(f"  Ascendant:  {chart.ascendant_sign.name.title():12} {chart.ascendant_degree:6.2f}°")
        lines.append(f"  Moon Sign:  {chart.moon_sign.name.title():12} (Emotional nature)")
        lines.append(f"  Sun Sign:   {chart.sun_sign.name.title():12} (Core identity)")
        lines.append(f"  Lagna Lord: {chart.lagna_lord.value}")
        lines.append("")

        # Planetary positions
        lines.append("─── PLANETARY POSITIONS ───")
        lines.append(f"  {'Planet':<12} {'Position':<32} {'House':<6} {'Nakshatra':<20}")
        lines.append("  " + "─" * 70)
        for planet in sorted(chart.planets.keys(), key=lambda p: p.value):
            pos = chart.planets[planet]
            retro = "(R)" if pos.is_retrograde else "   "
            nak_name = pos.nakshatra.name.replace("_", " ")
            lines.append(
                f"  {planet.value:<12} {pos.degree_display:<32} {pos.house:>6} {nak_name:<20}"
            )
        lines.append("")

        # Current dasha
        lines.append("─── CURRENT DASHA ───")
        current_dasha = self.get_current_dasha(chart)
        lines.append(f"  {current_dasha}")
        lines.append("")

        # Yogas
        if chart.yogas:
            lines.append("─── YOGAS DETECTED ───")
            for yoga in sorted(
                chart.yogas, key=lambda y: y.strength, reverse=True
            )[:12]:
                strength_bars = "★" * int(yoga.strength * 5)
                bene = "✓" if yoga.is_beneficial else "✗"
                lines.append(
                    f"  [{bene}] {yoga.name:<30} {strength_bars:<5} ({yoga.category})"
                )
                # Wrap description
                desc = yoga.description
                if len(desc) > 70:
                    desc = desc[:67] + "..."
                lines.append(f"      {desc}")
            lines.append("")

        # Predictions by system
        if chart.predictions:
            lines.append("─── KEY PREDICTIONS ───")

            systems = ["Parashari", "KP", "Nadi"]
            for system in systems:
                sys_preds = [
                    p for p in chart.predictions if p.system == system
                ][:5]
                if sys_preds:
                    lines.append(f"  [{system}]")
                    for pred in sys_preds:
                        confidence = f"{pred.confidence * 100:.0f}%"
                        category = pred.category.ljust(15)
                        prediction_text = pred.prediction[:65]
                        if len(pred.prediction) > 65:
                            prediction_text += "..."
                        lines.append(
                            f"    {category} {prediction_text} ({confidence})"
                        )
                    lines.append("")

        # Footer
        lines.append("╚════════════════════════════════════════════════════════════╝")

        return "\n".join(lines)

    def detailed_report(self, chart: BirthChart) -> str:
        """
        Generate a detailed multi-page report for professional consultation.

        Includes all chart details, analysis, interpretations, and remedies.

        Args:
            chart: BirthChart to analyze

        Returns:
            Extended formatted text report
        """
        lines = []

        # Title page
        lines.append("=" * 70)
        lines.append("SILICON SIDDHANTA — VEDIC ASTROLOGY ANALYSIS")
        lines.append("Multi-System Predictive Report".center(70))
        lines.append("=" * 70)
        lines.append("")

        # Summary section
        lines.append(self.summary(chart))
        lines.append("")

        # Houses section
        if chart.houses:
            lines.append("=" * 70)
            lines.append("HOUSE ANALYSIS")
            lines.append("=" * 70)
            lines.append("")

            for house_num in range(1, 13):
                from silicon_siddhanta.core.types import House

                h = House(house_num)
                if h in chart.houses:
                    cusp = chart.houses[h]
                    occupants = chart.planets_in_house(house_num)

                    lines.append(
                        f"House {house_num} ({cusp.lord.value}): "
                        f"{cusp.sign.name} {cusp.sign_degree:.2f}°"
                    )
                    if occupants:
                        lines.append(
                            f"  Occupants: {', '.join(p.value for p in occupants)}"
                        )
                    lines.append("")

        # KP Significators
        if chart.kp_significators:
            lines.append("=" * 70)
            lines.append("KP SIGNIFICATORS")
            lines.append("=" * 70)
            lines.append("")

            for house_num, significators in sorted(
                chart.kp_significators.items()
            ):
                sig_str = " > ".join(
                    p.value for p in significators[:5]
                )  # Top 5
                lines.append(f"House {house_num}: {sig_str}")
            lines.append("")

        # All predictions
        if chart.predictions:
            lines.append("=" * 70)
            lines.append("COMPLETE PREDICTIONS")
            lines.append("=" * 70)
            lines.append("")

            for system in ["Parashari", "KP", "Nadi"]:
                sys_preds = [
                    p for p in chart.predictions if p.system == system
                ]
                if sys_preds:
                    lines.append(f"\n{system.upper()}\n")
                    for pred in sys_preds:
                        lines.append(f"Category:  {pred.category}")
                        lines.append(f"Confidence: {pred.confidence * 100:.0f}%")
                        lines.append(f"Prediction: {pred.prediction}")
                        if pred.timing:
                            lines.append(f"Timing: {pred.timing}")
                        if pred.supporting_factors:
                            lines.append(
                                f"Factors: {', '.join(pred.supporting_factors)}"
                            )
                        if pred.remedies:
                            lines.append(
                                f"Remedies: {', '.join(pred.remedies)}"
                            )
                        lines.append("")

        lines.append("=" * 70)
        lines.append(
            f"Report generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}"
        )
        lines.append("=" * 70)

        return "\n".join(lines)
