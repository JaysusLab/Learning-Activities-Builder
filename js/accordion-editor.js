// ══════════════════════════════════════════════
// TAB 4 — ACCORDION: Editor Logic
// ══════════════════════════════════════════════

var ACCORDION_THEMES = {
  blue:   { primary: '#5564FF', accent: '#DDE0FF' },
  pink:   { primary: '#FF8FB3', accent: '#FFE9F0' },
  green:  { primary: '#00985B', accent: '#B7FFE2' },
  yellow: { primary: '#FFCB11', accent: '#FFF5CF' }
};
var selectedAccordionTheme = 'blue';
var selectedAccordionBg = '#EBEBEB';

function selectAccordionBg(hex) {
  selectedAccordionBg = hex;
  document.querySelectorAll('[id^="a-bg-"]').forEach(function (el) {
    el.classList.toggle('selected', el.dataset.color === hex);
  });
  document.getElementById('a_bgCustom').value = '';
  document.getElementById('accordionPreview').style.background = hex;
}

function applyCustomAccordionBg(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    selectedAccordionBg = val;
    document.querySelectorAll('[id^="a-bg-"]').forEach(function (el) { el.classList.remove('selected'); });
    document.getElementById('accordionPreview').style.background = val;
  }
}

function selectAccordionTheme(name) {
  selectedAccordionTheme = name;
  document.querySelectorAll('[id^="a-swatch-"]').forEach(function (el) {
    el.classList.toggle('selected', el.id === 'a-swatch-' + name);
  });
  refreshAccordion();
}

var accordionItems = [
  { title: 'Section One',   content: 'This is the expandable content for the first section. Add your learning content here.' },
  { title: 'Section Two',   content: 'This is the expandable content for the second section. Add your learning content here.' },
  { title: 'Section Three', content: 'This is the expandable content for the third section. Add your learning content here.' }
];

// ── Render editor items ──
function renderAccordion() {
  var container = document.getElementById('a_itemsContainer');
  container.innerHTML = '';
  accordionItems.forEach(function (item, i) {
    var el = document.createElement('div');
    el.className = 'step-card';
    el.innerHTML =
      '<div class="step-card-header">' +
        '<span class="step-card-label">Item ' + (i + 1) + '</span>' +
        '<button class="step-remove" onclick="removeAccordionItem(' + i + ')" title="Remove">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="field">' +
        '<label>Header title</label>' +
        '<input type="text" value="' + esc(item.title) + '" oninput="updateAccordionItem(' + i + ',\'title\',this.value)">' +
      '</div>' +
      '<div class="field"><label>Body content</label>' +
        '<textarea oninput="updateAccordionItem(' + i + ',\'content\',this.value)">' + escT(item.content) + '</textarea>' +
      '</div>';
    container.appendChild(el);
  });
  document.getElementById('a_addItemBtn').style.display = accordionItems.length >= 12 ? 'none' : 'flex';
  document.getElementById('a_itemLimitNote').style.display = accordionItems.length >= 12 ? 'block' : 'none';
  var badge = document.getElementById('a_itemCountBadge');
  if (badge) badge.textContent = accordionItems.length + (accordionItems.length === 1 ? ' item' : ' items');
}

function updateAccordionItem(i, key, val) {
  accordionItems[i][key] = val;
  refreshAccordion();
}

function addAccordionItem() {
  if (accordionItems.length >= 12) return;
  accordionItems.push({ title: '', content: '' });
  renderAccordion();
  refreshAccordion();
  setTimeout(function () {
    var els = document.querySelectorAll('#a_itemsContainer .step-card');
    if (els.length) els[els.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function removeAccordionItem(i) {
  if (accordionItems.length <= 1) return;
  accordionItems.splice(i, 1);
  renderAccordion();
  refreshAccordion();
}

function toggleAccordionActivityTitle() {
  var show = document.getElementById('a_showActivityTitle').checked;
  document.getElementById('a-title-section').style.display = show ? 'block' : 'none';
  refreshAccordion();
}

function toggleAccordionIntroParagraph() {
  var show = document.getElementById('a_showIntroParagraph').checked;
  document.getElementById('a-intro-section').style.display = show ? 'block' : 'none';
  refreshAccordion();
}

function toggleAccordionSpeechBubble() {
  var show = document.getElementById('a_showSpeechBubble').checked;
  document.getElementById('a-bubble-section').style.display = show ? 'block' : 'none';
  refreshAccordion();
}

// ── Build JSON data ──
function buildAccordionData() {
  var showActivityTitle  = document.getElementById('a_showActivityTitle')  ? document.getElementById('a_showActivityTitle').checked  : false;
  var showIntroParagraph = document.getElementById('a_showIntroParagraph') ? document.getElementById('a_showIntroParagraph').checked : false;
  var showSpeechBubble   = document.getElementById('a_showSpeechBubble')   ? document.getElementById('a_showSpeechBubble').checked   : false;
  var allowMultiple      = document.getElementById('a_allowMultiple')      ? document.getElementById('a_allowMultiple').checked      : false;
  var firstItemOpen      = document.getElementById('a_firstItemOpen')      ? document.getElementById('a_firstItemOpen').checked      : false;
  return {
    title: v('a_activityTitle'),
    showActivityTitle: showActivityTitle,
    showSpeechBubble: showSpeechBubble,
    speechBubble: v('a_bubbleText'),
    showIntroParagraph: showIntroParagraph,
    introParagraph: v('a_introParagraph'),
    settings: { allowMultiple: allowMultiple, firstItemOpen: firstItemOpen, speechBubbleTimeout: parseInt(v('a_bubbleTimeout')) || 8000 },
    theme: ACCORDION_THEMES[selectedAccordionTheme] || ACCORDION_THEMES.blue,
    backgroundColor: selectedAccordionBg,
    items: accordionItems.map(function (item, i) {
      return { id: i, title: item.title, content: item.content };
    })
  };
}

// ── Live preview ──
function renderAccordionPreview() {
  var data = buildAccordionData();
  var container = document.getElementById('accordionPreview');
  container.innerHTML = '';

  var theme = ACCORDION_THEMES[selectedAccordionTheme] || ACCORDION_THEMES.blue;

  var wrapper = document.createElement('div');
  wrapper.className = 'apv-wrapper';
  wrapper.style.setProperty('--apv-primary', theme.primary);
  wrapper.style.setProperty('--apv-accent', theme.accent);

  if (data.showActivityTitle) {
    var titleEl = document.createElement('div');
    titleEl.className = 'apv-title';
    titleEl.textContent = data.title;
    wrapper.appendChild(titleEl);
  }

  var bubble = null;
  if (data.showSpeechBubble) {
    bubble = document.createElement('div');
    bubble.className = 'apv-bubble';
    bubble.textContent = data.speechBubble;
    wrapper.appendChild(bubble);
    var timeout = (data.settings && data.settings.speechBubbleTimeout) || 8000;
    setTimeout(function () { bubble.classList.add('hidden'); }, timeout);
  }

  var box = document.createElement('div');
  box.className = 'apv-container';

  if (data.showIntroParagraph && data.introParagraph) {
    var introEl = document.createElement('p');
    introEl.className = 'apv-intro';
    introEl.innerHTML = escTBr(data.introParagraph);
    box.appendChild(introEl);
  }

  var allowMultiple = (data.settings && data.settings.allowMultiple) || false;
  var firstItemOpen = (data.settings && data.settings.firstItemOpen) || false;

  var list = document.createElement('div');
  list.className = 'apv-list';

  data.items.forEach(function (item, i) {
    var isOpen = firstItemOpen && i === 0;
    var itemEl = document.createElement('div');
    itemEl.className = 'apv-item' + (isOpen ? ' open' : '');

    var header = document.createElement('div');
    header.className = 'apv-header';
    header.innerHTML =
      '<span class="apv-header-title">' + escT(item.title) + '</span>' +
      '<svg class="apv-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>';

    var body = document.createElement('div');
    body.className = 'apv-body';
    var inner = document.createElement('div');
    inner.className = 'apv-body-inner';
    inner.innerHTML = escTBr(item.content);
    body.appendChild(inner);

    itemEl.appendChild(header);
    itemEl.appendChild(body);
    list.appendChild(itemEl);

    itemEl.addEventListener('click', function () {
      if (bubble) bubble.classList.add('hidden');
      var wasOpen = itemEl.classList.contains('open');
      if (!allowMultiple) {
        list.querySelectorAll('.apv-item').forEach(function (x) { x.classList.remove('open'); });
      }
      if (!wasOpen) { itemEl.classList.add('open'); }
      else { itemEl.classList.remove('open'); }
    });
  });

  box.appendChild(list);
  wrapper.appendChild(box);
  container.appendChild(wrapper);
}

// ── Debounced refresh ──
var accordionTimer = null;
function refreshAccordion() {
  clearTimeout(accordionTimer);
  accordionTimer = setTimeout(renderAccordionPreview, 300);
}

// ── Downloads ──
function downloadAccordionHTML() {
  var blob = new Blob([buildAccordionHTML(buildAccordionData())], { type: 'text/html' });
  triggerDownload(blob, 'index.html');
  showToast('index.html downloaded');
}

function copyAccordionCode() {
  copyToClipboard(buildAccordionHTML(buildAccordionData()));
}
