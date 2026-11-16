# HUD Studio V0.3.1 — Smart HUD Authoring

- Roster filters: MK1, MK2, MK3, Ultimate MK3, Trilogy, Advance. Game-specific playable, unlockable and boss names; variant names may differ by platform.
- Nameplate text is an independently editable SVG sprite, persisted in JSON and rendered to PNG.
- V center timer supports 60/120/180-second countdown, pause and reset. PNG captures current countdown frame; JSON saves remaining seconds.
- MaterialFill uses source image tile repeated at native texture resolution, clipped inside polygon and placed beneath the selected frame. Polygon boundaries are approximate and may require manual fine tuning.
- Mirror Quantize uses central axis X=960 by default, adjustable grid, mirrored duplication and optional linked counterpart movement.
- FX tint, brightness, contrast, saturation controls per sprite. Tint uses CSS color blend in preview and source-in color overlay during PNG rendering; slight differences can occur.
- All changes are in the dev branch package; no GitHub push.

Roster references: https://www.mksecrets.net/index.php?contentID=4005&lang=eng&section=mkt and https://www.mksecrets.net/index.php?contentID=5503&lang=eng&section=mkadv.
