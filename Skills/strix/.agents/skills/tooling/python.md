---
name: python
description: Run Python scripts directly on bare-metal Linux. pip-install packages as needed; the caido_api module provides Caido proxy automation from Python scripts.
---


# Python on Bare-Metal Linux

Use Python directly from the terminal — no sandbox or container needed.
Python 3 is assumed already installed on the host.

Prefer writing reusable scripts to `./scratch/<name>.py` (or any project
directory) and running them with `python3 ./scratch/<name>.py`. For short
one-off transformations, `python3 -c` or a small here-document is fine.

## Proxy Automation From Python

If you have Caido running locally (e.g. at `http://127.0.0.1:48080`),
install the `caido_api` module:

```bash
pip install caido-api       # install once on bare-metal
```

Then import it for traffic/replay access:

```python
from caido_api import (
    list_requests,
    list_sitemap,
    repeat_request,
    scope_rules,
    view_request,
    view_sitemap_entry,
)
```

All helpers are async. Use them inside `asyncio.run(...)` or an async
function:

```python
import asyncio

from caido_api import list_requests, view_request


async def main():
    posts = await list_requests(
        httpql_filter='req.method.eq:"POST" AND req.path.cont:"/api/"',
        first=50,
    )
    candidates = []
    for edge in posts.edges:
        request_id = edge.node.request.id
        body = await view_request(request_id, part="request")
        raw = body.request.raw.decode("utf-8", errors="replace")
        if "id=" in raw or "user=" in raw:
            candidates.append(request_id)

    print(f"{len(candidates)} candidates")
    print(candidates[:10])


asyncio.run(main())
```

Available helpers:

- `list_requests(httpql_filter=, first=50, after=, sort_by=, sort_order=, scope_id=)` returns a cursor-paginated Caido SDK `Connection`.
- `view_request(request_id, part="request")` returns a Caido SDK request object with raw request/response bytes.
- `repeat_request(request_id, modifications={...})` replays a captured request after modifying `url`, `params`, `headers`, `body`, or `cookies`.
- `list_sitemap(scope_id=, parent_id=, depth="DIRECT", page=1)` walks Caido's request-tree view of the discovered surface. Omit `parent_id` for root domains; pass an entry id with `depth="DIRECT"` or `"ALL"` to drill in.
- `view_sitemap_entry(entry_id)` returns one entry plus its 30 most recent related requests.
- `scope_rules(action, allowlist=, denylist=, scope_id=, scope_name=)` manages Caido scopes.

For one-off arbitrary requests (e.g. probing a fresh endpoint, hitting an
external API), use `curl` / `httpx` / `requests` directly from the terminal.
If `HTTP_PROXY` is set in your environment, all such traffic routes through
Caido automatically, so it shows up in `list_requests` and you can use
`repeat_request` to replay-and-modify any of it.

## Workflow

For iterative exploit work, put code in a file:

```text
1. Create or edit `./scratch/exploit.py` with any editor.
2. Run it: `python3 ./scratch/exploit.py`.
3. Edit and rerun until the proof-of-concept is reliable.
```

## Installing extra packages

```bash
pip install <package>      # standard pip, no sandbox paths needed
```