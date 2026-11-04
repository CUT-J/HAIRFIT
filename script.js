(function(){
  var text = document.getElementById('prompt').textContent;
  document.getElementById('view').textContent = text;
  var note = document.getElementById('note');
  var btns = [document.getElementById('copyMain'), document.getElementById('copySub')];
  var labels = ['プロンプトをコピー', 'コピー'];
  var timer;

  function fallback(){
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly','');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    return ok;
  }
  function show(ok){
    clearTimeout(timer);
    btns.forEach(function(b,i){
      b.classList.toggle('done', ok);
      b.textContent = ok ? 'コピーしました' : labels[i];
    });
    note.textContent = ok ? '全文をコピーしました。AIチャットに貼り付けてください。' : 'コピーできませんでした。全文を表示して手動で選択してください。';
    timer = setTimeout(function(){
      btns.forEach(function(b,i){ b.classList.remove('done'); b.textContent = labels[i]; });
      note.textContent = '';
    }, 3000);
  }
  function copy(){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ show(true); }, function(){ show(fallback()); });
    } else { show(fallback()); }
  }
  btns.forEach(function(b){ b.addEventListener('click', copy); });

  var card = document.getElementById('card'), toggle = document.getElementById('toggle');
  toggle.addEventListener('click', function(){
    var open = card.classList.toggle('open');
    toggle.textContent = open ? '閉じる' : '全文を表示する';
    toggle.setAttribute('aria-expanded', open);
  });
})();
