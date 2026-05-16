# Science Revision – Elements of Science (Unit 4)

A clean, fast-loading static revision website for exam preparation.

## 📂 File Structure

```
index.html      ← Chapter 29: Energy  (complete)
ch30.html       ← Chapter 30: Current Electricity  (placeholder – replace with full version)
README.md       ← This file
```

## 🚀 Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `science-revision`)
2. Upload all HTML files to the repo root
3. Go to **Settings → Pages → Source → main branch / root**
4. Your site will be live at `https://yourusername.github.io/science-revision/`

## ➕ Adding New Chapters

To add a new chapter (e.g. Chapter 31):

1. Copy `ch30.html` and rename it `ch31.html`
2. Fill in the content following the same structure used in `index.html`
3. Add a link to the sidebar in **every** existing HTML file:
   ```html
   <a href="ch31.html" class="chapter-link">Ch 31 · Chapter Name</a>
   ```
4. Add it to the chapter nav bar at the bottom of each file too.

## 🎨 Design System

- Fonts: **Sora** (headings) + **DM Sans** (body) + **JetBrains Mono** (code/formulas)
- Colors: Yellow `#F5C800`, Dark `#1A1A2E`, Green `#4CAF50`, Orange `#E65100`
- No external dependencies beyond Google Fonts — works offline once cached.

## ✅ Chapters Completed

- [x] Chapter 29 – Energy
- [ ] Chapter 30 – Current Electricity
