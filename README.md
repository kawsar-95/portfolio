# COVERAGE — a QA run in seven acts

**Nuruddin Kawsar · SQA Engineer · Dhaka, Bangladesh**

A cinematic portfolio that doesn't _describe_ QA — it makes the visitor
_perform_ it. The whole site is a software test life cycle: scrolling runs
the engineer from `SPEC` to `SIGNOFF` through seven acts, framed like a
Christopher Nolan film — letterboxed, grain-textured, mission-clocked, and
scored by two custom WebGL scenes: a true 4D tesseract (Interstellar) and a
black hole with a Keplerian accretion disk (Gargantua).

## The acts

| Stage | Act | Experience |
|---|---|---|
| `SPEC` | I | Hero — a real 4D hypercube rotated in the XW/YZ/ZW planes, projected to 3-space |
| `PLAN` | II | Origin story + QA stats (roles, coverage, team) |
| `CASE` | III | Skills as a 7-suite test manifest |
| `RUN` | IV | Career as a run through test environments |
| `REPORT` | V | Case-study registry — four platforms tested end to end |
| `TRIAGE` | VI | A working shell — `help`, `whoami`, `run-tests`, and three Nolan easter eggs |
| `SIGNOFF` | VII | Gargantua finale + `sign-off --approve` contact CTA |

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** design tokens
- **Three.js** via `@react-three/fiber` + `drei` — custom tesseract & black-hole shaders
- **framer-motion** scroll choreography · **lenis** smooth scroll
- Bebas Neue / Space Grotesk / JetBrains Mono

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Details worth noticing

- The left rail is a literal test run — stages light up as you execute the page
- The mission clock (top right) starts at `T+00:00:00` the moment the suite boots
- The terminal's `run-tests` runs a full animated regression run with a pass/fail report
- Everything degrades gracefully: reduced-motion, touch devices, no-WebGL
- Film grain, vignette and letterbox bars never sleep

---

_build v2026.9.13 · sqa-verified · zero regressions tolerated_
