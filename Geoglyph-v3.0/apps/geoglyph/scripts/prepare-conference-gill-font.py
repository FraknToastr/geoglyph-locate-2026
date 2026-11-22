"""Normalize invalid cmap language IDs in the private conference Gill Sans copy.

Usage: /usr/bin/python3 scripts/prepare-conference-gill-font.py SOURCE DESTINATION
Non-Macintosh cmap language IDs must be zero. The Windows font has language=1,
which Chromium rejects. FontTools updates checksums without changing outlines.
"""
import sys
from fontTools.ttLib import TTFont

font = TTFont(sys.argv[1], recalcTimestamp=False)
outlines = font.getTableData('glyf')
mappings = [(table.platformID, table.platEncID, dict(table.cmap)) for table in font['cmap'].tables]
changed = 0
for table in font['cmap'].tables:
    if table.platformID != 1 and table.language != 0:
        table.language = 0
        changed += 1
assert changed, 'Expected the known malformed cmap language metadata'
font.save(sys.argv[2])
prepared = TTFont(sys.argv[2])
assert prepared.getTableData('glyf') == outlines
assert [(table.platformID, table.platEncID, dict(table.cmap)) for table in prepared['cmap'].tables] == mappings
print(f'Normalized {changed} cmap language IDs; glyph outline bytes unchanged.')
