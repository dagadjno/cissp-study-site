/* Minimal markdown renderer for the note files' subset:
   headings, nested ul/ol, pipe tables (indented ok), fenced code,
   inline bold/em/code/links, <!-- REVIEW --> badge on next heading. */
(function () {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, function (_, c) { return '<code>' + c + '</code>'; });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  function tableHtml(rows) {
    var cells = rows.map(function (r) {
      return r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|')
        .map(function (c) { return c.trim(); });
    });
    // drop separator row(s) like --- | ---
    var body = cells.filter(function (r) {
      return !r.every(function (c) { return /^:?-{2,}:?$/.test(c) || c === ''; });
    });
    if (!body.length) return '';
    var html = '<div class="tbl-wrap"><table><thead><tr>';
    html += body[0].map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('');
    html += '</tr></thead><tbody>';
    for (var i = 1; i < body.length; i++) {
      html += '<tr>' + body[i].map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
    }
    return html + '</tbody></table></div>';
  }

  function render(md) {
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var out = [];
    var listStack = []; // entries: {type:'ul'|'ol', indent:n}
    var reviewNext = false;
    var i, line;

    function closeListsTo(indent) {
      while (listStack.length && listStack[listStack.length - 1].indent >= indent) {
        out.push('</' + listStack.pop().type + '>');
      }
    }
    function closeAllLists() { closeListsTo(-1); }

    for (i = 0; i < lines.length; i++) {
      line = lines[i];

      // fenced code
      var fence = line.match(/^\s*```(\w*)/);
      if (fence) {
        closeAllLists();
        var code = [];
        i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { code.push(lines[i]); i++; }
        out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        continue;
      }

      // review marker
      if (/^\s*<!--\s*REVIEW\s*-->\s*$/.test(line)) { reviewNext = true; continue; }
      // other html comments: drop
      if (/^\s*<!--.*-->\s*$/.test(line)) continue;

      // table block (any indent)
      if (/^\s*\|.*\|\s*$/.test(line)) {
        var rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
        i--;
        closeAllLists();
        out.push(tableHtml(rows));
        continue;
      }

      // heading
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        closeAllLists();
        var lvl = h[1].length;
        var badge = reviewNext ? '<span class="review-badge">review</span>' : '';
        reviewNext = false;
        out.push('<h' + lvl + '>' + inline(h[2]) + badge + '</h' + lvl + '>');
        continue;
      }

      // list item (- or 1.)
      var li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (li) {
        var indent = li[1].length;
        var type = /\d/.test(li[2]) ? 'ol' : 'ul';
        var top = listStack[listStack.length - 1];
        if (!top || indent > top.indent) {
          listStack.push({ type: type, indent: indent });
          out.push('<' + type + '>');
        } else if (indent < top.indent) {
          closeListsTo(indent + 1);
          top = listStack[listStack.length - 1];
          if (!top || top.indent < indent || top.type !== type) {
            listStack.push({ type: type, indent: indent });
            out.push('<' + type + '>');
          }
        } else if (top.type !== type) {
          out.push('</' + listStack.pop().type + '>');
          listStack.push({ type: type, indent: indent });
          out.push('<' + type + '>');
        }
        out.push('<li>' + inline(li[3]) + '</li>');
        continue;
      }

      // blank
      if (/^\s*$/.test(line)) continue;

      // continuation of a list item, or paragraph
      if (listStack.length && /^\s+\S/.test(line)) {
        out.push('<li style="list-style:none">' + inline(line.trim()) + '</li>');
      } else {
        closeAllLists();
        out.push('<p>' + inline(line.trim()) + '</p>');
      }
    }
    closeAllLists();
    return '<div class="md">' + out.join('\n') + '</div>';
  }

  window.renderMarkdown = render;
  window.mdInline = inline;
})();
