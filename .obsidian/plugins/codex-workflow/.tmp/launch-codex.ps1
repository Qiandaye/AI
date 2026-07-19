$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath 'G:\钱大爷的知识仓库'
Write-Host 'Codex vault: G:\钱大爷的知识仓库'
Write-Host 'Startup prompt: G:\钱大爷的知识仓库\.obsidian\plugins\codex-workflow\.tmp\startup-prompt.md'
$prompt = Get-Content -Raw -LiteralPath 'G:\钱大爷的知识仓库\.obsidian\plugins\codex-workflow\.tmp\startup-prompt.md'
codex $prompt