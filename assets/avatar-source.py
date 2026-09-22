"""
Anime-styled vector avatar.

Drawn from the reference: heavy curly hair, bold rectangular glasses,
dark crewneck. Stylised, not a likeness - the whole point is that it
stands in for a face rather than showing one.

Palette matches the portfolio site (cyan / magenta on near-black).
Writes a plain avatar and a named variant.
"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))

INK        = "#0a0d14"
HAIR       = "#151a26"
HAIR_LIT   = "#222b3d"
SKIN       = "#c08457"
SKIN_SHADE = "#a26c46"
SHIRT      = "#333944"
SHIRT_DARK = "#252a33"
CYAN       = "#00e5ff"
MAGENTA    = "#ff2d78"

DEFS = f"""
  <defs>
    <radialGradient id="glow" cx="50%" cy="28%" r="62%">
      <stop offset="0%"   stop-color="{CYAN}"    stop-opacity=".22"/>
      <stop offset="55%"  stop-color="{MAGENTA}" stop-opacity=".10"/>
      <stop offset="100%" stop-color="{INK}"     stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shirtG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="{SHIRT_DARK}"/>
      <stop offset="50%"  stop-color="{SHIRT}"/>
      <stop offset="100%" stop-color="{SHIRT_DARK}"/>
    </linearGradient>
    <linearGradient id="faceG" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0%"   stop-color="{SKIN_SHADE}"/>
      <stop offset="45%"  stop-color="{SKIN}"/>
      <stop offset="100%" stop-color="{SKIN_SHADE}"/>
    </linearGradient>
    <linearGradient id="fadeOut" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="{INK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="{INK}" stop-opacity="1"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="{CYAN}" stroke-opacity=".07" stroke-width="1"/>
    </pattern>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <filter id="softer" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
  </defs>"""


def curls(pts, fill, op="1"):
    return "\n".join(
        f'      <circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" opacity="{op}"/>'
        for x, y, r in pts)


# back mass of hair - a cloud of overlapping circles reads as curl volume
HAIR_BACK = curls([
    (256, 198, 120), (162, 178, 56), (214, 144, 58), (268, 132, 60),
    (322, 150, 56), (358, 190, 52), (150, 236, 48), (366, 238, 48),
    (190, 112, 32), (244, 100, 34), (302, 110, 32), (346, 128, 28),
    (140, 196, 34), (378, 204, 32),
], HAIR)

# fringe sitting over the forehead, a touch lighter for depth
HAIR_FRONT = curls([
    (196, 176, 46), (250, 162, 50), (306, 174, 46),
    (160, 198, 38), (352, 200, 38), (222, 138, 34), (288, 140, 34),
], HAIR_LIT) + "\n" + curls([
    (196, 170, 40), (250, 156, 44), (306, 168, 40),
], HAIR)

CHARACTER = f"""
  <!-- shoulders -->
  <path d="M84 512 C92 438 148 410 200 398 L312 398 C364 410 420 438 428 512 Z"
        fill="url(#shirtG)"/>
  <path d="M200 398 C222 424 290 424 312 398 C300 430 278 442 256 442
           C234 442 212 430 200 398 Z" fill="{SHIRT_DARK}"/>
  <path d="M84 512 C92 438 148 410 200 398" fill="none"
        stroke="{CYAN}" stroke-opacity=".5" stroke-width="3"/>
  <path d="M428 512 C420 438 364 410 312 398" fill="none"
        stroke="{MAGENTA}" stroke-opacity=".45" stroke-width="3"/>

  <!-- neck -->
  <path d="M226 330 L286 330 L286 392 C286 404 226 404 226 392 Z" fill="{SKIN_SHADE}"/>

  <!-- hair, behind the head -->
{HAIR_BACK}

  <!-- ears -->
  <ellipse cx="168" cy="272" rx="15" ry="22" fill="{SKIN_SHADE}"/>
  <ellipse cx="344" cy="272" rx="15" ry="22" fill="{SKIN_SHADE}"/>

  <!-- face -->
  <path d="M170 236 C170 196 200 172 256 172 C312 172 342 196 342 236
           L342 286 C342 334 306 366 256 366 C206 366 170 334 170 286 Z"
        fill="url(#faceG)"/>

  <!-- brows -->
  <path d="M188 232 C202 222 228 220 242 226" fill="none" stroke="{HAIR}"
        stroke-width="9" stroke-linecap="round"/>
  <path d="M270 226 C284 220 310 222 324 232" fill="none" stroke="{HAIR}"
        stroke-width="9" stroke-linecap="round"/>

  <!-- eyes - iris centred so the gaze reads straight at the viewer -->
  <ellipse cx="205" cy="272" rx="17" ry="20" fill="#0f131b"/>
  <ellipse cx="307" cy="272" rx="17" ry="20" fill="#0f131b"/>
  <circle cx="205" cy="272" r="7.5" fill="{CYAN}" opacity=".95"/>
  <circle cx="307" cy="272" r="7.5" fill="{CYAN}" opacity=".95"/>
  <circle cx="205" cy="272" r="3" fill="#06202a"/>
  <circle cx="307" cy="272" r="3" fill="#06202a"/>
  <circle cx="199.5" cy="265" r="3.4" fill="#ffffff" opacity=".7"/>
  <circle cx="301.5" cy="265" r="3.4" fill="#ffffff" opacity=".7"/>

  <!-- nose + mouth -->
  <path d="M254 292 C250 302 250 308 258 310" fill="none" stroke="{SKIN_SHADE}"
        stroke-width="4" stroke-linecap="round"/>
  <path d="M238 332 C248 341 264 341 274 332" fill="none" stroke="#8d5a38"
        stroke-width="5" stroke-linecap="round"/>

  <!-- fringe over the forehead -->
{HAIR_FRONT}

  <!-- glasses -->
  <g>
    <rect x="164" y="242" width="80" height="62" rx="14"
          fill="{CYAN}" fill-opacity=".07" stroke="#0b0e15" stroke-width="9"/>
    <rect x="268" y="242" width="80" height="62" rx="14"
          fill="{CYAN}" fill-opacity=".07" stroke="#0b0e15" stroke-width="9"/>
    <path d="M244 264 L268 264" stroke="#0b0e15" stroke-width="9" stroke-linecap="round"/>
    <path d="M164 262 L150 268" stroke="#0b0e15" stroke-width="9" stroke-linecap="round"/>
    <path d="M348 262 L362 268" stroke="#0b0e15" stroke-width="9" stroke-linecap="round"/>
    <path d="M176 288 L200 252" stroke="#ffffff" stroke-opacity=".30" stroke-width="7"
          stroke-linecap="round"/>
    <path d="M280 288 L304 252" stroke="#ffffff" stroke-opacity=".30" stroke-width="7"
          stroke-linecap="round"/>
  </g>

  <!-- rim light -->
  <path d="M146 258 C126 208 134 158 166 126" fill="none" stroke="{CYAN}"
        stroke-width="6" stroke-linecap="round" opacity=".75" filter="url(#soft)"/>
  <path d="M368 258 C388 208 380 156 348 124" fill="none" stroke="{MAGENTA}"
        stroke-width="6" stroke-linecap="round" opacity=".7" filter="url(#soft)"/>"""


def svg(named):
    H = 512
    name_block = ""
    if named:
        name_block = f"""
  <rect x="0" y="360" width="512" height="48" fill="url(#fadeOut)"/>
  <rect x="0" y="406" width="512" height="106" fill="{INK}"/>
  <rect x="0" y="405" width="512" height="2" fill="{CYAN}" fill-opacity=".85"/>
  <text x="256" y="452" text-anchor="middle"
        font-family="Segoe UI, Arial, Helvetica, sans-serif"
        font-size="34" font-weight="700" letter-spacing="2.5"
        fill="#e9eef7">MD ZAHIDUL HAQUE</text>
  <text x="256" y="484" text-anchor="middle"
        font-family="Consolas, Menlo, monospace"
        font-size="20" letter-spacing="5" fill="{CYAN}">zahiddiff</text>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 {H}" width="512" height="{H}">
{DEFS}
  <rect width="512" height="{H}" fill="{INK}"/>
  <rect width="512" height="{H}" fill="url(#grid)"/>
  <rect width="512" height="{H}" fill="url(#glow)"/>
  <ellipse cx="256" cy="250" rx="210" ry="200" fill="{CYAN}" opacity=".05" filter="url(#softer)"/>
{CHARACTER}{name_block}
</svg>
"""


for named, fn in ((False, 'anime-avatar.svg'), (True, 'anime-avatar-name.svg')):
    p = os.path.join(OUT, fn)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(svg(named))
    print('wrote', fn, os.path.getsize(p), 'bytes')
