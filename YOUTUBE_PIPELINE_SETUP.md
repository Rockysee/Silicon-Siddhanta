# YouTube Transcript Extraction Pipeline for Astrological Content Analysis

## Overview

`youtube_transcript_pipeline.py` is a production-quality Python script designed to extract, process, and analyze YouTube video transcripts for astrological (Jyotish) content. It was developed as part of the Silicon Siddhanta Project to preserve and analyze teachings from Vedic astrology educators, particularly Brajesh Gautam's Jyotish Vidya content.

## Key Features

- **YouTube Video Discovery**: Search for videos by channel or topic query
- **Transcript Extraction**: Download Hindi auto-generated captions from YouTube
- **Text Processing**: Clean transcripts (remove timestamps, duplicates, artifacts)
- **Translation Pipeline**: Convert Hindi content to English via Google Translate
- **Astrological Term Detection**: Extract ~150 Jyotish-specific terms (planets, nakshatra, yogas, dashas, etc.)
- **Batch Processing**: Download and process multiple videos efficiently
- **Summary Reports**: Generate comprehensive analysis reports with term frequency
- **Rate Limiting**: Built-in delays to respect API limits
- **Production Logging**: Comprehensive logging for debugging and auditing
- **Error Handling**: Graceful fallbacks for missing/unavailable content

## Installation

### 1. Prerequisites

- Python 3.8+
- pip (Python package manager)
- Internet connection (for YouTube API and translation)

### 2. Install Dependencies

```bash
pip install yt-dlp youtube-transcript-api deep-translator requests
```

**Individual packages:**
- `yt-dlp` - YouTube video search and metadata extraction
- `youtube-transcript-api` - Fetch captions/transcripts from YouTube
- `deep-translator` - Translation using Google Translate backend
- `requests` - HTTP library (usually pre-installed)

### 3. Verify Installation

```bash
python youtube_transcript_pipeline.py --help
```

Or test imports:
```python
python3 << 'EOF'
from youtube_transcript_api import YouTubeTranscriptApi
from deep_translator import GoogleTranslator
import yt_dlp
print("All dependencies installed successfully!")
EOF
```

## Quick Start

### Basic Usage

#### 1. Search and Download Transcripts

```python
from youtube_transcript_pipeline import (
    search_channel_videos,
    batch_download_transcripts,
    clean_transcript,
    extract_astrological_terms,
    generate_summary_report
)

# Search for videos
videos = search_channel_videos("Brajesh Gautam Jyotish", max_results=10)

# Extract video IDs
video_ids = [v['id'] for v in videos]

# Download Hindi transcripts
results = batch_download_transcripts(
    video_ids,
    output_dir="./transcripts/hindi",
    languages=['hi']
)
```

#### 2. Process and Analyze Transcripts

```python
from pathlib import Path

# Clean and extract terms
for filepath in Path("./transcripts/hindi").glob("*.txt"):
    with open(filepath) as f:
        raw = f.read()
    
    cleaned = clean_transcript(raw)
    terms = extract_astrological_terms(cleaned)
    
    print(f"File: {filepath.name}")
    print(f"Found {len(terms)} unique astrological terms")
    print(f"Top terms: {dict(sorted(terms.items(), key=lambda x: x[1], reverse=True)[:5])}")
```

#### 3. Translate Transcripts

```python
from youtube_transcript_pipeline import translate_transcript

# Read Hindi transcript
with open("transcripts/hindi/video_id.txt") as f:
    hindi_text = f.read()

# Translate to English
english_text = translate_transcript(hindi_text)

# Save translation
with open("transcripts/english/video_id.txt", 'w') as f:
    f.write(english_text)
```

#### 4. Generate Analysis Report

```python
report = generate_summary_report("./transcripts")
print(report)

# Save report
with open("summary_report.txt", 'w') as f:
    f.write(report)
```

### Running the Complete Pipeline

Execute the included demo/main pipeline:

```bash
python youtube_transcript_pipeline.py
```

This will:
1. Search for 5 videos on "Brajesh Gautam Jyotish"
2. Download Hindi transcripts
3. Clean and extract astrological terms
4. Translate a sample to English
5. Generate a comprehensive summary report
6. Save all outputs to `./transcripts_output/`

## API Reference

### Core Functions

#### `search_channel_videos(query, max_results=50)`
Searches YouTube for videos matching the query.

**Parameters:**
- `query` (str): Search terms (e.g., "Brajesh Gautam Jyotish")
- `max_results` (int): Maximum videos to return (default: 50)

**Returns:** List of dicts with 'id', 'title', 'url'

**Example:**
```python
videos = search_channel_videos("Krishnamurti Paddhati", max_results=20)
for v in videos[:5]:
    print(f"{v['title']}: {v['id']}")
```

---

#### `download_transcript(video_id, languages=['hi', 'en'], output_dir='./transcripts')`
Downloads transcript for a single video.

**Parameters:**
- `video_id` (str): YouTube video ID (11 characters)
- `languages` (list): Language codes to try, in order
- `output_dir` (str): Directory to save transcript

**Returns:** Path to saved file, or None if failed

**Example:**
```python
# Download Hindi transcript
path = download_transcript("dQw4w9WgXcQ", languages=['hi'])
if path:
    print(f"Saved to {path}")
```

---

#### `batch_download_transcripts(video_ids, output_dir='./transcripts', languages=['hi', 'en'])`
Downloads transcripts for multiple videos with rate limiting.

**Parameters:**
- `video_ids` (list): List of YouTube video IDs
- `output_dir` (str): Directory to save transcripts
- `languages` (list): Language codes to try

**Returns:** Dict mapping video_id to filepath (or None if failed)

**Example:**
```python
ids = ["dQw4w9WgXcQ", "jNQXAC9IVRw"]
results = batch_download_transcripts(ids)
successful = [v for v, p in results.items() if p]
print(f"{len(successful)}/{len(ids)} downloaded successfully")
```

---

#### `clean_transcript(raw_text)`
Removes artifacts from raw transcript text.

**Removes:**
- Timestamp patterns (00:00:15, 1:23)
- URLs
- HTML entities
- Extra whitespace
- Duplicate consecutive lines

**Parameters:**
- `raw_text` (str): Raw transcript text

**Returns:** Cleaned text string

**Example:**
```python
raw = open("transcripts/video.txt").read()
clean = clean_transcript(raw)
```

---

#### `translate_transcript(hindi_text, target_language='en', chunk_size=4500)`
Translates Hindi text to English using Google Translate.

Automatically chunks long texts to respect API limits.

**Parameters:**
- `hindi_text` (str): Hindi text to translate
- `target_language` (str): Target language code (default: 'en')
- `chunk_size` (int): Characters per request (default: 4500)

**Returns:** Translated English text

**Example:**
```python
hindi = "नमस्ते, आपका स्वागत है।"
english = translate_transcript(hindi)
print(english)  # Output: "Hello, welcome."
```

---

#### `extract_astrological_terms(text)`
Finds and counts Jyotish-specific terms in text.

Searches for 150+ Hindi/Sanskrit terms from JYOTISH_TERMS dictionary.

**Parameters:**
- `text` (str): Text to analyze (Hindi or English)

**Returns:** Dict mapping term names to occurrence counts

**Example:**
```python
text = "सूर्य नवम भाव में शुभ है। Jupiter is in 5th house."
terms = extract_astrological_terms(text)
# Output: {'Sun (सूर्य)': 1, '5th House': 1, 'Jupiter': 1, ...}
```

---

#### `generate_summary_report(transcripts_dir)`
Creates comprehensive analysis report of all transcripts in a directory.

**Includes:**
- File statistics
- Total character counts
- Astrological terms frequency analysis
- Top 20 most common terms

**Parameters:**
- `transcripts_dir` (str): Directory containing transcripts

**Returns:** Formatted report string

**Example:**
```python
report = generate_summary_report("./transcripts")
print(report)

# Save to file
with open("analysis_report.txt", 'w') as f:
    f.write(report)
```

---

### Utility Functions

#### `validate_video_id(video_id)`
Checks if a string is a valid YouTube video ID format.

```python
validate_video_id("dQw4w9WgXcQ")  # True
validate_video_id("invalid")       # False
```

#### `save_json_metadata(data, filepath)`
Saves dictionary as JSON metadata file.

```python
metadata = {
    "videos_found": 50,
    "transcripts_downloaded": 48,
    "timestamp": "2026-04-11T10:30:00"
}
save_json_metadata(metadata, "metadata.json")
```

---

## Astrological Terms Reference

The script includes **~150 Hindi/Sanskrit astrological terms** in the `JYOTISH_TERMS` dictionary, covering:

### Navagraha (9 Planets)
- सूर्य (Sun), चंद्र (Moon), मंगल (Mars), बुध (Mercury), बृहस्पति (Jupiter), शुक्र (Venus), शनि (Saturn), राहु (Rahu), केतु (Ketu)

### Rashis (12 Zodiac Signs)
- मेष (Aries), वृष (Taurus), मिथुन (Gemini), कर्क (Cancer), सिंह (Leo), कन्या (Virgo), तुला (Libra), वृश्चिक (Scorpio), धनु (Sagittarius), मकर (Capricorn), कुम्भ (Aquarius), मीन (Pisces)

### Nakshatras (27 Lunar Mansions)
- अश्विनी (Ashwini), भरणी (Bharani), कृत्तिका (Krittika), ... रेवती (Revati)

### Bhavas (12 Houses)
- लग्न (1st), द्वितीय भाव (2nd), ... द्वादश भाव (12th)

### Dashas (Planetary Periods)
- विंशोत्तरी दशा (Vimshottari), महादशा (Mahadasha), अंतर्दशा (Antardasha)

### Yogas (Combinations)
- राज योग (Rajyog), धन योग (Dhanyog), विवाह योग (Vivaah Yog), etc.

### KP System
- क्राइष्णमूर्ति पद्धति (Krishnamurti Paddhati), सबलांश (Sublord), etc.

## Output Directory Structure

The script creates the following directory structure:

```
transcripts_output/
├── hindi/
│   ├── dQw4w9WgXcQ_hi.txt          (Raw Hindi transcript)
│   ├── dQw4w9WgXcQ_cleaned.txt     (Cleaned transcript)
│   ├── jNQXAC9IVRw_hi.txt
│   └── jNQXAC9IVRw_cleaned.txt
├── english/
│   ├── dQw4w9WgXcQ_translated_en.txt
│   └── jNQXAC9IVRw_translated_en.txt
├── metadata.json                    (Extraction metadata)
└── summary_report.txt               (Analysis report)
```

## Ethical Considerations

### Content Rights
- Only download publicly available videos
- Respect creators' copyright and intellectual property
- Use auto-generated captions which are derivative works

### Data Usage
- **Research & Educational Use**: This tool is designed for educational research and knowledge preservation
- **Attribution**: Always attribute content to original creators
- **Transparency**: Disclose when transcripts have been extracted and analyzed

### API Respect
- **Rate Limiting**: Built-in 2-second delays between requests
- **Terms of Service**: Review YouTube's TOS before bulk downloading
- **Creator Preference**: Don't extract from channels that disable transcript downloads

### Data Privacy
- Store transcripts securely
- Don't share extracted data without permission
- Consider copyright implications of derivatives

## Troubleshooting

### Issue: "No module named 'youtube_transcript_api'"

**Solution:** Install missing dependency
```bash
pip install youtube-transcript-api
```

### Issue: "Video has no transcripts available"

**Cause:** The video may not have auto-generated captions enabled, or transcripts are disabled.

**Solution:**
- Check if video has captions on YouTube
- Try a different language code
- Skip unavailable videos

### Issue: "Translation rate limit exceeded"

**Cause:** Too many translation requests in short time.

**Solution:**
- Increase `REQUEST_DELAY` value (default: 2 seconds)
- Reduce batch size
- Wait before retrying

### Issue: "yt-dlp search returns no results"

**Cause:** Search query too specific or no matching content.

**Solution:**
- Try broader search terms
- Check YouTube manually for content
- Use direct video IDs instead of search

### Issue: Memory error with large transcripts

**Cause:** Very large files in memory during translation.

**Solution:**
- Reduce `chunk_size` in `translate_transcript()` (default: 4500)
- Process files in smaller batches
- Increase system RAM if possible

## Performance Notes

### Typical Benchmarks
- **Search**: 2-3 seconds per search query
- **Transcript Download**: 1-2 seconds per video
- **Translation**: 3-5 seconds per 1000 characters
- **Term Extraction**: <100ms per file
- **Batch of 10 videos**: ~30-45 seconds total

### Optimization Tips
- Use smaller `max_results` for initial testing
- Cache transcripts to avoid re-downloading
- Translate in parallel (requires modification for multi-threading)
- Filter languages before downloading

## Advanced Usage

### Custom Astrological Terms

Add your own terms to JYOTISH_TERMS:

```python
# Extend the dictionary
JYOTISH_TERMS.update({
    "मेरी कस्टम शब्द": "My Custom Term",
    "दूसरा शब्द": "Another Term"
})
```

### Filtering Results

```python
# Extract only specific term categories
planet_terms = {k: v for k, v in JYOTISH_TERMS.items() 
                if v in ['Sun', 'Moon', 'Mars', 'Mercury', ...]}

# Custom extraction
def extract_planets_only(text):
    planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    return {p: text.count(p) for p in planets if text.count(p) > 0}
```

### Batch Processing with Custom Logic

```python
from pathlib import Path
import json

def process_all_transcripts(input_dir, output_dir):
    results = []
    
    for filepath in Path(input_dir).glob("*.txt"):
        with open(filepath) as f:
            text = f.read()
        
        data = {
            'file': filepath.name,
            'char_count': len(text),
            'terms': extract_astrological_terms(text),
            'lines': len(text.split('\n'))
        }
        results.append(data)
    
    # Save as JSON
    with open(f"{output_dir}/analysis.json", 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    return results
```

## Dependencies Explanation

### youtube-transcript-api
- **Purpose**: Official Python client for YouTube Transcript API
- **Usage**: Fetches captions and auto-generated transcripts
- **Docs**: https://github.com/jdepoix/youtube-transcript-api

### yt-dlp
- **Purpose**: YouTube content discovery and metadata extraction
- **Usage**: Search for videos by channel/topic query
- **Docs**: https://github.com/yt-dlp/yt-dlp

### deep-translator
- **Purpose**: Multilingual translation via multiple backends
- **Usage**: Converts Hindi text to English
- **Backend**: Google Translate (free, no API key required)
- **Docs**: https://github.com/nidhaloff/deep-translator

## Logging

The script includes comprehensive logging to `youtube_transcript_pipeline.log`:

```bash
# View logs
tail -f youtube_transcript_pipeline.log

# See only errors
grep ERROR youtube_transcript_pipeline.log

# Monitor progress
grep INFO youtube_transcript_pipeline.log
```

Log levels:
- **DEBUG**: Detailed debugging information
- **INFO**: General information messages
- **WARNING**: Warning messages for recovered errors
- **ERROR**: Error messages for failed operations

## Contributing & Extending

To modify or extend the script:

1. **Add new astrological terms**: Update `JYOTISH_TERMS` dictionary
2. **Add new extraction functions**: Create new functions following the pattern
3. **Change translation source**: Modify `translate_transcript()` to use different backends
4. **Add database storage**: Extend with SQLite/PostgreSQL integration
5. **Create web interface**: Build Flask/Django API around functions

## License & Attribution

Part of the Silicon Siddhanta Project for Vedic Astrology knowledge preservation.

**Citation Format:**
```
YouTube Transcript Extraction Pipeline for Astrological Content Analysis
Part of Silicon Siddhanta Project
https://github.com/[repo-path]
Version 1.0.0 (2026)
```

## Support & Contact

For issues, questions, or suggestions:
1. Check the Troubleshooting section
2. Review the script's docstrings
3. Check YouTube API status
4. Verify all dependencies are installed

## Version History

- **v1.0.0** (2026-04-11): Initial release with full pipeline
  - Video search via yt-dlp
  - Hindi transcript extraction
  - Cleaning and translation
  - Astrological term extraction
  - Summary report generation

---

**Last Updated**: 2026-04-11
**Python Version**: 3.8+
**Status**: Production Ready
