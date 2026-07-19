---
name: json-repair
description: >
  自动检测和修复 JSON 格式错误。当用户遇到 "Expecting property name enclosed in double quotes"、
  "JSONDecodeError"、"Unterminated string" 等 JSON 解析错误，或需要修复配置文件、API 请求体、
  数据文件中的 JSON 语法问题时使用。支持单引号、尾随逗号、注释、None 值、未引号键名/值等常见错误。
  触发词：JSON 错误、json解析失败、格式不对、fix json、repair json、Invalid JSON。
---

# JSON Repair Skill

自动修复常见 JSON 格式错误，将非法 JSON 转为合法 JSON。

## 适用场景

- OpenAI API 报错 `Expecting property name enclosed in double quotes`
- Python `json.JSONDecodeError`
- 配置文件（config.json、settings.json 等）格式错误
- API 请求体 JSON 拼接错误
- 任何需要快速诊断和修复 JSON 格式问题的场景

## 使用方法

### 方式一：使用内置脚本（推荐）

脚本位置：`C:\Users\Administrator\.codex\skills\json-repair\scripts\json-repair.py`

```bash
# 修复文件并原地保存
python json-repair.py <文件路径>

# 从 stdin 读取，输出到 stdout
echo '{"key": "value"}' | python json-repair.py --stdin

# 仅检查文件合法性
python json-repair.py --check <文件路径>
```

### 方式二：直接调用修复函数

在 Python 代码中使用：

```python
import sys
sys.path.insert(0, r"C:\Users\Administrator\.codex\skills\json-repair\scripts")
from json-repair import fix_json_text

fixed_text, notes = fix_json_text(bad_json_string)
for note in notes:
    print("修复:", note)
# fixed_text 即为修复后的合法 JSON 字符串
```

## 支持的修复类型

| 错误类型 | 示例 | 修复方式 |
|---------|------|---------|
| 单引号 | `{'key': 'val'}` | 转双引号 |
| 尾随逗号 | `{"a": 1,}` | 移除 |
| 注释 | `// comment` 或 `# comment` | 移除 |
| None 值 | `{"a": None}` | 转 `null` |
| 未引号键名 | `{name: "x"}` | 加双引号 |
| 未引号值 | `{key: value}` | 加双引号 |

## 工作流程

1. **读取**：用 utf-8 编码读取 JSON 文件/字符串，失败时尝试 gbk/gb2312
2. **诊断**：尝试 `json.loads()` 解析，失败则进入修复流程
3. **修复**：按上述顺序逐步修复各类常见错误
4. **验证**：修复后再次尝试解析，成功则保存/返回
5. **自愈**：内置修复失败时，尝试 `json-repair` PyPI 库作为兜底
6. **报告**：输出修复记录，标注做了哪些修改

## 注意事项

- 修复后会自动格式化输出（缩进 2 空格）
- 多行字符串值中的引号不会被误改
- 不会修改 JSON 的结构或语义，只做语法层面的修复
- 如果无法完全修复，会保留近似结果并标注警告
