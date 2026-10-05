# CORPUS — the Noax site, converted

This is the Noax mirror one level up, **kept intact**, with only `index.html`
rewritten so the site presents CORPUS instead of Trevor Noah. The design is
untouched by construction: `main.css`, the WebGL bundles, the `.glb` models,
the `.ktx2` textures, the fonts and every image are copied from the mirror by
`build.sh`, so they are byte-identical to the original.

## Rebuild

```bash
./build.sh                  # copies assets from ../
PORT=3000 python3 server.py # http://localhost:3000
```

Only `index.html`, `build.sh` and this file are tracked in Git; the copied
assets are ignored so the repository does not store 27 MB twice.

## What changed in index.html

| Noax | CORPUS |
|---|---|
| Hero wordmark, 10 letter-paths (`TREVORNOAH`) | 6 letter groups (`CORPUS`), same `viewBox="0 0 1801 272"` and the same `.logo-part` rise animation |
| Header / menu wordmark SVG | `CORPUS`, forced to the original 206-unit width with `textLength` |
| Nav: Shows · Watch & Listen · Books · Store | Lessons · Atlas · AI Tutor · Dashboard |
| `Get Tickets` | `Start Learning` |
| Hero statement: "Finding the extraordinary in the ordinary…" | "Learning the human body structure by structure, with citations" |
| `Media / on the screen / View All Media` | `Systems / in the atlas / View All Systems` |
| `This Guy` + comedian bio | `The Method` + CORPUS description |
| News: World Cup, Netflix special, Grammys, book release | Atlas viewer beta, AI Tutor with citations, Mastery dashboard, Chambers of the Heart |
| Quote: "In life only three things are certain: death, Adobe updates and taxes" | "In anatomy only one thing is certain: relations, and every exam asks about them" |
| Quote source: The Daily Show | The CORPUS Atlas |
| Social links to trevornoah profiles | `#` placeholders |
| `©Trevornoah2026` | `©CORPUS2026` |

51 replacements, verified one by one. Tag balance matches the original exactly
except `<g>` 10 → 6, which is the wordmark change.

## Deliberately not changed

- **The 3D scene.** The models are referenced once each inside the minified
  WebGL bundle, so re-mapping the hero model would mean editing that bundle.
  Worth noting: the scene already ships `TREVOR_heart-opt-01.glb` and
  `TREVOR_brain-opt-01.glb`, which are the right subjects for an anatomy
  product — swapping the hero to the heart is a contained change if you want it.
- **Asset filenames.** `ob-trevornoah.*.css`, `trevor-favicon.webp` and friends
  are real paths; renaming them would break the site. The visible text
  `Trevor` count is 0, the filename count is untouched.
- **`main.css`, `app.js`, the WebGL chunks.** Zero edits.
