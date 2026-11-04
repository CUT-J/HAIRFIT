(function(){
  var promptElement = document.getElementById('prompt');
  var text = promptElement ? promptElement.textContent : '';
  var view = document.getElementById('view');
  if (view) view.textContent = text;

  var note = document.getElementById('note');
  var btns = [document.getElementById('copyMain'), document.getElementById('copySub')].filter(Boolean);
  var labels = ['プロンプトをコピー', 'プロンプトをコピー'];
  var timer;

  function fallback(){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly','');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function show(ok){
    clearTimeout(timer);
    btns.forEach(function(b){
      b.classList.toggle('done', ok);
      b.textContent = ok ? 'コピーしました' : 'プロンプトをコピー';
    });
    if (note) note.textContent = ok
      ? '全文をコピーしました。AIチャットに貼り付けてください。'
      : 'コピーできませんでした。全文を表示して手動で選択してください。';
    timer = setTimeout(function(){
      btns.forEach(function(b){ b.classList.remove('done'); b.textContent = 'プロンプトをコピー'; });
      if (note) note.textContent = '';
    }, 3000);
  }

  function copy(){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ show(true); }, function(){ show(fallback()); });
    } else {
      show(fallback());
    }
  }

  btns.forEach(function(b){ b.addEventListener('click', copy); });

  var card = document.getElementById('card');
  var toggle = document.getElementById('toggle');
  if (card && toggle) {
    toggle.addEventListener('click', function(){
      var open = card.classList.toggle('open');
      toggle.textContent = open ? '閉じる' : '全文を表示する';
      toggle.setAttribute('aria-expanded', open);
    });
  }
})();


  // Gender switch for the Tier ranking
  var womenTab = document.getElementById('womenTab');
  var menTab = document.getElementById('menTab');
  var womenTiers = document.getElementById('womenTiers');
  var menTiers = document.getElementById('menTiers');

  function selectTierView(viewName) {
    var showWomen = viewName === 'women';
    if (!womenTab || !menTab || !womenTiers || !menTiers) return;
    womenTiers.hidden = !showWomen;
    menTiers.hidden = showWomen;
    womenTab.classList.toggle('active', showWomen);
    menTab.classList.toggle('active', !showWomen);
    womenTab.setAttribute('aria-selected', String(showWomen));
    menTab.setAttribute('aria-selected', String(!showWomen));
  }

  if (womenTab && menTab) {
    womenTab.addEventListener('click', function(){ selectTierView('women'); });
    menTab.addEventListener('click', function(){ selectTierView('men'); });
  }

  // Xシェア機能
var shareBtn = document.getElementById('shareX');
if (shareBtn) {
  shareBtn.addEventListener('click', function() {
    var text = encodeURIComponent("あなたに似合う髪型をAIが診断する「HAIR FIT」プロンプト✨\n髪質や顔立ちからTier表で提案してくれます！\n\n#HAIRFIT #AI髪型診断 #ChatGPT");
    var url = encodeURIComponent(window.location.href);
    var shareUrl = "https://x.com/intent/tweet?text=" + text + "&url=" + url;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
}