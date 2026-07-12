# Source assets — not deployed

These files deliberately live outside `static/`. Anything in `static/` is copied verbatim
into the build and shipped, and these two are 582 KB each.

They are not real vector art: both are auto-traces of a raster image — 704 `<path>`
elements and 585 distinct fill colours, with coordinates like `15.13375638`. That is a
photograph converted into coloured blobs, which is why they are so large.

Every place the logo actually appears renders it at **48 px or smaller** (navbar `h-12`,
docs sidebar `h-10`, footer `h-7`, network hub 44×44, favicon 16 px). None of that detail
is ever visible, so the site now ships PNGs generated from these:

| Shipped file                  | Size    | Used for                  |
| ----------------------------- | ------- | ------------------------- |
| `static/favicon.png`          | 3.1 KB  | browser tab (64 px)       |
| `static/apple-touch-icon.png` | 14.6 KB | iOS home screen (180 px)  |
| `static/crux-logo.png`        | 24.5 KB | navbar, footer, docs, hub |
| `static/og-image.png`         | 33.5 KB | link previews (1200×630)  |

Keep these SVGs as the masters. To regenerate the PNGs after a logo change:

```bash
python3 -c "
import cairosvg
cairosvg.svg2png(url='assets-source/crux-logo-nobg.svg', write_to='static/crux-logo.png',       output_height=256)
cairosvg.svg2png(url='assets-source/crux-logo-nobg.svg', write_to='static/favicon.png',         output_height=64)
cairosvg.svg2png(url='assets-source/crux-logo-nobg.svg', write_to='static/apple-touch-icon.png', output_height=180)
"
```

If you ever get a hand-drawn vector of the logo (a few dozen paths, a handful of colours),
use that instead — it would be a few KB and could be shipped directly as an SVG.
