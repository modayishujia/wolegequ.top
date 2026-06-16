(function(){
  var STORAGE_KEY = 'wolegequ_lang';
  var LANG_MAP = {
    'zh': 'index.html',
    'zh-CN': 'index.html',
    'zh-TW': 'index.html',
    'en': 'en.html',
    'de': 'de.html',
    'ja': 'ja.html',
    'pt': 'pt.html',
    'pt-BR': 'pt.html',
    'pt-PT': 'pt.html'
  };
  var DEFAULT = 'index.html';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var current = location.pathname.split('/').pop() || 'index.html';
  var saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) return;

  var browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
  var target = LANG_MAP[browserLang] || LANG_MAP[navigator.language] || DEFAULT;

  if (target !== current) {
    sessionStorage.setItem(STORAGE_KEY, current);
    location.replace(target);
  }
})();
