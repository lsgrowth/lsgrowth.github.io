/* 모바일 하단 고정 바: 히어로를 지나면(히어로가 없는 페이지는 조금 스크롤하면) 보여 준다 */
(function () {
  var b = document.getElementById('mbar');
  if (!b) return;
  var h = document.querySelector('.hero');
  if (h && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { b.classList.toggle('show', !e[0].isIntersecting); }).observe(h);
  } else {
    var on = function () { b.classList.toggle('show', window.scrollY > 240); };
    window.addEventListener('scroll', on, { passive: true }); on();
  }
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
