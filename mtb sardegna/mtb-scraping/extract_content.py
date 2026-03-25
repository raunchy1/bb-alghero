#!/usr/bin/env python3
"""Extract content from MTB Sardegna website HTML files"""

import json
import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

BASE_DIR = Path(__file__).parent
OUTPUT_FILE = BASE_DIR / "extracted_data/site_content.json"

def extract_text_from_html(html_path):
    """Extract all text content from HTML file"""
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style", "nav", "footer"]):
        script.decompose()
    
    content = {
        "title": soup.title.string if soup.title else "",
        "meta_description": "",
        "headings": {},
        "paragraphs": [],
        "images": [],
        "links": []
    }
    
    # Meta description
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        content["meta_description"] = meta_desc.get("content", "")
    
    # Headings
    for level in range(1, 7):
        headings = soup.find_all(f"h{level}")
        if headings:
            content["headings"][f"h{level}"] = [h.get_text(strip=True) for h in headings]
    
    # Paragraphs
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if text and len(text) > 10:  # Filter short texts
            content["paragraphs"].append(text)
    
    # Images
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src and "jimcdn" in src:
            content["images"].append({
                "src": src,
                "alt": img.get("alt", ""),
                "title": img.get("title", "")
            })
    
    # Links
    for a in soup.find_all("a", href=True):
        href = a["href"]
        text = a.get_text(strip=True)
        if text and "mtbsardegna" in href:
            content["links"].append({"text": text, "href": href})
    
    # All text
    content["full_text"] = soup.get_text(separator="\n", strip=True)
    
    return content

def main():
    data = {
        "site": "mtbsardegna.com",
        "pages": {},
        "images_found": []
    }
    
    html_files = list(BASE_DIR.glob("httrack-mirror/**/*.html"))
    
    for html_file in html_files:
        try:
            relative_path = str(html_file.relative_to(BASE_DIR / "httrack-mirror"))
            print(f"Processing: {relative_path}")
            
            content = extract_text_from_html(html_file)
            data["pages"][relative_path] = content
            
            # Collect all images
            for img in content["images"]:
                if img["src"] not in data["images_found"]:
                    data["images_found"].append(img["src"])
                    
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    # Save JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nExtracted {len(data['pages'])} pages")
    print(f"Found {len(data['images_found'])} images")
    print(f"Saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
