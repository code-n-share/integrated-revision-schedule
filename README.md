# Revision Hub

A clean, fast-loading static revision website for exam preparation across all subjects.

## Project Structure

```
/
├── index.html                  ← Root page with subject selector
├── science/
│   ├── index.html              ← Science chapter index
│   ├── ch3.html                ← Chapter 3: Cells
│   ├── ch10.html               ← Chapter 10: Human Health
│   ├── ch14.html               ← Chapter 14: States of Matter
│   ├── ch29.html               ← Chapter 29: Energy
│   ├── ch35.html               ← Chapter 35: The Origin of the Universe
│   └── ch39.html               ← Chapter 39: Energy Sources and Future Needs
├── history/                    ← (coming soon)
├── english/                    ← (coming soon)
├── classics/                   ← (coming soon)
├── irish/                      ← (coming soon)
├── french/                     ← (coming soon)
├── maths/                      ← (coming soon)
├── geography/                  ← (coming soon)
├── README.md                   ← This file
└── progress.json               ← Study progress tracking

```

## Navigate

1. **Root** (`/index.html`) - Choose a subject
2. **Subject** (e.g. `/science/index.html`) - See all chapters in that subject
3. **Chapter** (e.g. `/ science/ch29.html`) - Read the revision content

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

- [x] Chapter 3 – Cells (Biological World)
- [x] Chapter 10 – Human Health (Biological World)
- [x] Chapter 14 – States of Matter (Chemical World)
- [x] Chapter 29 – Energy (Physical World)
- [x] Chapter 35 – The Origin of the Universe (Earth & Space)
- [x] Chapter 39 – Energy Sources and Future Needs (Earth & Space)
