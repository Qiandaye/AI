# 小规 (Xiaogui) 宠物生成操作指南

## 项目信息
- **宠物名称**: 小规 (Xiaogui)
- **概念**: 一只可爱的 3D 玩具风格机械仓鼠工程师，戴着橙色护目镜，代表精确和秩序
- **运行目录**: `G:\codex文件\hatch-pet\xiaogui-20260619`
- **风格**: 3D-toy (迷你机械玩具风格，温暖黄铜和铜色金属色调)

## 当前状态
- ✅ 运行目录已创建
- ✅ 作业清单已生成 (`imagegen-jobs.json`)
- ✅ 提示词已生成 (base + 9 个状态行)
- ✅ 布局指南已生成 (9 个状态)
- ❌ 图像未生成 (缺少 OPENAI_API_KEY)

## 继续步骤

### 步骤 1: 生成 Base 图像
在 Codex 应用界面中，使用内置的 `image_gen` 工具或 `$imagegen` 技能：
- **提示词文件**: `prompts/base-pet.md`
- **输出路径**: `decoded/base.png`
- **说明**: 生成一个完整的宠物主形象，背景为品红色 (#FF00FF) 色键背景

### 步骤 2: 生成姿态行
按顺序生成以下 9 个状态行：
1. **idle** (6 帧): `prompts/rows/idle.md` → `decoded/idle.png`
2. **running-right** (8 帧): `prompts/rows/running-right.md` → `decoded/running-right.png`
3. **running-left** (8 帧): 从 running-right 镜像生成，或独立生成
4. **waving** (4 帧): `prompts/rows/waving.md` → `decoded/waving.png`
5. **jumping** (5 帧): `prompts/rows/jumping.md` → `decoded/jumping.png`
6. **failed** (8 帧): `prompts/rows/failed.md` → `decoded/failed.png`
7. **waiting** (6 帧): `prompts/rows/waiting.md` → `decoded/waiting.png`
8. **running** (6 帧): `prompts/rows/running.md` → `decoded/running.png`
9. **review** (6 帧): `prompts/rows/review.md` → `decoded/review.png`

### 步骤 3: 运行后续处理脚本
所有图像生成完成后，运行以下脚本：

```powershell
# 提取帧
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/extract_strip_frames.py" ^
  --decoded-dir "G:\codex文件\hatch-pet\xiaogui-20260619\decoded" ^
  --output-dir "G:\codex文件\hatch-pet\xiaogui-20260619\frames" ^
  --states all ^
  --method auto

# 检查帧
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/inspect_frames.py" ^
  --frames-root "G:\codex文件\hatch-pet\xiaogui-20260619\frames" ^
  --json-out "G:\codex文件\hatch-pet\xiaogui-20260619\qa\review.json" ^
  --require-components

# 组装精灵图
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/compose_atlas.py" ^
  --frames-root "G:\codex文件\hatch-pet\xiaogui-20260619\frames" ^
  --output "G:\codex文件\hatch-pet\xiaogui-20260619\final\spritesheet.png" ^
  --webp-output "G:\codex文件\hatch-pet\xiaogui-20260619\final\spritesheet.webp"

# 验证精灵图
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/validate_atlas.py" ^
  "G:\codex文件\hatch-pet\xiaogui-20260619\final\spritesheet.webp" ^
  --json-out "G:\codex文件\hatch-pet\xiaogui-20260619\final\validation.json"

# 生成联系表
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/make_contact_sheet.py" ^
  "G:\codex文件\hatch-pet\xiaogui-20260619\final\spritesheet.webp" ^
  --output "G:\codex文件\hatch-pet\xiaogui-20260619\qa\contact-sheet.png"

# 渲染动画预览
python "C:/Users/Administrator/.codex/skills/hatch-pet/scripts/render_animation_previews.py" ^
  --frames-root "G:\codex文件\hatch-pet\xiaogui-20260619\frames" ^
  --output-dir "G:\codex文件\hatch-pet\xiaogui-20260619\qa\previews"
```

### 步骤 4: 打包
```powershell
# 创建宠物包
$PET_DIR = "C:\Users\Administrator\.codex\pets\xiaogui"
New-Item -ItemType Directory -Path $PET_DIR -Force
Copy-Item "G:\codex文件\hatch-pet\xiaogui-20260619\final\spritesheet.webp" $PET_DIR
```

## 注意事项
- 每次生成图像后，需要将输出复制到对应的 `decoded/` 目录
- 生成 base 后，需要创建 `references/canonical-base.png`
- 运行 `running-left` 时，需要先确认 `running-right` 的质量，然后镜像生成
- 所有图像生成完成后，需要运行 QA 验证确保质量

## 故障排除
- 如果图像生成失败，检查提示词和布局指南是否正确
- 如果 QA 验证失败，根据 `qa/review.json` 中的错误信息重新生成失败的行
- 如果遇到尺寸弹出问题，使用 `--method stable-slots` 重新运行帧提取
