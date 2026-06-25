import time
import os
from huggingface_hub import hf_hub_download

repo_id = 'sentence-transformers/all-MiniLM-L6-v2'
files = [
    'config.json', 
    'pytorch_model.bin', 
    'tokenizer.json', 
    'tokenizer_config.json', 
    'vocab.txt', 
    'special_tokens_map.json', 
    '1_Pooling/config.json', 
    'modules.json'
]

for f in files:
    print(f"Downloading {f}...")
    success = False
    for attempt in range(10):
        try:
            hf_hub_download(repo_id=repo_id, filename=f)
            print(f"Successfully downloaded {f}")
            success = True
            break
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for {f}: {e}")
            time.sleep(2)
    if not success:
        print(f"Failed to download {f} after 10 attempts!")
        exit(1)
