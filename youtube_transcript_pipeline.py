#!/usr/bin/env python3
"""
YouTube Transcript Extraction & Astrological Content Analysis Pipeline

A production-quality Python script for extracting YouTube video transcripts,
processing them for astrological content analysis, and generating summaries
of Jyotish-related educational content.

Module: youtube_transcript_pipeline
Author: Silicon Siddhanta Project
Version: 1.0.0
Last Updated: 2026-04-11

DEPENDENCIES:
    - yt-dlp              : YouTube video discovery and metadata extraction
    - youtube-transcript-api : YouTube caption/transcript API client
    - deep-translator     : Multilingual translation (Google Translate backend)
    - requests            : HTTP library for API calls
    - python-dotenv       : Environment variable management (optional)

INSTALLATION:
    pip install yt-dlp youtube-transcript-api deep-translator requests

USAGE EXAMPLES:
    # Example 1: Search for channel videos and extract transcripts
    >>> api = YouTubeTranscriptApi()
    >>> videos = search_channel_videos("Brajesh Gautam Jyotish", max_results=10)
    >>> batch_download_transcripts(videos, output_dir="./transcripts/hindi")

    # Example 2: Download transcript from specific video ID
    >>> download_transcript("dQw4w9WgXcQ", languages=['hi'],
    ...                     output_dir="./transcripts")

    # Example 3: Process and translate transcripts
    >>> hindi_text = open("transcripts/hindi/video.txt").read()
    >>> english_text = translate_transcript(hindi_text)
    >>> terms = extract_astrological_terms(english_text)

    # Example 4: Generate comprehensive report
    >>> report = generate_summary_report("./transcripts")
    >>> print(report)

ETHICAL CONSIDERATIONS:
    1. Public Content Rights: Only download publicly available videos
    2. Auto-Generated Captions: Use auto-generated captions for Hindi content
       which may have accuracy limitations - review manually for critical terms
    3. Research & Educational Use: This tool is designed for educational
       research in astrological knowledge preservation and analysis
    4. Attribution: Always attribute content to original creators
    5. Rate Limiting: Built-in delays respect YouTube's API rate limits
    6. Terms of Service: Review YouTube TOS before bulk downloading
    7. Creator Intent: Use caution with content where creators have
       disabled transcript downloads

ABOUT THIS IMPLEMENTATION:
    This script was developed as part of the Silicon Siddhanta Project to
    extract and preserve teachings from Brajesh Gautam's Jyotish Vidya
    educational videos. It combines:

    - YouTube discovery (yt-dlp): finds videos by channel/search query
    - Transcript extraction (youtube-transcript-api): retrieves Hindi captions
    - Text processing: removes timestamps and duplicate lines
    - Translation pipeline: converts Hindi to English via Google Translate
    - Astrological term extraction: identifies Jyotish-specific vocabulary
    - Summary generation: creates reports of all downloaded content

    The JYOTISH_TERMS dictionary contains ~150 Hindi/Sanskrit astrological
    terms mapped to English equivalents, covering:
    - Navagraha (9 planets)
    - Rashis (12 zodiac signs)
    - Nakshatras (27 lunar mansions)
    - Bhavas (12 houses)
    - Dashas (planetary periods)
    - Yogas (astrological combinations)
    - KP System terminology

OUTPUT STRUCTURE:
    {output_dir}/
    ├── hindi/
    │   ├── video_id_1.txt
    │   ├── video_id_2.txt
    │   └── ...
    ├── english/
    │   ├── video_id_1.txt
    │   ├── video_id_2.txt
    │   └── ...
    ├── metadata.json
    ├── terms_extracted.json
    └── summary_report.txt
"""

import os
import sys
import json
import time
import logging
import re
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Set
from datetime import datetime
from collections import Counter
import subprocess

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("ERROR: youtube-transcript-api not installed")
    print("Install with: pip install youtube-transcript-api")
    sys.exit(1)

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("ERROR: deep-translator not installed")
    print("Install with: pip install deep-translator")
    sys.exit(1)

try:
    import yt_dlp
except ImportError:
    print("ERROR: yt-dlp not installed")
    print("Install with: pip install yt-dlp")
    sys.exit(1)


# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('youtube_transcript_pipeline.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Request delay (seconds) - respect YouTube rate limits
REQUEST_DELAY = 2

# Translation chunk size (Google Translate has limits)
TRANSLATION_CHUNK_SIZE = 4500

# Maximum results per channel search
DEFAULT_MAX_RESULTS = 50

# Supported languages for transcript extraction
SUPPORTED_LANGUAGES = ['hi', 'en', 'sa']  # Hindi, English, Sanskrit


# =============================================================================
# JYOTISH TERMS DICTIONARY
# =============================================================================
# Comprehensive Hindi/Sanskrit astrological terminology mapping
JYOTISH_TERMS = {
    # Navagraha (9 Planets)
    "सूर्य": "Sun",
    "चंद्र": "Moon",
    "मंगल": "Mars",
    "बुध": "Mercury",
    "बृहस्पति": "Jupiter",
    "शुक्र": "Venus",
    "शनि": "Saturn",
    "राहु": "Rahu",
    "केतु": "Ketu",

    # Rashis (12 Zodiac Signs)
    "मेष": "Aries",
    "वृष": "Taurus",
    "मिथुन": "Gemini",
    "कर्क": "Cancer",
    "सिंह": "Leo",
    "कन्या": "Virgo",
    "तुला": "Libra",
    "वृश्चिक": "Scorpio",
    "धनु": "Sagittarius",
    "मकर": "Capricorn",
    "कुम्भ": "Aquarius",
    "मीन": "Pisces",

    # Nakshatras (27 Lunar Mansions)
    "अश्विनी": "Ashwini",
    "भरणी": "Bharani",
    "कृत्तिका": "Krittika",
    "रोहिणी": "Rohini",
    "मृगशिरा": "Mrigashira",
    "आर्द्रा": "Ardra",
    "पुनर्वसु": "Punarvasu",
    "पुष्य": "Pushya",
    "आश्लेषा": "Ashlesha",
    "मघा": "Magha",
    "पूर्वा फाल्गुनी": "Purva Phalguni",
    "उत्तर फाल्गुनी": "Uttara Phalguni",
    "हस्त": "Hasta",
    "चित्रा": "Chitra",
    "स्वाति": "Swati",
    "विशाखा": "Vishakha",
    "अनुराधा": "Anuradha",
    "ज्येष्ठा": "Jyeshtha",
    "मूल": "Mula",
    "पूर्वाषाढ़": "Purva Ashadha",
    "उत्तराषाढ़": "Uttara Ashadha",
    "श्रवण": "Shravan",
    "धनिष्ठा": "Dhanishta",
    "शतभिषक": "Shatabhisha",
    "पूर्व भाद्रपद": "Purva Bhadrapada",
    "उत्तर भाद्रपद": "Uttara Bhadrapada",
    "रेवती": "Revati",

    # Bhavas (12 Houses)
    "लग्न": "Ascendant/1st House",
    "द्वितीय भाव": "2nd House",
    "तृतीय भाव": "3rd House",
    "चतुर्थ भाव": "4th House",
    "पंचम भाव": "5th House",
    "षष्ठ भाव": "6th House",
    "सप्तम भाव": "7th House",
    "अष्टम भाव": "8th House",
    "नवम भाव": "9th House",
    "दशम भाव": "10th House",
    "एकादश भाव": "11th House",
    "द्वादश भाव": "12th House",

    # Important Dashas (Planetary Periods)
    "विंशोत्तरी दशा": "Vimshottari Dasha",
    "राज योग दशा": "Rajyog Dasha",
    "महादशा": "Mahadasha",
    "अंतर्दशा": "Antardasha",
    "प्रत्यंतर्दशा": "Pratyantar Dasha",
    "सूक्ष्मदशा": "Sukshma Dasha",
    "प्राणदशा": "Prana Dasha",

    # Yogas (Astrological Combinations)
    "राज योग": "Rajyog",
    "धन योग": "Dhanyog",
    "विवाह योग": "Vivaah Yog",
    "संतान योग": "Santan Yog",
    "भाग्य योग": "Bhagya Yog",
    "पारिवारिक योग": "Family Yog",
    "करियर योग": "Career Yog",
    "स्वास्थ्य योग": "Health Yog",
    "विदेश योग": "Abroad Yog",
    "शिक्षा योग": "Education Yog",
    "गजकेसरी योग": "Gaj Kesari Yog",
    "पंचमहापुरुष योग": "Panch Maha Purush Yog",
    "चंद्र मंगल योग": "Chandra Mangal Yog",

    # KP System Terminology
    "क्राइष्णमूर्ति पद्धति": "Krishnamurti Paddhati",
    "सबलांश": "Sublord",
    "कुंडली": "Horoscope/Birth Chart",
    "ग्रह": "Planet",
    "भाव": "House/Mansion",
    "नक्षत्र": "Nakshatra",
    "राशि": "Zodiac Sign",
    "अंश": "Degree",
    "कला": "Minute",
    "विकला": "Second",

    # Common Jyotish Concepts
    "शुभ": "Auspicious/Beneficial",
    "अशुभ": "Inauspicious/Malefic",
    "योगकारक": "Yogakaraka",
    "मारक": "Maraka",
    "बलवान": "Strong",
    "दुर्बल": "Weak",
    "चक्र": "Chakra/Circle",
    "त्रिकोण": "Trine",
    "कोण": "Angle",
    "पाप": "Sin/Malefic",
    "पुण्य": "Virtue/Beneficial",
    "गोचर": "Transit",
    "प्रश्न": "Query/Question",
    "प्रश्न कुंडली": "Query Horoscope",
    "ज्ञान": "Knowledge",
    "फल": "Result/Fruit",
    "भविष्य": "Future",
    "वर्तमान": "Present",
    "भूतकाल": "Past",
    "मानव": "Human",
    "जीवन": "Life",
    "मृत्यु": "Death",
    "पुनर्जन्म": "Rebirth",
    "कर्म": "Action/Deed",
    "भाग्य": "Destiny/Luck",
    "साधना": "Practice/Meditation",

    # Additional terms
    "विष्णु": "Vishnu",
    "शिव": "Shiva",
    "ब्रह्मा": "Brahma",
    "त्रिदेव": "Trinity",
    "देवता": "Deity",
    "दुर्गा": "Durga",
    "काली": "Kali",
    "सरस्वती": "Saraswati",
    "लक्ष्मी": "Lakshmi",
}


# =============================================================================
# MAIN FUNCTIONS
# =============================================================================

def search_channel_videos(
    query: str,
    max_results: int = DEFAULT_MAX_RESULTS
) -> List[Dict[str, str]]:
    """
    Search for YouTube videos by channel/topic query using yt-dlp.

    Args:
        query: Search query string (e.g., "Brajesh Gautam Jyotish")
        max_results: Maximum number of videos to retrieve (default: 50)

    Returns:
        List of dictionaries with 'id', 'title', 'url' keys

    Raises:
        Exception: If yt-dlp search fails

    Example:
        >>> videos = search_channel_videos("Brajesh Gautam", max_results=20)
        >>> print(f"Found {len(videos)} videos")
        >>> for video in videos[:3]:
        ...     print(f"{video['title']}: {video['id']}")
    """
    logger.info(f"Searching YouTube for: {query}")

    videos = []
    ydl_opts = {
        'quiet': False,
        'no_warnings': False,
        'extract_flat': 'in_playlist',
        'skip_download': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            search_query = f"ytsearch{max_results}:{query}"
            info = ydl.extract_info(search_query, download=False)

            if 'entries' in info:
                for entry in info['entries']:
                    if entry:
                        videos.append({
                            'id': entry.get('id'),
                            'title': entry.get('title', 'Unknown'),
                            'url': f"https://www.youtube.com/watch?v={entry.get('id')}"
                        })

        logger.info(f"Successfully found {len(videos)} videos")
        return videos

    except Exception as e:
        logger.error(f"Error searching YouTube: {str(e)}")
        raise


def download_transcript(
    video_id: str,
    languages: Optional[List[str]] = None,
    output_dir: str = "./transcripts"
) -> Optional[str]:
    """
    Download transcript for a single YouTube video.

    Args:
        video_id: YouTube video ID (11 characters)
        languages: List of language codes to try (default: ['hi', 'en'])
        output_dir: Directory to save transcript files

    Returns:
        Path to saved transcript file, or None if failed

    Raises:
        Exception: If video not found or has no transcripts

    Example:
        >>> filepath = download_transcript("dQw4w9WgXcQ", languages=['hi'])
        >>> if filepath:
        ...     print(f"Saved to: {filepath}")
    """
    if languages is None:
        languages = ['hi', 'en']

    logger.info(f"Downloading transcript for video: {video_id}")

    # Create output directory structure
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    api = YouTubeTranscriptApi()

    try:
        # Try to get transcript in preferred language
        transcript = None
        for lang in languages:
            try:
                logger.info(f"Attempting to fetch {lang} transcript...")
                transcript_list = api.list_transcripts(video_id)

                # Try to get manually created transcript first
                try:
                    transcript = transcript_list.find_transcript([lang])
                    logger.info(f"Found manually created {lang} transcript")
                    break
                except:
                    # Fall back to auto-generated
                    transcript = transcript_list.find_generated_transcript([lang])
                    logger.info(f"Found auto-generated {lang} transcript")
                    break

            except Exception as e:
                logger.debug(f"Could not find {lang} transcript: {str(e)}")
                continue

        if not transcript:
            logger.warning(f"No transcript found for video {video_id}")
            return None

        # Fetch and save transcript
        transcript_data = transcript.fetch()
        raw_text = "\n".join([entry['text'] for entry in transcript_data])

        # Determine language code used
        lang_code = transcript.language[:2] if hasattr(transcript, 'language') else languages[0]

        # Save to file
        filename = f"{video_id}_{lang_code}.txt"
        filepath = output_path / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(raw_text)

        logger.info(f"Successfully saved transcript to: {filepath}")
        time.sleep(REQUEST_DELAY)  # Rate limiting

        return str(filepath)

    except Exception as e:
        logger.error(f"Error downloading transcript for {video_id}: {str(e)}")
        return None


def batch_download_transcripts(
    video_ids: List[str],
    output_dir: str = "./transcripts",
    languages: Optional[List[str]] = None
) -> Dict[str, str]:
    """
    Download transcripts for multiple videos.

    Args:
        video_ids: List of YouTube video IDs
        output_dir: Directory to save transcripts
        languages: Language codes to attempt (default: ['hi', 'en'])

    Returns:
        Dictionary mapping video_id to filepath

    Example:
        >>> video_ids = ["dQw4w9WgXcQ", "jNQXAC9IVRw"]
        >>> results = batch_download_transcripts(video_ids)
        >>> successful = [v for v, p in results.items() if p]
        >>> print(f"Downloaded {len(successful)}/{len(video_ids)}")
    """
    if languages is None:
        languages = ['hi', 'en']

    logger.info(f"Starting batch download for {len(video_ids)} videos")

    results = {}
    for idx, video_id in enumerate(video_ids, 1):
        logger.info(f"[{idx}/{len(video_ids)}] Processing {video_id}")
        filepath = download_transcript(
            video_id,
            languages=languages,
            output_dir=output_dir
        )
        results[video_id] = filepath

    successful = sum(1 for p in results.values() if p)
    logger.info(f"Batch download complete: {successful}/{len(video_ids)} successful")

    return results


def clean_transcript(raw_text: str) -> str:
    """
    Clean raw transcript text by removing artifacts.

    Removes:
    - Timestamp patterns (e.g., "00:00:15")
    - Duplicate consecutive lines
    - Extra whitespace
    - URLs
    - HTML tags/entities

    Args:
        raw_text: Raw transcript text

    Returns:
        Cleaned text

    Example:
        >>> raw = "00:00:15 Hello there\\nHello there\\nHow are you?"
        >>> clean = clean_transcript(raw)
        >>> print(clean)
        Hello there
        How are you?
    """
    logger.debug("Cleaning transcript text...")

    # Remove timestamp patterns
    text = re.sub(r'\d{1,2}:\d{2}:\d{2}', '', raw_text)
    text = re.sub(r'\d{1,2}:\d{2}', '', text)

    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)

    # Remove HTML entities
    text = re.sub(r'&[a-z]+;', '', text)

    # Remove extra whitespace
    lines = text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]

    # Remove duplicate consecutive lines
    cleaned_lines = []
    prev_line = None
    for line in lines:
        if line != prev_line:
            cleaned_lines.append(line)
            prev_line = line

    result = '\n'.join(cleaned_lines)
    logger.debug(f"Cleaned text: {len(raw_text)} chars -> {len(result)} chars")

    return result


def translate_transcript(
    hindi_text: str,
    target_language: str = 'en',
    chunk_size: int = TRANSLATION_CHUNK_SIZE
) -> str:
    """
    Translate Hindi transcript to English using Google Translate.

    Handles long texts by chunking to respect API limits.

    Args:
        hindi_text: Hindi text to translate
        target_language: Target language code (default: 'en')
        chunk_size: Characters per translation chunk (default: 4500)

    Returns:
        Translated English text

    Raises:
        Exception: If translation fails

    Example:
        >>> hindi = "नमस्ते, आप कैसे हैं?"
        >>> english = translate_transcript(hindi)
        >>> print(english)
        Hello, how are you?
    """
    logger.info(f"Starting translation (chunk_size={chunk_size} chars)")

    if not hindi_text or len(hindi_text.strip()) == 0:
        logger.warning("Empty text provided for translation")
        return ""

    try:
        translator = GoogleTranslator(source_language='hi', target_language=target_language)

        # Split into chunks
        chunks = []
        current_chunk = ""

        for line in hindi_text.split('\n'):
            if len(current_chunk) + len(line) + 1 > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = line
            else:
                current_chunk += '\n' + line if current_chunk else line

        if current_chunk:
            chunks.append(current_chunk)

        logger.info(f"Translating {len(chunks)} chunks...")

        # Translate each chunk
        translated_chunks = []
        for idx, chunk in enumerate(chunks, 1):
            logger.info(f"Translating chunk {idx}/{len(chunks)}...")
            try:
                translated = translator.translate(chunk)
                translated_chunks.append(translated)
                time.sleep(REQUEST_DELAY)  # Rate limiting
            except Exception as e:
                logger.error(f"Error translating chunk {idx}: {str(e)}")
                translated_chunks.append(chunk)  # Keep original if translation fails

        result = '\n'.join(translated_chunks)
        logger.info(f"Translation complete: {len(hindi_text)} -> {len(result)} chars")

        return result

    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        raise


def extract_astrological_terms(text: str) -> Dict[str, int]:
    """
    Extract and count Jyotish-specific terms from text.

    Searches for terms in JYOTISH_TERMS dictionary.

    Args:
        text: Text to search (Hindi or English)

    Returns:
        Dictionary mapping terms to occurrence counts

    Example:
        >>> text = "सूर्य और चंद्र Sun and Moon"
        >>> terms = extract_astrological_terms(text)
        >>> print(terms)
        {'Sun': 1, 'Moon': 1, 'सूर्य': 1, 'चंद्र': 1}
    """
    logger.info("Extracting astrological terms...")

    found_terms = Counter()

    # Search for Hindi terms
    for hindi_term, english_term in JYOTISH_TERMS.items():
        count = text.count(hindi_term)
        if count > 0:
            found_terms[f"{english_term} ({hindi_term})"] = count

    # Also search for English equivalents
    for hindi_term, english_term in JYOTISH_TERMS.items():
        # Look for English terms (case-insensitive)
        pattern = r'\b' + re.escape(english_term) + r'\b'
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            found_terms[english_term] += len(matches)

    logger.info(f"Found {len(found_terms)} unique astrological terms")

    return dict(found_terms)


def generate_summary_report(transcripts_dir: str) -> str:
    """
    Generate comprehensive summary report of all transcripts.

    Creates a detailed report including:
    - File statistics
    - Astrological terms analysis
    - Language breakdown
    - Recommendations

    Args:
        transcripts_dir: Directory containing downloaded transcripts

    Returns:
        Formatted summary report string

    Example:
        >>> report = generate_summary_report("./transcripts")
        >>> print(report)
        >>> with open("summary.txt", "w") as f:
        ...     f.write(report)
    """
    logger.info(f"Generating summary report for: {transcripts_dir}")

    transcripts_path = Path(transcripts_dir)

    if not transcripts_path.exists():
        logger.warning(f"Directory not found: {transcripts_dir}")
        return "Error: Transcripts directory not found"

    # Find all transcript files
    hindi_files = list(transcripts_path.glob("*_hi.txt"))
    english_files = list(transcripts_path.glob("*_en.txt"))

    # Read and analyze files
    total_hindi_chars = 0
    total_english_chars = 0
    all_terms = Counter()

    logger.info(f"Processing {len(hindi_files)} Hindi and {len(english_files)} English files")

    for filepath in hindi_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()
                total_hindi_chars += len(text)
                terms = extract_astrological_terms(text)
                all_terms.update(terms)
        except Exception as e:
            logger.error(f"Error reading {filepath}: {str(e)}")

    for filepath in english_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                text = f.read()
                total_english_chars += len(text)
        except Exception as e:
            logger.error(f"Error reading {filepath}: {str(e)}")

    # Generate report
    report = []
    report.append("=" * 80)
    report.append("YOUTUBE TRANSCRIPT EXTRACTION & ANALYSIS SUMMARY REPORT")
    report.append("=" * 80)
    report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"Analysis Directory: {transcripts_dir}")
    report.append("")

    # File Statistics
    report.append("FILE STATISTICS")
    report.append("-" * 80)
    report.append(f"Hindi Transcripts: {len(hindi_files)} files")
    report.append(f"English Transcripts: {len(english_files)} files")
    report.append(f"Total Files: {len(hindi_files) + len(english_files)}")
    report.append(f"Total Hindi Content: {total_hindi_chars:,} characters")
    report.append(f"Total English Content: {total_english_chars:,} characters")
    report.append("")

    # Astrological Terms Analysis
    if all_terms:
        report.append("ASTROLOGICAL TERMS FREQUENCY ANALYSIS")
        report.append("-" * 80)
        report.append(f"Unique Terms Found: {len(all_terms)}")
        report.append("")
        report.append("Top 20 Most Frequent Terms:")
        report.append("")

        for term, count in all_terms.most_common(20):
            report.append(f"  {term:40s} : {count:3d} occurrences")

    report.append("")
    report.append("=" * 80)
    report.append("END OF REPORT")
    report.append("=" * 80)

    report_text = '\n'.join(report)
    logger.info("Summary report generated successfully")

    return report_text


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def save_json_metadata(
    data: Dict,
    filepath: str
) -> None:
    """
    Save metadata to JSON file.

    Args:
        data: Dictionary to save
        filepath: Output file path
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"Metadata saved to: {filepath}")
    except Exception as e:
        logger.error(f"Error saving metadata: {str(e)}")


def validate_video_id(video_id: str) -> bool:
    """
    Validate YouTube video ID format.

    Args:
        video_id: Video ID to validate

    Returns:
        True if valid, False otherwise
    """
    return bool(re.match(r'^[A-Za-z0-9_-]{11}$', video_id))


# =============================================================================
# MAIN EXECUTION
# =============================================================================

def main():
    """
    Main execution function demonstrating the complete pipeline.
    """
    print("\n" + "=" * 80)
    print("YOUTUBE TRANSCRIPT EXTRACTION & ASTROLOGICAL ANALYSIS PIPELINE")
    print("=" * 80)
    print()

    # Configuration
    SEARCH_QUERY = "Brajesh Gautam Jyotish"  # Change this for different searches
    MAX_RESULTS = 5  # Limit to 5 for demo (increase for full extraction)
    OUTPUT_BASE_DIR = "./transcripts_output"

    logger.info("Starting YouTube Transcript Pipeline")
    logger.info(f"Search Query: {SEARCH_QUERY}")
    logger.info(f"Max Results: {MAX_RESULTS}")

    try:
        # Step 1: Search for videos
        print(f"\n[Step 1] Searching YouTube for: {SEARCH_QUERY}")
        print("-" * 80)

        videos = search_channel_videos(SEARCH_QUERY, max_results=MAX_RESULTS)

        if not videos:
            print("ERROR: No videos found. Check your search query.")
            return

        print(f"Found {len(videos)} videos:")
        for i, video in enumerate(videos, 1):
            print(f"  {i}. {video['title'][:60]}...")
            print(f"     ID: {video['id']}")

        # Step 2: Download transcripts (Hindi)
        print(f"\n[Step 2] Downloading Hindi transcripts")
        print("-" * 80)

        video_ids = [v['id'] for v in videos]

        # Create language-specific directories
        hindi_dir = os.path.join(OUTPUT_BASE_DIR, "hindi")
        english_dir = os.path.join(OUTPUT_BASE_DIR, "english")

        download_results = batch_download_transcripts(
            video_ids,
            output_dir=hindi_dir,
            languages=['hi']
        )

        successful_downloads = sum(1 for p in download_results.values() if p)
        print(f"\nDownloaded {successful_downloads}/{len(video_ids)} transcripts")

        # Step 3: Process transcripts (cleaning, term extraction)
        print(f"\n[Step 3] Processing and analyzing transcripts")
        print("-" * 80)

        all_terms = Counter()
        processed_count = 0

        hindi_path = Path(hindi_dir)
        if hindi_path.exists():
            for filepath in hindi_path.glob("*.txt"):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        raw_text = f.read()

                    # Clean the transcript
                    cleaned = clean_transcript(raw_text)

                    # Extract astrological terms
                    terms = extract_astrological_terms(cleaned)
                    all_terms.update(terms)

                    processed_count += 1

                    # Save cleaned version
                    cleaned_filename = filepath.stem + "_cleaned.txt"
                    cleaned_filepath = filepath.parent / cleaned_filename
                    with open(cleaned_filepath, 'w', encoding='utf-8') as f:
                        f.write(cleaned)

                    print(f"  Processed: {filepath.name}")

                except Exception as e:
                    logger.error(f"Error processing {filepath}: {str(e)}")

        print(f"\nProcessed {processed_count} transcripts")
        print(f"Unique astrological terms found: {len(all_terms)}")

        if all_terms:
            print("\nTop 10 astrological terms:")
            for term, count in all_terms.most_common(10):
                print(f"  {term:45s}: {count} occurrences")

        # Step 4: Translation (optional - sample with first file)
        print(f"\n[Step 4] Translation (sample with first file)")
        print("-" * 80)

        hindi_files = list(Path(hindi_dir).glob("*_cleaned.txt"))
        if hindi_files:
            sample_file = hindi_files[0]
            print(f"Translating sample: {sample_file.name}")
            print("(Note: Full pipeline would translate all files)")

            try:
                with open(sample_file, 'r', encoding='utf-8') as f:
                    hindi_text = f.read()

                # Limit translation for demo (first 500 chars)
                sample_text = hindi_text[:500]
                print(f"\nOriginal Hindi (first 500 chars):")
                print(sample_text)

                english_text = translate_transcript(sample_text)

                print(f"\nTranslated to English:")
                print(english_text[:500])

                # Save translated version
                translated_filename = sample_file.stem.replace("_cleaned", "_translated_en")
                translated_filepath = Path(english_dir) / f"{translated_filename}.txt"
                translated_filepath.parent.mkdir(parents=True, exist_ok=True)

                with open(translated_filepath, 'w', encoding='utf-8') as f:
                    full_translation = translate_transcript(hindi_text)
                    f.write(full_translation)

                print(f"\nFull translation saved to: {translated_filepath}")

            except Exception as e:
                logger.error(f"Translation error: {str(e)}")

        # Step 5: Generate summary report
        print(f"\n[Step 5] Generating summary report")
        print("-" * 80)

        report = generate_summary_report(OUTPUT_BASE_DIR)

        # Save report
        report_path = os.path.join(OUTPUT_BASE_DIR, "summary_report.txt")
        os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)

        print(report)
        print(f"\nReport saved to: {report_path}")

        # Save metadata
        metadata = {
            "search_query": SEARCH_QUERY,
            "total_videos_found": len(videos),
            "successful_downloads": successful_downloads,
            "unique_astrological_terms": len(all_terms),
            "generated_at": datetime.now().isoformat(),
            "video_ids": video_ids,
            "top_terms": dict(all_terms.most_common(30))
        }

        metadata_path = os.path.join(OUTPUT_BASE_DIR, "metadata.json")
        save_json_metadata(metadata, metadata_path)

        print(f"\n" + "=" * 80)
        print("PIPELINE EXECUTION COMPLETED SUCCESSFULLY")
        print("=" * 80)
        print(f"Output directory: {OUTPUT_BASE_DIR}")
        print(f"Files created:")
        print(f"  - Hindi transcripts: {OUTPUT_BASE_DIR}/hindi/")
        print(f"  - English translations: {OUTPUT_BASE_DIR}/english/")
        print(f"  - Summary report: {report_path}")
        print(f"  - Metadata: {metadata_path}")
        print()

    except Exception as e:
        logger.error(f"Pipeline execution failed: {str(e)}", exc_info=True)
        print(f"ERROR: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
