#!/usr/bin/env python3
"""
Build location_hierarchy JSON from Wikipedia 'List of districts in India' wikitext.

Download source (reproducible):
  curl -sL 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_districts_in_India&prop=wikitext&format=json' \\
    -o wiki_raw.json
  python3 -c "import json; d=json.load(open('wiki_raw.json')); open('wikipedia_list_of_districts.wiki','w').write(d['parse']['wikitext']['*'])"

Usage:
  python generate_india_location_hierarchy.py <source.wiki> <out.json>
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


STATE_HEADER_WIKI = re.compile(r"^=== (.+) \(([A-Z]{2})\) ===\s*$", re.MULTILINE)
# [[Left side|Display]] — district name is Display when Left mentions "district" (not "List of...")
WIKI_PIPED_LINK = re.compile(r"\[\[([^\]|#]+)\|([^\]#]+)\]\]")
# Rows like: | 1 || NG || [[North Goa]]|| [[Panaji]]||  (no "... district|" in link)
WIKI_TABLE_DISTRICT_UNPIPED = re.compile(
  r"\|\s*\d+\s*\|\|\s*(?:[A-Z]{1,2}|–|—)\s*\|\|\s*\[\[([^\]|#]+)\]\]",
  re.MULTILINE,
)


def slugify(s: str) -> str:
  s = s.lower().replace("&", "and")
  s = s.replace("'", "").replace("'", "")
  s = re.sub(r"[^a-z0-9]+", "-", s)
  return s.strip("-")


def districts_from_wiki_section(section: str) -> list[str]:
  seen: set[str] = set()
  out: list[str] = []

  def add(name: str) -> None:
    name = name.strip()
    if not name or "{{" in name or "}}" in name or "|" in name:
      return
    nl = name.lower()
    if nl.startswith("file:") or nl.startswith("category:"):
      return
    if name not in seen:
      seen.add(name)
      out.append(name)

  for m in WIKI_PIPED_LINK.finditer(section):
    left, display = m.group(1).strip(), m.group(2).strip()
    if not display or "{{" in display or "}}" in display:
      continue
    ll = left.lower()
    if "list of districts" in ll or ll.startswith("category:") or ll.startswith("file:"):
      continue
    if "district" not in ll:
      continue
    add(display)

  for m in WIKI_TABLE_DISTRICT_UNPIPED.finditer(section):
    add(m.group(1))

  return out


def parse_wiki(text: str) -> dict[str, list[str]]:
  """Split on state headers; each section is wikitext until the next header."""
  matches = list(STATE_HEADER_WIKI.finditer(text))
  by_state: dict[str, list[str]] = {}
  for i, m in enumerate(matches):
    state_name = m.group(1).strip()
    start = m.end()
    end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
    section = text[start:end]
    by_state[state_name] = districts_from_wiki_section(section)
  return by_state


def build_hierarchy(by_state: dict[str, list[str]]) -> list[dict]:
  out: list[dict] = []
  for state_name in sorted(by_state.keys(), key=lambda s: s.lower()):
    state_slug = slugify(state_name)
    children: list[dict] = []
    for d in by_state[state_name]:
      d_slug = slugify(d)
      children.append({"id": f"{state_slug}__{d_slug}", "name": d, "children": []})
    out.append({"id": state_slug, "name": state_name, "children": children})
  return out


def main() -> None:
  if len(sys.argv) != 3:
    print("Usage: generate_india_location_hierarchy.py <source.wiki> <out.json>", file=sys.stderr)
    sys.exit(1)
  src = Path(sys.argv[1])
  dst = Path(sys.argv[2])
  text = src.read_text(encoding="utf-8")
  by_state = parse_wiki(text)
  hierarchy = build_hierarchy(by_state)
  dst.parent.mkdir(parents=True, exist_ok=True)
  dst.write_text(json.dumps(hierarchy, ensure_ascii=False, indent=2), encoding="utf-8")
  total_d = sum(len(v) for v in by_state.values())
  print(f"Wrote {len(hierarchy)} states / UTs, {total_d} district entries -> {dst}")


if __name__ == "__main__":
  main()
