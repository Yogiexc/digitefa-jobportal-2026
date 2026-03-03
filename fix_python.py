import re

with open('digitefa-python/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# The block to find starts from "<<<<<<< HEAD" and ends at ">>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204"
# We want to keep ONLY the HEAD part of the conflict manually, skipping the marker line.
# Actually let's just use regex to replace it entirely.
pattern = re.compile(r"<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204", re.DOTALL)

def replacer(match):
    return match.group(1)

new_content = pattern.sub(replacer, content)

with open('digitefa-python/main.py', 'w', encoding='utf-8', newline='') as f:
    f.write(new_content)

print("Fixed main.py")
