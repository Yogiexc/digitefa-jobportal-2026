import sys

with open(r'd:\laragon\www\digitefa-jobportal-2026\digitefa-python\main.py', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if '\t' in line:
            print(f"Tab at line {i}")
        if 520 <= i <= 540 or 620 <= i <= 630:
            print(f"Line {i}: {len(line) - len(line.lstrip())} spaces: {repr(line)}")
