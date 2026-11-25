/* 3분 자가 점검 (/check/): 답변은 이 화면의 변수에만 있고 저장·전송하지 않는다(외부 요청 없음). 결과 영상은 data/reels.json 에서 온 값을 쓴다. */
(function () {
  var dataEl = document.getElementById('ck-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var STEPS = ['노출', '클릭', '정보', '설득', '내원'];
  var Q = [
    [0, '진료과와 동네 이름으로 검색하면, 첫 화면에 우리 병원이 보인다.'],
    [0, '지금 쓰는 광고·채널 중 어디서 환자가 오는지 알고 있다.'],
    [1, '검색 결과에 경쟁 병원과 나란히 있을 때, 우리 병원을 눌러야 할 이유가 한눈에 보인다.'],
    [1, '플레이스·블로그의 대표 사진과 첫 문장을 최근 6개월 안에 점검했다.'],
    [2, '진료시간·휴진일·주차·진료 범위가 모든 채널에 똑같이 적혀 있다.'],
    [2, '환자가 가장 많이 묻는 질문에 대한 답이 온라인에 이미 있다.'],
    [3, '우리 병원만의 진료 철학이나 강점을 한 문장으로 말할 수 있다.'],
    [3, '그 철학이 후기·콘텐츠·상담에서 똑같이 느껴진다.'],
    [4, '전화·카톡·예약 문의에 바로 응답이 시작된다(부재 시 자동 안내 포함).'],
    [4, '첫 방문 환자가 다시 오는지(재진) 달마다 확인하고 있다.']
  ];
  var OPT = [['네', 2], ['애매해요', 1], ['아니요', 0]];
  var SYM = ['○', '△', '×'];
  var INFO = [
    { why: '환자가 우리 병원을 처음 만나는 자리부터 약합니다. 다음 단계가 아무리 좋아도 보이지 않으면 시작되지 않습니다.', tip: '광고비를 늘리기 전에, 상황과 예산에 맞는 채널이 무엇인지부터 다시 고릅니다.' },
    { why: '보이기는 하지만 눌리지 않습니다. 환자는 검색 결과에서 몇 초 안에 고릅니다.', tip: '경쟁 병원 옆에 섰을 때 우리 병원만의 이유가 대표 사진과 첫 문장에 보이는지 확인합니다.' },
    { why: '들어온 환자가 정보를 찾다 떠납니다. 채널마다 다른 정보는 신뢰를 깎습니다.', tip: '진료 범위·쉬는 날·주차까지 모든 채널의 정보를 하나로 맞춥니다.' },
    { why: '정보는 충분한데 마음이 움직이지 않습니다. 환자가 우리 병원을 골라야 할 감정의 이유가 비어 있습니다.', tip: '원장님의 진료 철학에서 환자가 결정하는 한 지점을 찾아, 모든 콘텐츠에 같은 목소리로 담습니다.' },
    { why: '마음먹은 환자가 예약 앞에서 이탈하거나, 한 번 오고 다시 오지 않습니다.', tip: '예약·응대를 사람의 기분이 아닌 시스템으로 만들고, 재진을 달마다 확인합니다.' }
  ];
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ans = []; for (var z = 0; z < Q.length; z++) ans.push(null);
  var i = 0;
  function show(id) {
    var ps = document.querySelectorAll('.ck-panel');
    for (var k = 0; k < ps.length; k++) ps[k].classList.toggle('on', ps[k].id === id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function render() {
    var s = Q[i][0], t = Q[i][1];
    $('ck-pn').textContent = (i + 1) + ' / ' + Q.length;
    $('ck-pb').style.width = (i / Q.length * 100) + '%';
    $('ck-qs').textContent = 'STEP 0' + (s + 1) + ' · ' + STEPS[s];
    $('ck-qt').textContent = t;
    $('ck-opts').innerHTML = OPT.map(function (o, k) {
      return '<button class="ck-opt' + (ans[i] === o[1] ? ' sel' : '') + '" type="button" data-v="' + o[1] + '"><b>' + SYM[k] + '</b>' + o[0] + '</button>';
    }).join('');
    $('ck-back').style.visibility = i ? 'visible' : 'hidden';
    var f = $('ck-opts').querySelector('.ck-opt'); if (f) f.focus({ preventScroll: true });
  }
  $('ck-opts').addEventListener('click', function (e) {
    var b = e.target.closest('.ck-opt'); if (!b) return;
    ans[i] = +b.getAttribute('data-v');
    var os = $('ck-opts').children; for (var k = 0; k < os.length; k++) os[k].classList.toggle('sel', os[k] === b);
    setTimeout(function () { if (i < Q.length - 1) { i++; render(); } else finish(); }, 220);
  });
  $('ck-back').addEventListener('click', function () { if (i > 0) { i--; render(); } });
  $('ck-start').addEventListener('click', function () { i = 0; show('ck-quiz'); render(); });
  $('ck-retry').addEventListener('click', function () { for (var k = 0; k < ans.length; k++) ans[k] = null; i = 0; show('ck-intro'); });
  function finish() {
    $('ck-pb').style.width = '100%';
    var sc = STEPS.map(function (_, k) { var a = 0; for (var j = 0; j < Q.length; j++) if (Q[j][0] === k) a += ans[j]; return a; });
    var low = 0; sc.forEach(function (v, k) { if (v < sc[low]) low = k; });
    var d = INFO[low], step = STEPS[low];
    $('ck-rstep').textContent = step; $('ck-rwhy').textContent = d.why;
    $('ck-rtitle').textContent = step + ' 단계에서 먼저 볼 것'; $('ck-rtip').textContent = d.tip;
    $('ck-rows').innerHTML = sc.map(function (v, k) {
      return '<li class="ck-row' + (k === low ? ' low' : '') + '"><span class="t">' + STEPS[k] + '</span><span class="ck-track"><span class="fill" data-w="' + (v / 4 * 100) + '"></span></span><span class="s">' + v + '/4</span></li>';
    }).join('');
    // 추천 영상: data/reels.json 의 해당 단계
    var r = null; for (var q = 0; q < D.reels.length; q++) if (D.reels[q]['단계'] === step) r = D.reels[q];
    var box = $('ck-rreel');
    if (r) {
      var ttl = '#' + r['노트번호'] + ' ' + r['제목'];
      box.innerHTML =
        '<a class="ck-reel" href="' + esc(r['영상']) + '" data-reel data-src="' + esc(r['영상']) + '" data-poster="' + esc(r['포스터']) + '" data-title="' + esc(ttl) + '" data-ig="' + esc(D.insta) + '" aria-haspopup="dialog">' +
        '<span class="ck-thumb"><img src="' + esc(r['포스터']) + '" alt="" width="54" height="96" loading="lazy"><span class="ck-play" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M5 3l8 5-8 5z" fill="#111"/></svg></span></span>' +
        '<span><small>30초 영상 · 연구소장 노트</small><strong>' + esc(ttl) + '</strong><em>영상 보기</em></span></a>' +
        '<p class="ck-links">' + (r['노트'] ? '<a href="' + esc(r['노트']) + '">전문 읽기 →</a>' : '') + '<a href="' + esc(D.insta) + '" target="_blank" rel="noopener">인스타그램에서 더 보기 →</a></p>';
    } else box.innerHTML = '';
    $('ck-toform').href = D.form + encodeURIComponent('자가점검-' + step);      // 유입 경로 칸 미리 채움
    show('ck-result'); $('ck-result').focus({ preventScroll: true });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      var fs = document.querySelectorAll('.ck-row .fill'); for (var k = 0; k < fs.length; k++) fs[k].style.width = fs[k].getAttribute('data-w') + '%';
    }); });
  }
})();
