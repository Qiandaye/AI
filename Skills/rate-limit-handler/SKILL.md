---
name: rate-limit-handler
description: 自动处理 429 Too Many Requests 错误，采用指数退避 + 随机抖动策略重试。适用于所有 AI API 调用场景（OpenAI、Claude、本地模型等）。当出现 "exceeded retry limit, last status: 429"、"rate limit"、"Too Many Requests"、"限速"、"频率限制" 等错误时自动触发。也适用于用户主动要求"加个重试机制"、"处理限流"、"429 怎么办"的场景。
---

# 429 限流自动重试 Handler

## 核心原则

429 错误 = 对方服务器说"你太快了，请稍后再试"。
解决方案不是放弃，而是**聪明地等待后重试**。

## 重试策略

### 指数退避 + 随机抖动

```
第1次重试: 等待 2秒  ± 随机0-2秒 = 2-4秒
第2次重试: 等待 4秒  ± 随机0-4秒 = 4-8秒
第3次重试: 等待 8秒  ± 随机0-8秒 = 8-16秒
第4次重试: 等待 16秒 ± 随机0-16秒 = 16-32秒
```

### 最大重试次数

- 默认最多重试 **4 次**
- 连续 4 次 429 后放弃，告知用户

### 特殊头信息处理

如果响应头中包含 `Retry-After`，优先使用该值作为等待时间。

## 实施步骤

### 1. 识别 429 错误

当看到以下任一情况时，立即启动重试流程：
- HTTP 状态码 429
- 错误信息包含 "Too Many Requests" 或 "rate limit"
- 工具调用返回 `exceeded retry limit` 且状态为 429

### 2. 计算等待时间

```python
import random
import time

def calculate_backoff(retry_count: int, retry_after_header: float | None = None) -> float:
    """
    计算指数退避等待时间（秒）
    
    Args:
        retry_count: 当前重试次数（从0开始）
        retry_after_header: Retry-After 响应头的值（如果有）
    
    Returns:
        等待时间（秒）
    """
    if retry_after_header is not None:
        return retry_after_header
    
    base_delay = min(2 ** retry_count, 30)  # 最大30秒
    jitter = random.uniform(0, base_delay)   # 随机抖动
    return base_delay + jitter
```

### 3. 执行重试

```python
import time
import random

def retry_with_backoff(func, max_retries=4, *args, **kwargs):
    """
    带指数退避的重试包装器
    
    Args:
        func: 可能返回 429 的函数
        max_retries: 最大重试次数
        *args, **kwargs: 传递给 func 的参数
    
    Returns:
        func 的成功返回值
    
    Raises:
        所有重试失败后抛出最后一次异常
    """
    last_exception = None
    
    for attempt in range(max_retries + 1):  # +1 因为第一次不算重试
        try:
            return func(*args, **kwargs)
        except Exception as e:
            last_exception = e
            
            # 检查是否是 429 错误
            status_code = getattr(e, 'status_code', None)
            error_str = str(e).lower()
            is_429 = status_code == 429 or '429' in error_str or 'too many requests' in error_str or 'rate limit' in error_str
            
            if not is_429:
                raise  # 非 429 错误直接抛出
            
            if attempt == max_retries:
                break  # 达到最大重试次数，退出循环
            
            # 计算等待时间
            wait_time = calculate_backoff(attempt)
            
            # 告知用户正在等待
            print(f"⏳ 遇到限流 (第 {attempt + 1} 次重试)，等待 {wait_time:.1f} 秒后重试...")
            time.sleep(wait_time)
    
    raise last_exception
```

### 4. 实际使用示例

```python
# 场景1: 封装 AI API 调用
def call_openai(messages):
    # ... API 调用代码 ...
    pass

safe_result = retry_with_backoff(call_openai, messages=[...])

# 场景2: 批量生成任务中的单条重试
def generate_article(topic):
    return retry_with_backoff(ai_generate, topic)
```

## 注意事项

1. **不要在重试时改变请求参数** — 429 是因为频率，不是因为内容
2. **每次重试前打印等待时间** — 让用户知道你在做什么，而不是卡住了
3. **Retry-After 头优先** — 服务器明确说了等多久，就等多久
4. **不要无限重试** — 4 次够了，再重试大概率还是 429
5. **区分 429 和其他错误** — 500、400 错误不应该用 429 策略处理

## 与全局工作台现有技能的关系

- `request-rate-control` 技能：面向**构建应用时**的客户端限流
- 本技能：面向**Codex 自身调用 API 时**的 429 自动重试
- 两者互补：构建应用时用 `request-rate-control`，Codex 日常使用时本技能自动生效
