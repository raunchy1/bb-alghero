#!/usr/bin/env python3
import json
import os
import shutil
from pathlib import Path

# Citește datele extrase
with open("extracted_data/site_content.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Creează structura organizată
organized = {
    "business": {
        "name": "MTB Sardegna",
        "owner": "Michele Pinna",
        "title": "Guida Ciclo Turistica Sportiva",
        "subtitle": "Maestro di Mountain Bike e Ciclismo Fuoristrada",
        "address": "viale Firenze 27, 08040 Arzana (OG) - Sardinia (Italy)",
        "phone": "+39 388 9708246",
        "whatsapp": "+39 388 9708246",
        "email": "info@mtbsardegna.com",
        "piva": "01475520910",
        "languages": ["it", "en", "es", "de"]
    },
    "content": {
        "it": {
            "home": {
                "hero_title": "MTB SARDEGNA..Vivi la natura in Mountain Bike",
                "hero_subtitle": "Vivi la natura in Mountain Bike",
                "description": data["pages"]["mtbsardegna.com/index.html"]["meta_description"]
            },
            "about": {
                "title": "Chi Sono",
                "content": "\n\n".join(data["pages"]["mtbsardegna.com/index.html"]["paragraphs"][:8])
            }
        }
    },
    "images": data["pages"]["mtbsardegna.com/index.html"]["images"]
}

# Salvează JSON organizat
with open("extracted_data/organized_data.json", "w", encoding="utf-8") as f:
    json.dump(organized, f, indent=2, ensure_ascii=False)

print("Date organizate salvate în: extracted_data/organized_data.json")
print(f"Total imagini: {len(organized['images'])}")
