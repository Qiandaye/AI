#!/usr/bin/env python3
"""
抖音无水印视频提取工具
支持从抖音分享链接中提取无水印视频并下载

支持链接格式:
  - https://v.douyin.com/xxxxx/
  - https://www.douyin.com/video/xxxxx
  - 抖音分享口令中的链接(自动提取)

使用方法:
  python douyin_extractor.py <抖音链接>
  python douyin_extractor.py                         # 交互模式
"""

import re
import json
import sys
import time
import os
import urllib.parse
from pathlib import Path

import requests

HEADERS_MOBILE = {
    "User-Agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/16.0 Mobile/15E148 Safari/604.1"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}

HEADERS_DOWNLOAD = {
    "User-Agent": HEADERS_MOBILE["User-Agent"],
    "Referer": "https://www.douyin.com/",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS_MOBILE)
SESSION.max_redirects = 10


def extract_url_from_text(text: str) -> str | None:
    """从文本中提取抖音链接"""
    patterns = [
        r"https?://v\.douyin\.com/[A-Za-z0-9]+/?",
        r"https?://www\.douyin\.com/video/\d+",
        r"https?://www\.douyin\.com/user/[A-Za-z0-9_-]+",
        r"https?://www\.iesdouyin\.com/share/video/\d+",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None


def resolve_short_url(url: str) -> str:
    """解析短链接，跟随重定向获取最终视频页URL"""
    resp = SESSION.get(url, allow_redirects=False, timeout=15)

    redirect_count = 0
    while resp.status_code in (301, 302, 303, 307, 308) and resp.headers.get("Location"):
        url = resp.headers["Location"]
        if url.startswith("/"):
            parsed = urllib.parse.urlparse(resp.url)
            url = f"{parsed.scheme}://{parsed.netloc}{url}"
        redirect_count += 1
        if redirect_count > 10:
            break
        resp = SESSION.get(url, allow_redirects=False, timeout=15)

    return resp.url if resp.url else url


def extract_video_id(url: str) -> str | None:
    """从URL中提取视频ID"""
    patterns = [
        r"/video/(\d+)",
        r"video_id=(\d+)",
        r"item_ids?=(\d+)",
        r"/share/video/(\d+)",
        r"aweme_id=(\d+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def decode_unicode_escapes(text: str) -> str:
    """解码Unicode转义字符"""
    return re.sub(
        r'\\u([0-9a-fA-F]{4})',
        lambda m: chr(int(m.group(1), 16)),
        text,
    )


def parse_render_data(html: str) -> dict | None:
    """解析页面中 RENDER_DATA 的内容"""
    patterns = [
        r'<script[^>]*id="RENDER_DATA"[^>]*>(.*?)</script>',
        r'<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)</script>',
    ]
    for pattern in patterns:
        match = re.search(pattern, html, re.DOTALL)
        if match:
            raw = match.group(1).strip()
            try:
                decoded = urllib.parse.unquote(raw)
                decoded = decode_unicode_escapes(decoded)
                return json.loads(decoded)
            except (json.JSONDecodeError, UnicodeDecodeError):
                if raw.startswith("%7B") or raw.startswith("%22"):
                    try:
                        decoded = urllib.parse.unquote(raw)
                        return json.loads(decoded)
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        pass
    return None


def find_video_data(data: dict, depth: int = 0) -> dict | None:
    """递归搜索包含视频信息的字典"""
    if depth > 15 or not isinstance(data, (dict, list)):
        return None

    if isinstance(data, dict):
        if "aweme" in data and isinstance(data["aweme"], dict) and "video" in data["aweme"]:
            return data["aweme"]
        if "video" in data and "play_addr" in data["video"]:
            return data
        for key in ("aweme", "aweme_detail", "item_list", "detail", "item_info"):
            if key in data and isinstance(data[key], (dict, list)):
                result = find_video_data(data[key], depth + 1)
                if result:
                    return result
        for value in data.values():
            result = find_video_data(value, depth + 1)
            if result:
                return result

    if isinstance(data, list):
        for item in data:
            result = find_video_data(item, depth + 1)
            if result:
                return result

    return None


def extract_video_from_api(video_id: str) -> dict | None:
    """通过API接口获取视频信息"""
    api_urls = [
        f"https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={video_id}",
        f"https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id={video_id}",
    ]
    for api_url in api_urls:
        try:
            resp = SESSION.get(
                api_url,
                headers={
                    **HEADERS_MOBILE,
                    "Referer": f"https://www.douyin.com/video/{video_id}",
                },
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                video_data = find_video_data(data)
                if video_data:
                    return video_data
        except Exception:
            continue
    return None


def get_watermark_free_urls(video_data: dict) -> list[str]:
    """从视频数据中提取无水印播放地址"""
    video_urls = []
    video = video_data.get("video", video_data)

    url_sources = [
        video.get("play_addr_h264"),
        video.get("play_addr"),
        video.get("download_addr"),
    ]

    for source in url_sources:
        if not source:
            continue
        url_list = source.get("url_list", [])
        for url in url_list:
            clean_url = re.sub(r"playwm", "play", url)
            if clean_url not in video_urls:
                video_urls.append(clean_url)

    return video_urls


def get_video_info(video_data: dict) -> dict:
    """获取视频元信息"""
    info = {}
    info["desc"] = video_data.get("desc", "")
    if "author" in video_data:
        author = video_data["author"]
        info["author"] = author.get("nickname", "")
    elif "author_info" in video_data:
        info["author"] = video_data["author_info"].get("nickname", "")
    else:
        info["author"] = ""

    aweme_id = video_data.get("aweme_id", "")
    info["aweme_id"] = aweme_id

    stats = video_data.get("statistics", video_data.get("stats", {}))
    info["digg_count"] = stats.get("digg_count", stats.get("diggCount", 0))
    info["comment_count"] = stats.get("comment_count", stats.get("commentCount", 0))
    info["share_count"] = stats.get("share_count", stats.get("shareCount", 0))

    return info


def sanitize_filename(name: str) -> str:
    """清理文件名中的非法字符"""
    name = re.sub(r'[\\/:*?"<>|]', "_", name)
    return name.strip()[:100] or "douyin_video"


def download_video(url: str, filepath: str) -> bool:
    """下载视频文件"""
    try:
        resp = SESSION.get(url, headers=HEADERS_DOWNLOAD, stream=True, timeout=60)
        resp.raise_for_status()

        total_size = int(resp.headers.get("content-length", 0))
        downloaded = 0

        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size:
                        percent = (downloaded / total_size) * 100
                        bar_len = 40
                        filled = int(bar_len * downloaded / total_size)
                        bar = "█" * filled + "░" * (bar_len - filled)
                        sys.stdout.write(f"\r  [{bar}] {percent:.1f}%")
                        sys.stdout.flush()
        sys.stdout.write("\n")
        return True
    except Exception as e:
        print(f"  下载失败: {e}")
        if os.path.exists(filepath):
            os.remove(filepath)
        return False


def extract(url: str, output_dir: str = "./videos") -> bool:
    """核心提取函数"""
    print(f"\n{'=' * 50}")
    print(f"  抖音无水印视频提取")
    print(f"{'=' * 50}")

    os.makedirs(output_dir, exist_ok=True)

    video_id = None
    video_data = None

    # 步骤1: 解析短链接
    if "v.douyin.com" in url or "iesdouyin.com/share" in url:
        print(f"\n[1/4] 解析短链接...")
        resolved_url = resolve_short_url(url)
        print(f"  -> {resolved_url}")
        video_id = extract_video_id(resolved_url)
    else:
        resolved_url = url
        video_id = extract_video_id(url)

    if video_id:
        print(f"  ✓ 视频ID: {video_id}")

    # 步骤2: 获取页面内容并解析RENDER_DATA
    print(f"\n[2/4] 获取视频页面数据...")
    try:
        resp = SESSION.get(resolved_url, timeout=15)
        html = resp.text

        render_data = parse_render_data(html)
        if render_data:
            video_data = find_video_data(render_data)
            if video_data:
                print(f"  ✓ 从页面数据中提取到视频信息")
    except Exception as e:
        print(f"  ⚠ 页面解析异常: {e}")

    # 步骤3: 如果页面解析失败，尝试API
    if not video_data and video_id:
        print(f"  → 尝试API接口...")
        video_data = extract_video_from_api(video_id)
        if video_data:
            print(f"  ✓ 从API提取到视频信息")

    if not video_data:
        print(f"\n  ✗ 未能提取到视频信息")
        return False

    # 步骤4: 获取无水印URL
    print(f"\n[3/4] 提取无水印视频地址...")
    video_urls = get_watermark_free_urls(video_data)
    if not video_urls:
        print(f"  ✗ 未找到无水印视频地址")
        return False
    print(f"  ✓ 找到 {len(video_urls)} 个播放地址")

    video_info = get_video_info(video_data)
    if video_info["desc"]:
        print(f"  描述: {video_info['desc'][:50]}...")
    if video_info["author"]:
        print(f"  作者: {video_info['author']}")
    print(f"  点赞: {video_info['digg_count']} | 评论: {video_info['comment_count']}")

    # 步骤5: 下载
    print(f"\n[4/4] 下载视频...")
    filename = sanitize_filename(video_info["desc"] or f"douyin_{video_info['aweme_id']}")
    filepath = os.path.join(output_dir, f"{filename}.mp4")

    # 尝试每个URL，直到成功
    for i, video_url in enumerate(video_urls):
        print(f"  尝试地址 {i + 1}/{len(video_urls)}")
        if download_video(video_url, filepath):
            file_size = os.path.getsize(filepath)
            print(f"\n  ✓ 下载成功!")
            print(f"  文件: {filepath}")
            print(f"  大小: {file_size / 1024 / 1024:.2f} MB")
            print(f"{'=' * 50}")
            return True

    print(f"\n  ✗ 所有地址下载均失败")
    return False


def main():
    os.makedirs("videos", exist_ok=True)

    if len(sys.argv) > 1:
        raw_input = " ".join(sys.argv[1:])
    else:
        raw_input = input("请输入抖音分享链接: ").strip()
        if not raw_input:
            print("未输入链接，退出。")
            return

    url = extract_url_from_text(raw_input)
    if not url:
        print("未能从输入中识别出有效的抖音链接。")
        print("支持格式:")
        print("  - https://v.douyin.com/xxxxx/")
        print("  - https://www.douyin.com/video/xxxxx")
        return

    print(f"\n识别到链接: {url}")
    success = extract(url)

    if not success:
        print("\n提示:")
        print("  1. 确保视频是公开的")
        print("  2. 尝试在浏览器中打开链接确认视频存在")
        print("  3. 抖音可能更新了页面结构，联系开发者更新解析逻辑")


if __name__ == "__main__":
    main()