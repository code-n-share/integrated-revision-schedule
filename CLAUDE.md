# Revision Hub

Static revision website for school exams, hosted on GitHub Pages (`main` branch, root). No build step, no dependencies.

## Layout
```
index.html                         subject picker (cards link to <subject>/)
<subject>/index.html              year picker (Year 1 / Year 2)
<subject>/year-1/ index.html       chapter list for that subject/year
<subject>/year-1/ ch<N>.html       one self-contained chapter page
<subject>/year-2/                  empty, awaiting content
assets/revision.css|js             shared interactive components (flashcards, quiz, mind map, cloze, tracker)
templates/chapter-template.html    starting point for every new chapter
CONTENT_RULES.md                   REQUIRED rules for chapter content, sections and formatting
```
Subjects: business, classics, english, french, geography, history, irish, maths, science.

## Rules
- **Whenever you add or upgrade a chapter, read and follow `CONTENT_RULES.md`** and start from `templates/chapter-template.html`.
- Use relative paths only (the site lives under `/<repo-name>/`). From a chapter: `../../index.html` is the site root, `../../assets/…` the shared assets.
- Add the new chapter's card to its `year-N/index.html`. Keep the README chapter list current.
- Don't invent subject content: take it from the user's textbook/notes; flag gaps rather than guess.
- Existing chapters inline their own CSS and are older than the shared kit; don't mass-refactor them unless asked. New or upgraded chapters use `assets/`.
- `progress.json` and `.github/workflows/sync.yml` are an hourly timestamp job; leave them alone.
- Verify by opening the page (Playwright or browser) and clicking through the interactive parts before saying it's done.
- Commit/push only when asked.
