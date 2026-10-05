# CORPUS — visual concept exploration

Three directions, explored before any of them is built. Per the workflow:
**concept → directions → design → render → critique → refine.**

## The problem with the first attempt

The Next.js CORPUS kept Noax's tokens and lost Noax's idea. What shipped was
navy background + rounded cards + progress rings + a sidebar — i.e. the default
AI dashboard. It was polished and it was nobody's.

Naming the failure precisely, because the critique pass should check for these:

- Rounded cards in a grid as the primary organising device
- A ring/bar per item to signal progress
- Accent colour chosen for contrast, not meaning
- Motion added for feedback, derived from nothing
- Hierarchy carried by font size alone
- Every screen the same shape: heading → grid → CTA

So the rule for what follows: **the accent colour, the layout unit and the
motion must all come from one idea about what anatomy actually is.**

---

## Direction A — PLATE

**Concept:** CORPUS is not an app that contains anatomy. It *is* an atlas. The
unit of the interface is the plate, not the card — numbered, ruled, annotated
in the margin, the way Vesalius and Gray organised the body for four centuries.

**Why it fits:** nobody has to be taught what an atlas is. The metaphor carries
hierarchy for free: plate number = order, marginalia = commentary, the ruled
column = the body's own proportions.

**Typography:** engraved transitional serif for display, letterspaced small caps
for structure names, Latin first and English beneath. A condensed grotesque for
labels. Monospace for plate numbers only.

**Colour:** Noax cream `#f9fcf4` as paper, Noax navy `#1d2440` as plate ink,
Noax crimson `#c6313e` as the annotation pen. No gradients, no drop shadows —
depth comes from hairline rules and paper grain.

**Layout:** two-column plate spread. Figure left, marginalia right with leader
lines. `PL. XII` top-left. Ruler ticks down the outer margin. An index of plates
replaces the dashboard grid.

**Motion:** line art drawing itself in via `stroke-dashoffset`; plate numbers
counting up; marginalia arriving on a hairline. All slow — this is print.

**Progress:** a ledger of plates completed, not a ring per lesson.

**Risk:** reads as *vintage* instead of *clinical* if the paper treatment is
pushed too far. Needs one cold, modern element to keep it honest.

---

## Direction B — SPECIMEN

**Concept:** learning anatomy means handling specimens. The interface is a lab
bench — cold, metallic, labelled, slightly unfriendly the way real labs are.

**Why it fits:** it is honest about what the subject is. Nothing is softened.
The unfriendliness is the point; it signals rigour.

**Typography:** stark neo-grotesque headings; a typewriter monospace for every
label, ID and measurement, because that is what specimen tags are typed on.

**Colour:** slate `#2a3138`, oxidised green `#6f7f6a`, bone `#e8e4d8`, formalin
amber `#c8a24a` as the accent. **This abandons the Noax palette** — flagged, not
hidden.

**Layout:** each item is a string-tied tag with typewritten metadata, hung on a
bench rail. Measurement ticks instead of padding. Nothing is rounded.

**Motion:** tags swinging on their string with pendulum easing; labels flipping
to show the reverse; a scalpel-cut wipe for transitions.

**Risk:** cold enough to put students off, and it costs the palette you asked to
keep. The boldest of the three and the least safe.

---

## Direction C — PULSE

**Concept:** the body is a set of rhythms. The accent colour is not a brand
colour — it is arterial blood, and it moves at 60 bpm. Every timed animation in
the product derives from a real physiological rate: the accent pulses at 60/min,
section rhythm breathes at 12/min, line art draws at the speed of an ECG sweep.

**Why it fits:** it gives the blush a *reason to exist*. Right now `#ff9bb4` is
there because Noax had it. Here it is there because it is blood, and blood
moves. That single decision propagates: layout becomes signal strips, mastery
becomes a waveform filling in, a lesson becomes a recording.

**Typography:** the technical grotesque Noax already uses; tabular numerals
everywhere; measurements set very large because in medicine the number is the
content.

**Colour:** Noax navy `#1d2440`, cream `#f9fcf4`, blush `#ff9bb4` as arterial,
crimson `#c6313e` for alerts. **Keeps the palette exactly, changes what it
means.**

**Layout:** horizontal signal strips with time on the x-axis. No card grid —
structures are traces. The dashboard is a monitor, not a board.

**Motion:** 60 bpm pulse on the accent only, never on containers. Stroke-draw
for line art. Reduced-motion collapses everything to static, which is not
optional here — a pulsing interface is a genuine accessibility hazard.

**Risk:** the pulse becomes a gimmick the moment it is applied to more than the
accent. It has to stay disciplined.

---

## Comparison

|  | A · PLATE | B · SPECIMEN | C · PULSE |
|---|---|---|---|
| Keeps Noax palette | Yes | **No** | Yes |
| Keeps Noax type | No (serif) | No (mono-heavy) | Yes |
| Distinctiveness | High | Highest | High |
| Warmth for learners | High | Low | Medium |
| Fits the atlas feature | Perfectly | Well | Well |
| Fits the tutor feature | Weakly | Weakly | **Strongly** — an answer arriving on a trace reads as instrumented |
| Main risk | Vintage | Unwelcoming | Gimmick |

**Recommendation: C, with A's plate numbering borrowed for lesson order.**
C keeps what you asked to keep, supplies the missing idea, and is the only one
of the three whose motion language survives contact with the AI tutor — the
feature that most differentiates CORPUS.

---

## The render + critique step

This workflow renders screens at real iPhone resolution and then critiques them.
**I cannot run that step here.** Headless Chrome cannot be installed in this
sandbox — `storage.googleapis.com` is unreachable, so no browser binary can be
downloaded. I verified this rather than assuming it.

Two ways to keep the step:

1. **You render, I critique.** I build a screen, you screenshot it at iPhone
   width, I run the critique checklist against the actual pixels.
2. **I write the critique pass now** as a checklist and apply it to the code and
   to my own output — weaker than pixels, but not nothing.

The checklist, either way:

- Is there any rounded card in a grid acting as the primary organiser?
- Does every item carry its own ring or bar?
- Can the accent colour be explained in one sentence *without* the word
  "brand"?
- Does any animation derive from something other than a UI convention?
- Is hierarchy carried by anything besides font size?
- Do two different screens have the same shape?
- Would this look out of place next to nine other AI-generated apps?
