# Request Rate Control — AI 请求频率控制 Skill

## 触发条件
当用户涉及以下场景时自动加载：
- 构建 AI 驱动的应用（聊天、搜索、问答、生成）
- 对接大模型 API（OpenAI、Claude、本地模型等）
- 提到"控制请求次数"、"限流"、"防抖"、"缓存"、"成本控制"
- 构建网站/应用需要调用外部 AI 服务

## 核心原则

AI 请求是**付费资源**，不是免费午餐。每次请求都花钱、花时间、有配额。
好的应用应该像节水一样节水 API 调用。

## 五大控制策略

### 1. 服务端缓存（最省钱，优先使用）

相同的问题不要问两次 AI。

```python
import hashlib
import json
import time
from pathlib import Path

class SimpleCache:
    """简单文件缓存，适合中小型项目"""
    
    def __init__(self, cache_dir=".ai_cache", ttl_hours=24):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.ttl = ttl_hours * 3600  # 秒
    
    def _key(self, text):
        return hashlib.md5(text.encode()).hexdigest()
    
    def get(self, text):
        key = self._key(text)
        cache_file = self.cache_dir / f"{key}.json"
        if cache_file.exists():
            data = json.loads(cache_file.read_text(encoding="utf-8"))
            if time.time() - data["time"] < self.ttl:
                return data["result"]
            cache_file.unlink()  # 过期删除
        return None
    
    def set(self, text, result):
        key = self._key(text)
        cache_file = self.cache_dir / f"{key}.json"
        cache_file.write_text(json.dumps({
            "time": time.time(),
            "result": result
        }, ensure_ascii=False, indent=2), encoding="utf-8")
```

**使用场景：** 常见问题、固定内容、搜索结果

**效果：** 相同问题零成本，减少 50%+ 请求

---

### 2. 限流器（防止被封）

控制单位时间内的最大请求数。

```python
import time
from collections import deque
from threading import Lock

class TokenBucketLimiter:
    """令牌桶限流器 — 平滑流量，允许短暂突发"""
    
    def __init__(self, rate, max_tokens):
        """
        rate: 每秒生成的令牌数
        max_tokens: 桶的最大容量
        """
        self.rate = rate
        self.max_tokens = max_tokens
        self.tokens = max_tokens
        self.last_time = time.time()
        self.lock = Lock()
    
    def acquire(self, tokens=1):
        """获取令牌，阻塞直到可用"""
        with self.lock:
            now = time.time()
            # 补充令牌
            elapsed = now - self.last_time
            self.tokens = min(self.max_tokens, 
                            self.tokens + elapsed * self.rate)
            self.last_time = now
            
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            
            # 计算等待时间
            wait = (tokens - self.tokens) / self.rate
        
        time.sleep(wait)
        return self.acquire(tokens)  # 递归重试

# 使用示例：每分钟最多 10 次请求
limiter = TokenBucketLimiter(rate=10/60, max_tokens=10)

def safe_call_api(question):
    limiter.acquire()  # 自动等待
    return call_openai(question)
```

**使用场景：** 所有 API 调用前必加

**效果：** 避免 429 限流错误，保护账号

---

### 3. 队列 + 并发控制

高并发时排队处理，不瞬间打爆 API。

```python
import asyncio
import aiohttp

class AsyncRateLimiter:
    """异步限流器，适合高并发 Web 应用"""
    
    def __init__(self, max_per_second=5):
        self.semaphore = asyncio.Semaphore(max_per_second)
        self.rate = max_per_second
    
    async def __aenter__(self):
        await self.semaphore.acquire()
        return self
    
    async def __aexit__(self, *args):
        self.semaphore.release()

async def handle_request(question, limiter):
    async with limiter:
        async with aiohttp.ClientSession() as session:
            async with session.post("https://api.openai.com/v1/chat/completions",
                                   json={"prompt": question},
                                   headers={"Authorization": "Bearer ..."}) as resp:
                return await resp.json()
```

**使用场景：** Web 应用、高并发场景

**效果：** 平滑处理大量并发请求

---

### 4. 前端防抖（Debounce）

用户快速输入时，只发最后一次请求。

```javascript
// 搜索框防抖
let searchTimer = null;

function debounceSearch(input, callback, delay = 300) {
    if (searchTimer) clearTimeout(searchTimer);
    
    searchTimer = setTimeout(() => {
        const query = input.value.trim();
        if (query.length > 0) {
            callback(query);  // 真正发送请求
        }
    }, delay);
}

// 使用
document.getElementById('search').addEventListener('input', (e) => {
    debounceSearch(e.target, (query) => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => renderResults(data));
    });
});
```

**使用场景：** 搜索框、聊天输入、实时预览

**效果：** 减少 70%+ 无效请求

---

### 5. 降级策略（兜底）

API 挂了或限流时，给用户一个体面的答案。

```python
import functools

def fallback(max_retries=2, backoff=[1, 2, 4]):
    """指数退避重试装饰器"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries:
                        raise
                    time.sleep(backoff[attempt])
            return None
        return wrapper
    return decorator

@fallback(max_retries=2)
def call_ai_with_retry(question):
    return call_openai(question)

# 完整降级链
def get_answer(question):
    # 1. 先查缓存
    cached = cache.get(question)
    if cached:
        return cached
    
    # 2. 尝试 AI
    try:
        answer = call_ai_with_retry(question)
        cache.set(question, answer)
        return answer
    except Exception:
        pass
    
    # 3. 降级到本地知识库
    local_answer = search_local_kb(question)
    if local_answer:
        return local_answer
    
    # 4. 终极降级
    return "暂时无法回答，请稍后重试"
```

**使用场景：** 所有生产环境应用

**效果：** API 故障时用户体验不崩溃

---

## 实战模板：完整的 AI 调用封装

```python
import hashlib
import json
import time
from pathlib import Path
from collections import deque
from threading import Lock

class AIRequestController:
    """AI 请求控制器 — 缓存 + 限流 + 降级 一体化"""
    
    def __init__(self, api_func, max_rpm=60, cache_ttl_hours=24):
        """
        api_func: 调用 AI 的函数
        max_rpm: 每分钟最大请求数
        cache_ttl_hours: 缓存过期时间
        """
        self.api_func = api_func
        self.cache = SimpleCache(ttl_hours=cache_ttl_hours)
        self.limiter = TokenBucketLimiter(rate=max_rpm/60, max_tokens=max_rpm)
        self.request_log = deque(maxlen=1000)
    
    def call(self, question, fallback_func=None):
        """带完整控制的调用"""
        # 1. 缓存命中
        cached = self.cache.get(question)
        if cached:
            self._log("cache_hit")
            return cached
        
        # 2. 限流等待
        self.limiter.acquire()
        
        # 3. 调用 API（带重试）
        try:
            result = self.api_func(question)
            self.cache.set(question, result)
            self._log("api_success")
            return result
        except Exception as e:
            self._log(f"api_error: {e}")
            
            # 4. 降级
            if fallback_func:
                try:
                    result = fallback_func(question)
                    self._log("fallback_success")
                    return result
                except Exception as fe:
                    self._log(f"fallback_error: {fe}")
            
            raise
    
    def _log(self, event):
        self.request_log.append({
            "time": time.time(),
            "event": event
        })
    
    def stats(self):
        """获取请求统计"""
        total = len(self.request_log)
        hits = sum(1 for r in self.request_log if r["event"] == "cache_hit")
        misses = total - hits
        return {
            "total_requests": total,
            "cache_hits": hits,
            "cache_misses": misses,
            "hit_rate": f"{hits/total*100:.1f}%" if total > 0 else "0%"
        }
```

**使用方式：**

```python
# 初始化
controller = AIRequestController(
    api_func=lambda q: call_openai(q),
    max_rpm=30,  # 每分钟 30 次
    cache_ttl_hours=48
)

# 调用
answer = controller.call(
    "什么是汽车金融？",
    fallback_func=lambda q: search_local_kb(q)
)

# 查看统计
print(controller.stats())
# {'total_requests': 100, 'cache_hits': 67, 'cache_misses': 33, 'hit_rate': '67.0%'}
```

---

## 成本估算参考

| 策略 | 请求减少 | 成本节省 |
|------|---------|---------|
| 纯缓存 | 50-80% | 最显著 |
| 限流器 | 0%（只是平滑） | 防止额外费用 |
| 前端防抖 | 60-90%（搜索场景） | 显著 |
| 降级策略 | 0% | 避免故障损失 |
| 组合使用 | 70-95% | 最优 |

---

## 注意事项

1. **缓存键要精确** — 用户输入微调会导致缓存失效，考虑模糊匹配
2. **缓存 TTL 要合理** — 新闻类内容 TTL 短（1-4h），百科类可以长（24-72h）
3. **限流参数按套餐定** — 免费套餐 RPM 低，付费套餐可以高一些
4. **监控命中率** — 低于 30% 说明缓存策略需要调整
5. **不要缓存敏感数据** — 用户隐私信息不入缓存

---

## 版本历史

- v1 (2026-06-22): 初始版本，五大策略全覆盖
