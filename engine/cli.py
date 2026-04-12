#!/usr/bin/env python3
"""
cli.py — Silicon Siddhanta Command-Line Interface

Usage:
    python -m silicon_siddhanta.cli chart --name "Hemant" --date 27/03/1980 --time 11:45 \
        --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz "Asia/Kolkata"

    python -m silicon_siddhanta.cli chart --name "Hemant" --date 27/03/1980 --time 11:45 \
        --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz "Asia/Kolkata" --report full

    python -m silicon_siddhanta.cli dasha --name "Hemant" --date 27/03/1980 --time 11:45 \
        --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz "Asia/Kolkata"

    python -m silicon_siddhanta.cli predict --name "Hemant" --date 27/03/1980 --time 11:45 \
        --place "Kalyan" --lat 19.2437 --lon 73.1355 --tz "Asia/Kolkata" --category Career
"""

import argparse
import sys
from datetime import datetime

from silicon_siddhanta.orchestrator import SiliconSiddhanta
from silicon_siddhanta.core.types import Ayanamsha, Planet, House


def parse_date(date_str: str) -> tuple:
    """Parse DD/MM/YYYY date string."""
    parts = date_str.split("/")
    if len(parts) != 3:
        raise ValueError(f"Invalid date format: {date_str}. Use DD/MM/YYYY")
    return int(parts[2]), int(parts[1]), int(parts[0])


def parse_time(time_str: str) -> tuple:
    """Parse HH:MM or HH:MM:SS time string."""
    parts = time_str.split(":")
    hour = int(parts[0])
    minute = int(parts[1]) if len(parts) > 1 else 0
    second = int(parts[2]) if len(parts) > 2 else 0
    return hour, minute, second


def cmd_chart(args, engine):
    """Generate and display birth chart."""
    year, month, day = parse_date(args.date)
    hour, minute, second = parse_time(args.time)

    chart = engine.generate_chart(
        name=args.name,
        year=year, month=month, day=day,
        hour=hour, minute=minute, second=second,
        place_name=args.place,
        latitude=args.lat, longitude=args.lon,
        timezone_str=args.tz
    )

    if args.report == "full":
        if hasattr(engine, 'detailed_report'):
            print(engine.detailed_report(chart))
        else:
            print(engine.summary(chart))
            print()
            # Extended output
            print("─── ALL PREDICTIONS ───")
            for p in chart.predictions:
                print(f"  [{p.system:10s}] {p.category:20s} ({p.confidence*100:.0f}%)")
                print(f"             {p.prediction}")
                if p.remedies:
                    print(f"             Remedies: {', '.join(p.remedies[:3])}")
                print()
    else:
        print(engine.summary(chart))

    return chart


def cmd_dasha(args, engine):
    """Display Vimshottari Dasha periods."""
    year, month, day = parse_date(args.date)
    hour, minute, second = parse_time(args.time)

    chart = engine.generate_chart(
        name=args.name,
        year=year, month=month, day=day,
        hour=hour, minute=minute, second=second,
        place_name=args.place,
        latitude=args.lat, longitude=args.lon,
        timezone_str=args.tz
    )

    print(f"╔══ VIMSHOTTARI DASHA — {chart.birth_data.name} ══╗")
    print(f"Moon: {chart.planets[Planet.MOON].nakshatra.name} "
          f"(Lord: {chart.planets[Planet.MOON].nakshatra_lord.value})")
    print()

    now = datetime.utcnow()
    current_dasha = engine.get_current_dasha(chart)
    print(f"Current Period: {current_dasha}")
    print()

    for md in chart.dashas:
        is_current = md.start <= now <= md.end
        marker = " ◄── CURRENT" if is_current else ""
        print(f"{'='*60}")
        print(f"  {md.lord.value} Maha Dasha: "
              f"{md.start.strftime('%d/%m/%Y')} to {md.end.strftime('%d/%m/%Y')}"
              f"  ({md.duration_years:.1f} yrs){marker}")

        if is_current or args.detail:
            for ad in md.sub_periods:
                is_cur_ad = ad.start <= now <= ad.end
                ad_marker = " ◄" if is_cur_ad else ""
                print(f"    {md.lord.value}-{ad.lord.value}: "
                      f"{ad.start.strftime('%d/%m/%Y')} to {ad.end.strftime('%d/%m/%Y')}"
                      f"{ad_marker}")

                if is_cur_ad:
                    for pd in ad.sub_periods:
                        is_cur_pd = pd.start <= now <= pd.end
                        pd_marker = " ◄" if is_cur_pd else ""
                        print(f"      {md.lord.value}-{ad.lord.value}-{pd.lord.value}: "
                              f"{pd.start.strftime('%d/%m/%Y')} to {pd.end.strftime('%d/%m/%Y')}"
                              f"{pd_marker}")

    print(f"{'='*60}")


def cmd_predict(args, engine):
    """Display predictions for a specific category."""
    year, month, day = parse_date(args.date)
    hour, minute, second = parse_time(args.time)

    chart = engine.generate_chart(
        name=args.name,
        year=year, month=month, day=day,
        hour=hour, minute=minute, second=second,
        place_name=args.place,
        latitude=args.lat, longitude=args.lon,
        timezone_str=args.tz
    )

    preds = engine.get_predictions(chart, category=args.category if args.category != "all" else None)

    print(f"╔══ PREDICTIONS — {chart.birth_data.name} ══╗")
    if args.category and args.category != "all":
        print(f"Category: {args.category}")
    print()

    for p in sorted(preds, key=lambda x: x.confidence, reverse=True):
        conf_bar = "█" * int(p.confidence * 10) + "░" * (10 - int(p.confidence * 10))
        print(f"  [{p.system:10s}] {p.category}")
        print(f"  Confidence: [{conf_bar}] {p.confidence*100:.0f}%")
        print(f"  {p.prediction}")
        if p.supporting_factors:
            print(f"  Factors: {', '.join(p.supporting_factors[:5])}")
        if p.remedies:
            print(f"  Remedies: {', '.join(p.remedies[:3])}")
        if p.timing:
            print(f"  Timing: {p.timing}")
        print()


def main():
    parser = argparse.ArgumentParser(
        prog="silicon_siddhanta",
        description="Silicon Siddhanta — Multi-System Vedic Astrology Engine"
    )
    parser.add_argument("--ayanamsha", default="lahiri",
                        choices=["lahiri", "kp", "raman"],
                        help="Ayanamsha model (default: lahiri)")

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Common arguments for all subcommands
    def add_birth_args(sub):
        sub.add_argument("--name", required=True, help="Name of the person")
        sub.add_argument("--date", required=True, help="Birth date (DD/MM/YYYY)")
        sub.add_argument("--time", required=True, help="Birth time (HH:MM or HH:MM:SS)")
        sub.add_argument("--place", default="", help="Birth place name")
        sub.add_argument("--lat", type=float, required=True, help="Latitude")
        sub.add_argument("--lon", type=float, required=True, help="Longitude")
        sub.add_argument("--tz", default="", help="Timezone (IANA, e.g., Asia/Kolkata)")

    # chart command
    chart_parser = subparsers.add_parser("chart", help="Generate birth chart")
    add_birth_args(chart_parser)
    chart_parser.add_argument("--report", choices=["summary", "full"], default="summary",
                              help="Report level (default: summary)")

    # dasha command
    dasha_parser = subparsers.add_parser("dasha", help="Show Vimshottari Dasha")
    add_birth_args(dasha_parser)
    dasha_parser.add_argument("--detail", action="store_true",
                              help="Show all antar dashas (not just current)")

    # predict command
    predict_parser = subparsers.add_parser("predict", help="Show predictions")
    add_birth_args(predict_parser)
    predict_parser.add_argument("--category", default="all",
                                help="Filter by category (Career, Marriage, Health, etc.)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Map ayanamsha string to enum
    ayan_map = {
        "lahiri": Ayanamsha.LAHIRI,
        "kp": Ayanamsha.KP,
        "raman": Ayanamsha.RAMAN,
    }
    engine = SiliconSiddhanta(ayan_map[args.ayanamsha])

    if args.command == "chart":
        cmd_chart(args, engine)
    elif args.command == "dasha":
        cmd_dasha(args, engine)
    elif args.command == "predict":
        cmd_predict(args, engine)


if __name__ == "__main__":
    main()
