---
name: "video-download"
description: "Download videos from web pages, Douyin, Bilibili, YouTube, and 1000+ other sites. Use when the user provides a video URL and wants to download it, or when scraping videos from a webpage. Supports platform extractors via yt-dlp and generic HTML video extraction via Python scraper."
---

# Video Download Skill

## Overview

Two-tier video download strategy:

1. **Platform extractors** (preferred): Use `yt-dlp` for known platforms (Douyin, Bilibili, YouTube, Twitter, Instagram, TikTok, Kuaishou, etc.)
2. **Generic scraping** (fallback): Use `video_scraper.py` for HTML5 `<video>` tags, meta tags, iframe embeds, JS-loaded URLs, JSON-LD

## Prerequisites

- `yt-dlp` installed: `pip install yt-dlp`
- `ffmpeg` available (for merging video+audio into mp4)
- Python 3.10+ with `requests`, `beautifulsoup4`, `lxml`

## Usage

### Method 1: yt-dlp (recommended for known platforms)

```bash
python G:\codex文件\proj_001_skill_视频下载\scripts\ytdlp_download.py "<URL>"
```

Options:
- `-q 720p` — download 720p quality
- `-q 480p` — download 480p quality
- `-q audio` — download audio only (MP3)
- `-o "<path>"` — specify output directory
- `--list` — list supported platforms

### Method 2: Generic scraper (for arbitrary webpages)

```bash
# Only find videos, don't download
python G:\codex文件\video_scraper.py "<URL>"

# Find and download
python G:\codex文件\video_scraper.py "<URL>" "G:\codex文件\视频下载"
```

## Workflow

1. **Ask for URL** if not provided
2. **Try yt-dlp first** — it handles 99% of cases (Douyin, Bilibili, YouTube, etc.)
3. **Fall back to scraper** if yt-dlp fails or the URL is a generic webpage
4. **Report results** — print file path, size, and format

## Platform Support (via yt-dlp)

- 抖音 (Douyin)
- Bilibili
- YouTube
- Twitter/X
- Instagram
- TikTok
- 快手 (Kuaishou)
- AcFun
- 1000+ more sites

## Notes

- All downloads go to `G:\codex文件\视频下载\` by default
- Filenames use `%(title)s_%(id)s.%(ext)s` format
- If `ffmpeg` is not found, yt-dlp downloads separate video/audio streams without merging
- Sandbox permission errors on G: drive require `require_escalated`
