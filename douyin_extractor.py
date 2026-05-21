#!/usr/bin/env python3
"""
抖音无水印视频提取工具
使用 Playwright 浏览器加载抖音移动端页面，提取无水印视频并下载

支持链接格式:
  - https://v.douyin.com/xxxxx/
  - https://www.douyin.com/video/xxxxx
  - 抖音分享口令中的链接(自动提取)

使用方法:
  python douyin_extractor.py <抖音链接>
  python douyin_extractor.py                         # 交互模式

原理:
  1. 使用移动端 UA 加载抖音视频页，服务端直出 <video> 标签
  2. 从 <video src> 中获取 playwm (watermark) 地址
  3. 将 playwm 替换为 play 获取无水印视频地址
  4. 用 requests 流式下载视频文件
"""

import re
import json
import sys
import os
import time
import urllib.parse

import requests
from playwright.sync_api import sync_playwright

DOWNLOAD_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/16.0 Mobile/15E148 Safari/604.1"
    ),
    "Referer": "https://www.douyin.com/",
}

MOBILE_UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) "
    "Version/16.0 Mobile/15E148 Safari/604.1"
)


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


def resolve_short_url(url: str) -> str | None:
    """通过抖音短链接获取重定向后的URL，提取 video_id"""
    resp = requests.get(url, headers=DOWNLOAD_HEADERS, allow_redirects=False, timeout=15)
    redirect_count = 0
    while resp.status_code in (301, 302, 303, 307, 308) and resp.headers.get("Location"):
        url = resp.headers["Location"]
        if url.startswith("/"):
            parsed = urllib.parse.urlparse(resp.url)
            url = f"{parsed.scheme}://{parsed.netloc}{url}"
        redirect_count += 1
        if redirect_count > 10:
            break
        resp = requests.get(url, headers=DOWNLOAD_HEADERS, allow_redirects=False, timeout=15)
    return resp.url if resp.url else url


def sanitize_filename(name: str) -> str:
    """清理文件名中的非法字符"""
    name = re.sub(r'[\\/:*?"<>|\n\r\t]', "_", name)
    return name.strip()[:100] or "douyin_video"


def parse_page(html: str) -> dict:
    """从移动端页面HTML中提取视频信息"""
    result = {
        "video_url": None,
        "desc": "",
        "author": "",
    }

    # 提取 <video> 标签 src
    video_match = re.search(r'<video[^>]*src="([^"]+)"', html)
    if video_match:
        src = video_match.group(1)
        if src.startswith("/"):
            src = f"https://www.douyin.com{src}"
        # 替换 playwm -> play 去水印
        result["video_url"] = re.sub(r"playwm", "play", src)
        result["video_url"] = result["video_url"].replace("&amp;", "&")

    # 提取页面标题 (格式: "描述 #话题 - 抖音")
    title_match = re.search(r"<title>([^<]+)</title>", html)
    if title_match:
        title = title_match.group(1)
        title = re.sub(r"\s*-\s*抖音\s*$", "", title).strip()
        result["desc"] = title

    return result


def download_video(url: str, filepath: str) -> bool:
    """下载视频文件(带进度条)"""
    try:
        resp = requests.get(url, headers=DOWNLOAD_HEADERS, stream=True, timeout=120)
        resp.raise_for_status()
        content_type = resp.headers.get("content-type", "")
        if "video" not in content_type and resp.status_code != 200:
            return False

        total_size = int(resp.headers.get("content-length", 0))
        downloaded = 0
        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = downloaded / total_size * 100
                        bar_len = 40
                        filled = int(bar_len * percent / 100)
                        bar = "#" * filled + "-" * (bar_len - filled)
                        sys.stdout.write(f"\r  [{bar}] {percent:.1f}%")
                        sys.stdout.flush()
        sys.stdout.write("\n")
        return True
    except Exception as e:
        print(f"  下载失败: {e}")
        if os.path.exists(filepath):
            os.remove(filepath)
        return False


def extract_with_mobile_page(url: str, output_dir: str = "./videos") -> bool:
    """使用移动端页面提取视频"""
    print(f"\n{'=' * 50}")
    print(f"  抖音无水印视频提取")
    print(f"{'=' * 50}")

    os.makedirs(output_dir, exist_ok=True)

    # 步骤1: 解析短链接获取 video_id
    print(f"\n[1/3] 解析链接...")
    video_id = extract_video_id(url)
    if not video_id and "v.douyin.com" in url:
        resolved = resolve_short_url(url)
        video_id = extract_video_id(resolved)
        if resolved:
            print(f"  重定向: {resolved[:80]}...")

    if video_id:
        print(f"  ✓ 视频ID: {video_id}")
        douyin_url = f"https://www.douyin.com/video/{video_id}"
    else:
        douyin_url = url

    # 步骤2: 使用 Playwright 加载移动端页面
    print(f"\n[2/3] 加载移动端页面...")
    video_info = None

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ])
        context = browser.new_context(
            user_agent=MOBILE_UA,
            viewport={"width": 390, "height": 844},
        )
        page = context.new_page()

        try:
            page.goto(douyin_url, timeout=30000, wait_until="domcontentloaded")
        except Exception:
            pass

        # 等待页面渲染
        wait_count = 0
        while wait_count < 10:
            time.sleep(2)
            html = page.content()
            result = parse_page(html)
            if result["video_url"]:
                video_info = result
                print(f"  ✓ 页面渲染完成")
                break
            wait_count += 1

        html = page.content()
        browser.close()

        if not video_info:
            result = parse_page(html)
            if result["video_url"]:
                video_info = result

    if not video_info or not video_info["video_url"]:
        print(f"\n  ✗ 未能从页面提取到视频信息")
        print(f"  提示: 视频可能需要公开可见")
        return False

    print(f"  ✓ 获取到无水印视频地址")
    if video_info.get("desc"):
        print(f"  描述: {video_info['desc']}")

    # 步骤3: 下载
    print(f"\n[3/3] 下载视频...")
    filename = sanitize_filename(video_info.get("desc", "") or f"douyin_{video_id or 'video'}")
    filepath = os.path.join(output_dir, f"{filename}.mp4")

    print(f"  地址: {video_info['video_url'][:80]}...")
    if download_video(video_info["video_url"], filepath):
        file_size = os.path.getsize(filepath)
        print(f"\n  ✓ 下载成功!")
        print(f"  文件: {filepath}")
        print(f"  大小: {file_size / 1024 / 1024:.2f} MB")
        print(f"{'=' * 50}")
        return True

    print(f"\n  ✗ 下载失败")
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
    success = extract_with_mobile_page(url)

    if not success:
        print("\n提示:")
        print("  1. 确保视频是公开的")
        print("  2. 尝试在浏览器中打开链接确认视频存在")


if __name__ == "__main__":
    main()