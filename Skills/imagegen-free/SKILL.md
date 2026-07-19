---
name: "imagegen-free"
description: "Free AI image generation using Pollinations.ai — no API key required. Use when the built-in image_gen tool is unavailable, OPENAI_API_KEY is not set, or the user asks to generate images without an API key. Supports text-to-image via HTTP requests to https://image.pollinations.ai/. Saves outputs to output/portrait_series/ or user-specified directory."
---

# Free Image Generation Skill (Pollinations.ai)

When the built-in `image_gen` tool is unavailable and no `OPENAI_API_KEY` is set, use this skill to generate AI images via Pollinations.ai — a free, no-API-key-required image generation service.

## When to Use

- User asks to generate images but built-in `image_gen` is not working
- `OPENAI_API_KEY` is not set and user doesn't want to configure it
- Quick image generation for previews, concepts, or prototyping
- Fashion portraits, illustrations, product mockups, any visual concept

## When NOT to Use

- High-fidelity commercial production images (use built-in `image_gen` with API key)
- True transparent background images (Pollinations doesn't support alpha)
- Batch generation of 50+ images (too slow via HTTP)
- When the user explicitly wants the built-in tool

## Quick Start

```python
import urllib.request
import urllib.parse
import os

def generate_image(prompt, filename, size="1024x1024", seed=None):
    """Generate an image using Pollinations.ai and save it locally."""
    # Build URL
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={size.split('x')[0]}&height={size.split('x')[1]}"
    if seed is not None:
        url += f"&seed={seed}"
    
    # Download
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as response:
        data = response.read()
    
    # Save
    filepath = os.path.join("output", filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(data)
    
    return filepath
```

## Prompt Templates

### Fashion Portrait (Reference Style)
```
Professional fashion portrait photography, soft focus, {subject_description}, wearing a {color} {material} turtleneck sweater, pure black background, {lighting_description}, high-end editorial style, shallow depth of field, ultra-realistic, 8k quality
```

### Product Mockup
```
Clean product photography of a {product_description}, white background, soft studio lighting, professional catalog style, sharp focus, 4k quality
```

### Illustration
```
{style} illustration of {subject}, {color_scheme} color palette, {composition} composition, high detail, professional quality
```

## Common Sizes

| Size | Use Case |
|------|----------|
| 1024x1024 | Square (fastest) |
| 1024x1536 | Portrait (3:4) |
| 1536x1024 | Landscape (3:2) |
| 2048x2048 | High-res square |

## Tips for Best Results

1. **Be specific** — Include style, lighting, composition, and quality keywords
2. **Use consistent prompts** — For series generation, keep the style keywords identical
3. **Add seed values** — Use different seeds for variety, same seed for reproducibility
4. **Wait between requests** — Pollinate has rate limits; add 2-3 second delays
5. **Iterate** — If the result isn't quite right, adjust the prompt and regenerate

## Rate Limits

- Pollinations.ai is free but has implicit rate limits
- Space requests 2-3 seconds apart
- Don't batch more than 10 requests in quick succession
- If you get errors, wait a minute and retry

## Output Convention

Save generated images to:
- `output/portrait_series/` — Fashion portrait series
- `output/product/` — Product mockups
- `output/illustrations/` — Illustrations
- Or any user-specified directory

Always report the final saved path for each generated image.
