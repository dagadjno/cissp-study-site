(function () {
  'use strict';

  var view = document.getElementById('view');
  var topbarEl = document.getElementById('topbar');
  var titleEl = document.getElementById('title');
  var backBtn = document.getElementById('back-btn');
  var INDEX = null;
  var tab = 'notes';
  var backFn = null; // function to run on back press, or null = at tab root

  // ---------- utils ----------
  function h(html) {
    view.innerHTML = html;
    view.scrollTop = 0;
    window.scrollTo(0, 0);
    view.classList.remove('enter');
    void view.offsetWidth; // restart the enter animation
    view.classList.add('enter');
  }
  function setTitle(t) { titleEl.textContent = t; }
  function setBack(fn) { backFn = fn; backBtn.hidden = !fn; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  // learned = answered "Got it" twice in a row; ids are prefixed "0X-"
  function countLearned(domId) {
    var s = store('fc-stats') || {}, n = 0;
    for (var k in s) if (k.indexOf(domId + '-') === 0 && (s[k].streak || 0) >= 2) n++;
    return n;
  }
  function countMissed(domId) {
    var s = store('q-stats') || {}, n = 0;
    for (var k in s) if (s[k].lastWrong && k.indexOf(domId + '-') === 0) n++;
    return n;
  }

  function getJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' -> ' + r.status);
      return r.json();
    });
  }
  function getText(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' -> ' + r.status);
      return r.text();
    });
  }
  function fail(err) {
    h('<p class="hint center">Could not load data' +
      (navigator.onLine ? '' : ' — you appear to be offline and this item is not cached yet') +
      '.<br><code>' + String(err.message || err) + '</code></p>');
  }

  var TZ_OFFSET_MS = 9 * 3600e3; // day boundaries in UTC+9
  function dayKey(daysAgo) {
    return new Date(Date.now() + TZ_OFFSET_MS - (daysAgo || 0) * 864e5).toISOString().slice(0, 10);
  }

  function progressTotals() {
    var fc = store('fc-stats') || {}, qs = store('q-stats') || {}, L = 0, C = 0, k;
    for (k in fc) if ((fc[k].streak || 0) >= 2) L++;
    for (k in qs) if (!qs[k].lastWrong) C++;
    return { L: L, C: C };
  }

  // per-day activity log: {"YYYY-MM-DD": {c: reviews, q: answers, L: learned total, Q: correct total}}
  function snapshotToday() {
    var log = store('day-log') || {};
    var key = dayKey();
    var e = log[key] || { c: 0, q: 0 };
    var t = progressTotals();
    e.L = t.L; e.Q = t.C;
    log[key] = e;
    store('day-log', log);
  }

  function logActivity(kind) {
    var log = store('day-log') || {};
    var key = dayKey();
    var e = log[key] || { c: 0, q: 0 };
    e[kind]++;
    var t = progressTotals();
    e.L = t.L; e.Q = t.C;
    log[key] = e;
    var cutoff = dayKey(60);
    for (var k in log) if (k < cutoff) delete log[k];
    store('day-log', log);
  }

  function activityChartHtml() {
    var log = store('day-log');
    if (!log) { // one-time seed from quiz history recorded before this feature
      log = {};
      (store('quiz-history') || []).forEach(function (s) {
        var e = log[s.date] || { c: 0, q: 0 };
        e.q += s.total;
        log[s.date] = e;
      });
      if (Object.keys(log).length) store('day-log', log);
    }
    var days = [], max = 1, total = 0, i, key, e, parts;
    // carry totals forward from the newest snapshot before the 30-day window
    var windowStart = dayKey(29);
    var carry = null;
    Object.keys(log).sort().forEach(function (k) {
      if (k < windowStart && log[k].L != null) carry = log[k];
    });
    for (i = 29; i >= 0; i--) {
      key = dayKey(i);
      parts = key.split('-');
      e = log[key] || { c: 0, q: 0 };
      if (e.L != null) carry = e;
      days.push({
        label: (+parts[1]) + '/' + (+parts[2]),
        c: e.c || 0, q: e.q || 0,
        L: carry ? carry.L : null, Q: carry ? carry.Q : null
      });
      max = Math.max(max, (e.c || 0) + (e.q || 0));
      total += (e.c || 0) + (e.q || 0);
    }
    // hover title for pointers; the tapped day shows the same counts as a small on-chart label
    function barText(day) {
      return day.label + ' — ' + day.c + ' cards, ' + day.q + ' questions' +
        (day.L != null ? ' · totals: ' + day.L + ' learned, ' + day.Q + ' correct' : '');
    }
    function lineText(day) {
      return day.L != null ? day.label + ' — ' + day.L + ' learned, ' + day.Q + ' correct' : '';
    }
    // the day's two counts stacked: orange over blue, the order the bar segments sit in
    function numHtml(cards, questions, pos) {
      return '<b class="ch-num" style="' + pos + '">' +
        '<i class="qo">' + questions + '</i><i class="cb">' + cards + '</i></b>';
    }
    var cols = days.map(function (day, idx) {
      return '<div class="ch-col' + (total && idx === 29 ? ' tapped' : '') + '" title="' + barText(day) + '">' +
        numHtml(day.c, day.q, 'bottom:' + (100 * (day.c + day.q) / max) + '%') +
        (day.q ? '<i class="ch-seg qo" style="height:' + (100 * day.q / max) + '%"></i>' : '') +
        (day.c ? '<i class="ch-seg cb" style="height:' + (100 * day.c / max) + '%"></i>' : '') +
        '</div>';
    }).join('');
    var labels = days.map(function (day, idx) {
      return '<span>' + (idx % 7 === 1 ? day.label : '') + '</span>';
    }).join('');
    // companion line panel: cumulative totals on their own scale (never a second axis on the bars)
    var lineMax = 1, hasLine = false;
    days.forEach(function (day) {
      if (day.L != null) { hasLine = true; lineMax = Math.max(lineMax, day.L, day.Q); }
    });
    var lineSvg = '', hitCols = '';
    if (hasLine) {
      var pts = function (prop) {
        return days.map(function (day, idx) {
          if (day[prop] == null) return null;
          return (idx * (300 / 29)).toFixed(1) + ',' + (76 - 72 * day[prop] / lineMax).toFixed(1);
        }).filter(Boolean).join(' ');
      };
      lineSvg = '<svg class="line-chart" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">' +
        '<polyline class="ln cb" vector-effect="non-scaling-stroke" points="' + pts('L') + '"/>' +
        '<polyline class="ln o" vector-effect="non-scaling-stroke" points="' + pts('Q') + '"/>' +
        '</svg>';
      // invisible equal-width tap targets over the svg, aligned with the x-axis labels below;
      // each carries its day's label, parked on the higher of that day's two points
      hitCols = days.map(function (day, idx) {
        var t = lineText(day);
        if (!t) return '<i class="ch-hit-col"></i>';
        var y = 76 - 72 * Math.max(day.L, day.Q) / lineMax;
        return '<i class="ch-hit-col' + (idx === 29 ? ' tapped' : '') + '" title="' + t + '">' +
          numHtml(day.L, day.Q, 'left:' + (idx * (100 / 29)).toFixed(1) + '%;top:' + (y / 80 * 100).toFixed(1) + '%') +
          '</i>';
      }).join('');
    }
    var last = days[29];
    var xAxis = '<div class="ch-x">' + labels + '</div>';
    var barsCard = '<div class="p-item p-overview">' +
      '<div class="ov-title">Daily activity' + (total ? '<span class="ov-peak">peak ' + max + '/day</span>' : '') + '</div>' +
      '<div class="chart">' + cols + '</div>' + xAxis +
      '<div class="legend"><span><i class="dot cb"></i>cards reviewed</span>' +
      '<span><i class="dot o"></i>questions answered</span></div>' +
      (total ? '' : '<p class="hint" style="margin:8px 0 0">activity will appear here as you study</p>') +
      '</div>';
    var linesCard = hasLine
      ? '<div class="p-item p-overview">' +
        '<div class="ov-title">Totals over time</div>' +
        '<div class="line-wrap">' + lineSvg + '<div class="ch-hit">' + hitCols + '</div></div>' + xAxis +
        '<div class="legend"><span><i class="dash cb"></i>cards learned (' + last.L + ')</span>' +
        '<span><i class="dash o"></i>questions correct (' + last.Q + ')</span></div>' +
        '</div>'
      : '';
    return barsCard + linesCard;
  }

  // tapping a day on either chart moves that chart's visible number label to it
  function wireActivityChart() {
    function wire(container, colSel) {
      container.addEventListener('click', function (ev) {
        var col = ev.target.closest(colSel);
        if (!col || !col.querySelector('.ch-num')) return; // days before tracking started carry no label
        container.querySelectorAll('.tapped').forEach(function (c) { c.classList.remove('tapped'); });
        col.classList.add('tapped');
      });
    }
    view.querySelectorAll('.chart').forEach(function (c) { wire(c, '.ch-col'); });
    view.querySelectorAll('.ch-hit').forEach(function (c) { wire(c, '.ch-hit-col'); });
  }

  // segments: [{n, cls, label}]; remainder renders as the neutral track
  function barHtml(segs, total, mini) {
    var used = 0;
    var inner = segs.filter(function (s) { return s.n > 0; }).map(function (s) {
      used += s.n;
      return '<i class="seg ' + s.cls + '" style="flex:' + s.n + '" title="' + s.label + ': ' + s.n + '"></i>';
    }).join('');
    var rem = Math.max(total - used, 0);
    if (rem > 0 || !inner) inner += '<i class="seg track" style="flex:' + (rem || 1) + '"></i>';
    return '<span class="bar' + (mini ? ' mini' : '') + '">' + inner + '</span>';
  }

  function domainProgress(d) {
    var fc = store('fc-stats') || {}, qs = store('q-stats') || {}, k;
    var p = { cards: d.cards || 0, learned: 0, learning: 0, questions: d.questions || 0, correct: 0, missed: 0 };
    for (k in fc) if (k.indexOf(d.id + '-') === 0) { if ((fc[k].streak || 0) >= 2) p.learned++; else p.learning++; }
    for (k in qs) if (k.indexOf(d.id + '-') === 0) { if (qs[k].lastWrong) p.missed++; else p.correct++; }
    return p;
  }

  // ---------- domain pickers ----------
  function domainList(opts) {
    // opts: {key:'notes'|'flashcards'|'quiz'|'progress', onPick(domain|null for all), allLabel, headerHtml}
    setBack(null);
    var html = (opts.headerHtml || '') + '<div class="item-list">';
    if (opts.allLabel) {
      html += '<button class="item" data-id="__all">' + opts.allLabel + '</button>';
    }
    INDEX.domains.forEach(function (d) {
      var has = !!d[opts.key];
      var sub = '';
      var extra = '';
      if (opts.key === 'progress') {
        has = !!(d.flashcards || d.quiz);
        if (has) {
          var p = domainProgress(d);
          sub = p.learned + '/' + p.cards + ' learned · ' + p.missed + ' missed';
          if (p.cards) extra += barHtml([{ n: p.learned, cls: 'g', label: 'learned' }, { n: p.learning, cls: 'o', label: 'learning' }], p.cards, true);
          if (p.questions) extra += barHtml([{ n: p.correct, cls: 'g', label: 'correct' }, { n: p.missed, cls: 'o', label: 'missed' }], p.questions, true);
        } else {
          sub = 'nothing tracked yet';
        }
      }
      if (opts.key === 'flashcards') {
        var learned = countLearned(d.id);
        sub = has ? d.cards + ' cards' + (learned ? ' · ' + learned + ' learned' : '') : 'no cards yet';
        if (has) {
          var pf = domainProgress(d);
          extra = barHtml([{ n: pf.learned, cls: 'g', label: 'learned' }, { n: pf.learning, cls: 'o', label: 'learning' }], pf.cards, true);
        }
      }
      if (opts.key === 'quiz') {
        var missed = countMissed(d.id);
        sub = has ? d.questions + ' questions' + (missed ? ' · ' + missed + ' to retry' : '') : 'no questions yet';
        if (has) {
          var pq = domainProgress(d);
          extra = barHtml([{ n: pq.correct, cls: 'g', label: 'correct' }, { n: pq.missed, cls: 'o', label: 'missed' }], pq.questions, true);
        }
      }
      html += '<button class="item" data-id="' + d.id + '"' + (has ? '' : ' disabled') + '>' +
        'Domain ' + d.num + ': ' + d.title +
        (sub ? '<span class="sub">' + sub + '</span>' : '') + extra + '</button>';
    });
    html += '</div>';
    if (INDEX.updated) html += '<p class="hint center">content updated ' + INDEX.updated + '</p>';
    h(html);
    view.querySelectorAll('.item:not([disabled])').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-id');
        opts.onPick(id === '__all' ? null : INDEX.domains.find(function (d) { return d.id === id; }));
      };
    });
  }

  // ---------- notes ----------
  var NOTES = {};     // domain id -> raw markdown, fetched once per session
  var noteQuery = ''; // last search on the notes list, restored when you come back to it

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escAttr(s) { return escHtml(s).replace(/"/g, '&quot;'); }
  // markdown syntax a search result shouldn't show
  function plain(s) {
    return s.replace(/^\s*([-*]|\d+\.)\s+/, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^\s*\|\s*/, '').replace(/\s*\|\s*$/, '').replace(/\s*\|\s*/g, ' · ')
      .replace(/[*`#]/g, '')
      .trim();
  }
  function termsOf(q) {
    return q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
  }
  function hasAll(text, ts) { // every term present, in any order
    var low = text.toLowerCase();
    return ts.every(function (t) { return low.indexOf(t) >= 0; });
  }
  function countIn(text, ts) { // occurrences, to match what the in-note search marks up
    var low = text.toLowerCase(), n = 0;
    ts.forEach(function (t) {
      var i = 0, at;
      while ((at = low.indexOf(t, i)) >= 0) { n++; i = at + t.length; }
    });
    return n;
  }
  function loadNotes() {
    return Promise.all(INDEX.domains.filter(function (d) { return d.notes; }).map(function (d) {
      return NOTES[d.id] != null ? null
        : getText('data/' + d.notes).then(function (md) { NOTES[d.id] = md; });
    }));
  }
  function noteText(d) {
    return NOTES[d.id] != null ? Promise.resolve(NOTES[d.id])
      : getText('data/' + d.notes).then(function (md) { NOTES[d.id] = md; return md; });
  }

  // hits grouped under their heading, so a common word lists sections instead of flooding
  function searchNote(md, ts) {
    var out = [], cur = null, heading = '';
    function hit(text) {
      if (!cur) { cur = { heading: heading, snippet: text, n: 0 }; out.push(cur); }
      cur.n += countIn(text, ts);
    }
    md.replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
      var head = line.match(/^#{1,4}\s+(.*)$/);
      if (head) {
        heading = head[1]; cur = null;
        if (hasAll(heading, ts)) hit(heading);
        return;
      }
      if (hasAll(line, ts)) hit(line);
    });
    return out;
  }

  // escaped text with each term hit wrapped in <mark>, windowed around the first one
  function snippetHtml(text, ts, max) {
    var low = text.toLowerCase(), first = -1;
    ts.forEach(function (t) {
      var at = low.indexOf(t);
      if (at >= 0 && (first < 0 || at < first)) first = at;
    });
    var start = Math.max(0, (first < 0 ? 0 : first) - 40);
    var cut = text.slice(start, start + (max || 160));
    var lowCut = cut.toLowerCase(), ranges = [];
    ts.forEach(function (t) {
      var i = 0, at;
      while ((at = lowCut.indexOf(t, i)) >= 0) { ranges.push([at, at + t.length]); i = at + t.length; }
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var html = '', pos = 0;
    ranges.forEach(function (r) {
      if (r[0] < pos) return; // overlapping terms: the first one already covered this
      html += escHtml(cut.slice(pos, r[0])) + '<mark>' + escHtml(cut.slice(r[0], r[1])) + '</mark>';
      pos = r[1];
    });
    html += escHtml(cut.slice(pos));
    return (start ? '…' : '') + html + (start + cut.length < text.length ? '…' : '');
  }

  // innermost blocks holding every term — the rendered stand-in for "one line", so a
  // multi-word search marks the same passages the results list counted
  function blocksWithAll(root, ts) {
    var all = Array.prototype.slice.call(root.querySelectorAll('p, li, td, th, h1, h2, h3, h4, pre'))
      .filter(function (el) { return hasAll(el.textContent, ts); });
    return all.filter(function (el) {
      return !all.some(function (other) { return other !== el && el.contains(other); });
    });
  }

  // wrap every hit in the rendered note; returns them in document order
  function markHits(root, ts) {
    var scopes = ts.length > 1 ? blocksWithAll(root, ts) : [root];
    scopes.forEach(function (scope) { markTerms(scope, ts); });
    return Array.prototype.slice.call(root.querySelectorAll('mark.hit'));
  }
  function markTerms(root, ts) {
    ts.forEach(function (t) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var nodes = [], n;
      while ((n = walker.nextNode())) {
        if (n.parentNode.nodeName !== 'MARK' && n.nodeValue.toLowerCase().indexOf(t) >= 0) nodes.push(n);
      }
      nodes.forEach(function (node) {
        var text = node.nodeValue, low = text.toLowerCase();
        var frag = document.createDocumentFragment(), i = 0, at, m;
        while ((at = low.indexOf(t, i)) >= 0) {
          if (at > i) frag.appendChild(document.createTextNode(text.slice(i, at)));
          m = document.createElement('mark');
          m.className = 'hit';
          m.textContent = text.slice(at, at + t.length);
          frag.appendChild(m);
          i = at + t.length;
        }
        if (i < text.length) frag.appendChild(document.createTextNode(text.slice(i)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  function searchBarHtml(placeholder, nav) {
    return '<div class="nsearch"><input id="n-q" type="search" placeholder="' + placeholder + '" ' +
      'autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">' +
      (nav ? '<span class="nfind" id="n-count"></span>' +
        '<button class="icon-btn nnav" id="n-prev" aria-label="Previous match">&#8593;</button>' +
        '<button class="icon-btn nnav" id="n-next" aria-label="Next match">&#8595;</button>' : '') +
      '</div>';
  }
  function stickUnderTopbar() { // park the search bar right below the sticky topbar
    var bar = view.querySelector('.nsearch');
    if (bar) bar.style.top = topbarEl.offsetHeight + 'px';
  }

  function notesRoot() {
    setTitle('Notes');
    domainList({
      key: 'notes',
      headerHtml: searchBarHtml('Search all notes…') + '<div id="n-hits"></div>',
      onPick: function (d) { openNote(d); }
    });
    wireNotesSearch();
  }

  function wireNotesSearch() {
    var input = document.getElementById('n-q');
    var hits = document.getElementById('n-hits');
    var list = view.querySelector('.item-list');
    var foot = view.querySelector('.item-list ~ .hint');
    var loading = null;
    stickUnderTopbar();

    function show(ts) {
      var html = '', total = 0;
      INDEX.domains.forEach(function (d) {
        if (!NOTES[d.id]) return;
        searchNote(NOTES[d.id], ts).forEach(function (s) {
          total += s.n;
          var head = plain(s.heading), snip = plain(s.snippet);
          html += '<button class="item" data-d="' + d.id + '" data-h="' + escAttr(head) + '">' +
            (s.n > 1 ? '<span class="n-tally">' + s.n + '</span>' : '') +
            'D' + d.num + ' · ' + escHtml(head) +
            // the hit is the heading itself when a stub note has nothing else in it
            (snip === head ? '' : '<span class="sub">' + snippetHtml(snip, ts) + '</span>') +
            '</button>';
        });
      });
      hits.innerHTML = html
        ? '<p class="hint center">' + total + (total === 1 ? ' match' : ' matches') + '</p>' +
          '<div class="item-list">' + html + '</div>'
        : '<p class="hint center">No matches.</p>';
      hits.querySelectorAll('.item').forEach(function (b) {
        b.onclick = function () {
          openNote(INDEX.domains.find(function (d) { return d.id === b.getAttribute('data-d'); }),
            input.value, b.getAttribute('data-h'));
        };
      });
    }

    function update() {
      var q = input.value;
      noteQuery = q;
      var ts = termsOf(q);
      list.hidden = !!ts.length;
      if (foot) foot.hidden = !!ts.length;
      if (!ts.length) { hits.innerHTML = ''; return; }
      if (!hits.innerHTML) hits.innerHTML = '<p class="hint center">searching…</p>';
      if (!loading) loading = loadNotes();
      loading.then(function () {
        if (input.value === q) show(ts); // ignore a pass overtaken by later keystrokes
      }).catch(fail);
    }
    input.oninput = update;
    if (noteQuery) { input.value = noteQuery; update(); }
  }

  // query/heading arrive when opening from a search result, to land on that section's hit
  function openNote(d, query, heading) {
    setTitle('Domain ' + d.num);
    setBack(notesRoot);
    h('<p class="hint center">loading…</p>');
    noteText(d).then(function (md) {
      h(searchBarHtml('Search this note…', true) + '<div id="n-body">' + renderMarkdown(md) + '</div>');
      wireNoteSearch(query, heading);
    }).catch(fail);
  }

  function wireNoteSearch(query, heading) {
    var input = document.getElementById('n-q');
    var body = document.getElementById('n-body');
    var count = document.getElementById('n-count');
    var clean = body.innerHTML; // pristine copy, re-marked from scratch on every query
    var marks = [], at = -1, timer = null;
    stickUnderTopbar();

    function show() { if (marks[at]) marks[at].scrollIntoView({ block: 'center' }); }
    function go(i) {
      if (!marks.length) return;
      at = (i + marks.length) % marks.length;
      marks.forEach(function (m, k) { m.classList.toggle('on', k === at); });
      count.textContent = (at + 1) + '/' + marks.length;
      show();
    }
    function run() {
      var ts = termsOf(input.value);
      body.innerHTML = clean;
      marks = ts.length ? markHits(body, ts) : [];
      at = -1;
      count.textContent = !ts.length ? '' : marks.length ? '' : 'none';
      if (marks.length) go(0);
    }
    input.oninput = function () {
      clearTimeout(timer);
      timer = setTimeout(run, 150); // a long note re-renders on each pass
    };
    input.onkeydown = function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      go(at + (e.shiftKey ? -1 : 1));
    };
    document.getElementById('n-prev').onclick = function () { go(at - 1); };
    document.getElementById('n-next').onclick = function () { go(at + 1); };

    if (!query) return;
    input.value = query;
    run();
    if (heading) jumpToSection(body, heading, marks, go);
    // #view animates in on a transform and long tables lay out late, so a jump fired this
    // early can land short — re-assert it once the entrance is done
    requestAnimationFrame(show);
    setTimeout(show, 350);
  }

  // land on the first hit at or after the heading the result came from
  function jumpToSection(body, heading, marks, go) {
    var heads = body.querySelectorAll('h1, h2, h3, h4'), target = null, i;
    for (i = 0; i < heads.length; i++) {
      if (heads[i].textContent.indexOf(heading) === 0) { target = heads[i]; break; }
    }
    if (!target) return;
    for (i = 0; i < marks.length; i++) {
      if (target.compareDocumentPosition(marks[i]) & Node.DOCUMENT_POSITION_FOLLOWING) { go(i); return; }
    }
    target.scrollIntoView({ block: 'start' });
  }

  // ---------- flashcards ----------
  // ---------- card scheduling (SM-2 lite) ----------
  // streak doubles as the learning step: 0 and 1 are learning, 2+ means graduated. A learning
  // card resurfaces STEPS[streak] cards later in the same session; a graduated one gets a day
  // interval (ivl) and a due date, growing by its ease each time it's recalled.
  var STEPS = [4, 12];
  var EASE_START = 2.5, EASE_MIN = 1.3, EASE_DROP = 0.2;

  function isDue(s) {
    if (!s || (s.streak || 0) < 2) return true;  // new, learning, or relearning after a lapse
    return !s.due || s.due <= dayKey();
  }
  function daysUntil(key) { // both parse as UTC midnight, so this lands on whole days
    return Math.round((Date.parse(key) - Date.parse(dayKey())) / 864e5);
  }

  function loadDecks(domain) {
    var srcs = domain ? [domain] : INDEX.domains.filter(function (d) { return d.flashcards; });
    return Promise.all(srcs.map(function (d) {
      return getJSON('data/' + d.flashcards).then(function (deck) {
        return deck.cards.map(function (c) {
          c.domain = d.num;
          return c;
        });
      });
    })).then(function (arrs) { return [].concat.apply([], arrs); });
  }

  function cardsRoot() {
    setTitle('Flashcards');
    domainList({
      key: 'flashcards', allLabel: 'All domains',
      onPick: cardSetup
    });
  }

  function cardSetup(domain) {
    setBack(cardsRoot);
    setTitle(domain ? 'Cards · Domain ' + domain.num : 'Cards · All');
    h('<p class="hint center">loading…</p>');
    loadDecks(domain).then(function (cards) {
      var stats = store('fc-stats') || {};
      var due = cards.filter(function (c) { return isDue(stats[c.id]); });
      var inReview = cards.filter(function (c) { return (stats[c.id] || {}).streak >= 2; }).length;
      var soonest = null; // nearest due date among the cards that aren't ready yet
      cards.forEach(function (c) {
        var s = stats[c.id];
        if (s && s.due && !isDue(s) && (!soonest || s.due < soonest)) soonest = s.due;
      });
      var wait = soonest ? daysUntil(soonest) : 0;
      var html = '<p class="hint center">' + cards.length + ' cards · ' + inReview + ' in review</p>' +
        '<div class="pill-row" style="justify-content:center">' +
        '<button class="pill" data-m="due"' + (due.length ? '' : ' disabled') + '>Due now (' + due.length + ')</button>' +
        '<button class="pill" data-m="all">All (' + cards.length + ')</button></div>' +
        (due.length ? '' : '<p class="hint center">Nothing due' +
          (soonest ? ' — next in ' + wait + (wait === 1 ? ' day' : ' days') : '') +
          '. Run All to study ahead.</p>');
      h(html);
      view.querySelectorAll('.pill:not([disabled])').forEach(function (p) {
        p.onclick = function () {
          cardSession(shuffle(p.getAttribute('data-m') === 'due' ? due : cards), domain);
        };
      });
    }).catch(fail);
  }

  function cardSession(queue, domain) {
    var stats = store('fc-stats') || {};
    var total = queue.length, done = 0, again = 0;
    var requeued = {}; // ids put back this session, so repeats spread out instead of looping
    setBack(function () { cardSetup(domain); });

    // put a learning card back STEPS[step] cards later, pushed past the repeats already
    // waiting — a fixed slot let a handful of hard cards rotate among themselves forever
    function requeue(card, step) {
      requeued[card.id] = true;
      var waiting = queue.filter(function (c) { return requeued[c.id]; }).length;
      var at = STEPS[Math.min(step, STEPS.length - 1)] + waiting;
      queue.splice(Math.min(at, queue.length), 0, card);
    }
    setTitle(domain ? 'Cards · Domain ' + domain.num : 'Cards · All');

    function next() {
      if (!queue.length) {
        h('<div class="center"><div class="score-big">&#127881;</div>' +
          '<p>' + total + ' cards reviewed' + (again ? ', ' + again + ' marked again' : '') + '.</p>' +
          '<div class="btn-row"><button class="btn secondary" id="fc-done">Done</button>' +
          '<button class="btn" id="fc-restart">Go again</button></div></div>');
        document.getElementById('fc-done').onclick = cardsRoot;
        document.getElementById('fc-restart').onclick = function () { cardSetup(domain); };
        return;
      }
      var card = queue[0];
      var flipped = false;
      h('<div class="fc-progress">' + (done + 1) + ' / ' + (done + queue.length) + '</div>' +
        '<div class="fc-card" id="fc-card">' +
        '<div class="fc-topic">D' + card.domain + (card.topic ? ' · ' + card.topic : '') + '</div>' +
        '<div class="fc-front">' + mdInline(card.front) + '</div>' +
        '<div class="fc-back" id="fc-back" hidden></div>' +
        '<div class="fc-tap" id="fc-tap">tap to reveal</div>' +
        '</div>' +
        '<div class="btn-row" id="fc-btns" hidden>' +
        '<button class="btn bad" id="fc-again">Again</button>' +
        '<button class="btn good" id="fc-good">Got it</button></div>');
      var cardEl = document.getElementById('fc-card');
      cardEl.onclick = function () {
        if (flipped) return;
        flipped = true;
        cardEl.classList.add('flipped');
        var back = document.getElementById('fc-back');
        back.innerHTML = renderMarkdown(card.back);
        back.hidden = false;
        document.getElementById('fc-tap').hidden = true;
        document.getElementById('fc-btns').hidden = false;
      };
      function animOut(cls) {
        document.querySelectorAll('#fc-btns .btn').forEach(function (b) { b.disabled = true; });
        cardEl.classList.remove('flipped');
        cardEl.classList.add(cls);
        setTimeout(next, 190);
      }
      function record(ok) {
        var s = stats[card.id] || { seen: 0, lapses: 0, streak: 0 };
        var wasGraduated = (s.streak || 0) >= 2;
        s.seen++;
        s.ease = s.ease || EASE_START;
        if (ok) {
          s.streak = (s.streak || 0) + 1;
          if (wasGraduated) {          // recalled on schedule — push it further out
            s.ivl = Math.max(1, Math.round((s.ivl || 1) * s.ease));
            s.due = dayKey(-s.ivl);
          } else if (s.streak >= 2) {  // graduating: a day for new cards, while a lapsed one
            s.ivl = s.ivl || 1;        // resumes at the shortened interval its lapse set
            s.due = dayKey(-s.ivl);
          }
        } else {
          s.lapses++;
          s.streak = 0;
          delete s.due; // back to learning, due again today
          if (wasGraduated) { // forgetting a scheduled card costs ease and halves its interval
            s.ease = Math.max(EASE_MIN, s.ease - EASE_DROP);
            s.ivl = Math.max(1, Math.round((s.ivl || 1) / 2));
          }
        }
        s.last = Date.now();
        stats[card.id] = s;
        store('fc-stats', stats);
        logActivity('c');
        return s;
      }
      document.getElementById('fc-again').onclick = function (e) {
        e.stopPropagation();
        record(false); again++;
        queue.shift();
        requeue(card, 0);
        animOut('fc-out-left');
      };
      document.getElementById('fc-good').onclick = function (e) {
        e.stopPropagation();
        var s = record(true);
        queue.shift();
        if (s.streak >= 2) done++;    // graduated, so it leaves the session
        else requeue(card, s.streak); // one more correct pass before it graduates
        animOut('fc-out-right');
      };
    }
    next();
  }

  // confetti burst at viewport point (x, y)
  function celebrate(x, y, count) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!document.body.animate) return;
    var colors = ['#ff5e3a', '#ffe27a', '#2f7d3f', '#2f6fb5', '#c8451f'];
    for (var i = 0; i < (count || 26); i++) {
      var p = document.createElement('i');
      var size = 5 + Math.random() * 5;
      p.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:' + size + 'px;height:' + (Math.random() < .5 ? size : size * .5) + 'px;' +
        'background:' + colors[i % colors.length] + ';' +
        'border-radius:' + (Math.random() < .4 ? '50%' : '2px') + ';' +
        'pointer-events:none;z-index:99;';
      var ang = Math.random() * Math.PI * 2;
      var v = 60 + Math.random() * 130;
      var dx = Math.cos(ang) * v;
      var dy = Math.sin(ang) * v - 90 - Math.random() * 70;
      var rot = (Math.random() - .5) * 720;
      document.body.appendChild(p);
      p.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (rot / 2) + 'deg)', opacity: 1, offset: .35 },
        { transform: 'translate(' + (dx * 1.25) + 'px,' + (dy + 200) + 'px) rotate(' + (rot * .8) + 'deg)', opacity: 1, offset: .8 },
        { transform: 'translate(' + (dx * 1.4) + 'px,' + (dy + 330) + 'px) rotate(' + rot + 'deg)', opacity: 0 }
      ], { duration: 1600 + Math.random() * 900, easing: 'cubic-bezier(.15,.5,.45,1)' })
        .onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }

  // ---------- quiz ----------
  function loadQuestions(domain) {
    var srcs = domain ? [domain] : INDEX.domains.filter(function (d) { return d.quiz; });
    return Promise.all(srcs.map(function (d) {
      return getJSON('data/' + d.quiz).then(function (q) {
        return q.questions.map(function (x) { x.domain = d.num; return x; });
      });
    })).then(function (arrs) { return [].concat.apply([], arrs); });
  }

  // An in-flight quiz lives in localStorage so leaving the tab (to check the notes, say)
  // or closing the app doesn't lose it. Cleared when the quiz finishes or a new one starts.
  function savedQuiz() {
    var s = store('quiz-session');
    return s && s.ids && s.ids.length ? s : null;
  }
  function clearQuiz() { store('quiz-session', null); }

  function quizTab() { // tapping the Quiz tab picks up where you left off
    if (!resumeQuiz()) quizRoot();
  }

  function quizRoot() {
    setTitle('Quiz');
    var s = savedQuiz();
    var header = '';
    if (s) {
      var d = s.dom ? INDEX.domains.find(function (x) { return x.id === s.dom; }) : null;
      header = '<p class="hint center" style="margin-bottom:8px">Quiz in progress · ' +
        (d ? 'Domain ' + d.num : 'all domains') + ' · question ' +
        Math.min(s.i + 1, s.ids.length) + ' of ' + s.ids.length + '</p>' +
        '<div class="btn-row" style="margin:0 0 14px"><button class="btn" id="qz-resume">Resume quiz</button>' +
        '<button class="btn secondary" id="qz-drop">Discard</button></div>';
    }
    domainList({
      key: 'quiz', allLabel: 'All domains', headerHtml: header,
      onPick: function (d) { quizSetup(d); }
    });
    var resume = document.getElementById('qz-resume');
    if (resume) resume.onclick = function () { resumeQuiz(); };
    var drop = document.getElementById('qz-drop');
    if (drop) drop.onclick = function () { clearQuiz(); quizRoot(); };
  }

  function resumeQuiz() {
    var s = savedQuiz();
    if (!s) return false;
    var domain = s.dom ? INDEX.domains.find(function (d) { return d.id === s.dom; }) : null;
    if (s.dom && !domain) { clearQuiz(); return false; } // that domain is gone from the index
    setTitle(domain ? 'Quiz · Domain ' + domain.num : 'Quiz · All');
    setBack(quizRoot);
    h('<p class="hint center">loading…</p>');
    loadQuestions(domain).then(function (pool) {
      var byId = {};
      pool.forEach(function (q) { byId[q.id] = q; });
      // a content sync can retire questions mid-quiz: keep what survives, shift the position
      var kept = [], at = 0;
      var here = byId[s.ids[s.i]]; // still the same question at the saved spot?
      s.ids.forEach(function (id, k) {
        if (!byId[id]) return;
        if (k < s.i) at++;
        kept.push(byId[id]);
      });
      if (at >= kept.length) { clearQuiz(); quizRoot(); return; }
      runQuiz(kept, domain, {
        i: at, score: s.score || 0,
        order: here ? s.order : null,
        picked: here ? s.picked : null
      });
    }).catch(fail);
    return true;
  }

  function quizSetup(domain) {
    setBack(quizRoot);
    setTitle(domain ? 'Quiz · Domain ' + domain.num : 'Quiz · All');
    h('<p class="hint center">loading…</p>');
    loadQuestions(domain).then(function (pool) {
      var stats = store('q-stats') || {};
      var toReview = pool.filter(function (q) {
        return !stats[q.id] || stats[q.id].lastWrong;
      });
      h('<p class="hint center">' + pool.length + ' questions · ' +
        (pool.length - toReview.length) + ' answered correctly</p>' +
        '<div class="pill-row" style="justify-content:center">' +
        '<button class="pill" data-n="review"' + (toReview.length ? '' : ' disabled') + '>To review (' + toReview.length + ')</button>' +
        '<button class="pill" data-n="all">All (' + pool.length + ')</button></div>' +
        (toReview.length ? '' : '<p class="hint center">All answered correctly — run All to keep them fresh.</p>'));
      view.querySelectorAll('.pill:not([disabled])').forEach(function (p) {
        p.onclick = function () {
          runQuiz(shuffle(p.getAttribute('data-n') === 'review' ? toReview : pool), domain);
        };
      });
    }).catch(fail);
  }

  function runQuiz(questions, domain, resume) {
    var i = resume ? resume.i : 0, score = resume ? resume.score : 0;
    var stats = store('q-stats') || {};
    var order = null, picked = null; // display order and answer for the question on screen
    var resumeOrder = resume ? resume.order : null;
    var resumePicked = resume ? resume.picked : null;
    setBack(quizRoot);

    function save() {
      store('quiz-session', {
        dom: domain ? domain.id : null,
        ids: questions.map(function (q) { return q.id; }),
        i: i, score: score, order: order, picked: picked
      });
    }

    function finish() {
      clearQuiz();
      var hist = store('quiz-history') || [];
      hist.push({
        date: dayKey(),
        domain: domain ? domain.num : 'all',
        score: score, total: questions.length
      });
      store('quiz-history', hist);
      var pct = Math.round(100 * score / questions.length);
      h('<div class="center"><div class="score-big">' + score + ' / ' + questions.length + '</div>' +
        '<p class="hint">' + pct + '%' + (pct >= 80 ? ' — solid' : pct >= 60 ? ' — getting there' : ' — review the misses') + '</p>' +
        '<div class="btn-row"><button class="btn secondary" id="qz-done">Done</button>' +
        '<button class="btn" id="qz-again">New quiz</button></div></div>');
      document.getElementById('qz-done').onclick = quizRoot;
      document.getElementById('qz-again').onclick = function () { quizSetup(domain); };
      if (pct >= 80) {
        celebrate(window.innerWidth / 2, 160, 44);
        setTimeout(function () { celebrate(window.innerWidth / 2, 160, 30); }, 350);
      }
    }

    function next() {
      if (i >= questions.length) return finish();
      var q = questions[i];
      // a resumed question keeps the lettering it had when you left it
      order = resumeOrder && resumeOrder.length === q.options.length
        ? resumeOrder
        : shuffle(q.options.map(function (_, k) { return k; }));
      var replay = resumePicked;
      resumeOrder = null; resumePicked = null;
      picked = null;
      var letters = ['A', 'B', 'C', 'D', 'E'];
      h('<div class="q-progress">' + (i + 1) + ' / ' + questions.length +
        ' · D' + q.domain + (q.topic ? ' · ' + q.topic : '') + '</div>' +
        '<div class="q-stem">' + mdInline(q.stem) + '</div>' +
        '<div class="q-options">' +
        order.map(function (optIdx, pos) {
          return '<button class="q-opt" data-i="' + optIdx + '"><span class="k">' +
            letters[pos] + '</span>' + mdInline(q.options[optIdx]) + '</button>';
        }).join('') + '</div><div id="q-after"></div>');

      // again = replaying an answer given before you left the tab: show it, don't re-score it
      function answer(pick, again, btn) {
        picked = pick;
        var right = pick === q.answer;
        if (!again) {
          if (right) {
            score++;
            var r = btn.getBoundingClientRect();
            celebrate(r.left + r.width / 2, r.top + r.height / 2);
          }
          stats[q.id] = { lastWrong: !right, at: Date.now() };
          store('q-stats', stats);
          logActivity('q');
        }
        view.querySelectorAll('.q-opt').forEach(function (b) {
          b.disabled = true;
          var bi = parseInt(b.getAttribute('data-i'), 10);
          if (bi === q.answer) b.classList.add('correct');
          else if (bi === pick) b.classList.add('wrong');
        });
        var expl = '<div class="q-expl"><strong>' + (right ? 'Correct.' : 'Incorrect.') + '</strong> ' +
          mdInline(q.explanation || '');
        if (q.why_wrong) {
          expl += '<ul>' + q.why_wrong.map(function (w, k) {
            if (k === q.answer) return '';
            return '<li>' + mdInline(q.options[k].split(/[.;—]/)[0]) + ' — ' + mdInline(w) + '</li>';
          }).join('') + '</ul>';
        }
        expl += '</div><div class="btn-row"><button class="btn" id="q-next">' +
          (i + 1 < questions.length ? 'Next' : 'Finish') + '</button></div>';
        document.getElementById('q-after').innerHTML = expl;
        document.getElementById('q-next').onclick = function () { i++; next(); };
        save();
        // on a fresh answer, bring the verdict into view; on a replay, start back at the stem
        if (!again) document.getElementById('q-next').scrollIntoView({ block: 'nearest' });
      }

      view.querySelectorAll('.q-opt').forEach(function (btn) {
        btn.onclick = function () { answer(parseInt(btn.getAttribute('data-i'), 10), false, btn); };
      });
      if (replay != null) answer(replay, true);
      else save();
    }
    next();
  }

  // ---------- progress ----------
  var CARD_STATES = ['new', 'learned', 'learning'];   // tap cycles in this order
  var Q_STATES = ['new', 'missed', 'correct'];

  function cardState(s) { return !s ? 'new' : (s.streak || 0) >= 2 ? 'learned' : 'learning'; }
  function qState(s) { return !s ? 'new' : s.lastWrong ? 'missed' : 'correct'; }

  function setCardState(stats, id, state) {
    if (state === 'new') { delete stats[id]; return; }
    var s = stats[id] || { seen: 0, lapses: 0 };
    s.streak = state === 'learned' ? 2 : 0;
    if (state === 'learned') { // schedule it like a card that just graduated
      s.ease = s.ease || EASE_START;
      s.ivl = s.ivl || 1;
      s.due = dayKey(-s.ivl);
    } else delete s.due;       // learning cards are always due
    s.last = Date.now();
    stats[id] = s;
  }
  function setQState(stats, id, state) {
    if (state === 'new') { delete stats[id]; return; }
    stats[id] = { lastWrong: state === 'missed', at: Date.now() };
  }

  function progressRoot() {
    setTitle('Progress');
    var all = { cards: 0, learned: 0, learning: 0, questions: 0, correct: 0, missed: 0 };
    INDEX.domains.forEach(function (d) {
      var p = domainProgress(d);
      for (var k in all) all[k] += p[k];
    });
    var header = activityChartHtml() +
      '<div class="p-item p-overview">' +
      '<div class="ov-title">All domains</div>' +
      '<div class="ov-row"><span class="ov-label">Cards</span>' +
      barHtml([{ n: all.learned, cls: 'g', label: 'learned' }, { n: all.learning, cls: 'o', label: 'learning' }], all.cards) +
      '<span class="ov-num">' + all.learned + '/' + all.cards + '</span></div>' +
      '<div class="ov-row"><span class="ov-label">Questions</span>' +
      barHtml([{ n: all.correct, cls: 'g', label: 'correct' }, { n: all.missed, cls: 'o', label: 'missed' }], all.questions) +
      '<span class="ov-num">' + all.correct + '/' + all.questions + '</span></div>' +
      '<div class="legend">' +
      '<span><i class="dot g"></i>learned / correct</span>' +
      '<span><i class="dot o"></i>learning / missed</span>' +
      '<span><i class="dot t"></i>not seen</span>' +
      '</div></div>';
    domainList({ key: 'progress', onPick: progressView, headerHtml: header });
    wireActivityChart();
  }

  function progressView(domain) {
    setBack(progressRoot);
    setTitle('Progress · Domain ' + domain.num);
    h('<p class="hint center">loading…</p>');
    Promise.all([
      domain.flashcards ? loadDecks(domain) : Promise.resolve([]),
      domain.quiz ? loadQuestions(domain) : Promise.resolve([])
    ]).then(function (res) {
      var cards = res[0], questions = res[1];
      var fcStats = store('fc-stats') || {};
      var qStats = store('q-stats') || {};

      var mode = cards.length ? 'cards' : 'questions';
      var filter = 'all';

      h('<p class="hint center">Tap a status to change it — the card and quiz modes follow it.</p>' +
        '<div class="pill-row" style="justify-content:center">' +
        '<button class="pill" data-m="cards"' + (cards.length ? '' : ' disabled') + '>Cards (' + cards.length + ')</button>' +
        '<button class="pill" data-m="questions"' + (questions.length ? '' : ' disabled') + '>Questions (' + questions.length + ')</button>' +
        '</div><div class="pill-row" id="p-filters" style="justify-content:center"></div><div id="p-list"></div>' +
        '<div class="btn-row"><button class="btn secondary" id="p-reset">Reset domain ' +
        domain.num + ' progress</button></div>');

      function stateOf(x) {
        return mode === 'cards' ? cardState(fcStats[x.id]) : qState(qStats[x.id]);
      }

      function renderFilters() {
        var all = mode === 'cards' ? cards : questions;
        var states = mode === 'cards' ? ['new', 'learning', 'learned'] : ['new', 'missed', 'correct'];
        var counts = { all: all.length };
        states.forEach(function (s) { counts[s] = 0; });
        all.forEach(function (x) { counts[stateOf(x)]++; });
        var row = document.getElementById('p-filters');
        row.innerHTML = ['all'].concat(states).map(function (s) {
          return '<button class="pill small' + (filter === s ? ' active' : '') + '" data-f="' + s + '">' +
            s + ' (' + counts[s] + ')</button>';
        }).join('');
        row.querySelectorAll('.pill').forEach(function (p) {
          p.onclick = function () { filter = p.getAttribute('data-f'); renderFilters(); renderList(); };
        });
      }

      function renderList() {
        var list = document.getElementById('p-list');
        view.querySelectorAll('.pill[data-m]').forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-m') === mode);
        });
        var isCard = mode === 'cards';
        var items = (isCard ? cards : questions).filter(function (x) {
          return filter === 'all' || stateOf(x) === filter;
        });
        if (!items.length) {
          list.innerHTML = '<p class="hint center">nothing with this status</p>';
          return;
        }
        list.innerHTML = items.map(function (x, i) {
          var st = stateOf(x);
          return '<div class="p-item"><div class="p-row"><div class="p-text" data-i="' + i + '"><span class="t">' +
            (x.topic || '') + '</span><span class="f">' + mdInline(isCard ? x.front : x.stem) + '</span></div>' +
            '<button class="chip ' + st + '" data-kind="' + (isCard ? 'card' : 'q') + '" data-id="' + x.id + '">' + st + '</button></div>' +
            '<div class="p-detail" hidden></div></div>';
        }).join('');
        list.querySelectorAll('.p-text').forEach(function (pt) {
          pt.onclick = function () {
            var x = items[parseInt(pt.getAttribute('data-i'), 10)];
            var detail = pt.parentElement.nextElementSibling;
            if (detail.hidden && !detail.innerHTML) {
              if (isCard) {
                detail.innerHTML = renderMarkdown(x.back);
              } else {
                var letters = 'ABCD';
                detail.innerHTML =
                  (x.explanation ? '<p class="p-expl">' + mdInline(x.explanation) + '</p>' : '') +
                  '<ul class="p-opts">' + x.options.map(function (o, k) {
                    var why = k !== x.answer && x.why_wrong && x.why_wrong[k]
                      ? '<div class="why">' + mdInline(x.why_wrong[k]) + '</div>' : '';
                    return '<li class="' + (k === x.answer ? 'ans' : '') + '"><span class="k">' +
                      letters[k] + '</span> ' + mdInline(o) + why + '</li>';
                  }).join('') + '</ul>';
              }
            }
            detail.hidden = !detail.hidden;
          };
        });
        list.querySelectorAll('.chip').forEach(function (chip) {
          chip.onclick = function () {
            var kind = chip.getAttribute('data-kind');
            var id = chip.getAttribute('data-id');
            var order = kind === 'card' ? CARD_STATES : Q_STATES;
            var cur = chip.textContent.trim();
            var nxt = order[(order.indexOf(cur) + 1) % order.length];
            if (kind === 'card') { setCardState(fcStats, id, nxt); store('fc-stats', fcStats); }
            else { setQState(qStats, id, nxt); store('q-stats', qStats); }
            chip.className = 'chip ' + nxt;
            void chip.offsetWidth; // restart the bump animation
            chip.classList.add('bump');
            chip.textContent = nxt;
            snapshotToday(); // flag edits move the totals lines too
            renderFilters(); // keep counts current; the row itself stays put
          };
        });
      }

      view.querySelectorAll('.pill[data-m]:not([disabled])').forEach(function (p) {
        p.onclick = function () {
          mode = p.getAttribute('data-m');
          filter = 'all';
          renderFilters();
          renderList();
        };
      });
      renderFilters();
      renderList();
      // two-step inline confirmation: native confirm() can be suppressed in installed PWAs
      var resetBtn = document.getElementById('p-reset');
      var resetLabel = resetBtn.textContent;
      var disarmTimer = null;
      resetBtn.onclick = function () {
        if (resetBtn.getAttribute('data-armed')) {
          clearTimeout(disarmTimer);
          cards.forEach(function (c) { delete fcStats[c.id]; });
          questions.forEach(function (q) { delete qStats[q.id]; });
          store('fc-stats', fcStats);
          store('q-stats', qStats);
          snapshotToday();
          progressView(domain);
          return;
        }
        resetBtn.setAttribute('data-armed', '1');
        resetBtn.classList.remove('secondary');
        resetBtn.classList.add('bad');
        resetBtn.textContent = 'Tap again to confirm';
        disarmTimer = setTimeout(function () {
          if (!document.body.contains(resetBtn)) return;
          resetBtn.removeAttribute('data-armed');
          resetBtn.classList.add('secondary');
          resetBtn.classList.remove('bad');
          resetBtn.textContent = resetLabel;
        }, 4000);
      };
    }).catch(fail);
  }

  // ---------- shell ----------
  var roots = { notes: notesRoot, cards: cardsRoot, quiz: quizTab, progress: progressRoot };

  document.querySelectorAll('.tab').forEach(function (t) {
    t.onclick = function () {
      tab = t.getAttribute('data-tab');
      // mixed cached html/js versions: this js doesn't know the tab — self-heal
      if (!roots[tab]) { location.reload(); return; }
      document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('active', x === t); });
      roots[tab]();
    };
  });
  backBtn.onclick = function () { if (backFn) backFn(); };

  getJSON('data/index.json').then(function (idx) {
    INDEX = idx;
    notesRoot();
  }).catch(fail);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
})();
