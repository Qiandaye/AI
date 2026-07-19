#!/usr/bin/env python3
import argparse, json, os, sys, time, urllib.request, urllib.parse

def generate_single(prompt, output_path, size='1024x1024', seed=None):
    width, height = size.split('x')
    encoded_prompt = urllib.parse.quote(prompt)
    url = 'https://image.pollinations.ai/prompt/' + encoded_prompt + '?width=' + width + '&height=' + height + '&nologo=true'
    if seed is not None:
        url += '&seed=' + str(seed)
    print('Generating: ' + output_path)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            data = response.read()
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(data)
        print('  Saved: ' + output_path + ' (' + str(len(data)//1024) + ' KB)')
        return True
    except Exception as e:
        print('  ERROR: ' + str(e))
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate images via Pollinations.ai')
    parser.add_argument('prompt', help='Image generation prompt')
    parser.add_argument('--output', '-o', default='output/imagegen/result.png', help='Output file path')
    parser.add_argument('--size', '-s', default='1024x1024', help='WidthxHeight')
    parser.add_argument('--seed', type=int, default=None, help='Random seed')
    args = parser.parse_args()
    success = generate_single(args.prompt, args.output, args.size, args.seed)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
