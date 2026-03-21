from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

_LOCATION_JSON = Path(__file__).resolve().parent / "data" / "india_location_hierarchy.json"


@lru_cache(maxsize=1)
def load_location_hierarchy() -> list[dict]:
  """
  Full India state → district tree for the config API (Properties / Travel Agents folders).
  Generated from Wikipedia via scripts/generate_india_location_hierarchy.py.
  """
  if not _LOCATION_JSON.is_file():
    return []
  with _LOCATION_JSON.open(encoding="utf-8") as f:
    data = json.load(f)
  return data if isinstance(data, list) else []
