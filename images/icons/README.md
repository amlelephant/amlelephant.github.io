# Custom icon art

Drop PNGs in this folder using the exact filenames below and they replace the
emoji placeholders automatically. No code change needed — `icon()` in
`js/winxp.js` points at this directory, and each slot falls back to its emoji
whenever the file is missing, so a half-finished set never looks broken.

| Filename         | Status | Where it appears                          |
| ---------------- | ------ | ----------------------------------------- |
| `about.png`      | done   | Desktop icon, Start menu, My Computer     |
| `projects.png`   | done   | Desktop icon, Start menu, My Computer     |
| `resume.png`     | done   | Desktop icon, Start menu, My Computer     |
| `contact.png`    | done   | Desktop icon, Start menu, My Computer     |
| `mycomputer.png` | done   | Desktop icon, Start menu right panel      |
| `email.png`      | done   | Contact window card                       |
| `github.png`     | done   | Contact window card                       |
| `linkedin.png`   | done   | Contact window card                       |
| `drive-c.png`    | done   | My Computer → Drives (Local Disk C:)      |
| `drive-d.png`    | done   | My Computer → Drives (CD Drive D:)        |
| `terminal.png`   | **TODO** | CRT easter-egg desktop icon. Only needed if the block near `winxp.js:118` is uncommented. |

## Transparency — read this before redrawing

The first batch of art was saved fully opaque, so every icon was a white
rectangle on the desktop wallpaper. The backgrounds were removed afterwards
with an edge-connected flood fill, which is why interior whites (the envelope
face, the smiley fill, the GitHub circle) survived.

If you redraw with real transparency in Paint, **close your outlines
completely**. A single diagonal step counts as a hole: a flood fill can slip
through it and erase the fill you meant to keep. That is exactly what happened
to the envelope on the first pass.

`linkedin.png` is deliberately left opaque — its blue field *is* the logo, and
it only ever renders on a light card, never on the desktop.

## What size to draw

**Draw one 48x48 PNG per icon.** That is the largest slot, so the art is never
upscaled — everything else scales it down.

The same file gets rendered at four sizes depending on where it appears:

| Size | Where |
| ---- | ----- |
| 48x48 | Desktop icons (shown 1:1, exactly as you drew it) |
| 32x32 | Contact cards, My Computer pages and drives |
| 24x24 | Start menu entries |
| 16x16 | Window title bars and taskbar buttons |

These are the real Windows XP icon sizes.

### If you want the small sizes sharper

Downscaling 48 → 16 softens fine detail no matter what. Two ways to handle it:

1. **Keep detail coarse.** Avoid single-pixel lines and tiny text; use chunky
   shapes and strong silhouettes that survive being shrunk to a third size.
   One 48x48 file, done.
2. **Draw a second 16x16 version** if a particular icon looks mushy in the
   title bar. That needs a small code change to pick the right file per slot —
   ask and it takes a few minutes.

Start with option 1. It is almost always good enough.

## Other drawing notes

- Save as **PNG with a transparent background**. Windows 11 Paint supports
  this: use Layers, delete the background layer, then Save As → PNG. (The old
  Windows 7 Paint could not do real transparency — if your art comes out with
  a white box behind it, that is why.)
- Square canvas. Non-square art still renders (`object-fit: contain` letterboxes
  it) but will not fill the slot.
- The 48px desktop slot uses `image-rendering: pixelated`, so what you draw is
  what you get — no smoothing. The smaller slots resample smoothly.

The three contact-card slots (`email`, `github`, `linkedin`) have **no emoji
fallback** — they render as empty space until you add the art. That is
deliberate, so the Contact window reads as clean text in the meantime.
