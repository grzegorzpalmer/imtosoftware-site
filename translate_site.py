#!/usr/bin/env python3
"""
IMTO Software — translator strony na DE i EN (DeepL API)
Użycie: python3 translate_site.py
"""
import os, re, time
import requests
from pathlib import Path

SITE_ROOT = Path(__file__).parent   # folder ze skryptem = root serwisu
API_URL   = "https://api-free.deepl.com/v2/translate"

# Klucz DeepL czytany z pliku deepl.key (nie trafia do GitHuba)
_key_file = SITE_ROOT / "deepl.key"
if not _key_file.exists():
    raise FileNotFoundError(
        "Brak pliku deepl.key — wklej swój klucz DeepL do tego pliku.\n"
        f"Oczekiwana lokalizacja: {_key_file}"
    )
API_KEY = _key_file.read_text(encoding="utf-8").strip()

# (katalog, deepl_lang, html_lang, flag_code, etykieta)
LANGS = [
    ("de", "DE",    "de", "de", "DE"),
    ("en", "EN-US", "en", "gb", "EN"),
]

EXCLUDE_DIRS = {".git", ".github", "de", "en", "images",
                ".auto-memory", ".claude", ".remote-plugins"}

# ── HTML przełącznika językowego ────────────────────────────────────────────
# flag_code: 'pl', 'de', 'gb' (UK uses 'gb' in flagcdn)
SWITCHER_TPL = """\
<div class="nav-lang" id="navLang">
                <button class="nav-lang-btn" id="navLangBtn" aria-haspopup="true" aria-expanded="false">
                    <img id="navLangFlag" class="nav-lang-flag" src="https://flagcdn.com/20x15/{flag_code}.png" srcset="https://flagcdn.com/40x30/{flag_code}.png 2x" alt="{code}" width="20" height="15">
                    <span id="navLangCode">{code}</span>
                    <svg class="nav-lang-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
                <div class="nav-lang-menu" id="navLangMenu">
                    <a href="/" data-lang-link="pl" class="nav-lang-opt"><img class="nav-lang-flag" src="https://flagcdn.com/20x15/pl.png" alt="PL" width="20" height="15"> Polski</a>
                    <a href="/de/" data-lang-link="de" class="nav-lang-opt"><img class="nav-lang-flag" src="https://flagcdn.com/20x15/de.png" alt="DE" width="20" height="15"> Deutsch</a>
                    <a href="/en/" data-lang-link="en" class="nav-lang-opt"><img class="nav-lang-flag" src="https://flagcdn.com/20x15/gb.png" alt="EN" width="20" height="15"> English</a>
                </div>
            </div>
            """

# ── DeepL ───────────────────────────────────────────────────────────────────
def translate_html(html: str, target_lang: str) -> str:
    resp = requests.post(
        API_URL,
        headers={
            "Authorization": f"DeepL-Auth-Key {API_KEY}"
        },
        data={
            "text": html,
            "source_lang": "PL",
            "target_lang": target_lang,
            "tag_handling": "html",
            "non_splitting_tags": "span,em,strong,br,a,button,label,div",
            "outline_detection": "0",
        },
        timeout=90
    )
    resp.raise_for_status()
    data = resp.json()
    if "translations" not in data:
        raise ValueError(f"DeepL error: {data}")
    return data["translations"][0]["text"]

# ── Naprawianie ścieżek ─────────────────────────────────────────────────────
def fix_asset_paths(html: str) -> str:
    """Zamienia względne ścieżki do zasobów na bezwzględne."""
    html = re.sub(r'(href|src)="(?:\.\./)*(style\.css)"',    r'\1="/\2"',       html)
    html = re.sub(r'(href|src)="(?:\.\./)*(script\.js)"',    r'\1="/\2"',       html)
    html = re.sub(r'(src|href)="(?:\.\./)*(images/[^"]*)"',  r'\1="/\2"',       html)
    html = re.sub(r'(href)="(?:\.\./)*(sitemap\.xml)"',       r'\1="/\2"',       html)
    html = re.sub(r'(href)="(?:\.\./)*(robots\.txt)"',        r'\1="/\2"',       html)
    return html

# ── Usunięcie istniejącego switcher (jeśli już jest) ────────────────────────
def strip_existing_switcher(html: str) -> str:
    """Usuwa blok nav-lang z HTML (np. dodany wcześniej przez add_switcher_to_pl)."""
    start_tag = '<div class="nav-lang" id="navLang">'
    start = html.find(start_tag)
    if start == -1:
        return html
    pos, depth = start + len(start_tag), 1
    while pos < len(html) and depth > 0:
        no = html.find('<div', pos)
        nc = html.find('</div>', pos)
        if nc == -1:
            break
        if no != -1 and no < nc:
            depth += 1; pos = no + 4
        else:
            depth -= 1
            if depth == 0:
                end = nc + len('</div>')
                # zjedz białe znaki za blokiem
                while end < len(html) and html[end] in ' \t\n\r':
                    end += 1
                return html[:start] + html[end:]
            pos = nc + len('</div>')
    return html

# ── Wstrzyknięcie przełącznika do nava ──────────────────────────────────────
def inject_switcher(html: str, flag_code: str, code: str) -> str:
    html = strip_existing_switcher(html)   # usuń duplikat jeśli istnieje
    switcher = SWITCHER_TPL.format(flag_code=flag_code, code=code)
    # Wstaw przed przyciskiem hamburger
    html = html.replace(
        '<button class="nav-hamburger"',
        switcher + '<button class="nav-hamburger"',
        1
    )
    return html

# ── Meta-tagi ───────────────────────────────────────────────────────────────
def update_meta(html: str, lang_dir: str, html_lang: str, rel_path: str) -> str:
    rel = str(rel_path).replace("\\", "/")
    lang_url = f"https://imtosoftware.pl/{lang_dir}/{rel}"

    # <html lang="">
    html = re.sub(r'<html lang="[^"]*"', f'<html lang="{html_lang}"', html)

    # canonical
    html = re.sub(
        r'<link rel="canonical" href="[^"]*"',
        f'<link rel="canonical" href="{lang_url}"',
        html
    )
    # og:url
    html = re.sub(
        r'(<meta property="og:url" content=")[^"]*(")',
        f'\\g<1>{lang_url}\\g<2>',
        html
    )
    return html

def add_hreflang(html: str, rel_path: str) -> str:
    rel = str(rel_path).replace("\\", "/")
    pl  = f"https://imtosoftware.pl/{rel}"
    de  = f"https://imtosoftware.pl/de/{rel}"
    en  = f"https://imtosoftware.pl/en/{rel}"
    tags = (
        f'\n    <link rel="alternate" hreflang="pl" href="{pl}">'
        f'\n    <link rel="alternate" hreflang="de" href="{de}">'
        f'\n    <link rel="alternate" hreflang="en" href="{en}">'
        f'\n    <link rel="alternate" hreflang="x-default" href="{pl}">'
    )
    return html.replace("</head>", tags + "\n</head>", 1)

# ── Główna funkcja ──────────────────────────────────────────────────────────
def get_html_files():
    files = []
    for root, dirs, filenames in os.walk(SITE_ROOT):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDE_DIRS)
        for fn in sorted(filenames):
            if fn.endswith(".html"):
                rel = Path(root).relative_to(SITE_ROOT) / fn
                files.append(rel)
    return files

def process_file(rel_path, lang_dir, deepl_lang, html_lang, flag, code):
    src = SITE_ROOT / rel_path
    dst = SITE_ROOT / lang_dir / rel_path

    html = src.read_text(encoding="utf-8")

    # Tłumacz
    translated = translate_html(html, deepl_lang)

    # Post-processing
    translated = fix_asset_paths(translated)
    translated = update_meta(translated, lang_dir, html_lang, rel_path)
    translated = add_hreflang(translated, rel_path)
    translated = inject_switcher(translated, flag, code)

    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(translated, encoding="utf-8")

def add_switcher_to_pl(rel_path):
    """Dodaje przełącznik do polskiej wersji (bez tłumaczenia)."""
    path = SITE_ROOT / rel_path
    html = path.read_text(encoding="utf-8")
    if "nav-lang" in html:
        return  # już dodany
    html = inject_switcher(html, "pl", "PL")
    html = add_hreflang(html, rel_path)
    path.write_text(html, encoding="utf-8")

# ── Uruchomienie ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    files = get_html_files()
    total = len(files)
    print(f"Znaleziono {total} plików HTML\n")

    errors = []

    for i, rel_path in enumerate(files, 1):
        # 1. Dodaj przełącznik do PL
        try:
            add_switcher_to_pl(rel_path)
        except Exception as e:
            print(f"  [PL] ✗ {rel_path}: {e}")

        # 2. Tłumacz na DE i EN
        for (lang_dir, deepl_lang, html_lang, flag, code) in LANGS:
            dst = SITE_ROOT / lang_dir / rel_path
            if dst.exists():
                print(f"[{i}/{total}] {lang_dir.upper()}: {rel_path} — pomijam (istnieje)")
                continue
            try:
                print(f"[{i}/{total}] {lang_dir.upper()}: {rel_path}...", end=" ", flush=True)
                process_file(rel_path, lang_dir, deepl_lang, html_lang, flag, code)
                print("✓")
                time.sleep(0.4)   # grzeczność wobec API
            except Exception as e:
                print(f"✗  {e}")
                errors.append((lang_dir, rel_path, str(e)))

    print(f"\n✅