
(function(){
  var promptElement = document.getElementById('prompt');
  var text = promptElement ? promptElement.textContent : '';
  var view = document.getElementById('view');
  if (view) view.textContent = text;

  // GA4イベント送信
  function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  var note = document.getElementById('note');
  var btns = [
    document.getElementById('copyMain'),
    document.getElementById('copySub')
  ].filter(Boolean);

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
      btns.forEach(function(b){
        b.classList.remove('done');
        b.textContent = 'プロンプトをコピー';
      });
      if (note) note.textContent = '';
    }, 3000);
  }

  function copy(button){
    function done(ok) {
      if (ok) {
        var eventName = button.id === 'copyMain'
          ? 'prompt_copy_main'
          : 'prompt_copy_sub';

        trackEvent(eventName, {
          button_location: button.id
        });
      }
      show(ok);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function(){ done(true); },
        function(){ done(fallback()); }
      );
    } else {
      done(fallback());
    }
  }

  btns.forEach(function(b){
    b.addEventListener('click', function(){
      copy(b);
    });
  });

  // プロンプト全文の開閉
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
  womenTab.addEventListener('click', function(){
    selectTierView('women');
  });

  menTab.addEventListener('click', function(){
    selectTierView('men');
  });
}


// シェア機能（端末の共有メニューを開く）
(function () {
  var btn = document.getElementById('shareBtn');
  if (!btn) return;

  var note = document.getElementById('shareNote');
  var pageUrl = location.href.split('#')[0];

  var shareData = {
    title: 'HAIR FIT',
    text: 'あなたに似合う髪型をAIが診断する「HAIR FIT」プロンプト✨\n髪質や顔立ちからTier表で提案してくれます！\n#HAIRFIT #AI髪型診断 #ChatGPT',
    url: pageUrl
  };

  var timer;

  function say(msg) {
    clearTimeout(timer);
    note.textContent = msg;
    timer = setTimeout(function () {
      note.textContent = '';
    }, 3500);
  }

  function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = pageUrl;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();

    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}

    document.body.removeChild(ta);
    return ok;
  }

  function copyLink() {
    function done(ok) {
      say(ok
        ? 'リンクをコピーしました。好きなアプリに貼り付けてください。'
        : 'コピーできませんでした。'
      );
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pageUrl).then(
        function () { done(true); },
        function () { done(fallbackCopy()); }
      );
    } else {
      done(fallbackCopy());
    }
  }

  btn.addEventListener('click', function () {

    // GA4：シェアボタンのクリック
    if (typeof gtag === 'function') {
      gtag('event', 'share_click', {
        method: navigator.share ? 'native_share' : 'copy_link'
      });
    }

    if (navigator.share) {
      navigator.share(shareData).catch(function (err) {
        if (err && err.name !== 'AbortError') copyLink();
      });
    } else {
      copyLink();
    }
  });
})();

// GA4：ChatGPTを開くリンクのクリック計測
(function () {
  var chatgptLink = document.getElementById('chatgptLink');

  if (!chatgptLink) return;

  chatgptLink.addEventListener('click', function () {
    if (typeof gtag === 'function') {
      gtag('event', 'chatgpt_open', {
        link_url: chatgptLink.href,
        transport_type: 'beacon'
      });
    }
  });
})();