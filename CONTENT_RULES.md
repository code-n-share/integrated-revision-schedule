# Content Rules for New Chapters

Apply these every time a chapter is added (or an existing one is upgraded). Start from
`templates/chapter-template.html`; interactive widgets come from `assets/revision.css` + `assets/revision.js`.

## 1. Where it goes
- File: `<subject>/year-<N>/ch<number>.html` (notes pages: descriptive name, e.g. `notes.html`).
- Add a card for it to `<subject>/year-<N>/index.html` (number, title, unit, 1-line description, tag), in chapter order.
- Chapter pages link back with `index.html` (same folder) and to the site root with `../../index.html`.
- Shared assets: `../../assets/revision.css` and `../../assets/revision.js`. Never use absolute `/…` paths (GitHub Pages serves from a sub-path).

## 2. Required sections, in this order
Sidebar link + `id` for each; every section heading uses `.section-heading` with an emoji icon.

| # | Section | Purpose | Component |
|---|---------|---------|-----------|
| 1 | **Hero** – chapter badge, title, 3–6 learning-outcome tags (`✔ …`) | Know the goal | existing hero |
| 2 | **Brain dump** | Active recall *before* reading | `details.rv-dump` |
| 3 | **Mind map** | Big picture: 1 root, 3–6 branches, ≤3 levels, ≤4 words/node | `.rv-mindmap` |
| 4 | **Key terms at a glance** | Every bold term in the chapter, plain-English definition | table or glossary grid |
| 5 | **Topic sections** (1 per syllabus idea) | The actual notes (see §3) | `.key-term`, `.example-box`, cards, tables |
| 6 | **Flashcards** | 1 card per key term/fact/formula (aim 10–25) | `.rv-flash` |
| 7 | **Fill the gaps** | Recall exact wording of definitions (5–10 sentences) | `.rv-cloze` |
| 8 | **Quick quiz** | 6–12 MCQs with explanations | `.rv-quiz` |
| 9 | **Practice questions** | Exam-style questions with click-to-reveal model answers (4–6) | `details.rv-qa` |
| 10 | **Exam quick-reference summary** | One table: Topic · Rule/Definition · Exam tip | `table` |
| 11 | **Revision tracker** | Spaced repetition: Day 0,1,3,7,14,30 | `.rv-tracker` |

Subjects with no calculations (history, english, french, irish, classics) replace "Practice problems" with
short-answer / source-based / essay-plan questions. Maths and science keep numeric worked problems with units (maths: also follow §6).

## 3. Writing the notes
- **Source of truth:** content must come from the student's textbook/notes/syllabus for that chapter. Never invent facts, dates, quotes or formulae; if unsure, leave a `TODO:` comment and tell the user.
- **Two layers for every idea:** an exam-ready definition (`.key-term`, bold the term) followed by a 💡 simpler line (`.tip`) with an everyday analogy.
- Short sentences, bullets over paragraphs, one idea per block. Use the exact words the exam marks ("dissipated", "triangulation pillar").
- **Memory aids** where they genuinely help: `.mnemonic` (acronyms, stories), tables for comparisons, numbered steps for processes, timelines for history.
- **`.exam-trap`** (⚠️ Common mistake) for each frequently-lost mark.
- Worked **examples** (`.example-box`) for any skill: show steps, units, and the final answer highlighted.
- Formulae: monospace (`JetBrains Mono`) in a formula box, with unit and rearrangements.
- Diagrams: inline SVG/canvas or CSS; no external image hosting. Label everything.
- Every section answers "what could they ask, and how many marks?" — note mark-worthy points.

## 4. Interactive components (markup)
Details and live examples are in `templates/chapter-template.html`.

```html
<!-- Flashcards: each card is a term/question and its answer -->
<div class="rv-flash"><div class="rv-card"><div class="q">Define energy</div><div class="a">The ability to do work (J)</div></div></div>

<!-- Quiz: data-answer is the letter of the correct <li> (a,b,c…). Options are shuffled; add data-noshuffle if
     options refer to each other ("all of the above"). Always give an .explain. -->
<div class="rv-quiz"><div class="rv-q" data-answer="b"><p>Question?</p><ol><li>…</li><li>Right</li></ol><div class="explain">Why</div></div></div>

<!-- Mind map: nested lists; click a node to collapse -->
<div class="rv-mindmap"><ul><li>Root<ul><li>Branch<ul><li>Leaf</li></ul></li></ul></li></ul></div>

<!-- Fill the gaps: {{answer}} or {{answer|alternative}} -->
<div class="rv-cloze"><p>Work = force × {{distance}}.</p></div>

<!-- Practice question: click to reveal the model answer -->
<details class="rv-qa"><summary>Question?</summary><div class="rv-model">Model answer</div></details>

<!-- Brain dump + spaced-revision tracker -->
<details class="rv-dump"><summary>…</summary><textarea></textarea></details>
<div class="rv-tracker"></div>
```
Quality bar for the question sets:
- Quiz distractors must be plausible (typical misconceptions), 4 options, one clearly correct.
- Flashcards: one fact per card, question side ≤ 15 words, no card that just repeats its answer.
- Cover **every** key term and every formula in at least one flashcard *and* one question.
- Mix recall (define), understanding (explain why) and application (calculate / apply to scenario).

## 5. Design & code conventions
- Static HTML only, no build step, no frameworks. Fonts: Sora (headings), DM Sans (body), JetBrains Mono (formulae).
- Each subject keeps its accent colour (take it from that subject's `index.html`); set `--accent` / `--accent-light` in the chapter's `:root`.  If the accent is dark or saturated (e.g. history red), switch text on the accent (sidebar header, badge) to white for contrast.
- Layout: fixed 240px dark sidebar, hero, `.content` max 900px, bottom chapter-nav bar. Must stay readable on mobile (sidebar hidden under 800px).
- Interactive state lives in `localStorage` under `rv:<page path>:…`; never require a server or login.
- Accessible: real `<button>`s for actions, sufficient contrast, don't rely on colour alone (✓/✗ icons accompany right/wrong).

## 6. Maths chapters (extra rules – reference: `maths/year-2/ch1.html`)
Maths keeps sections 1–11 above, but the notes and question sets follow these rules.

**Plan first**
- Before writing, list the chapter's sub-concepts (one per textbook section, plus special cases such as "negative squared" or "missing power").
- Give **each question exactly one distinct sub-concept**, across the quiz *and* the practice questions together. No two questions may test the same idea in the same way (two-step equation, x on both sides and brackets are three different ideas; two more two-step equations are not).
- Keep the plan as an HTML comment at the top of the chapter: sub-concept → quiz # / practice # (+ textbook exercise ref). Every textbook section must appear at least once.

**Worked steps must be quick to grab and remember**
- Every skill gets a **method card** (`.method`): 3–5 numbered steps, each a short imperative ("Subtract the smaller x-term").
- Every worked example uses `.work`: one operation per line, a 2–5 word reason on the right (`.why`, e.g. "add 5 both sides"), the final answer highlighted (`.ln.ans`). Aim for ≤ 5 lines; don't skip a step that loses marks.
- Add a `.mnemonic` or one-line rule where one exists, and a `.exam-trap` for the commonest lost mark (sign errors, forgetting units, flipping an inequality).
- Grids / arrays: `table.mgrid`. Number lines: `<div class="rv-numline" …>` (attributes documented in `assets/revision.js`). Formulae in `.formula`.

**Content and answers**
- Questions come from the textbook exercises (cite "Ex 1.4 Q24"). Work every answer out yourself *and* compare with the book's answer key; if they differ, flag it, don't guess.
- Use real symbols: − × ÷ ≤ ≥ ∈ ℕ ℤ ℝ, `<sup>`/² ³ for powers. No images of equations.
- Final answers carry units (cm², €, years) and answer the question asked (find *Ann's* age, not just x).
- Numbers in quiz distractors should be the result of a real mistake (wrong sign, forgot to divide, didn't flip), and the explanation says which.
- Counts for maths: 10–14 quiz questions, 10–15 practice questions, 20–25 flashcards.
- Don't put `rv-numline` inside flashcards or quiz options (those are re-rendered by JS); use it in notes and practice answers.

## 7. Done checklist
- [ ] Sections 1–11 present, sidebar links work, ids match
- [ ] All facts traced to the source material
- [ ] Mind map, flashcards, cloze, quiz all render and respond (open the page and click through)
- [ ] Every key term appears in glossary, a flashcard and a question
- [ ] Chapter card added to the year's `index.html`; back-links resolve
- [ ] README "Chapters" list updated if it lists the chapter
- [ ] Maths only: question plan comment present; each question has a distinct sub-concept; every model answer matches the textbook key
