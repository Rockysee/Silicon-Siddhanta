# YouTube Transcript Pipeline - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
pip install yt-dlp youtube-transcript-api deep-translator
```

### 2. Run the Demo (1 min)
```bash
python youtube_transcript_pipeline.py
```

This will:
- Search YouTube for "Brajesh Gautam Jyotish" videos
- Download 5 Hindi transcripts
- Extract astrological terms
- Translate a sample to English
- Generate a summary report

### 3. Check Output
```bash
ls -la transcripts_output/
cat transcripts_output/summary_report.txt
```

---

## Common Use Cases

### Use Case 1: Download Transcripts from Specific Videos

```python
from youtube_transcript_pipeline import batch_download_transcripts

video_ids = [
    "dQw4w9WgXcQ",  # Replace with actual IDs
    "jNQXAC9IVRw",
]

results = batch_download_transcripts(video_ids, output_dir="./my_transcripts")

for vid, path in results.items():
    status = "✓ Downloaded" if path else "✗ Failed"
    print(f"{vid}: {status}")
```

### Use Case 2: Search and Download All Videos from a Channel

```python
from youtube_transcript_pipeline import search_channel_videos, batch_download_transcripts

# Search
videos = search_channel_videos("Brajesh Gautam", max_results=50)
video_ids = [v['id'] for v in videos]

# Print what we found
print(f"Found {len(videos)} videos:")
for v in videos[:10]:
    print(f"  - {v['title'][:60]}...")

# Download
results = batch_download_transcripts(video_ids)
successful = sum(1 for p in results.values() if p)
print(f"\nDownloaded {successful}/{len(video_ids)}")
```

### Use Case 3: Analyze Astrological Content

```python
from youtube_transcript_pipeline import (
    clean_transcript,
    extract_astrological_terms
)

# Read transcript
with open("transcripts/hindi/video_id_hi.txt") as f:
    raw_text = f.read()

# Clean it
clean_text = clean_transcript(raw_text)

# Extract terms
terms = extract_astrological_terms(clean_text)

# Show results
print("Astrological Terms Found:")
for term, count in sorted(terms.items(), key=lambda x: x[1], reverse=True)[:15]:
    print(f"  {term:45s} : {count}")
```

### Use Case 4: Translate Hindi to English

```python
from youtube_transcript_pipeline import translate_transcript

# Read Hindi transcript
with open("transcripts/hindi/video_id_hi.txt") as f:
    hindi_text = f.read()

print("Translating Hindi to English...")
english_text = translate_transcript(hindi_text)

# Save translation
with open("transcripts/english/video_id_en.txt", 'w') as f:
    f.write(english_text)

print("Translation complete!")
```

### Use Case 5: Generate Analysis Report

```python
from youtube_transcript_pipeline import generate_summary_report

# Generate report for all transcripts in a directory
report = generate_summary_report("./transcripts")

# Print it
print(report)

# Save to file
with open("analysis_report.txt", 'w') as f:
    f.write(report)
```

---

## Single Video Workflow

Extract transcript from one specific video:

```python
from youtube_transcript_pipeline import (
    download_transcript,
    clean_transcript,
    extract_astrological_terms,
    translate_transcript
)

VIDEO_ID = "dQw4w9WgXcQ"  # Replace with actual ID

# Step 1: Download
print(f"[1] Downloading transcript for {VIDEO_ID}...")
filepath = download_transcript(VIDEO_ID, languages=['hi'])

if not filepath:
    print("Failed to download!")
    exit(1)

# Step 2: Read and clean
print("[2] Cleaning transcript...")
with open(filepath) as f:
    raw = f.read()
clean = clean_transcript(raw)

# Step 3: Extract terms
print("[3] Extracting astrological terms...")
terms = extract_astrological_terms(clean)
print(f"Found {len(terms)} unique terms")

# Step 4: Translate
print("[4] Translating to English...")
english = translate_transcript(clean)

# Step 5: Save
print("[5] Saving results...")
with open(f"{VIDEO_ID}_english.txt", 'w') as f:
    f.write(english)

print("Done!")
```

---

## Batch Processing Workflow

Process multiple videos with progress reporting:

```python
from youtube_transcript_pipeline import (
    batch_download_transcripts,
    clean_transcript,
    extract_astrological_terms
)
from pathlib import Path
import json

VIDEO_IDS = [
    "dQw4w9WgXcQ",
    "jNQXAC9IVRw",
    # Add more IDs...
]

# Download all
print(f"Downloading {len(VIDEO_IDS)} transcripts...")
results = batch_download_transcripts(VIDEO_IDS, output_dir="./transcripts")

# Process each
all_terms = {}
for i, (vid, filepath) in enumerate(results.items(), 1):
    if not filepath:
        print(f"[{i}/{len(VIDEO_IDS)}] {vid}: SKIPPED")
        continue
    
    print(f"[{i}/{len(VIDEO_IDS)}] {vid}: Processing...")
    
    with open(filepath) as f:
        raw = f.read()
    
    clean = clean_transcript(raw)
    terms = extract_astrological_terms(clean)
    
    all_terms[vid] = terms

# Save analysis
with open("analysis.json", 'w') as f:
    json.dump(all_terms, f, ensure_ascii=False, indent=2)

print(f"Analysis saved!")
```

---

## Debugging Tips

### Check if a video has transcripts

```python
from youtube_transcript_api import YouTubeTranscriptApi

VIDEO_ID = "dQw4w9WgXcQ"

try:
    api = YouTubeTranscriptApi()
    transcripts = api.list_transcripts(VIDEO_ID)
    
    print("Available languages:")
    for t in transcripts:
        print(f"  - {t.language} ({t.name})")
except:
    print("Video not found or transcripts unavailable")
```

### Validate video ID format

```python
from youtube_transcript_pipeline import validate_video_id

ids_to_check = [
    "dQw4w9WgXcQ",
    "invalid_id",
    "12345678901"  # Correct length
]

for vid in ids_to_check:
    valid = validate_video_id(vid)
    print(f"{vid}: {'✓ Valid' if valid else '✗ Invalid'}")
```

### View logs while processing

```bash
# In one terminal - run the script
python youtube_transcript_pipeline.py

# In another terminal - watch the logs
tail -f youtube_transcript_pipeline.log | grep -E "(INFO|ERROR)"
```

---

## Performance Tips

### 1. Start with small batches
```python
# Test with 5 videos first
videos = search_channel_videos("Your Query", max_results=5)
```

### 2. Cache transcripts to avoid re-downloading
```python
import os
from pathlib import Path

TRANSCRIPT_DIR = "./cached_transcripts"

def download_if_needed(video_id):
    filepath = Path(TRANSCRIPT_DIR) / f"{video_id}.txt"
    
    if filepath.exists():
        print(f"Using cached: {video_id}")
        return str(filepath)
    else:
        print(f"Downloading: {video_id}")
        return download_transcript(video_id, output_dir=TRANSCRIPT_DIR)
```

### 3. Process translations in the background
```bash
# Run translation in background while doing other work
nohup python translate_batch.py > translate.log 2>&1 &

# Check progress
tail -f translate.log
```

### 4. Increase delays for stability
```python
# If hitting rate limits, modify REQUEST_DELAY in the script
import youtube_transcript_pipeline as ytp
ytp.REQUEST_DELAY = 5  # Increase from default 2 seconds
```

---

## Customization Examples

### Add your own search terms

```python
from youtube_transcript_pipeline import search_channel_videos, batch_download_transcripts

CHANNELS = [
    "Brajesh Gautam Jyotish",
    "KP Astrology",
    "Vedic Astrology",
]

for channel in CHANNELS:
    print(f"\nSearching: {channel}")
    videos = search_channel_videos(channel, max_results=10)
    ids = [v['id'] for v in videos]
    
    output_dir = f"./transcripts_{channel.replace(' ', '_')}"
    batch_download_transcripts(ids, output_dir=output_dir)
```

### Filter transcripts by length

```python
from pathlib import Path

TRANSCRIPT_DIR = "./transcripts"
MIN_LENGTH = 5000  # Characters

for filepath in Path(TRANSCRIPT_DIR).glob("*.txt"):
    size = filepath.stat().st_size
    status = "✓" if size > MIN_LENGTH else "✗"
    print(f"{status} {filepath.name}: {size} bytes")
```

### Extract specific term categories

```python
from youtube_transcript_pipeline import JYOTISH_TERMS

# Get only planet terms
planets = {k: v for k, v in JYOTISH_TERMS.items() 
           if v in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']}

# Get only nakshatra terms
nakshatras = {k: v for k, v in JYOTISH_TERMS.items() 
              if 'nakshatra' not in v.lower() and len(v) < 20}

print(f"Planets: {len(planets)}")
print(f"Nakshatras: {len(nakshatras)}")
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError: No module named 'youtube_transcript_api'` | Package not installed | `pip install youtube-transcript-api` |
| `No transcripts available` | Video has no captions enabled | Use a different video |
| `Translation rate limit exceeded` | Too many requests too fast | Increase `REQUEST_DELAY` to 5-10 seconds |
| `UnicodeDecodeError` | File encoding issue | Open with `encoding='utf-8'` |
| `Connection timeout` | Network issue | Check internet, retry with delay |

---

## What's Included in Output

After running, you'll get:

```
transcripts_output/
├── hindi/                      # Raw Hindi transcripts
│   ├── video1_hi.txt
│   └── video1_cleaned.txt
├── english/                    # English translations
│   └── video1_translated_en.txt
├── metadata.json               # Video metadata & statistics
└── summary_report.txt          # Astrological analysis report
```

**Sample summary_report.txt content:**
```
FILE STATISTICS
- Hindi Transcripts: 5 files
- English Transcripts: 5 files
- Total Characters: 125,450

ASTROLOGICAL TERMS FREQUENCY
- Sun (सूर्य): 12 occurrences
- Moon (चंद्र): 8 occurrences
- 5th House: 6 occurrences
...

TOP 20 TERMS
[detailed frequency list]
```

---

## Next Steps

1. **Explore the full API**: Read `YOUTUBE_PIPELINE_SETUP.md`
2. **Understand astrological terms**: Review `JYOTISH_TERMS` dictionary
3. **Customize for your needs**: Modify the functions
4. **Build on it**: Create web interface, database storage, etc.

---

**For detailed documentation, see: YOUTUBE_PIPELINE_SETUP.md**
