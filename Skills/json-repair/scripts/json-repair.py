#!/usr/bin/env python3
"""
json-repair: 自动检测并修复常见的 JSON 格式错误。

支持的修复：
  1. 单引号 -> 双引号（Python 字典风格）
  2. 尾随逗号移除
  3. 注释行移除（// 和 #）
  4. None/null 值处理
  5. 未引号键名添加双引号
  6. 未引号字符串值添加双引号
  7. 自愈兜底：尝试 json-repair 库（若已安装）

用法：
  python json-repair.py <input_file>          # 修复文件并原地覆盖
  python json-repair.py --stdin               # 从 stdin 读取，输出到 stdout
  python json-repair.py --check <file>        # 仅检查，不修改
  python json-repair.py --help

示例：
  echo "{'key': 'value',}" | python json-repair.py --stdin
  python json-repair.py config.json
"""

import sys
import re
import json


def fix_json_text(text):
    """
    对一段文本做渐进式修复，返回 (修复后的文本, 修复记录列表)。
    """
    notes = []
    original = text

    # 1) 移除行首注释（// 和 # 风格）
    cleaned_lines = []
    for line in text.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("//") or stripped.startswith("#"):
            notes.append("移除注释行: " + stripped[:60])
            continue
        # 行内注释（简单处理：去掉末尾的 // ...）
        in_string = False
        escape = False
        for i, ch in enumerate(line):
            if escape:
                escape = False
                continue
            if ch == '\\' and in_string:
                escape = True
                continue
            if ch == '"':
                in_string = not in_string
            if not in_string and i + 1 < len(line) and line[i:i+2] == '//':
                notes.append("移除行内注释 (pos=" + str(i) + ")")
                line = line[:i].rstrip()
                break
        cleaned_lines.append(line)
    text = '\n'.join(cleaned_lines)

    # 2) 尝试直接解析
    try:
        json.loads(text)
        return text, notes or ["原文已是合法 JSON"]
    except json.JSONDecodeError:
        pass

    # 3) 单引号 -> 双引号（逐字符解析，跳过字符串内的引号）
    fixed = []
    in_str = False
    escape = False
    for ch in text:
        if escape:
            fixed.append(ch)
            escape = False
            continue
        if ch == '\\':
            fixed.append(ch)
            escape = True
            continue
        if ch == '"':
            in_str = not in_str
            fixed.append(ch)
            continue
        if ch == "'" and not in_str:
            notes.append("单引号 -> 双引号")
            fixed.append('"')
        else:
            fixed.append(ch)
    text = ''.join(fixed)

    # 4) 移除尾随逗号
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    if re.search(r',(\s*[}\]])', original):
        notes.append("移除尾随逗号")

    # 5) 未引号键名 -> 添加双引号
    text = re.sub(
        r'(?:^|(?<=[{,\n]))\s*([a-zA-Z_\u4e00-\u9fff][a-zA-Z0-9_\u4e00-\u9fff]*)\s*:',
        lambda m: _quote_key(m),
        text,
        flags=re.MULTILINE
    )
    if re.search(r'(?:^|(?<=[{,\n]))\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:', original, re.MULTILINE):
        notes.append("未引用键名添加双引号")

    # 6) None -> null
    if 'None' in text:
        text = re.sub(r'\bNone\b', 'null', text)
        notes.append("None -> null")

    # 7) 未引号字符串值 -> 添加双引号
    #    在 "key": 后面找未引号的值（排除 null/true/false/数字/[/{ 等合法 JSON 值）
    text, had_unquoted = _fix_unquoted_values(text)
    if had_unquoted:
        notes.append("未引用字符串值添加双引号")

    # 8) 尝试再次解析
    try:
        json.loads(text)
        return text, notes or ["原文已是合法 JSON"]
    except json.JSONDecodeError:
        pass

    # 9) 兜底：尝试 json-repair 库
    try:
        import json_repair as jr
        repaired = jr.repair(original)
        json.loads(repaired)
        notes.append("使用 json-repair 库自愈")
        return repaired, notes
    except ImportError:
        pass
    except Exception:
        pass

    # 10) 最终失败
    return text, notes + ["警告: 无法自动修复，请手动检查"]


def _quote_key(m):
    """正则替换回调：给未引用的键名加双引号。"""
    full = m.group(0)
    key = m.group(1)
    # 找到键名开始位置
    prefix = full[:len(full) - len(key) - 1]
    return prefix + '"' + key + '":'


def _fix_unquoted_values(text):
    """
    在 "key": 之后查找未加引号的字符串值并加上引号。
    排除: null, true, false, 数字, [, {, ", ', ( 等合法 JSON 值起始符。
    返回 (修改后的文本, 是否有修改)。
    """
    # 匹配 "key": 后面跟着未引号值的情况
    # 未引号值 = 一个或多个非空白、非逗号、非括号、非布尔/null 关键字的字符
    pattern = r'"([^"]+)"\s*:\s*([a-zA-Z_\u4e00-\u9fff][a-zA-Z0-9_\u4e00-\u9fff]*(?:\s+[a-zA-Z_\u4e00-\u9fff][a-zA-Z0-9_\u4e00-\u9fff]*)*)\s*([,}\]])'

    changed = False

    def replacer(m):
        nonlocal changed
        changed = True
        key = m.group(1)
        val = m.group(2).strip()
        terminator = m.group(3)
        # 跳过 JSON 关键字
        if val in ('null', 'true', 'false'):
            return m.group(0)
        return '"' + key + '": "' + val + '"' + terminator

    text = re.sub(pattern, replacer, text)
    return text, changed


def main():
    import argparse
    parser = argparse.ArgumentParser(description="自动检测和修复 JSON 格式错误")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('file', nargs='?', help="要修复的 JSON 文件路径")
    group.add_argument('--stdin', action='store_true', help="从 stdin 读取，输出到 stdout")
    group.add_argument('--check', metavar='FILE', help="仅检查文件是否合法 JSON")
    args = parser.parse_args()

    if args.check:
        try:
            with open(args.check, 'r', encoding='utf-8') as f:
                text = f.read()
            json.loads(text)
            print("[OK] " + args.check + " 是合法的 JSON")
            sys.exit(0)
        except json.JSONDecodeError as e:
            print("[FAIL] " + args.check + ": " + str(e))
            fixed, notes = fix_json_text(text)
            print("\n修复记录:")
            for n in notes:
                print("  - " + n)
            try:
                json.loads(fixed)
                print("\n[INFO] 自动修复后可解析。使用 'python json-repair.py <file>' 保存修复结果。")
            except json.JSONDecodeError:
                print("\n[FATAL] 自动修复失败，请手动检查。")
            sys.exit(1)
        except FileNotFoundError:
            print("[ERROR] 文件不存在: " + args.check)
            sys.exit(1)
    if args.stdin:

        text = sys.stdin.read()
        fixed, notes = fix_json_text(text)
        print("Fix log:")
        for n in notes:
            print("  - " + n)
        print()
        print(fixed)
        return

    # 修复文件模式
    filepath = args.file
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
    except FileNotFoundError:
        print("[ERROR] 文件不存在: " + filepath)
        sys.exit(1)
    except UnicodeDecodeError:
        for enc in ['gbk', 'gb2312', 'latin-1']:
            try:
                with open(filepath, 'r', encoding=enc) as f:
                    text = f.read()
                print("[INFO] 使用 " + enc + " 编码读取文件")
                break
            except UnicodeDecodeError:
                continue
        else:
            print("[ERROR] 无法以 utf-8/gbk/gb2312/latin-1 读取文件: " + filepath)
            sys.exit(1)

    fixed, notes = fix_json_text(text)
    print("修复文件: " + filepath)
    print("修复记录:")
    for n in notes:
        print("  - " + n)

    # 保存修复结果
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            parsed = json.loads(fixed)
            json.dump(parsed, f, indent=2, ensure_ascii=False)
        print("\n[OK] 已保存修复后的文件: " + filepath)
    except json.JSONDecodeError:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print("\n[WARN] 修复后仍无法完全解析，已保存近似结果: " + filepath)


if __name__ == '__main__':
    main()
