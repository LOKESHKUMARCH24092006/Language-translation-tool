/* =============================================
   LINGUAFLOW — App Logic (app.js)
   Uses MyMemory Free Translation API
   (No API key required, up to 5000 chars/day free)
   ============================================= */
'use strict';
/* ── Language Definitions ── */
const LANGUAGES = [
  { code: 'auto',  name: '🔍 Detect Language' },
  { code: 'af',    name: '🇿🇦 Afrikaans' },
  { code: 'sq',    name: '🇦🇱 Albanian' },
  { code: 'am',    name: '🇪🇹 Amharic' },
  { code: 'ar',    name: '🇸🇦 Arabic' },
  { code: 'hy',    name: '🇦🇲 Armenian' },
  { code: 'az',    name: '🇦🇿 Azerbaijani' },
  { code: 'eu',    name: '🌍 Basque' },
  { code: 'be',    name: '🇧🇾 Belarusian' },
  { code: 'bn',    name: '🇧🇩 Bengali' },
  { code: 'bs',    name: '🇧🇦 Bosnian' },
  { code: 'bg',    name: '🇧🇬 Bulgarian' },
  { code: 'ca',    name: '🌍 Catalan' },
  { code: 'ceb',   name: '🇵🇭 Cebuano' },
  { code: 'zh-CN', name: '🇨🇳 Chinese (Simplified)' },
  { code: 'zh-TW', name: '🇹🇼 Chinese (Traditional)' },
  { code: 'co',    name: '🌍 Corsican' },
  { code: 'hr',    name: '🇭🇷 Croatian' },
  { code: 'cs',    name: '🇨🇿 Czech' },
  { code: 'da',    name: '🇩🇰 Danish' },
  { code: 'nl',    name: '🇳🇱 Dutch' },
  { code: 'en',    name: '🇬🇧 English' },
  { code: 'eo',    name: '🌍 Esperanto' },
  { code: 'et',    name: '🇪🇪 Estonian' },
  { code: 'fi',    name: '🇫🇮 Finnish' },
  { code: 'fr',    name: '🇫🇷 French' },
  { code: 'fy',    name: '🌍 Frisian' },
  { code: 'gl',    name: '🌍 Galician' },
  { code: 'ka',    name: '🇬🇪 Georgian' },
  { code: 'de',    name: '🇩🇪 German' },
  { code: 'el',    name: '🇬🇷 Greek' },
  { code: 'gu',    name: '🇮🇳 Gujarati' },
  { code: 'ht',    name: '🇭🇹 Haitian Creole' },
  { code: 'ha',    name: '🌍 Hausa' },
  { code: 'haw',   name: '🌺 Hawaiian' },
  { code: 'he',    name: '🇮🇱 Hebrew' },
  { code: 'hi',    name: '🇮🇳 Hindi' },
  { code: 'hmn',   name: '🌍 Hmong' },
  { code: 'hu',    name: '🇭🇺 Hungarian' },
  { code: 'is',    name: '🇮🇸 Icelandic' },
  { code: 'ig',    name: '🌍 Igbo' },
  { code: 'id',    name: '🇮🇩 Indonesian' },
  { code: 'ga',    name: '🇮🇪 Irish' },
  { code: 'it',    name: '🇮🇹 Italian' },
  { code: 'ja',    name: '🇯🇵 Japanese' },
  { code: 'jv',    name: '🇮🇩 Javanese' },
  { code: 'kn',    name: '🇮🇳 Kannada' },
  { code: 'kk',    name: '🇰🇿 Kazakh' },
  { code: 'km',    name: '🇰🇭 Khmer' },
  { code: 'ko',    name: '🇰🇷 Korean' },
  { code: 'ku',    name: '🌍 Kurdish' },
  { code: 'ky',    name: '🇰🇬 Kyrgyz' },
  { code: 'lo',    name: '🇱🇦 Lao' },
  { code: 'la',    name: '🌍 Latin' },
  { code: 'lv',    name: '🇱🇻 Latvian' },
  { code: 'lt',    name: '🇱🇹 Lithuanian' },
  { code: 'lb',    name: '🇱🇺 Luxembourgish' },
  { code: 'mk',    name: '🇲🇰 Macedonian' },
  { code: 'mg',    name: '🇲🇬 Malagasy' },
  { code: 'ms',    name: '🇲🇾 Malay' },
  { code: 'ml',    name: '🇮🇳 Malayalam' },
  { code: 'mt',    name: '🇲🇹 Maltese' },
  { code: 'mi',    name: '🇳🇿 Maori' },
  { code: 'mr',    name: '🇮🇳 Marathi' },
  { code: 'mn',    name: '🇲🇳 Mongolian' },
  { code: 'my',    name: '🇲🇲 Myanmar (Burmese)' },
  { code: 'ne',    name: '🇳🇵 Nepali' },
  { code: 'no',    name: '🇳🇴 Norwegian' },
  { code: 'ny',    name: '🌍 Nyanja (Chichewa)' },
  { code: 'ps',    name: '🇦🇫 Pashto' },
  { code: 'fa',    name: '🇮🇷 Persian' },
  { code: 'pl',    name: '🇵🇱 Polish' },
  { code: 'pt',    name: '🇵🇹 Portuguese' },
  { code: 'pa',    name: '🇮🇳 Punjabi' },
  { code: 'ro',    name: '🇷🇴 Romanian' },
  { code: 'ru',    name: '🇷🇺 Russian' },
  { code: 'sm',    name: '🇼🇸 Samoan' },
  { code: 'gd',    name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scots Gaelic' },
  { code: 'sr',    name: '🇷🇸 Serbian' },
  { code: 'st',    name: '🌍 Sesotho' },
  { code: 'sn',    name: '🌍 Shona' },
  { code: 'sd',    name: '🇵🇰 Sindhi' },
  { code: 'si',    name: '🇱🇰 Sinhala' },
  { code: 'sk',    name: '🇸🇰 Slovak' },
  { code: 'sl',    name: '🇸🇮 Slovenian' },
  { code: 'so',    name: '🇸🇴 Somali' },
  { code: 'es',    name: '🇪🇸 Spanish' },
  { code: 'su',    name: '🌍 Sundanese' },
  { code: 'sw',    name: '🌍 Swahili' },
  { code: 'sv',    name: '🇸🇪 Swedish' },
  { code: 'tl',    name: '🇵🇭 Tagalog (Filipino)' },
  { code: 'tg',    name: '🇹🇯 Tajik' },
  { code: 'ta',    name: '🇮🇳 Tamil' },
  { code: 'te',    name: '🇮🇳 Telugu' },
  { code: 'th',    name: '🇹🇭 Thai' },
  { code: 'tr',    name: '🇹🇷 Turkish' },
  { code: 'uk',    name: '🇺🇦 Ukrainian' },
  { code: 'ur',    name: '🇵🇰 Urdu' },
  { code: 'uz',    name: '🇺🇿 Uzbek' },
  { code: 'vi',    name: '🇻🇳 Vietnamese' },
  { code: 'cy',    name: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh' },
  { code: 'xh',    name: '🌍 Xhosa' },
  { code: 'yi',    name: '🌍 Yiddish' },
  { code: 'yo',    name: '🌍 Yoruba' },
  { code: 'zu',    name: '🌍 Zulu' },
];
/* Quick-access languages shown as pills */
const QUICK_LANGS = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ko', name: 'Korean' },
];
/* ── DOM References ── */
const sourceLangEl   = document.getElementById('sourceLang');
const targetLangEl   = document.getElementById('targetLang');
const sourceTextEl   = document.getElementById('sourceText');
const outputAreaEl   = document.getElementById('outputArea');
const outputPHEl     = document.getElementById('outputPlaceholder');
const charCountEl    = document.getElementById('charCount');
const wordCountEl    = document.getElementById('wordCount');
const translateBtn   = document.getElementById('translateBtn');
const clearBtn       = document.getElementById('clearBtn');
const copyBtn        = document.getElementById('copyBtn');
const swapBtn        = document.getElementById('swapBtn');
const ttsSourceBtn   = document.getElementById('ttsSourceBtn');
const ttsTargetBtn   = document.getElementById('ttsTargetBtn');
const statusBar      = document.getElementById('statusBar');
const copyFeedback   = document.getElementById('copyFeedback');
const quickPillsEl   = document.getElementById('quickPills');
const btnLoader      = document.getElementById('btnLoader');
/* ── State ── */
let currentTranslation = '';
let isSpeaking = false;
let speakingUtterance = null;
let translateTimeout = null;
/* ── Populate Language Selects ── */
function buildSelects() {
  const makeOption = (lang, selectEl) => {
    const opt = document.createElement('option');
    opt.value = lang.code;
    opt.textContent = lang.name;
    selectEl.appendChild(opt);
  };
  LANGUAGES.forEach(lang => {
    // source: include "auto detect"
    makeOption(lang, sourceLangEl);
  });
  // target: skip "auto" option
  LANGUAGES.filter(l => l.code !== 'auto').forEach(lang => {
    makeOption(lang, targetLangEl);
  });
  // Defaults: English → Spanish
  sourceLangEl.value = 'en';
  targetLangEl.value = 'es';
}
/* ── Populate Quick Pills ── */
function buildPills() {
  QUICK_LANGS.forEach(lang => {
    const pill = document.createElement('button');
    pill.className = 'pill';
    pill.textContent = lang.name;
    pill.title = `Translate to ${lang.name}`;
    pill.setAttribute('aria-label', `Set target language to ${lang.name}`);
    pill.addEventListener('click', () => {
      targetLangEl.value = lang.code;
      highlightActivePill();
      if (sourceTextEl.value.trim()) triggerTranslate();
    });
    quickPillsEl.appendChild(pill);
  });
  highlightActivePill();
}
function highlightActivePill() {
  const targetCode = targetLangEl.value;
  quickPillsEl.querySelectorAll('.pill').forEach((pill, i) => {
    pill.classList.toggle('active', QUICK_LANGS[i]?.code === targetCode);
    if (QUICK_LANGS[i]?.code === targetCode) {
      pill.style.background = 'rgba(139,92,246,0.18)';
      pill.style.borderColor = 'rgba(139,92,246,0.5)';
      pill.style.color = '#a78bfa';
    } else {
      pill.style.background = '';
      pill.style.borderColor = '';
      pill.style.color = '';
    }
  });
}
/* ── Character Counter ── */
function updateCharCount() {
  const len = sourceTextEl.value.length;
  charCountEl.textContent = `${len.toLocaleString()} / 5,000`;
  charCountEl.className = 'char-count';
  if (len > 4500) charCountEl.classList.add('danger');
  else if (len > 3500) charCountEl.classList.add('warning');
}
/* ── Status Bar ── */
function showStatus(msg, type = 'error') {
  statusBar.textContent = msg;
  statusBar.className = `status-bar visible ${type}`;
}
function clearStatus() {
  statusBar.className = 'status-bar';
}
/* ── Skeleton Loading ── */
function showSkeleton() {
  outputAreaEl.innerHTML = `
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
  `;
  outputPHEl && (outputPHEl.style.display = 'none');
}
function clearOutput() {
  outputAreaEl.innerHTML = '';
  const ph = document.createElement('span');
  ph.className = 'placeholder-text';
  ph.id = 'outputPlaceholder';
  ph.textContent = 'Your translation will appear here…';
  outputAreaEl.appendChild(ph);
  currentTranslation = '';
  wordCountEl.textContent = '';
  copyBtn.disabled = true;
  ttsTargetBtn.disabled = true;
}
/* ── Translate ── */
async function translate() {
  const text = sourceTextEl.value.trim();
  if (!text) {
    clearOutput();
    return;
  }
  const sourceLang = sourceLangEl.value;
  const targetLang = targetLangEl.value;
  if (sourceLang !== 'auto' && sourceLang === targetLang) {
    showStatus('⚠️ Source and target languages are the same.', 'info');
    return;
  }
  clearStatus();
  showSkeleton();
  translateBtn.classList.add('loading');
  translateBtn.disabled = true;
  // Build lang pair for MyMemory API
  const langPair = sourceLang === 'auto'
    ? `|${targetLang}`
    : `${sourceLang}|${targetLang}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
  // Use AbortController for broad browser compatibility
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const status = Number(data.responseStatus);
    if (status === 200) {
      const translated = data.responseData?.translatedText;
      if (!translated) throw new Error('Empty response from translation API.');
      currentTranslation = translated;
      outputAreaEl.innerHTML = '';
      outputAreaEl.classList.add('animating');
      outputAreaEl.textContent = translated;
      setTimeout(() => outputAreaEl.classList.remove('animating'), 500);
      // Word count
      const words = translated.trim().split(/\s+/).filter(Boolean).length;
      wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      copyBtn.disabled = false;
      ttsTargetBtn.disabled = false;
      // Quota warning: API sets quotaFinished flag when limit is hit
      if (data.quotaFinished) {
        showStatus('⚠️ Daily quota reached. Try again tomorrow or use a shorter text.', 'info');
      }
    } else if (status === 429) {
      showStatus('⚠️ Daily quota reached. Try again tomorrow or use a shorter text.', 'info');
      clearOutput();
    } else {
      throw new Error(data.responseDetails || `Translation failed (status ${data.responseStatus})`);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    let message = '❌ Translation failed. ';
    if (err.name === 'AbortError') {
      message += 'Request timed out — please try again.';
    } else if (!navigator.onLine) {
      message += 'No internet connection detected.';
    } else {
      message += err.message || 'Unknown error.';
    }
    showStatus(message, 'error');
    outputAreaEl.innerHTML = '';
    const ph = document.createElement('span');
    ph.className = 'placeholder-text';
    ph.textContent = 'Translation unavailable.';
    outputAreaEl.appendChild(ph);
  } finally {
    translateBtn.classList.remove('loading');
    translateBtn.disabled = false;
  }
}
/* ── Auto-translate on typing (debounced) ── */
function triggerTranslate() {
  clearTimeout(translateTimeout);
  translateTimeout = setTimeout(translate, 800);
}
/* ── Copy to Clipboard ── */
async function copyTranslation() {
  if (!currentTranslation) return;
  try {
    await navigator.clipboard.writeText(currentTranslation);
    copyFeedback.classList.add('show');
    setTimeout(() => copyFeedback.classList.remove('show'), 2200);
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = currentTranslation;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyFeedback.classList.add('show');
    setTimeout(() => copyFeedback.classList.remove('show'), 2200);
  }
}
/* ── Text-to-Speech ── */
function speak(text, langCode, btn) {
  if (!('speechSynthesis' in window)) {
    showStatus('⚠️ Your browser does not support text-to-speech.', 'info');
    return;
  }
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.querySelectorAll('.icon-btn.speaking').forEach(b => b.classList.remove('speaking'));
    return;
  }
  if (!text.trim()) {
    showStatus('⚠️ Nothing to read aloud.', 'info');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  // Map language codes for SpeechSynthesis
  const ttsLangMap = {
    'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW',
    'auto': 'en-US',
  };
  utterance.lang = ttsLangMap[langCode] || langCode;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  isSpeaking = true;
  btn.classList.add('speaking');
  speakingUtterance = utterance;
  utterance.onend = () => {
    isSpeaking = false;
    btn.classList.remove('speaking');
  };
  utterance.onerror = () => {
    isSpeaking = false;
    btn.classList.remove('speaking');
  };
  window.speechSynthesis.speak(utterance);
}
/* ── Swap Languages ── */
function swapLanguages() {
  const srcLang = sourceLangEl.value;
  const tgtLang = targetLangEl.value;
  const srcText = sourceTextEl.value.trim();
  // Swap language codes (can't swap "auto detect")
  if (srcLang !== 'auto') {
    sourceLangEl.value = tgtLang;
    targetLangEl.value = srcLang;
  } else {
    targetLangEl.value = tgtLang;
  }
  // Swap text content
  if (currentTranslation && srcText) {
    sourceTextEl.value = currentTranslation;
    updateCharCount();
    clearOutput();
    triggerTranslate();
  } else if (srcText) {
    clearOutput();
    triggerTranslate();
  }
  highlightActivePill();
}
/* ── Event Listeners ── */
sourceTextEl.addEventListener('input', () => {
  updateCharCount();
  if (!sourceTextEl.value.trim()) {
    clearOutput();
    clearStatus();
    clearTimeout(translateTimeout);
  } else {
    triggerTranslate();
  }
});
sourceTextEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    clearTimeout(translateTimeout);
    translate();
  }
});
translateBtn.addEventListener('click', () => {
  clearTimeout(translateTimeout);
  translate();
});
clearBtn.addEventListener('click', () => {
  sourceTextEl.value = '';
  updateCharCount();
  clearOutput();
  clearStatus();
  clearTimeout(translateTimeout);
  sourceTextEl.focus();
});
copyBtn.addEventListener('click', copyTranslation);
swapBtn.addEventListener('click', swapLanguages);
ttsSourceBtn.addEventListener('click', () => {
  speak(sourceTextEl.value, sourceLangEl.value, ttsSourceBtn);
});
ttsTargetBtn.addEventListener('click', () => {
  speak(currentTranslation, targetLangEl.value, ttsTargetBtn);
});
sourceLangEl.addEventListener('change', () => {
  if (sourceTextEl.value.trim()) triggerTranslate();
});
targetLangEl.addEventListener('change', () => {
  highlightActivePill();
  if (sourceTextEl.value.trim()) triggerTranslate();
});
/* ── Init ── */
buildSelects();
buildPills();
updateCharCount();
