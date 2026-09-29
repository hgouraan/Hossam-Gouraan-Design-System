# Hossam Gouraan — Design System V2 · archive

Exact snapshot of the live Design System artifact, taken 2026-09-26 15:09 UTC.

- Source artifact version: `1790434264-c132` ("V2: re-architected against the strategy docs…")
- Nothing was changed. Every file under `project/` was downloaded from the live artifact and byte-compared against the working source (identical).
- The photography files are the exact uploads referenced by `project/design-system.json` (sizes match the asset records).

## Contents

| Folder | What |
|---|---|
| `project/` | The design system exactly as stored: `README.md` (brand book), `tokens.json`, `design-system.json` (index), `components/` (26 boards: `preview.html` + `README.md` each, plus `bundle.js` / `bundle.css` template helpers), `fonts/` (Thmanyah Sans ×5, IBM Plex Sans Arabic ×4, Archivo, IBM Plex Sans ×3, IBM Plex Mono ×3), `assets/Photography/` (3 portraits + 3 cut-outs + README) |
| `viewer/` | Offline viewer. Open `viewer/index.html` in a browser. Each board runs live from the local files: fonts, photos, tokens, templates. |
| `boards-png/` | Rendered PNG of every board and the cover (1.5× resolution), for keeping and sharing without a browser. |
| `SHA256SUMS.txt` | Checksums of every file in this archive. |

## Viewer notes

- `viewer/tokens.css` is compiled from `project/tokens.json` (dark "Night" theme, as the boards were designed).
- `viewer/bundle.local.js` is `project/components/bundle.js` with the artifact's `/_blob/<id>` image URLs pointed at the local photo files. It's the only difference from the stored bundle.
- Some browsers block local fonts from `file://` pages. If the Arabic headlines don't show in Thmanyah, serve the folder locally (for example `python3 -m http.server` inside this folder), then open `http://localhost:8000/viewer/`.

## Licensing

`fonts/ThmanyahSans-*` were converted to woff2 from the Thmanyah Sans files you supplied; their use is governed by your Thmanyah licence. IBM Plex and Archivo are SIL Open Font License fonts.
