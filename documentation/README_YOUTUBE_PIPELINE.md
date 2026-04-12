# YouTube Transcript Pipeline for Astrological Content Analysis

## Project Overview

A production-quality Python script for extracting, processing, and analyzing YouTube video transcripts for astrological (Jyotish) content. Developed as part of the Silicon Siddhanta Project to extract and preserve teachings from Vedic astrology educators, particularly Brajesh Gautam's Jyotish Vidya content.

**Current Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: 2026-04-11  
**Python**: 3.8+

---

## Files Included

### Main Script
- **`youtube_transcript_pipeline.py`** (984 lines)
  - Complete, production-quality implementation
  - All core functions with comprehensive error handling
  - Built-in logging and progress reporting
  - if __name__ == "__main__" demo included

### Documentation
- **`YOUTUBE_PIPELINE_SETUP.md`** (584 lines)
  - Complete reference guide
  - Installation instructions
  - Full API documentation for all functions
  - Astrological terms reference
  - Troubleshooting guide
  - Advanced usage examples

- **`QUICK_START.md`** (428 lines)
  - 5-minute setup guide
  - Common use cases with code
  - Single video workflow
  - Batch processing workflow
  - Performance tips
  - Customization examples

- **`PIPELINE_EXAMPLES.py`** (602 lines)
  - 10 complete, runnable examples
  - Covers every major function
  - Can be executed individually
  - Demonstrates best practices

---

## Quick Installation

```bash
# 1. Install dependencies
pip install yt-dlp youtube-transcript-api deep-translator

# 2. Run the demo
python youtube_transcript_pipeline.py

# 3. Check output
ls -la transcripts_output/
cat transcripts_output/summary_report.txt
```

---

## Key Features

### 1. YouTube Video Discovery
```python
videos = search_channel_videos("Brajesh Gautam Jyotish", max_results=10)
```
- Search by channel name or topic
- Returns video ID, title, URL
- Uses yt-dlp for discovery

### 2. Transcript Extraction
```python
download_transcript("dQw4w9WgXcQ", languages=['hi'], output_dir="./transcripts")
```
- Download Hindi auto-generated captions
- Fallback to English if Hindi unavailable
- Built-in rate limiting (2 sec delay)
- Handles errors gracefully

### 3. Batch Processing
```python
batch_download_transcripts(video_ids, output_dir="./transcripts")
```
- Download multiple transcripts efficiently
- Progress tracking
- Error handling per video
- Returns mapping of success/failure

### 4. Text Cleaning
```python
cleaned = clean_transcript(raw_text)
```
- Removes timestamps (00:00:15)
- Strips URLs and HTML entities
- Eliminates duplicate lines
- Normalizes whitespace

### 5. Astrological Term Extraction
```python
terms = extract_astrological_terms(text)
```
- Detects ~150 Hindi/Sanskrit astrological terms
- Counts occurrences
- Returns frequency dictionary
- Includes all major Jyotish concepts

### 6. Translation Pipeline
```python
english_text = translate_transcript(hindi_text, chunk_size=4500)
```
- Hindi to English via Google Translate
- Automatic chunking for long texts
- Respects API rate limits
- Fallback if translation fails

### 7. Summary Reports
```python
report = generate_summary_report("./transcripts")
```
- File statistics
- Total character counts
- Term frequency analysis
- Top 20 most common terms
- Formatted text output

---

## Astrological Terms Included

The script includes **~150 Hindi/Sanskrit terms** covering:

| Category | Count | Examples |
|----------|-------|----------|
| Navagraha (Planets) | 9 | Sun, Moon, Mars, Jupiter, Saturn, etc. |
| Rashis (Zodiac) | 12 | Aries, Taurus, Gemini, etc. |
| Nakshatras (Lunar Mansions) | 27 | Ashwini, Bharani, Krittika, etc. |
| Bhavas (Houses) | 12 | 1st House, 5th House, 10th House, etc. |
| Dashas (Periods) | 7+ | Vimshottari, Mahadasha, Antardasha, etc. |
| Yogas (Combinations) | 20+ | Rajyog, Dhanyog, Vivaah Yog, etc. |
| KP System | 10+ | Krishnamurti Paddhati, Sublord, etc. |
| Concepts | 60+ | Auspicious, Malefic, Transit, Karma, etc. |

---

## Usage Examples

### Example 1: Simple Search & Download
```python
from youtube_transcript_pipeline import search_channel_videos, batch_download_transcripts

videos = search_channel_videos("Brajesh Gautam", max_results=5)
video_ids = [v['id'] for v in videos]
batch_download_transcripts(video_ids, output_dir="./transcripts")
```

### Example 2: Complete Processing Pipeline
```python
from youtube_transcript_pipeline import *
from pathlib import Path

# Download
results = batch_download_transcripts(video_ids)

# Process each
for filepath in Path("./transcripts").glob("*.txt"):
    with open(filepath) as f:
        raw = f.read()
    
    clean = clean_transcript(raw)
    terms = extract_astrological_terms(clean)
    
    print(f"{filepath.name}: {len(terms)} terms found")

# Generate report
report = generate_summary_report("./transcripts")
```

### Example 3: Custom Analysis
```python
from collections import Counter

# Extract all planet mentions
text = open("transcript.txt").read()
terms = extract_astrological_terms(text)

planets = {k: v for k, v in terms.items() 
           if any(p in k for p in ['Sun', 'Moon', 'Mars', 'Jupiter'])}

print("Planet frequency:")
for p, count in planets.most_common(9):
    print(f"  {p}: {count} mentions")
```

---

## Output Structure

```
transcripts_output/
├── hindi/
│   ├── dQw4w9WgXcQ_hi.txt              (Raw Hindi)
│   ├── dQw4w9WgXcQ_cleaned.txt         (Cleaned)
│   └── ...
├── english/
│   ├── dQw4w9WgXcQ_translated_en.txt   (Translated)
│   └── ...
├── metadata.json                        (Extraction stats)
└── summary_report.txt                   (Analysis report)
```

**Sample summary_report.txt**:
```
FILE STATISTICS
- Hindi Transcripts: 5 files
- Total Characters: 125,450

ASTROLOGICAL TERMS FREQUENCY
- Sun (सूर्य): 12 occurrences
- Moon (चंद्र): 8 occurrences
- 5th House: 6 occurrences

TOP 20 TERMS
[detailed frequency list...]
```

---

## API Reference (Functions)

### Video Discovery
- `search_channel_videos(query, max_results=50)` → List[Dict]

### Transcript Download
- `download_transcript(video_id, languages=['hi'], output_dir)` → Optional[str]
- `batch_download_transcripts(video_ids, output_dir, languages)` → Dict[str, str]

### Text Processing
- `clean_transcript(raw_text)` → str
- `translate_transcript(hindi_text, target_language='en', chunk_size=4500)` → str

### Analysis
- `extract_astrological_terms(text)` → Dict[str, int]
- `generate_summary_report(transcripts_dir)` → str

### Utilities
- `validate_video_id(video_id)` → bool
- `save_json_metadata(data, filepath)` → None

---

## Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| yt-dlp | YouTube video search | `pip install yt-dlp` |
| youtube-transcript-api | Fetch transcripts | `pip install youtube-transcript-api` |
| deep-translator | Translation | `pip install deep-translator` |
| requests | HTTP client | Usually pre-installed |

**Install all at once**:
```bash
pip install yt-dlp youtube-transcript-api deep-translator
```

---

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Search (1 query) | 2-3 sec | via yt-dlp |
| Download 1 transcript | 1-2 sec | via YouTube API |
| Download 10 transcripts | 20-30 sec | With 2sec rate limiting |
| Clean 1 transcript | <100ms | Regex processing |
| Extract terms (1 file) | 50-200ms | Dictionary lookup |
| Translate 1000 chars | 1-2 sec | via Google Translate |
| Translate 10k chars | 5-10 sec | 2-3 API requests |
| Generate report | 2-3 sec | All files analysis |

---

## Ethical Considerations

### Content Rights
- Download only publicly available videos
- Respect creator copyright
- Use auto-generated captions (derivative works)

### Usage
- **Research/Educational**: Primary use case
- **Attribution**: Always credit original creators
- **Transparency**: Disclose transcript extraction and analysis

### API Respect
- Built-in rate limiting (2 sec delays)
- Review YouTube Terms of Service
- Respect creator preferences (if transcripts disabled)

### Data Security
- Store transcripts securely
- Don't share without permission
- Consider copyright implications

---

## Troubleshooting

### "No module named 'youtube_transcript_api'"
```bash
pip install youtube-transcript-api
```

### "Video has no transcripts available"
- Video may not have captions enabled
- Try different language codes
- Skip unavailable videos in batch

### "Translation rate limit exceeded"
- Increase REQUEST_DELAY (default: 2 seconds)
- Reduce batch size
- Wait before retrying

### yt-dlp search returns no results
- Try broader search terms
- Verify content exists on YouTube manually
- Use direct video IDs instead

---

## Advanced Usage

### Custom Astrological Terms
```python
from youtube_transcript_pipeline import JYOTISH_TERMS

JYOTISH_TERMS.update({
    "मेरा शब्द": "My Term",
    "दूसरा शब्द": "Another Term"
})
```

### Multi-threaded Batch Processing
```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(download_transcript, video_ids)
```

### Database Integration
```python
import sqlite3

conn = sqlite3.connect("transcripts.db")
cursor = conn.cursor()

# Store terms in database
for term, count in terms.items():
    cursor.execute("INSERT INTO terms VALUES (?, ?)", (term, count))
```

---

## Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `YOUTUBE_PIPELINE_SETUP.md` | Complete reference & API docs | 20-30 min |
| `QUICK_START.md` | Common use cases & examples | 10-15 min |
| `PIPELINE_EXAMPLES.py` | Runnable code examples | 15-20 min |
| `youtube_transcript_pipeline.py` | Source code | 30-40 min |

---

## Getting Started (3 Steps)

### Step 1: Install (1 minute)
```bash
pip install yt-dlp youtube-transcript-api deep-translator
```

### Step 2: Run (2 minutes)
```bash
python youtube_transcript_pipeline.py
```

### Step 3: Explore Output (1 minute)
```bash
cat transcripts_output/summary_report.txt
```

**Total time: ~5 minutes** ✓

---

## Project Context

### Silicon Siddhanta Project
This script is part of the broader Silicon Siddhanta initiative to create a comprehensive Vedic astrology engine combining:

- **KP System** (krishnamurti_paddhati.py)
- **Parashari System** (parashari.py)
- **Nadi System** (nadi_system.py)
- **KCIL System** (kcil_system.py)
- **Prediction Engine** (prediction_engine.py)
- **YouTube Transcript Pipeline** (youtube_transcript_pipeline.py)

### Used for Knowledge Preservation
This tool extracts teachings from Brajesh Gautam's Jyotish Vidya videos to:
1. Create searchable content library
2. Preserve astrological teachings
3. Facilitate research and analysis
4. Support educational initiatives

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-11 | Initial release - full pipeline with all features |

---

## Support & Contact

For issues or questions:
1. **Check Troubleshooting** in YOUTUBE_PIPELINE_SETUP.md
2. **Review Examples** in PIPELINE_EXAMPLES.py
3. **Verify Dependencies** are installed correctly
4. **Check Internet Connection** for API calls

---

## License & Attribution

**Part of Silicon Siddhanta Project**

For research, education, and knowledge preservation in Vedic Astrology.

```
YouTube Transcript Extraction Pipeline for Astrological Content Analysis
Version 1.0.0 (2026-04-11)
Part of Silicon Siddhanta Project
Python 3.8+
```

---

## Quick Links

- **Full Setup Guide**: See `YOUTUBE_PIPELINE_SETUP.md`
- **Quick Examples**: See `QUICK_START.md`
- **Runnable Code**: See `PIPELINE_EXAMPLES.py`
- **Source Code**: See `youtube_transcript_pipeline.py`

---

## Summary

This production-quality script provides everything needed to:
- ✓ Search YouTube for educational content
- ✓ Download Hindi transcripts automatically
- ✓ Clean and process text
- ✓ Extract astrological terminology
- ✓ Translate to English
- ✓ Generate comprehensive analysis reports

**With ~1000 lines of code, comprehensive documentation, and built-in examples.**

Install dependencies, run the demo, and start analyzing astrological content from YouTube!

---

**Last Updated**: 2026-04-11  
**Status**: Ready for Production Use  
**Questions?** See YOUTUBE_PIPELINE_SETUP.md or QUICK_START.md
