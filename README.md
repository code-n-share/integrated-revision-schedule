# Revision Hub

A clean, fast-loading static revision website for exam preparation across all subjects.

## Project Structure

```
/
├── index.html                  ← Root page with subject selector
├── CLAUDE.md                   ← Project guide for Claude Code
├── CONTENT_RULES.md            ← Rules every new chapter must follow (sections, formatting, quality)
├── assets/
│   ├── revision.css            ← Shared styles: flashcards, quiz, mind map, cloze, tracker
│   └── revision.js             ← Shared interactive behaviour (progress saved in localStorage)
├── templates/
│   └── chapter-template.html   ← Copy this to start a new chapter
├── <subject>/                  ← business, classics, english, french, geography,
│   │                             history, irish, maths, science
│   ├── index.html          ← Year picker (Year 1 / Year 2)
│   ├── year-1/
│   │   ├── index.html          ← Chapter list for that subject (Year 1)
│   │   └── ch<N>.html          ← Chapter pages (existing content lives here)
│   └── year-2/                 ← Empty, ready for Year 2 content
├── README.md                   ← This file
└── progress.json               ← Study progress tracking
```

## Navigate

1. **Root** (`/index.html`) - Choose a subject
2. **Subject** (e.g. `/science/`) - Choose Year 1 or Year 2
3. **Year** (e.g. `/science/year-1/`) - See all chapters for that year
4. **Chapter** (e.g. `/science/year-1/ch29.html`) - Read the revision content

## Adding a New Chapter

1. Copy `templates/chapter-template.html` to `<subject>/year-<N>/ch<number>.html`
2. Fill it in following `CONTENT_RULES.md`
3. Add its card to `<subject>/year-<N>/index.html`

Every chapter has: brain dump, mind map, key terms, notes, flashcards, fill-the-gaps, quiz,
practice questions, exam summary and a spaced-revision tracker.

## Design System

- Fonts: **Sora** (headings) + **DM Sans** (body) + **JetBrains Mono** (code/formulas)
- Colors vary per subject (e.g. Science = Green, Maths = Purple, History = Yellow)
- No external dependencies beyond Google Fonts -- works offline once cached.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `revision-hub`)
2. Upload all files to the repo (folders + HTML)
3. Go to **Settings -> Pages -> Source -> main branch / root**
4. Your site will be live at `https://yourusername.github.io/revision-hub/`

## Chapters Completed

- [x] Science Year 1 – Chapter 3 – Cells (Biological World)
- [x] Science Year 1 – Chapter 10 – Human Health (Biological World)
- [x] Science Year 1 – Chapter 14 – States of Matter (Chemical World)
- [x] Science Year 1 – Chapter 29 – Energy (Physical World)
- [x] Science Year 1 – Chapter 35 – The Origin of the Universe (Earth & Space)
- [x] Science Year 1 – Chapter 39 – Energy Sources and Future Needs (Earth & Space)
- [x] Business Year 2 – Chapter 9 – Insurance
- [x] Business Year 2 – Chapter 12 – Protecting the Consumer
- [x] Business Year 2 – Chapter 15 – The Skills, Characteristics and Role of the Entrepreneur
- [x] Business Year 2 – Chapter 16 – Types of Enterprise
- [x] Business Year 2 – Chapter 21 – Market Research
- [x] Business Year 2 – Chapter 22 – The Marketing Mix
