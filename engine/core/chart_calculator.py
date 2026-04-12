"""
core/chart_calculator.py — Silicon Siddhanta
Birth Chart Calculator using Swiss Ephemeris

Computes actual planetary positions, house cusps, nakshatras,
and KP sub-lord chains from real astronomical data.

This is the FOUNDATION layer — all other modules depend on its output.
"""

import swisseph as swe
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Tuple
from timezonefinder import TimezoneFinder
import math

from .types import (
    Planet, Sign, Nakshatra, House, Ayanamsha,
    GeoLocation, BirthData, PlanetPosition, HouseCusp, BirthChart
)

# ═══════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

# Swiss Ephemeris planet IDs
SWE_PLANETS = {
    Planet.SUN: swe.SUN,
    Planet.MOON: swe.MOON,
    Planet.MARS: swe.MARS,
    Planet.MERCURY: swe.MERCURY,
    Planet.JUPITER: swe.JUPITER,
    Planet.VENUS: swe.VENUS,
    Planet.SATURN: swe.SATURN,
    Planet.RAHU: swe.MEAN_NODE,   # Mean Rahu (standard in Vedic)
}

# Ayanamsha IDs for Swiss Ephemeris
SWE_AYANAMSHA = {
    Ayanamsha.LAHIRI: swe.SIDM_LAHIRI,
    Ayanamsha.KP: swe.SIDM_KRISHNAMURTI,
    Ayanamsha.RAMAN: swe.SIDM_RAMAN,
    Ayanamsha.TRUE_CHITRAPAKSHA: swe.SIDM_TRUE_CITRA,
}

# Exaltation signs and exact degrees
EXALTATION = {
    Planet.SUN: (Sign.ARIES, 10.0),
    Planet.MOON: (Sign.TAURUS, 3.0),
    Planet.MARS: (Sign.CAPRICORN, 28.0),
    Planet.MERCURY: (Sign.VIRGO, 15.0),
    Planet.JUPITER: (Sign.CANCER, 5.0),
    Planet.VENUS: (Sign.PISCES, 27.0),
    Planet.SATURN: (Sign.LIBRA, 20.0),
    Planet.RAHU: (Sign.TAURUS, 20.0),
    Planet.KETU: (Sign.SCORPIO, 20.0),
}

# Debilitation (opposite of exaltation)
DEBILITATION = {
    Planet.SUN: (Sign.LIBRA, 10.0),
    Planet.MOON: (Sign.SCORPIO, 3.0),
    Planet.MARS: (Sign.CANCER, 28.0),
    Planet.MERCURY: (Sign.PISCES, 15.0),
    Planet.JUPITER: (Sign.CAPRICORN, 5.0),
    Planet.VENUS: (Sign.VIRGO, 27.0),
    Planet.SATURN: (Sign.ARIES, 20.0),
    Planet.RAHU: (Sign.SCORPIO, 20.0),
    Planet.KETU: (Sign.TAURUS, 20.0),
}

# Mool Trikona ranges: (sign, start_degree, end_degree)
MOOL_TRIKONA = {
    Planet.SUN: (Sign.LEO, 0.0, 20.0),
    Planet.MOON: (Sign.TAURUS, 3.0, 30.0),
    Planet.MARS: (Sign.ARIES, 0.0, 12.0),
    Planet.MERCURY: (Sign.VIRGO, 15.0, 20.0),
    Planet.JUPITER: (Sign.SAGITTARIUS, 0.0, 10.0),
    Planet.VENUS: (Sign.LIBRA, 0.0, 15.0),
    Planet.SATURN: (Sign.AQUARIUS, 0.0, 20.0),
}

# Combustion degrees (distance from Sun for each planet)
COMBUSTION_DEGREES = {
    Planet.MOON: 12.0,
    Planet.MARS: 17.0,
    Planet.MERCURY: 14.0,  # 12° if retrograde
    Planet.JUPITER: 11.0,
    Planet.VENUS: 10.0,   # 8° if retrograde
    Planet.SATURN: 15.0,
}

# ═══════════════════════════════════════════════════════════════════════════
# KP SUB-LORD TABLE (249 subdivisions)
# ═══════════════════════════════════════════════════════════════════════════

# Vimshottari dasha years (proportional span of each planet's sub)
DASHA_YEARS = {
    Planet.KETU: 7, Planet.VENUS: 20, Planet.SUN: 6,
    Planet.MOON: 10, Planet.MARS: 7, Planet.RAHU: 18,
    Planet.JUPITER: 16, Planet.SATURN: 19, Planet.MERCURY: 17,
}
DASHA_SEQUENCE = [
    Planet.KETU, Planet.VENUS, Planet.SUN, Planet.MOON,
    Planet.MARS, Planet.RAHU, Planet.JUPITER, Planet.SATURN, Planet.MERCURY
]
TOTAL_DASHA_YEARS = 120


def build_kp_sub_table() -> List[Tuple[float, float, Planet, Planet, Planet]]:
    """
    Build the complete KP 249-subdivision table.
    Returns list of (start_deg, end_deg, star_lord, sub_lord, sub_sub_lord).
    Each nakshatra (13°20') is divided into 9 subs proportional to dasha years.
    Each sub is further divided into 9 sub-subs.
    """
    table = []
    nakshatra_span = 13.0 + 20.0 / 60.0  # 13.33333...°

    for nak_idx in range(27):
        nak_start = nak_idx * nakshatra_span
        star_lord = DASHA_SEQUENCE[nak_idx % 9]

        # Sub divisions within this nakshatra
        sub_start = nak_start
        # Start sub sequence from the star lord's position in dasha sequence
        star_lord_idx = DASHA_SEQUENCE.index(star_lord)

        for sub_offset in range(9):
            sub_lord = DASHA_SEQUENCE[(star_lord_idx + sub_offset) % 9]
            sub_span = nakshatra_span * DASHA_YEARS[sub_lord] / TOTAL_DASHA_YEARS
            sub_end = sub_start + sub_span

            # Sub-sub divisions
            ss_start = sub_start
            sub_lord_idx = DASHA_SEQUENCE.index(sub_lord)

            for ss_offset in range(9):
                ss_lord = DASHA_SEQUENCE[(sub_lord_idx + ss_offset) % 9]
                ss_span = sub_span * DASHA_YEARS[ss_lord] / TOTAL_DASHA_YEARS
                ss_end = ss_start + ss_span

                table.append((ss_start, ss_end, star_lord, sub_lord, ss_lord))
                ss_start = ss_end

            sub_start = sub_end

    return table


# Pre-build the table at module load
KP_SUB_TABLE = build_kp_sub_table()


def get_kp_sublords(longitude: float) -> Tuple[Planet, Planet, Planet]:
    """
    Get star lord, sub lord, and sub-sub lord for a given sidereal longitude.
    Uses binary-style search on the pre-built KP table.
    """
    lon = longitude % 360.0

    # Quick calculation for star lord (nakshatra lord)
    nak_span = 13.0 + 20.0 / 60.0
    nak_idx = int(lon / nak_span)
    if nak_idx >= 27:
        nak_idx = 26
    star_lord = DASHA_SEQUENCE[nak_idx % 9]

    # Search sub and sub-sub from the table
    for start, end, sl, sub, subsub in KP_SUB_TABLE:
        if start <= lon < end:
            return sl, sub, subsub

    # Edge case: exact 360°
    last = KP_SUB_TABLE[-1]
    return last[2], last[3], last[4]


# ═══════════════════════════════════════════════════════════════════════════
# CHART CALCULATOR
# ═══════════════════════════════════════════════════════════════════════════

class ChartCalculator:
    """
    Core chart computation engine.
    Takes birth data → produces complete BirthChart with real planetary positions.
    """

    def __init__(self, ayanamsha: Ayanamsha = Ayanamsha.LAHIRI):
        self.ayanamsha = ayanamsha
        swe.set_ephe_path('')  # Use built-in ephemeris
        self._tf = TimezoneFinder()

    def create_birth_data(
        self,
        name: str,
        year: int, month: int, day: int,
        hour: int, minute: int, second: int = 0,
        place_name: str = "",
        latitude: float = 0.0,
        longitude: float = 0.0,
        timezone_str: str = ""
    ) -> BirthData:
        """Create BirthData from human-readable inputs."""
        if not timezone_str and latitude and longitude:
            timezone_str = self._tf.timezone_at(lat=latitude, lng=longitude) or "UTC"

        import pytz
        local_tz = pytz.timezone(timezone_str)
        local_dt = local_tz.localize(datetime(year, month, day, hour, minute, second))
        utc_dt = local_dt.astimezone(pytz.UTC).replace(tzinfo=None)

        location = GeoLocation(
            name=place_name,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone_str
        )

        return BirthData(
            name=name,
            datetime_utc=utc_dt,
            datetime_local=local_dt.replace(tzinfo=None),
            location=location,
            ayanamsha=self.ayanamsha
        )

    def calculate_chart(self, birth: BirthData) -> BirthChart:
        """
        Main computation: birth data → complete BirthChart.

        Steps:
        1. Compute Julian Day
        2. Set ayanamsha
        3. Calculate all 9 planetary positions (sidereal)
        4. Calculate 12 house cusps (Placidus)
        5. Determine nakshatra, pada, KP sub-lords
        6. Check dignity (exaltation, debilitation, own sign, etc.)
        7. Check combustion, retrograde status
        8. Assign planets to houses
        """
        # Step 1: Julian Day
        dt = birth.datetime_utc
        hour_decimal = dt.hour + dt.minute / 60.0 + dt.second / 3600.0
        jd = swe.julday(dt.year, dt.month, dt.day, hour_decimal)

        # Step 2: Ayanamsha
        swe.set_sid_mode(SWE_AYANAMSHA.get(birth.ayanamsha, swe.SIDM_LAHIRI))
        ayanamsha_val = swe.get_ayanamsa_ut(jd)

        # Step 3: House cusps (Placidus system, sidereal)
        lat = birth.location.latitude
        lon = birth.location.longitude
        cusps_tropical, ascmc = swe.houses(jd, lat, lon, b'P')  # Placidus

        # Convert cusps to sidereal
        cusps_sidereal = [(c - ayanamsha_val) % 360.0 for c in cusps_tropical]
        asc_sidereal = (ascmc[0] - ayanamsha_val) % 360.0
        mc_sidereal = (ascmc[1] - ayanamsha_val) % 360.0

        # Sidereal time
        sid_time = swe.sidtime(jd)

        # Step 4: Calculate planetary positions
        planets = {}
        sun_lon = None

        for planet, swe_id in SWE_PLANETS.items():
            result = swe.calc_ut(jd, swe_id)
            trop_lon = result[0][0]
            lat_val = result[0][1]
            speed = result[0][3]

            sid_lon = (trop_lon - ayanamsha_val) % 360.0

            if planet == Planet.SUN:
                sun_lon = sid_lon

            planets[planet] = self._build_planet_position(
                planet, sid_lon, lat_val, speed, cusps_sidereal, sun_lon
            )

        # Ketu = 180° from Rahu
        rahu_pos = planets[Planet.RAHU]
        ketu_lon = (rahu_pos.longitude + 180.0) % 360.0
        planets[Planet.KETU] = self._build_planet_position(
            Planet.KETU, ketu_lon, -rahu_pos.latitude, rahu_pos.speed,
            cusps_sidereal, sun_lon
        )

        # Step 5: Check combustion for each planet
        if sun_lon is not None:
            for planet in [Planet.MOON, Planet.MARS, Planet.MERCURY,
                           Planet.JUPITER, Planet.VENUS, Planet.SATURN]:
                pos = planets[planet]
                dist = abs(pos.longitude - sun_lon)
                if dist > 180:
                    dist = 360 - dist
                comb_deg = COMBUSTION_DEGREES.get(planet, 999)
                # Reduced combustion for retrograde Mercury/Venus
                if pos.is_retrograde and planet == Planet.MERCURY:
                    comb_deg = 12.0
                elif pos.is_retrograde and planet == Planet.VENUS:
                    comb_deg = 8.0
                pos.is_combust = dist <= comb_deg

        # Step 6: Build house cusps
        houses = {}
        for i in range(12):
            cusp_lon = cusps_sidereal[i]
            sign = Sign(int(cusp_lon / 30.0) % 12)
            sign_deg = cusp_lon % 30.0
            nak_idx = int(cusp_lon / (13.0 + 20.0/60.0))
            if nak_idx >= 27:
                nak_idx = 26
            nak = Nakshatra(nak_idx)

            star_lord, sub_lord, sub_sub = get_kp_sublords(cusp_lon)

            h = House(i + 1)
            houses[h] = HouseCusp(
                house=h,
                longitude=cusp_lon,
                sign=sign,
                sign_degree=sign_deg,
                lord=sign.lord,
                nakshatra=nak,
                nakshatra_lord=star_lord,
                sub_lord=sub_lord,
                sub_sub_lord=sub_sub
            )

        # Step 7: Assemble BirthChart
        asc_sign = Sign(int(asc_sidereal / 30.0) % 12)
        moon_sign = planets[Planet.MOON].sign
        sun_sign = planets[Planet.SUN].sign

        chart = BirthChart(
            birth_data=birth,
            ayanamsha_value=ayanamsha_val,
            julian_day=jd,
            sidereal_time=sid_time,
            planets=planets,
            houses=houses,
            ascendant_degree=asc_sidereal,
            ascendant_sign=asc_sign,
            moon_sign=moon_sign,
            sun_sign=sun_sign,
        )

        return chart

    def _build_planet_position(
        self,
        planet: Planet,
        sid_lon: float,
        latitude: float,
        speed: float,
        cusps: List[float],
        sun_lon: Optional[float]
    ) -> PlanetPosition:
        """Build a complete PlanetPosition from raw longitude."""
        sign = Sign(int(sid_lon / 30.0) % 12)
        sign_deg = sid_lon % 30.0

        # Nakshatra
        nak_span = 13.0 + 20.0 / 60.0
        nak_idx = int(sid_lon / nak_span)
        if nak_idx >= 27:
            nak_idx = 26
        nak = Nakshatra(nak_idx)
        nak_offset = sid_lon - (nak_idx * nak_span)
        pada = min(int(nak_offset / (nak_span / 4.0)) + 1, 4)

        # KP sub-lords
        star_lord, sub_lord, sub_sub = get_kp_sublords(sid_lon)

        # House placement
        house_num = self._find_house(sid_lon, cusps)

        # Dignity
        is_retrograde = speed < 0
        is_exalted = False
        is_debilitated = False
        is_own_sign = False
        is_mool_trikona = False

        if planet in EXALTATION:
            ex_sign, _ = EXALTATION[planet]
            is_exalted = (sign == ex_sign)

        if planet in DEBILITATION:
            deb_sign, _ = DEBILITATION[planet]
            is_debilitated = (sign == deb_sign)

        is_own_sign = (sign.lord == planet)

        if planet in MOOL_TRIKONA:
            mt_sign, mt_start, mt_end = MOOL_TRIKONA[planet]
            if sign == mt_sign and mt_start <= sign_deg <= mt_end:
                is_mool_trikona = True

        return PlanetPosition(
            planet=planet,
            longitude=sid_lon,
            latitude=latitude,
            speed=speed,
            sign=sign,
            sign_degree=sign_deg,
            nakshatra=nak,
            nakshatra_pada=pada,
            nakshatra_lord=star_lord,
            house=house_num,
            is_retrograde=is_retrograde,
            is_combust=False,  # Set later
            is_exalted=is_exalted,
            is_debilitated=is_debilitated,
            is_own_sign=is_own_sign,
            is_mool_trikona=is_mool_trikona,
            sub_lord=sub_lord,
            sub_sub_lord=sub_sub,
        )

    def _find_house(self, longitude: float, cusps: List[float]) -> int:
        """Determine which house a planet falls in (1-12)."""
        lon = longitude % 360.0
        for i in range(12):
            cusp_start = cusps[i]
            cusp_end = cusps[(i + 1) % 12]

            if cusp_start <= cusp_end:
                if cusp_start <= lon < cusp_end:
                    return i + 1
            else:
                # Wraps around 0°/360°
                if lon >= cusp_start or lon < cusp_end:
                    return i + 1

        return 1  # Fallback to first house
