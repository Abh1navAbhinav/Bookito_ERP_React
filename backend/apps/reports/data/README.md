# India location hierarchy

- **`india_location_hierarchy.json`** — States/UTs and districts for `GET /api/reports/config/` (`location_hierarchy`). District `id` values are unique: `{state-slug}__{district-slug}` (e.g. `kerala__kozhikode`).
- **`wikipedia_list_of_districts.wiki`** — Wikipedia wikitext used to regenerate the JSON.

## Regenerate JSON

```bash
python3 backend/apps/reports/scripts/generate_india_location_hierarchy.py \
  backend/apps/reports/data/wikipedia_list_of_districts.wiki \
  backend/apps/reports/data/india_location_hierarchy.json
```

## Refresh wikitext from Wikipedia

```bash
curl -sL 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_districts_in_India&prop=wikitext&format=json' \
  -o /tmp/wiki_india_districts.json
python3 -c "import json; t=json.load(open('/tmp/wiki_india_districts.json'))['parse']['wikitext']['*']; open('backend/apps/reports/data/wikipedia_list_of_districts.wiki','w',encoding='utf-8').write(t)"
```

Then run the regenerate command above. Restart Django after updating the JSON (the loader uses `lru_cache`).
