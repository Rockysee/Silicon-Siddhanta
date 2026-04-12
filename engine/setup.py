from setuptools import setup, find_packages

setup(
    name="silicon_siddhanta",
    version="1.0.0",
    description="Multi-System Vedic Astrology Engine (Parashari + KP + Nadi)",
    author="Hemant Thackeray",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[
        "pyswisseph>=2.10",
        "pytz>=2024.1",
        "timezonefinder>=6.0",
        "geopy>=2.4",
    ],
    entry_points={
        "console_scripts": [
            "siddhanta=silicon_siddhanta.cli:main",
        ]
    },
)
