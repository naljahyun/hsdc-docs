/**
 * fee-count.js
 *   h2.fee-section 각각의 뒤따르는 table에 대해 다음을 수행합니다:
 *     1) tbody 행 수를 세어 h2[data-count] 에 세팅 (원래 기능)
 *     2) 헤더 텍스트가 "비용"인 열을 찾아
 *        - 해당 열 td의 인라인 text-align 제거 + .price 클래스 부여
 *          (table-reader 플러그인이 강제로 text-align:left 를 박는 문제 우회)
 *        - 숫자+쉼표 시퀀스를 <span class="num">으로 래핑
 *          (CSS에서 숫자만 세리프, 단위 '원'은 본문 폰트 유지)
 *
 *   사용법 (mkdocs.yml):
 *     extra_javascript:
 *       - javascripts/fee-count.js
 */
(function () {
  var NUM_SPLIT = /([0-9][0-9,]*)/;

  function wrapNumbers(cell) {
    if (cell.querySelector('.num')) return;
    var walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (textNode) {
      var txt = textNode.nodeValue;
      if (!/[0-9]/.test(txt)) return;
      var parts = txt.split(NUM_SPLIT);
      if (parts.length === 1) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (part, i) {
        if (part === '') return;
        if (i % 2 === 1) {
          var span = document.createElement('span');
          span.className = 'num';
          span.textContent = part;
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  function processTable(table) {
    var headerCells = table.querySelectorAll('thead th');
    var priceIdx = -1;
    headerCells.forEach(function (th, i) {
      if (th.textContent.trim() === '비용') priceIdx = i;
    });
    if (priceIdx < 0) return;

    if (headerCells[priceIdx]) {
      headerCells[priceIdx].classList.add('price');
      headerCells[priceIdx].style.textAlign = '';
    }
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      var cell = tr.children[priceIdx];
      if (!cell) return;
      cell.classList.add('price');
      cell.style.textAlign = '';
      wrapNumbers(cell);
    });
  }

  function apply() {
    document.querySelectorAll('h2.fee-section').forEach(function (h) {
      var el = h.nextElementSibling;
      while (el && el.tagName !== 'TABLE') {
        var inner = el.querySelector && el.querySelector('table');
        if (inner) { el = inner; break; }
        el = el.nextElementSibling;
      }
      if (!el) return;
      if (!h.hasAttribute('data-count')) {
        h.setAttribute('data-count', el.querySelectorAll('tbody tr').length);
      }
      processTable(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
  if (window.document$) {
    window.document$.subscribe(apply);
  }
})();
