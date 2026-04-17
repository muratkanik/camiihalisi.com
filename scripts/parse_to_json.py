import sys
try:
    from PyPDF2 import PdfReader
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    from PyPDF2 import PdfReader
import os
import json

base_dir = "/Users/mkanik/Documents/GitHub/camiihalisi.com/master-content"
dirs = ["TR 1-20 Blog", "TR 21-40 Blog", "TR 41-60 Blog", ""]

results = []

for d in dirs:
    path = os.path.join(base_dir, d)
    if not os.path.exists(path): continue
    for file in os.listdir(path):
        if file.lower().endswith(".pdf"):
            full_path = os.path.join(path, file)
            print(f"Parsing {file}...")
            try:
                reader = PdfReader(full_path)
                text = "\n\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
                results.append({
                    "title": file,
                    "text": text,
                    "category": d if d else "master"
                })
            except Exception as e:
                print(f"Error reading {file}: {e}")

out_path = "/Users/mkanik/Documents/GitHub/camiihalisi.com/scripts/parsed_pdfs.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"Saved {len(results)} parsed PDFs into parsed_pdfs.json")
