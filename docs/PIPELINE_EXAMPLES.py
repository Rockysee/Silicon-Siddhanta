#!/usr/bin/env python3
"""
YouTube Transcript Pipeline - Usage Examples

This file contains practical examples demonstrating all major functions
of the youtube_transcript_pipeline.py module.

Each example is self-contained and can be run independently.

Usage:
    python PIPELINE_EXAMPLES.py  # Runs all examples
    python -c "from PIPELINE_EXAMPLES import example_1; example_1()"  # Run single example
"""

from youtube_transcript_pipeline import (
    search_channel_videos,
    download_transcript,
    batch_download_transcripts,
    clean_transcript,
    translate_transcript,
    extract_astrological_terms,
    generate_summary_report,
    JYOTISH_TERMS,
)
from pathlib import Path
import json


# =============================================================================
# EXAMPLE 1: Basic Video Search
# =============================================================================

def example_1_basic_search():
    """
    Example 1: Search YouTube for videos matching a query.

    This is the starting point - find videos before downloading transcripts.
    """
    print("\n" + "="*80)
    print("EXAMPLE 1: Basic Video Search")
    print("="*80)

    # Search for videos
    query = "Brajesh Gautam Jyotish"
    max_results = 5

    print(f"\nSearching for: '{query}'")
    print(f"Max results: {max_results}")

    videos = search_channel_videos(query, max_results=max_results)

    if not videos:
        print("No videos found!")
        return

    print(f"\nFound {len(videos)} videos:\n")

    for i, video in enumerate(videos, 1):
        print(f"{i}. {video['title'][:70]}")
        print(f"   ID: {video['id']}")
        print(f"   URL: {video['url']}\n")

    return videos


# =============================================================================
# EXAMPLE 2: Download Single Transcript
# =============================================================================

def example_2_single_transcript():
    """
    Example 2: Download transcript from a single video.

    Downloads Hindi auto-generated captions for one video.
    """
    print("\n" + "="*80)
    print("EXAMPLE 2: Download Single Transcript")
    print("="*80)

    # Use a well-known video ID (you can replace with your own)
    # Note: Not all videos have Hindi transcripts
    video_id = "dQw4w9WgXcQ"  # Example - will likely fail, just for demo

    print(f"\nDownloading transcript for video: {video_id}")
    print("Attempting languages: Hindi (hi), English (en)\n")

    output_dir = "./example_transcripts"

    filepath = download_transcript(
        video_id,
        languages=['hi', 'en'],
        output_dir=output_dir
    )

    if filepath:
        print(f"\nSuccess! Saved to: {filepath}")

        # Show file info
        file_size = Path(filepath).stat().st_size
        print(f"File size: {file_size:,} bytes")

        # Show first 200 chars
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"\nFirst 200 characters:")
        print(content[:200])
    else:
        print("Failed to download transcript.")
        print("Note: Not all videos have available transcripts.")
        print("Try with a different video ID that has Hindi captions enabled.")

    return filepath


# =============================================================================
# EXAMPLE 3: Batch Download Multiple Transcripts
# =============================================================================

def example_3_batch_download():
    """
    Example 3: Download transcripts for multiple videos at once.

    Demonstrates batch processing with rate limiting and error handling.
    """
    print("\n" + "="*80)
    print("EXAMPLE 3: Batch Download Multiple Transcripts")
    print("="*80)

    # List of video IDs to download
    # Replace with actual IDs from videos that have Hindi transcripts
    video_ids = [
        "dQw4w9WgXcQ",
        "jNQXAC9IVRw",
        "9bZkp7q19f0",
    ]

    print(f"\nDownloading {len(video_ids)} transcripts...")
    print("(Note: These are example IDs - may not have Hindi transcripts)")

    output_dir = "./example_transcripts/batch"

    # Download all
    results = batch_download_transcripts(
        video_ids,
        output_dir=output_dir,
        languages=['hi']
    )

    # Show results
    print("\n\nResults:")
    print("-" * 80)

    successful = 0
    for video_id, filepath in results.items():
        if filepath:
            print(f"✓ {video_id}: Downloaded to {filepath}")
            successful += 1
        else:
            print(f"✗ {video_id}: Failed (may not have Hindi transcripts)")

    print(f"\nSummary: {successful}/{len(video_ids)} successful downloads")

    return results


# =============================================================================
# EXAMPLE 4: Clean Transcript Text
# =============================================================================

def example_4_clean_transcript():
    """
    Example 4: Clean raw transcript by removing artifacts.

    Removes timestamps, URLs, duplicates, and extra whitespace.
    """
    print("\n" + "="*80)
    print("EXAMPLE 4: Clean Transcript Text")
    print("="*80)

    # Sample raw transcript with artifacts
    raw_transcript = """
00:00:15 नमस्ते सभी को स्वागत है
00:00:20 नमस्ते सभी को स्वागत है
00:00:25 आज हम बात करेंगे सूर्य के बारे में
00:00:30 सूर्य ग्रह बहुत महत्वपूर्ण है
Visit https://example.com for more info
00:00:35 सूर्य ग्रह बहुत महत्वपूर्ण है
00:00:40 चंद्र भी महत्वपूर्ण है
&nbsp; &lt; &gt;
01:00:00 धन्यवाद
    """

    print("Original transcript (with artifacts):")
    print("-" * 80)
    print(raw_transcript)
    print("-" * 80)
    print(f"Length: {len(raw_transcript)} characters")

    # Clean it
    cleaned = clean_transcript(raw_transcript)

    print("\n\nCleaned transcript:")
    print("-" * 80)
    print(cleaned)
    print("-" * 80)
    print(f"Length: {len(cleaned)} characters")
    print(f"\nReduction: {len(raw_transcript) - len(cleaned)} characters removed")


# =============================================================================
# EXAMPLE 5: Extract Astrological Terms
# =============================================================================

def example_5_extract_terms():
    """
    Example 5: Find and count astrological terms in text.

    Searches for ~150 Jyotish terms (Hindi and English).
    """
    print("\n" + "="*80)
    print("EXAMPLE 5: Extract Astrological Terms")
    print("="*80)

    # Sample text with astrological content
    sample_text = """
    सूर्य नवम भाव में है और यह बहुत शुभ है।
    चंद्र राशि में मजबूत है।
    मंगल और शुक्र का योग दिख रहा है।
    The Sun in 9th house is very auspicious.
    Moon is strong in the chart.
    Jupiter is the lord of 5th and 8th house.
    Mars-Venus conjunction forms a powerful yoga.
    राहु और केतु का असर भी देखना चाहिए।
    Rahu in 7th creates some challenges.
    नक्षत्र अश्लेषा से लेकर मृगशिरा तक का असर है।
    """

    print("Sample text:")
    print("-" * 80)
    print(sample_text)
    print("-" * 80)

    # Extract terms
    terms = extract_astrological_terms(sample_text)

    if not terms:
        print("No astrological terms found!")
        return

    print(f"\n\nFound {len(terms)} unique astrological terms:\n")

    # Sort by frequency
    sorted_terms = sorted(terms.items(), key=lambda x: x[1], reverse=True)

    for term, count in sorted_terms[:20]:  # Show top 20
        bar = "█" * count
        print(f"{term:45s} : {count:2d} {bar}")


# =============================================================================
# EXAMPLE 6: Translate Hindi to English
# =============================================================================

def example_6_translate():
    """
    Example 6: Translate Hindi text to English.

    Uses Google Translate via deep-translator library.
    Automatically handles chunking for long texts.
    """
    print("\n" + "="*80)
    print("EXAMPLE 6: Translate Hindi to English")
    print("="*80)

    # Sample Hindi text
    hindi_text = """
    सूर्य नवम भाव में होने से व्यक्ति को उच्च शिक्षा मिलती है।
    चंद्र राशि में मजबूत होने से मन स्थिर रहता है।
    मंगल की स्थिति से साहस और बल मिलता है।
    शुक्र की कृपा से विषय भोग का आनंद मिलता है।
    शनि सूर्य का परिणाम बहुत महत्वपूर्ण है।
    """

    print("Hindi text:")
    print("-" * 80)
    print(hindi_text)
    print("-" * 80)
    print(f"Length: {len(hindi_text)} characters\n")

    print("Translating to English...")
    print("(This may take 10-30 seconds depending on text length)\n")

    try:
        english_text = translate_transcript(hindi_text)

        print("English translation:")
        print("-" * 80)
        print(english_text)
        print("-" * 80)
        print(f"Length: {len(english_text)} characters")

    except Exception as e:
        print(f"Translation error: {e}")
        print("Note: Translation requires internet connection")


# =============================================================================
# EXAMPLE 7: Generate Summary Report
# =============================================================================

def example_7_summary_report():
    """
    Example 7: Generate comprehensive analysis report.

    Creates a summary of all transcripts in a directory.
    """
    print("\n" + "="*80)
    print("EXAMPLE 7: Generate Summary Report")
    print("="*80)

    # Use example transcripts directory
    transcripts_dir = "./example_transcripts"

    print(f"\nGenerating report for: {transcripts_dir}\n")

    # Generate report
    report = generate_summary_report(transcripts_dir)

    # Show report
    print(report)

    # Save to file
    report_path = Path(transcripts_dir) / "summary_report.txt"
    report_path.parent.mkdir(parents=True, exist_ok=True)

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"\n\nReport saved to: {report_path}")


# =============================================================================
# EXAMPLE 8: Explore Astrological Terms Dictionary
# =============================================================================

def example_8_jyotish_terms():
    """
    Example 8: Explore the built-in astrological terms dictionary.

    Shows structure and categories of ~150 terms.
    """
    print("\n" + "="*80)
    print("EXAMPLE 8: Jyotish Terms Dictionary")
    print("="*80)

    print(f"\nTotal terms: {len(JYOTISH_TERMS)}\n")

    # Categorize terms
    planets = [v for v in JYOTISH_TERMS.values() if v in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']]
    houses = [v for v in JYOTISH_TERMS.values() if 'House' in v or 'Ascendant' in v]
    nakshatras = [v for v in JYOTISH_TERMS.values() if v.endswith(('i', 'a')) and len(v) > 4]

    print("CATEGORY BREAKDOWN:")
    print("-" * 80)
    print(f"Planets (Navagraha): {len(set(planets))} terms")
    print(f"Houses (Bhavas): {len(set(houses))} terms")
    print(f"Lunar Mansions (Nakshatras): ~27 terms")
    print(f"Yogas (Combinations): ~20+ terms")
    print(f"Dashas (Periods): 7+ terms")
    print(f"Other concepts: ~60+ terms")

    print("\n\nPLANETS INCLUDED:")
    print("-" * 80)
    planets_set = set(planets)
    for p in sorted(planets_set):
        # Find Hindi equivalent
        hindi = [k for k, v in JYOTISH_TERMS.items() if v == p][0]
        print(f"  {p:15s} ({hindi})")

    print("\n\nSAMPLE TERMS:")
    print("-" * 80)
    for i, (hindi, english) in enumerate(list(JYOTISH_TERMS.items())[:20], 1):
        print(f"{i:2d}. {english:30s} → {hindi}")

    print(f"\n... and {len(JYOTISH_TERMS) - 20} more terms")


# =============================================================================
# EXAMPLE 9: Complete Processing Workflow
# =============================================================================

def example_9_complete_workflow():
    """
    Example 9: Complete workflow from search to analysis.

    Demonstrates end-to-end processing of videos.
    """
    print("\n" + "="*80)
    print("EXAMPLE 9: Complete Processing Workflow")
    print("="*80)

    workflow = """
    COMPLETE WORKFLOW STEPS:

    1. SEARCH
       └─ search_channel_videos(query, max_results)
          └─ Returns list of videos with ID, title, URL

    2. DOWNLOAD
       └─ batch_download_transcripts(video_ids, output_dir)
          └─ Downloads Hindi transcripts to files

    3. CLEAN
       └─ clean_transcript(raw_text)
          └─ Removes timestamps, URLs, duplicates

    4. ANALYZE
       └─ extract_astrological_terms(text)
          └─ Finds ~150 Jyotish terms, counts occurrences

    5. TRANSLATE (Optional)
       └─ translate_transcript(hindi_text)
          └─ Converts Hindi to English

    6. REPORT
       └─ generate_summary_report(transcripts_dir)
          └─ Creates comprehensive analysis report

    TYPICAL EXECUTION TIME:
    - Search: 2-3 seconds
    - Download 10 videos: 20-30 seconds
    - Clean & Analyze: 1-2 seconds
    - Translate: 30-60 seconds per 10,000 characters
    - Report generation: 2-3 seconds
    """

    print(workflow)

    print("\nCODE EXAMPLE:")
    print("-" * 80)

    code_example = '''
# 1. Search for videos
videos = search_channel_videos("Brajesh Gautam", max_results=10)
video_ids = [v['id'] for v in videos]

# 2. Download transcripts
results = batch_download_transcripts(video_ids, output_dir="./transcripts")

# 3. Process each transcript
all_terms = {}
for filepath in Path("./transcripts").glob("*.txt"):
    with open(filepath) as f:
        raw = f.read()

    clean = clean_transcript(raw)
    terms = extract_astrological_terms(clean)
    all_terms[filepath.name] = terms

# 4. Generate report
report = generate_summary_report("./transcripts")
print(report)
    '''

    print(code_example)


# =============================================================================
# EXAMPLE 10: Custom Analysis Functions
# =============================================================================

def example_10_custom_analysis():
    """
    Example 10: Create custom analysis based on pipeline functions.

    Shows how to extend the pipeline for specific needs.
    """
    print("\n" + "="*80)
    print("EXAMPLE 10: Custom Analysis Functions")
    print("="*80)

    # Sample function: Analyze planet emphasis
    def analyze_planet_emphasis(text):
        """Find which planets are most discussed."""
        planets = {
            'Sun (सूर्य)': 0,
            'Moon (चंद्र)': 0,
            'Mars (मंगल)': 0,
            'Mercury (बुध)': 0,
            'Jupiter (बृहस्पति)': 0,
            'Venus (शुक्र)': 0,
            'Saturn (शनि)': 0,
            'Rahu (राहु)': 0,
            'Ketu (केतु)': 0,
        }

        terms = extract_astrological_terms(text)

        for planet in planets.keys():
            for term, count in terms.items():
                if planet.split('(')[1].split(')')[0] in term or planet.split()[0] in term:
                    planets[planet] += count

        return sorted(planets.items(), key=lambda x: x[1], reverse=True)

    # Sample function: Find house focus
    def analyze_house_focus(text):
        """Find which houses are most discussed."""
        houses = {}

        for i in range(1, 13):
            house_names = [f"{i}th house", f"{i}th House", f"{i} house"]
            hindi_house_key = None

            for key, val in JYOTISH_TERMS.items():
                if f"{i}th House" in val or f"House" in val and i <= 12:
                    hindi_house_key = key
                    break

            count = sum(text.count(name) for name in house_names)
            if count > 0:
                houses[f"House {i}"] = count

        return sorted(houses.items(), key=lambda x: x[1], reverse=True)

    # Sample text
    sample = """
    सूर्य नवम भाव में शुभ है।
    चंद्र पञ्चम भाव में है।
    Jupiter is in 5th house, Mars in 7th house.
    सूर्य की स्थिति बहुत महत्वपूर्ण है।
    Moon and Mercury conjunction in 3rd house.
    शनि सप्तम भाव में है - विवाह में समस्या।
    """

    print("\nSample text:")
    print("-" * 80)
    print(sample)
    print()

    # Analyze planets
    print("\nPLANET EMPHASIS:")
    print("-" * 80)
    planets = analyze_planet_emphasis(sample)
    for planet, count in planets[:5]:
        if count > 0:
            print(f"{planet:30s} : {count} mentions")

    # Analyze houses
    print("\nHOUSE FOCUS:")
    print("-" * 80)
    houses = analyze_house_focus(sample)
    for house, count in houses[:5]:
        if count > 0:
            print(f"{house:30s} : {count} mentions")


# =============================================================================
# MAIN - Run All Examples
# =============================================================================

def main():
    """Run all examples."""
    examples = [
        ("Basic Search", example_1_basic_search),
        ("Single Transcript Download", example_2_single_transcript),
        ("Batch Download", example_3_batch_download),
        ("Clean Transcript", example_4_clean_transcript),
        ("Extract Terms", example_5_extract_terms),
        ("Translate Text", example_6_translate),
        ("Summary Report", example_7_summary_report),
        ("Jyotish Terms", example_8_jyotish_terms),
        ("Complete Workflow", example_9_complete_workflow),
        ("Custom Analysis", example_10_custom_analysis),
    ]

    print("\n" + "="*80)
    print("YOUTUBE TRANSCRIPT PIPELINE - USAGE EXAMPLES")
    print("="*80)
    print("\nAvailable examples:")
    for i, (name, _) in enumerate(examples, 1):
        print(f"  {i}. {name}")

    print("\nRunning all examples...\n")

    for name, func in examples:
        try:
            func()
        except Exception as e:
            print(f"\nERROR in {name}: {e}")
            import traceback
            traceback.print_exc()

    print("\n" + "="*80)
    print("ALL EXAMPLES COMPLETED")
    print("="*80)
    print("\nFor detailed documentation, see: YOUTUBE_PIPELINE_SETUP.md")
    print("For quick examples, see: QUICK_START.md")


if __name__ == "__main__":
    main()
