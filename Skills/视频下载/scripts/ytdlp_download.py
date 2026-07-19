#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
yt-dlp 视频下载工具
支持抖音、B站、YouTube、快手、Twitter、Instagram、TikTok 等 1000+ 网站
"""

import sys
import os
import subprocess


DEFAULT_DIR = r"G:\codex文件\视频下载"


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)
    return path


def download(url, quality="best", save_dir=None, merge=True):
    """
    使用 yt-dlp 下载视频
    
    参数:
        url: 视频链接
        quality: 画质选择
            - "best"       最高画质（默认）
            - "720p"       720p
            - "480p"       480p
            - "audio"      仅音频
        save_dir: 保存目录，默认 G:\codex文件\视频下载
        merge: 是否合并音视频为 mp4
    返回:
        下载的文件路径列表
    """
    if save_dir is None:
        save_dir = ensure_dir(DEFAULT_DIR)
    else:
        save_dir = ensure_dir(save_dir)

    # 检查 yt-dlp 是否可用
    try:
        result = subprocess.run(
            ["yt-dlp", "--version"],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode != 0:
            print("错误: yt-dlp 未安装或不可用")
            print("运行: pip install yt-dlp")
            sys.exit(1)
    except FileNotFoundError:
        print("错误: yt-dlp 未安装")
        print("运行: pip install yt-dlp")
        sys.exit(1)

    # 构建命令
    cmd = ["yt-dlp", "--no-playlist"]

    # 画质选择
    if quality == "best":
        cmd.extend(["-f", "bestvideo+bestaudio"])
    elif quality == "720p":
        cmd.extend(["-f", "bestvideo[height<=720]+bestaudio"])
    elif quality == "480p":
        cmd.extend(["-f", "bestvideo[height<=480]+bestaudio"])
    elif quality == "audio":
        cmd.extend(["-x", "--audio-format", "mp3"])
    else:
        cmd.extend(["-f", quality])

    # 合并为 mp4
    if merge and quality != "audio":
        cmd.extend(["--merge-output-format", "mp4"])

    # 输出模板
    cmd.extend(["-o", os.path.join(save_dir, "%(title)s_%(id)s.%(ext)s")])

    # 添加 URL
    cmd.append(url)

    print(f"下载命令: {' '.join(cmd)}")
    print(f"目标: {url}")
    print(f"画质: {quality}")
    print(f"保存目录: {save_dir}")
    print("-" * 60)

    # 执行下载
    proc = subprocess.run(cmd, capture_output=False)

    if proc.returncode == 0:
        print("-" * 60)
        print("下载完成！")
        # 列出下载的文件
        files = [f for f in os.listdir(save_dir) if f.endswith(('.mp4', '.mkv', '.webm', '.mp3'))]
        for f in sorted(files, key=lambda x: os.path.getmtime(os.path.join(save_dir, x)), reverse=True)[:5]:
            filepath = os.path.join(save_dir, f)
            size_mb = os.path.getsize(filepath) / (1024 * 1024)
            print(f"  {f} ({size_mb:.1f} MB)")
    else:
        print("下载失败，请检查链接是否正确")


def list_supported():
    """列出 yt-dlp 支持的平台"""
    try:
        result = subprocess.run(
            ["yt-dlp", "--list-extractors"],
            capture_output=True, text=True, timeout=30
        )
        extractors = result.stdout.strip().split("\n")
        print(f"yt-dlp 支持 {len(extractors)} 个网站，包括:")
        popular = ["douyin", "bilibili", "youtube", "twitter", "instagram", "tiktok", "kuaishou", "acfun", "bilibili"]
        found = [e for e in extractors if e.lower() in popular]
        for name in found[:10]:
            print(f"  - {name}")
        print(f"  ... 以及其他 {len(extractors) - len(found)} 个网站")
    except Exception as e:
        print(f"获取支持列表失败: {e}")


def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  python ytdlp_download.py <URL> [选项]")
        print()
        print("选项:")
        print("  -q, --quality <画质>     画质选择: best(默认), 720p, 480p, audio")
        print("  -o, --output <目录>      输出目录")
        print("  --list                   列出支持的平台")
        print("  --no-merge               不合并音视频")
        print()
        print("示例:")
        print('  python ytdlp_download.py "https://v.douyin.com/xxxxx"')
        print('  python ytdlp_download.py "https://v.douyin.com/xxxxx" -q 720p')
        print('  python ytdlp_download.py "https://www.bilibili.com/video/xxxx" -o "G:\\codex文件\\my_videos"')
        print('  python ytdlp_download.py --list')
        sys.exit(1)

    url = sys.argv[1]
    quality = "best"
    save_dir = None
    merge = True
    i = 2

    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg in ("-q", "--quality"):
            quality = sys.argv[i + 1]
            i += 2
        elif arg in ("-o", "--output"):
            save_dir = sys.argv[i + 1]
            i += 2
        elif arg == "--list":
            list_supported()
            return
        elif arg == "--no-merge":
            merge = False
            i += 1
        else:
            i += 1

    download(url, quality=quality, save_dir=save_dir, merge=merge)


if __name__ == "__main__":
    main()
