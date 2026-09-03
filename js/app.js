(function () {
  'use strict';

  var view = document.getElementById('view');
  var titleEl = document.getElementById('title');
  var backBtn = document.getElementById('back-btn');
  var INDEX = null;
  var tab = 'notes';
  var backFn = null; // function to run on back press, or null = at tab root

  // ---------- utils ----------
  function h(html) { view.innerHTML = html; view.scrollTop = 0; window.scrollTo(0, 0); }
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

  // ---------- domain pickers ----------
  function domainList(opts) {
    // opts: {key:'notes'|'flashcards'|'quiz', onPick(domain|null for all), allLabel}
    setBack(null);
    var html = '<div class="item-list">';
    if (opts.allLabel) {
      html += '<button class="item" data-id="__all">' + opts.allLabel + '</button>';
    }
    INDEX.domains.forEach(function (d) {
      var has = !!d[opts.key];
      var sub = '';
      if (opts.key === 'flashcards') sub = has ? d.cards + ' cards' : 'no cards yet';
      if (opts.key === 'quiz') sub = has ? d.questions + ' questions' : 'no questions yet';
      html += '<button class="item" data-id="' + d.id + '"' + (has ? '' : ' disabled') + '>' +
        'Domain ' + d.num + ': ' + d.title +
        (sub ? '<span class="sub">' + sub + '</span>' : '') + '</button>';
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
  function notesRoot() {
    setTitle('Notes');
    domainList({
      key: 'notes',
      onPick: function (d) {
        setTitle('Domain ' + d.num);
        setBack(notesRoot);
        h('<p class="hint center">loading…</p>');
        getText('data/' + d.notes).then(function (md) {
          h(renderMarkdown(md));
        }).catch(fail);
      }
    });
  }

  // ---------- flashcards ----------
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
      onPick: function (d) {
        h('<p class="hint center">loading…</p>');
        loadDecks(d).then(function (cards) { cardSession(shuffle(cards), d); }).catch(fail);
      }
    });
  }

  function cardSession(queue, domain) {
    var stats = store('fc-stats') || {};
    var total = queue.length, done = 0, again = 0;
    setBack(cardsRoot);
    setTitle(domain ? 'Cards · Domain ' + domain.num : 'Cards · All');

    function next() {
      if (!queue.length) {
        h('<div class="center"><div class="score-big">&#127881;</div>' +
          '<p>' + total + ' cards reviewed' + (again ? ', ' + again + ' marked again' : '') + '.</p>' +
          '<div class="btn-row"><button class="btn secondary" id="fc-done">Done</button>' +
          '<button class="btn" id="fc-restart">Restart</button></div></div>');
        document.getElementById('fc-done').onclick = cardsRoot;
        document.getElementById('fc-restart').onclick = function () {
          h('<p class="hint center">loading…</p>');
          loadDecks(domain).then(function (cards) { cardSession(shuffle(cards), domain); }).catch(fail);
        };
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
        var back = document.getElementById('fc-back');
        back.innerHTML = renderMarkdown(card.back);
        back.hidden = false;
        document.getElementById('fc-tap').hidden = true;
        document.getElementById('fc-btns').hidden = false;
      };
      function record(ok) {
        var s = stats[card.id] || { seen: 0, lapses: 0 };
        s.seen++; if (!ok) s.lapses++;
        s.last = Date.now();
        stats[card.id] = s;
        store('fc-stats', stats);
      }
      document.getElementById('fc-again').onclick = function (e) {
        e.stopPropagation();
        record(false); again++;
        queue.shift();
        queue.splice(Math.min(4, queue.length), 0, card); // resurface soon
        next();
      };
      document.getElementById('fc-good').onclick = function (e) {
        e.stopPropagation();
        record(true); done++;
        queue.shift();
        next();
      };
    }
    next();
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

  function pickQuestions(pool, n) {
    // weight: unseen 3, previously missed 2, previously correct 1
    var stats = store('q-stats') || {};
    var weighted = pool.map(function (q) {
      var s = stats[q.id];
      var w = !s ? 3 : (s.lastWrong ? 2 : 1);
      return { q: q, w: w, r: Math.random() * w };
    });
    weighted.sort(function (a, b) { return b.r - a.r; });
    return weighted.slice(0, n).map(function (x) { return x.q; });
  }

  function quizRoot() {
    setTitle('Quiz');
    domainList({
      key: 'quiz', allLabel: 'All domains',
      onPick: function (d) { quizSetup(d); }
    });
  }

  function quizSetup(domain) {
    setBack(quizRoot);
    setTitle(domain ? 'Quiz · Domain ' + domain.num : 'Quiz · All');
    h('<p class="hint center">loading…</p>');
    loadQuestions(domain).then(function (pool) {
      var sizes = [5, 10, pool.length].filter(function (v, i, a) {
        return v <= pool.length && a.indexOf(v) === i;
      });
      h('<p class="hint center">How many questions? (' + pool.length + ' available)</p>' +
        '<div class="pill-row" style="justify-content:center">' +
        sizes.map(function (s) {
          return '<button class="pill" data-n="' + s + '">' +
            (s === pool.length ? 'All ' + s : s) + '</button>';
        }).join('') + '</div>');
      view.querySelectorAll('.pill').forEach(function (p) {
        p.onclick = function () {
          runQuiz(pickQuestions(pool, parseInt(p.getAttribute('data-n'), 10)), domain);
        };
      });
    }).catch(fail);
  }

  function runQuiz(questions, domain) {
    var i = 0, score = 0;
    var stats = store('q-stats') || {};
    setBack(quizRoot);

    function finish() {
      var hist = store('quiz-history') || [];
      hist.push({
        date: new Date().toISOString().slice(0, 10),
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
    }

    function next() {
      if (i >= questions.length) return finish();
      var q = questions[i];
      var order = shuffle(q.options.map(function (_, k) { return k; }));
      var letters = ['A', 'B', 'C', 'D', 'E'];
      h('<div class="q-progress">' + (i + 1) + ' / ' + questions.length +
        ' · D' + q.domain + (q.topic ? ' · ' + q.topic : '') + '</div>' +
        '<div class="q-stem">' + mdInline(q.stem) + '</div>' +
        '<div class="q-options">' +
        order.map(function (optIdx, pos) {
          return '<button class="q-opt" data-i="' + optIdx + '"><span class="k">' +
            letters[pos] + '</span>' + mdInline(q.options[optIdx]) + '</button>';
        }).join('') + '</div><div id="q-after"></div>');

      view.querySelectorAll('.q-opt').forEach(function (btn) {
        btn.onclick = function () {
          var picked = parseInt(btn.getAttribute('data-i'), 10);
          var right = picked === q.answer;
          if (right) score++;
          stats[q.id] = { lastWrong: !right, at: Date.now() };
          store('q-stats', stats);
          view.querySelectorAll('.q-opt').forEach(function (b) {
            b.disabled = true;
            var bi = parseInt(b.getAttribute('data-i'), 10);
            if (bi === q.answer) b.classList.add('correct');
            else if (bi === picked) b.classList.add('wrong');
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
          document.getElementById('q-next').scrollIntoView({ block: 'nearest' });
        };
      });
    }
    next();
  }

  // ---------- shell ----------
  var roots = { notes: notesRoot, cards: cardsRoot, quiz: quizRoot };

  document.querySelectorAll('.tab').forEach(function (t) {
    t.onclick = function () {
      tab = t.getAttribute('data-tab');
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
