/**
 * fee-count.js
 *   h2.fee-section 각각에 대해 바로 뒤에 오는 table 의
 *   tbody 행 개수를 세서 data-count 속성으로 꽂아줍니다.
 *
 *   사용법 (mkdocs.yml):
 *     extra_javascript:
 *       - javascripts/fee-count.js
 *
 *   마크다운에는 data-count 를 수동으로 쓰지 않아도 됩니다:
 *     ## 영상·기록 사본 { .fee-section #영상기록-사본 }
 */
(function () {
  function apply() {
    document.querySelectorAll('h2.fee-section').forEach(function (h) {
      // 이미 수동으로 지정되어 있으면 존중
      if (h.hasAttribute('data-count')) return;

      var el = h.nextElementSibling;
      while (el && el.tagName !== 'TABLE') el = el.nextElementSibling;
      if (!el) return;

      var n = el.querySelectorAll('tbody tr').length;
      h.setAttribute('data-count', n);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  // Material 의 instant navigation(pjax) 대응
  if (window.document$) {
    window.document$.subscribe(apply);
  }
})();
