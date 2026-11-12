/* Revision Hub – shared interactive components (no dependencies).
   Authoring markup is documented in CONTENT_RULES.md. Progress is stored in localStorage. */
(function () {
  var chapterId = location.pathname.replace(/^\/|\.html$/g, '').replace(/\//g, ':');
  var store = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var norm = function (s) { return s.trim().toLowerCase().replace(/\s+/g, ' '); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var el = function (html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; };

  /* ── Flashcards ── <div class="rv-flash"><div class="rv-card"><div class="q">…</div><div class="a">…</div></div>…</div> */
  function flashcards(root, n) {
    var cards = $$(':scope > .rv-card', root).map(function (c) { return { q: c.querySelector('.q').innerHTML, a: c.querySelector('.a').innerHTML }; });
    var key = 'rv:' + chapterId + ':fc' + n;
    var known = store.get(key, []);
    var order = [], pos = 0, onlyLearning = false;
    function rebuild() { order = cards.map(function (_, i) { return i; }).filter(function (i) { return !onlyLearning || known.indexOf(i) < 0; }); pos = 0; }
    function render() {
      var pct = Math.round(known.length / cards.length * 100);
      var head = '<div class="rv-bar"><i style="width:' + pct + '%"></i></div><div class="rv-meta">' + known.length + ' / ' + cards.length + ' known</div>';
      var body;
      if (!order.length) body = '<div class="rv-empty">🎉 All cards known! Reset to go again.</div>';
      else {
        var c = cards[order[pos]];
        body = '<div class="rv-flip"><div class="rv-flip-inner"><div class="rv-face rv-front">' + c.q + '</div><div class="rv-face rv-back">' + c.a + '</div></div></div>' +
          '<div class="rv-meta">Card ' + (pos + 1) + ' of ' + order.length + ' · click or press Space to flip · ← → to move</div>' +
          '<div class="rv-row"><button class="rv-btn bad" data-a="learning">✗ Still learning</button><button class="rv-btn ok" data-a="know">✓ I know it</button></div>';
      }
      root.innerHTML = head + body +
        '<div class="rv-row"><button class="rv-btn" data-a="prev">← Prev</button><button class="rv-btn" data-a="next">Next →</button>' +
        '<button class="rv-btn" data-a="shuffle">🔀 Shuffle</button><button class="rv-btn" data-a="filter">' + (onlyLearning ? 'Show all' : 'Only unknown') + '</button>' +
        '<button class="rv-btn" data-a="reset">Reset</button></div>';
    }
    function move(d) { if (order.length) { pos = (pos + d + order.length) % order.length; render(); } }
    function mark(isKnown) {
      var i = order[pos], at = known.indexOf(i);
      if (isKnown && at < 0) known.push(i);
      if (!isKnown && at >= 0) known.splice(at, 1);
      store.set(key, known);
      if (onlyLearning && isKnown) { order.splice(pos, 1); if (pos >= order.length) pos = 0; render(); } else move(1);
    }
    function flip() { var f = root.querySelector('.rv-flip'); if (f) f.classList.toggle('flipped'); }
    root.tabIndex = 0;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) { if (e.target.closest('.rv-flip')) flip(); return; }
      var a = b.getAttribute('data-a');
      if (a === 'next') move(1); else if (a === 'prev') move(-1);
      else if (a === 'know') mark(true); else if (a === 'learning') mark(false);
      else if (a === 'shuffle') { shuffle(order); pos = 0; render(); }
      else if (a === 'filter') { onlyLearning = !onlyLearning; rebuild(); render(); }
      else if (a === 'reset') { known = []; store.set(key, known); onlyLearning = false; rebuild(); render(); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === ' ') { e.preventDefault(); flip(); } else if (e.key === 'ArrowRight') move(1); else if (e.key === 'ArrowLeft') move(-1);
    });
    root.classList.add('rv-box');
    rebuild(); render();
  }

  /* ── Quiz ── <div class="rv-quiz"><div class="rv-q" data-answer="b"><p>Question</p><ol><li>A</li><li>B</li></ol><div class="explain">Why</div></div></div>
     Add data-noshuffle on .rv-quiz to keep option order (e.g. "all of the above"). */
  function quiz(root, n) {
    var key = 'rv:' + chapterId + ':quiz' + n;
    var qs = $$(':scope > .rv-q', root).map(function (q) {
      var opts = $$('li', q).map(function (li, i) { return { html: li.innerHTML, ok: 'abcdefgh'[i] === q.getAttribute('data-answer').toLowerCase() }; });
      var ex = q.querySelector('.explain');
      return { q: q.querySelector('p').innerHTML, opts: opts, explain: ex ? ex.innerHTML : '' };
    });
    var keep = root.hasAttribute('data-noshuffle');
    function run(subset) {
      var score = 0, answered = 0, missed = [];
      root.innerHTML = '';
      root.classList.add('rv-box');
      subset.forEach(function (q, qi) {
        var opts = keep ? q.opts.slice() : shuffle(q.opts.slice());
        var block = el('<div class="rv-qblock"><div class="rv-qtext">' + (qi + 1) + '. ' + q.q + '</div><div class="rv-explain">💡 ' + q.explain + '</div></div>');
        var explain = block.querySelector('.rv-explain');
        opts.forEach(function (o) {
          var b = el('<button class="rv-opt">' + o.html + '</button>');
          b.addEventListener('click', function () {
            $$('.rv-opt', block).forEach(function (x, xi) { x.disabled = true; if (opts[xi].ok) x.classList.add('right'); });
            if (o.ok) score++; else { b.classList.add('wrong'); missed.push(q); }
            block.classList.add('done'); answered++;
            if (answered === subset.length) finish();
          });
          block.insertBefore(b, explain);
        });
        root.appendChild(block);
      });
      var out = el('<div class="rv-score"></div>');
      root.appendChild(out);
      function finish() {
        var best = Math.max(store.get(key, 0), Math.round(score / subset.length * 100));
        if (subset.length === qs.length) store.set(key, best);
        out.innerHTML = 'Score: ' + score + ' / ' + subset.length + ' <div class="rv-meta">Best on full quiz: ' + store.get(key, 0) + '%</div>' +
          '<div class="rv-row">' + (missed.length ? '<button class="rv-btn primary" data-a="missed">Retry ' + missed.length + ' missed</button>' : '') + '<button class="rv-btn" data-a="all">Restart quiz</button></div>';
        out.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { run(b.getAttribute('data-a') === 'missed' ? missed : qs); }); });
      }
    }
    run(qs);
  }

  /* ── Mind map ── <div class="rv-mindmap"><ul><li>Root<ul><li>Branch<ul><li>Leaf</li></ul></li></ul></li></ul></div> */
  function mindmap(root) {
    $$('li', root).forEach(function (li) {
      var kids = li.querySelector(':scope > ul');
      var label = document.createElement('span');
      label.className = 'rv-node' + (kids ? ' has-kids' : '');
      while (li.firstChild && li.firstChild !== kids) label.appendChild(li.firstChild);
      li.insertBefore(label, kids);
      if (kids) label.addEventListener('click', function () { li.classList.toggle('collapsed'); });
    });
    var bar = el('<div class="rv-row" style="justify-content:flex-start"><button class="rv-btn">Expand all</button><button class="rv-btn">Collapse branches</button></div>');
    var b = bar.querySelectorAll('button');
    b[0].addEventListener('click', function () { $$('li', root).forEach(function (l) { l.classList.remove('collapsed'); }); });
    b[1].addEventListener('click', function () { $$('li li', root).forEach(function (l) { if (l.querySelector('ul')) l.classList.add('collapsed'); }); });
    root.parentNode.insertBefore(bar, root);
  }

  /* ── Cloze ── <div class="rv-cloze"><p>Energy is the ability to do {{work}}.</p></div>  ({{a|b}} = accepted alternatives) */
  function cloze(root) {
    $$('p', root).forEach(function (p) {
      p.innerHTML = p.innerHTML.replace(/\{\{(.+?)\}\}/g, function (_, ans) {
        var first = ans.split('|')[0];
        return '<input class="rv-blank" size="' + Math.max(4, first.length + 1) + '" data-ans="' + ans.replace(/"/g, '&quot;') + '" autocomplete="off" spellcheck="false">';
      });
    });
    var bar = el('<div class="rv-row"><button class="rv-btn primary">Check</button><button class="rv-btn">Reveal</button><button class="rv-btn">Clear</button></div>');
    var b = bar.querySelectorAll('button');
    var inputs = function () { return $$('.rv-blank', root); };
    b[0].addEventListener('click', function () {
      inputs().forEach(function (i) {
        var ok = i.getAttribute('data-ans').split('|').some(function (a) { return norm(a) === norm(i.value); });
        i.classList.toggle('right', ok); i.classList.toggle('wrong', !ok);
      });
    });
    b[1].addEventListener('click', function () { inputs().forEach(function (i) { i.value = i.getAttribute('data-ans').split('|')[0]; i.classList.add('right'); i.classList.remove('wrong'); }); });
    b[2].addEventListener('click', function () { inputs().forEach(function (i) { i.value = ''; i.classList.remove('right', 'wrong'); }); });
    root.classList.add('rv-box'); root.appendChild(bar);
  }

  /* ── Spaced-revision tracker ── <div class="rv-tracker"></div> (Day 0, 1, 3, 7, 14, 30) */
  function tracker(root, n) {
    var key = 'rv:' + chapterId + ':track' + n;
    var gaps = [0, 1, 3, 7, 14, 30], DAY = 864e5;
    var done = store.get(key, []); // ISO timestamps, index = step
    function render() {
      var start = done[0] ? new Date(done[0]) : null, now = Date.now();
      var html = '<div class="rv-meta">Tick each revision when you finish it. The next one is highlighted when it is due.</div><div class="rv-steps">';
      gaps.forEach(function (g, i) {
        var d = !!done[i], due = !d && start && done[i - 1] && now >= start.getTime() + g * DAY;
        var when = start ? new Date(start.getTime() + g * DAY).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : (i ? '' : 'Today');
        html += '<div class="rv-step' + (d ? ' done' : '') + (due ? ' due' : '') + '" data-i="' + i + '"><b>' + (g ? 'Day ' + g : 'First pass') + '</b>' + (d ? '✓ done' : due ? 'Due now' : when) + '</div>';
      });
      root.innerHTML = html + '</div>';
    }
    root.classList.add('rv-box');
    root.addEventListener('click', function (e) {
      var s = e.target.closest('.rv-step'); if (!s) return;
      var i = +s.getAttribute('data-i');
      if (done[i]) done.length = i; else if (i === 0 || done[i - 1]) done[i] = new Date().toISOString();
      store.set(key, done); render();
    });
    render();
  }

  /* ── Brain dump ── <details class="rv-dump"><summary>…</summary><textarea></textarea></details> – notes are saved locally. */
  function dump(root, n) {
    var t = root.querySelector('textarea'); if (!t) return;
    var key = 'rv:' + chapterId + ':dump' + n;
    t.value = store.get(key, '');
    t.addEventListener('input', function () { store.set(key, t.value); });
  }

  function init() {
    var map = { '.rv-flash': flashcards, '.rv-quiz': quiz, '.rv-cloze': cloze, '.rv-tracker': tracker, 'details.rv-dump': dump, '.rv-mindmap': mindmap };
    Object.keys(map).forEach(function (sel) { $$(sel).forEach(function (r, i) { map[sel](r, i); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
