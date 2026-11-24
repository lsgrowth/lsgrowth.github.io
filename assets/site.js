/* ☰ 메뉴(900px 미만): button · aria-expanded · aria-controls, Esc 로 닫기, 메뉴 링크를 누르면 닫힘 */
(function () {
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
  }
  btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 900) set(false); });
})();

/* 진단 페이지 자가진단: 체크 개수 표시, 2개 이하이면 신청 안내 */
(function () {
  var box = document.getElementById('selfcheck');
  if (!box) return;
  var cb = box.querySelectorAll('input[type=checkbox]');
  var out = document.getElementById('selfcheck-result');
  var msg = document.getElementById('selfcheck-msg');
  var touched = false;
  function upd() {
    var n = 0;
    for (var i = 0; i < cb.length; i++) if (cb[i].checked) n++;
    out.textContent = '체크한 항목 ' + n + ' / ' + cb.length;
    msg.hidden = !(touched && n <= 2);
  }
  for (var i = 0; i < cb.length; i++) cb[i].addEventListener('change', function () { touched = true; upd(); });
  upd();
})();

/* 모션: IntersectionObserver 로 한 번씩만(스크롤 이벤트 계산 없음). 움직임 줄이기 설정이거나 IO 가 없으면 아무것도 하지 않고 최종 상태 그대로 둔다. */
(function () {
  try {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var de = document.documentElement;
    de.classList.add('motion');

    /* 7) 숫자 카운트업: HTML 에는 최종값이 이미 있고(쉼표·소수점 그대로), 화면에 들어오면 0 → 최종값(약 1.2초, 한 번) */
    function fmt(v, dec, comma) {
      var s = dec ? v.toFixed(dec) : String(Math.round(v));
      if (comma) { var q = s.split('.'); q[0] = q[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = q.join('.'); }
      return s;
    }
    function countUp(box, th) {
      var cus = box.querySelectorAll('.cu'), to = [], dec = [], comma = [], orig = [];
      for (var i = 0; i < cus.length; i++) {
        to.push(parseFloat(cus[i].getAttribute('data-to'))); dec.push(parseInt(cus[i].getAttribute('data-dec') || '0', 10));
        comma.push(cus[i].getAttribute('data-comma') === '1'); orig.push(cus[i].textContent);
      }
      if (box.classList.contains('mk-card') || box.closest('.career')) {      // 시작 상태는 JS 가 붙인 클래스일 때만(JS 가 실패하면 최종 상태 그대로)
        box.classList.add('bar-w');
        for (var kk = 0; kk < box.children.length; kk++) box.children[kk].style.setProperty('--k', kk);
      }
      new IntersectionObserver(function (es, ob) {
        if (!es[0].isIntersecting) return;
        ob.disconnect();
        box.classList.add('go');      // 막대·밑줄·칸 떠오르기 시작
        var t0 = null, D = 1200;
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3);
          for (var i = 0; i < cus.length; i++) cus[i].textContent = fmt(to[i] * e, dec[i], comma[i]);
          if (p < 1) requestAnimationFrame(step);
          else for (var j = 0; j < cus.length; j++) cus[j].textContent = orig[j];      // 끝에는 HTML 에 적힌 최종값 그대로
        }
        for (var k = 0; k < cus.length; k++) cus[k].textContent = fmt(0, dec[k], comma[k]);
        requestAnimationFrame(step);
      }, { threshold: th || 0.4 }).observe(box);
    }
    var boxes = document.querySelectorAll('.nums, .mk-card');
    for (var bx = 0; bx < boxes.length; bx++) countUp(boxes[bx], boxes[bx].classList.contains('mk-card') ? 0.2 : 0.4);      // 히어로 카드는 화면에 보이는 즉시(로드 직후) 한 번

    /* 8) 형광펜 그어지기 */
    var hls = document.querySelectorAll('.hl');
    if (hls.length) {
      var hio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); hio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      for (var h = 0; h < hls.length; h++) { hls[h].classList.add('hl-w'); hio.observe(hls[h]); }
    }

    /* 9) 내원 5단계 깔때기: 화면에 들어오면 5칸이 0.1초 간격으로 차례로 켜진다(한 번) */
    var fn = document.querySelector('.funnel');
    if (fn) {
      fn.classList.add('fn-w');
      new IntersectionObserver(function (es, ob) {
        if (es[0].isIntersecting) { fn.classList.add('go'); ob.disconnect(); }
      }, { threshold: 0.35 }).observe(fn);
    }

    /* 10) 카드 떠오르기: 첫 화면 아래 섹션의 제목·카드, 같은 줄은 0.06초씩 차례로 */
    var rv = !document.querySelector('.hero-ink') ? [] : document.querySelectorAll('.sec > .eyebrow, .sec > h2, .sec .sub, .notes-side > *, .mcard, .promise, .st, .notecard');
    if (rv.length) {      // 카드 떠오르기는 메인(히어로가 있는 페이지)에서만
      var rio = new IntersectionObserver(function (es) {
        var vis = es.filter(function (e) { return e.isIntersecting; });
        vis.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; });
        var rowTop = null, idx = 0;
        vis.forEach(function (e) {
          var top = Math.round(e.boundingClientRect.top / 8);
          if (rowTop === null || Math.abs(top - rowTop) > 2) { rowTop = top; idx = 0; }
          e.target.style.setProperty('--d', (idx * 0.06).toFixed(2) + 's'); idx++;
          e.target.classList.add('in'); rio.unobserve(e.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
      for (var r = 0; r < rv.length; r++) {
        if (rv[r].closest('.hero-ink,.nums-sec')) continue;
        var rc = rv[r].getBoundingClientRect();
        if (rc.top < window.innerHeight && rc.bottom > 0) continue;      // 이미 첫 화면에 보이는 것은 모션 없음(LCP 보호)
        rv[r].classList.add('rv'); rio.observe(rv[r]);
      }
    }
  } catch (err) { /* 모션이 실패해도 내용은 그대로 보인다 */ }
})();
