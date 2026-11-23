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
