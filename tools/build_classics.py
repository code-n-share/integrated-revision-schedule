#!/usr/bin/env python3
"""Generate a CLASSICS chapter page from a body fragment + a small metadata file.

    python3 tools/build_classics.py meta.json body.html

body.html holds everything between the brain dump and the revision tracker, i.e. these sections in order
(see CONTENT_RULES.md section 2): mindmap, keyterms, topic-1..topic-N, flashcards, cloze, quiz, practice, summary.
The script adds the page shell (CSS, sidebar, hero, brain dump, revision tracker, nav bar, scripts), checks that
every sidebar anchor exists, and writes classics/year-<year>/ch<n>.html.

meta.json (example):
{
  "year": 2, "n": 6,
  "title": "The Digestive System", "emoji": "🍽️", "pages": "pp. 51–56", "lower": "digestive system",
  "unit": "Unit 2 – Biological World", "sidebar": "Elements of Science · Unit 2 Biological World",   # sidebar sub-title (optional)
  "goals": ["Outline the stages of human nutrition", "..."],
  "topics": ["The five stages of nutrition", "The mouth"]      # -> sidebar links #topic-1, #topic-2 ...
}

The output is plain static HTML and is the source of truth afterwards: edit the generated file directly.
The shell mirrors templates/chapter-template.html (plus the small .flow style); if you change the template's
look, update SHELL here too. Each subject gets its own dedicated tool (build_<subject>.py): copy this file and change
SUBJECT (colours from that subject's index.html; "#fff" for on_accent if the accent is dark) and anything the subject needs
in the shell (e.g. Maths method cards / number lines).
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

SUBJECT = dict(subject='Classics', accent='#00796B', accent_light='#E0F2F1', accent_bright='#4DB6AC', on_accent='#fff',
               book='Year 2 class notes', book_title='Classics · Year 2',
               exam='Junior Cycle Classical Studies Revision')
FOLDER = 'classics'

SHELL = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%(subject)s Revision – %(title)s</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/revision.css">
  <style>
    :root {
      --accent: %(accent)s; --accent-light: %(accent_light)s; --accent-bright: %(accent_bright)s;
      --bg: #F8F9FA; --card: #FFFFFF; --text: #1A1A2E; --muted: #6B7280; --border: #E5E7EB;
      --radius: 14px; --shadow: 0 4px 24px rgba(0,0,0,.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .sidebar { position: fixed; top: 0; left: 0; width: 240px; height: 100vh; background: var(--text); color: #fff; overflow-y: auto; z-index: 100; }
    .sidebar-header { background: var(--accent); color: %(on_accent)s; padding: 20px 18px 16px; font-family: 'Sora', sans-serif; }
    .sidebar-header .site-title { font-size: 13px; font-weight: 600; opacity: .8; text-transform: uppercase; letter-spacing: 1px; }
    .sidebar-header .book-title { font-size: 17px; font-weight: 800; line-height: 1.2; margin-top: 4px; }
    .sidebar a { display: block; padding: 9px 18px; color: rgba(255,255,255,.75); text-decoration: none; font-size: 14px; font-weight: 500; border-left: 3px solid transparent; }
    .sidebar a:hover, .sidebar a.active { color: #fff; background: rgba(255,255,255,.08); border-left-color: var(--accent-bright); }
    .main { margin-left: 240px; }
    .chapter-hero { background: var(--text); color: #fff; padding: 44px 48px; }
    .chapter-badge { display: inline-block; background: var(--accent); color: %(on_accent)s; font: 700 12px 'Sora', sans-serif; padding: 4px 12px; border-radius: 100px; }
    .chapter-hero h1 { font: 800 36px 'Sora', sans-serif; margin: 12px 0 6px; }
    .chapter-hero h1 span { color: var(--accent-bright); }
    .chapter-meta { opacity: .7; font-size: 14px; }
    .goal-tag { display: inline-block; margin: 12px 8px 0 0; padding: 4px 12px; border-radius: 100px; background: rgba(255,255,255,.12); font-size: 13px; }
    .content { max-width: 900px; padding: 32px 48px 80px; }
    .section-heading { font: 700 22px 'Sora', sans-serif; margin: 40px 0 14px; padding-bottom: 8px; border-bottom: 3px solid var(--accent); scroll-margin-top: 24px; }
    .key-term { background: var(--accent-light); border-left: 5px solid var(--accent); border-radius: 0 var(--radius) var(--radius) 0; padding: 14px 18px; margin: 14px 0; }
    .example-box { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); margin: 14px 0; overflow: hidden; }
    .example-header { background: var(--accent-light); font-weight: 700; padding: 8px 16px; }
    .example-body { padding: 14px 16px; }
    .tip { margin-top: 8px; padding: 8px 12px; background: #FFFBE6; border-radius: 8px; font-size: 14px; }
    .mnemonic { margin: 14px 0; padding: 14px 18px; background: #E8F5E9; border-left: 5px solid #2E7D32; border-radius: 0 var(--radius) var(--radius) 0; }
    .exam-trap { margin: 14px 0; padding: 14px 18px; background: #FDECEA; border-left: 5px solid #D32F2F; border-radius: 0 var(--radius) var(--radius) 0; }
    table { width: 100%%; border-collapse: collapse; margin: 14px 0; background: var(--card); }
    th, td { padding: 10px 12px; border: 1px solid var(--border); text-align: left; font-size: 14px; vertical-align: top; }
    th { background: var(--accent-light); }
    ul, ol { margin: 10px 0 10px 22px; } li { font-size: 14px; margin-bottom: 4px; }
    p { font-size: 14px; margin: 8px 0; }
    .flow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 14px 0; }
    .flow .box { background: var(--card); border: 2px solid var(--accent); border-radius: 10px; padding: 6px 12px; font-size: 13px; font-weight: 600; }
    .flow .box.blue { border-color: #1976D2; background: #E3F2FD; }
    .flow .box.red { border-color: #C62828; background: #FDECEA; }
    .fig { margin: 16px 0; }
    .fig figcaption { font-size: 13px; color: var(--muted); margin-top: 6px; }
    .dg { display: block; width: 100%%; height: auto; background: #fff; border: 1px solid var(--border); border-radius: 10px; }
    .dg text { font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px; font-weight: 600; fill: #1A1A2E; }
    .dg .s { font-size: 11px; font-weight: 500; fill: #4B5563; }
    .dg .h { font: 800 14px 'Sora', sans-serif; }
    .dg .w { fill: #fff; }
    .dg .m { text-anchor: middle; }
    .twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
    .twocol > div { border-radius: var(--radius); padding: 12px 16px; border: 1.5px solid var(--border); background: var(--card); }
    .twocol .pos { border-color: #2E7D32; background: #F1F8F2; }
    .twocol .neg { border-color: #C62828; background: #FDF1F0; }
    .twocol h4 { font: 700 14px 'Sora', sans-serif; margin-bottom: 4px; }
    @media (max-width: 800px) { .twocol { grid-template-columns: 1fr; } }
    .flow .arr { font-weight: 700; color: var(--muted); }
    .chapter-nav-bar { position: fixed; bottom: 0; left: 240px; right: 0; background: #fff; border-top: 1px solid var(--border); padding: 10px 48px; font-size: 14px; z-index: 50; }
    .chapter-nav-bar a { color: var(--accent); font-weight: 600; text-decoration: none; }
    @media (max-width: 800px) { .sidebar { display: none; } .main, .chapter-nav-bar { margin-left: 0; left: 0; } .chapter-hero, .content { padding-left: 20px; padding-right: 20px; } .chapter-nav-bar { padding-left: 20px; padding-right: 20px; } }
  </style>
</head>
<body>
  <nav class="sidebar">
    <div class="sidebar-header"><div class="site-title">%(subject)s Revision</div><div class="book-title">%(book_title)s</div></div>
    <a href="index.html">&larr; %(subject)s Home</a>
    <a href="#brain-dump">Brain Dump</a>
    <a href="#mindmap">Mind Map</a>
    <a href="#keyterms">Key Terms</a>
%(side)s
    <a href="#flashcards">Flashcards</a>
    <a href="#cloze">Fill the Gaps</a>
    <a href="#quiz">Quiz</a>
    <a href="#practice">Practice Questions</a>
    <a href="#summary">Exam Summary</a>
    <a href="#tracker">Revision Tracker</a>
  </nav>

  <main class="main">
    <div class="chapter-hero">
      <div class="chapter-badge">Chapter %(n)s · %(unit)s</div>
      <h1>%(emoji)s <span>%(title)s</span></h1>
      <p class="chapter-meta">%(book)s, %(pages)s · %(exam)s</p>
      <div>%(goals)s</div>
    </div>

    <div class="content">
      <div class="section-heading" id="brain-dump">🧠 Brain Dump (before you read)</div>
      <details class="rv-dump">
        <summary>Write down everything you already remember about the %(lower)s, then read on and fill the gaps</summary>
        <textarea placeholder="Type here – saved on this device only"></textarea>
      </details>

%(body)s
    </div>
  </main>

  <div class="chapter-nav-bar"><a href="index.html">&larr; %(subject)s Home</a></div>
  <script src="../../assets/revision.js"></script>
  <script>
    // Highlight active sidebar link while scrolling
    var secs = document.querySelectorAll('.section-heading'), links = document.querySelectorAll('.sidebar a[href^="#"]');
    addEventListener('scroll', function () {
      var cur = ''; secs.forEach(function (s) { if (scrollY >= s.offsetTop - 80) cur = '#' + s.id; });
      links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === cur); });
    });
  </script>
</body>
</html>
'''

TRACKER = '''
      <div class="section-heading" id="tracker">📅 Revision Tracker (spaced repetition)</div>
      <div class="rv-tracker"></div>'''


def build(meta_path, body_path):
    m = json.loads(pathlib.Path(meta_path).read_text())
    body = pathlib.Path(body_path).read_text()
    for i in range(1, len(m['topics']) + 1):
        assert f'id="topic-{i}"' in body, f'missing id="topic-{i}" in body'
    for sid in ['mindmap', 'keyterms', 'flashcards', 'cloze', 'quiz', 'practice', 'summary']:
        assert f'id="{sid}"' in body, f'missing id="{sid}" in body'
    side = '\n'.join(f'    <a href="#topic-{i}">{t}</a>' for i, t in enumerate(m['topics'], 1))
    goals = ''.join(f'<span class="goal-tag">✔ {g}</span>' for g in m['goals'])
    out = SHELL % dict(SUBJECT, book_title=m.get('sidebar', SUBJECT['book_title']), title=m['title'], n=m['n'], emoji=m['emoji'], pages=m['pages'], lower=m['lower'],
                       unit=m['unit'], side=side, goals=goals, body=body.rstrip() + '\n' + TRACKER)
    dest = ROOT / FOLDER / f"year-{m['year']}" / f"ch{m['n']}.html"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out)
    print('wrote', dest.relative_to(ROOT))


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    build(sys.argv[1], sys.argv[2])
