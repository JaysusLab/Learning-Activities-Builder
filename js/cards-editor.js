// ══════════════════════════════════════════════
// TAB 2 — CARD INTERACTION: Editor Logic
// ══════════════════════════════════════════════

var CARDS_THEMES = {
  blue:   { primary: '#5564FF', accent: '#DDE0FF' },
  pink:   { primary: '#FF8FB3', accent: '#FFE9F0' },
  green:  { primary: '#00985B', accent: '#B7FFE2' },
  yellow: { primary: '#FFCB11', accent: '#FFF5CF' }
};
var selectedCardsTheme = 'blue';
var selectedCardsBg = '#EBEBEB';

function selectCardsBg(hex) {
  selectedCardsBg = hex;
  document.querySelectorAll('[id^="c-bg-"]').forEach(function (el) {
    el.classList.toggle('selected', el.dataset.color === hex);
  });
  document.getElementById('c_bgCustom').value = '';
  document.getElementById('cardsPreview').style.background = hex;
}

function applyCustomCardsBg(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    selectedCardsBg = val;
    document.querySelectorAll('[id^="c-bg-"]').forEach(function (el) { el.classList.remove('selected'); });
    document.getElementById('cardsPreview').style.background = val;
  }
}

function selectCardsTheme(name) {
  selectedCardsTheme = name;
  document.querySelectorAll('[id^="c-swatch-"]').forEach(function (el) {
    el.classList.toggle('selected', el.id === 'c-swatch-' + name);
  });
  refreshCards();
}

var cards = [
  { title: 'Card Title 1', showTitle: true, content: 'This is the expandable content for the first card. Add your learning content here.' },
  { title: 'Card Title 2', showTitle: true, content: 'This is the expandable content for the second card. Add your learning content here.' },
  { title: 'Card Title 3', showTitle: true, content: 'This is the expandable content for the third card. Add your learning content here.' },
  { title: 'Card Title 4', showTitle: true, content: 'This is the expandable content for the fourth card. Add your learning content here.' }
];

// ── Render editor cards ──
function renderCards() {
  var container = document.getElementById('c_cardsContainer');
  container.innerHTML = '';
  cards.forEach(function (card, i) {
    var titleChecked = card.showTitle !== false ? 'checked' : '';
    var titleInputStyle = card.showTitle !== false ? '' : 'style="display:none"';
    var el = document.createElement('div');
    el.className = 'step-card';
    el.innerHTML =
      '<div class="step-card-header">' +
        '<span class="step-card-label">Card ' + (i + 1) + '</span>' +
        '<button class="step-remove" onclick="removeCard(' + i + ')" title="Remove">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="field">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
          '<label style="margin-bottom:0">Card title</label>' +
          '<label class="toggle-switch">' +
            '<input type="checkbox" ' + titleChecked + ' onchange="toggleCardTitle(' + i + ',this.checked)">' +
            '<div class="toggle-track"></div>' +
          '</label>' +
        '</div>' +
        '<input type="text" value="' + esc(card.title) + '" ' + titleInputStyle + ' oninput="updateCard(' + i + ',\'title\',this.value)">' +
      '</div>' +
      '<div class="field"><label>Card content (shown on expand)</label>' +
        '<textarea oninput="updateCard(' + i + ',\'content\',this.value)">' + escT(card.content) + '</textarea>' +
      '</div>';
    container.appendChild(el);
  });
  document.getElementById('c_addCardBtn').style.display = cards.length >= 9 ? 'none' : 'flex';
  document.getElementById('c_cardLimitNote').style.display = cards.length >= 9 ? 'block' : 'none';
  var badge = document.getElementById('c_cardCountBadge');
  if (badge) badge.textContent = cards.length + (cards.length === 1 ? ' card' : ' cards');
}

function toggleCardTitle(i, checked) {
  cards[i].showTitle = checked;
  var cardEls = document.querySelectorAll('#c_cardsContainer .step-card');
  if (cardEls[i]) {
    var input = cardEls[i].querySelector('input[type="text"]');
    if (input) input.style.display = checked ? '' : 'none';
  }
  refreshCards();
}

function updateCard(i, key, val) {
  cards[i][key] = val;
  refreshCards();
}

function addCard() {
  if (cards.length >= 9) return;
  cards.push({ title: '', showTitle: true, content: '' });
  renderCards();
  refreshCards();
  setTimeout(function () {
    var els = document.querySelectorAll('#c_cardsContainer .step-card');
    if (els.length) els[els.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function removeCard(i) {
  if (cards.length <= 1) return;
  cards.splice(i, 1);
  renderCards();
  refreshCards();
}

function toggleCardsActivityTitle() {
  var show = document.getElementById('c_showActivityTitle').checked;
  document.getElementById('c-title-section').style.display = show ? 'block' : 'none';
  refreshCards();
}

function toggleCardsSpeechBubble() {
  var show = document.getElementById('c_showSpeechBubble').checked;
  document.getElementById('c-bubble-section').style.display = show ? 'block' : 'none';
  refreshCards();
}

function toggleCardsIntroParagraph() {
  var show = document.getElementById('c_showIntroParagraph').checked;
  document.getElementById('c-intro-section').style.display = show ? 'block' : 'none';
  refreshCards();
}

// ── Build JSON data ──
function getExpandedByDefault() {
  var el = document.getElementById('c_expandedByDefault');
  return el ? el.checked : false;
}

function buildCardsData() {
  var showSpeechBubble = document.getElementById('c_showSpeechBubble') ? document.getElementById('c_showSpeechBubble').checked : false;
  var showActivityTitle = document.getElementById('c_showActivityTitle') ? document.getElementById('c_showActivityTitle').checked : false;
  var showIntroParagraph = document.getElementById('c_showIntroParagraph') ? document.getElementById('c_showIntroParagraph').checked : false;
  var horizontalLayout = document.getElementById('c_horizontalLayout') ? document.getElementById('c_horizontalLayout').checked : false;
  return {
    title: v('c_activityTitle'),
    showActivityTitle: showActivityTitle,
    showSpeechBubble: showSpeechBubble,
    speechBubble: v('c_bubbleText'),
    showIntroParagraph: showIntroParagraph,
    introParagraph: v('c_introParagraph'),
    settings: { speechBubbleTimeout: parseInt(v('c_bubbleTimeout')) || 8000, expandedByDefault: getExpandedByDefault(), horizontalLayout: horizontalLayout },
    theme: CARDS_THEMES[selectedCardsTheme] || CARDS_THEMES.blue,
    backgroundColor: selectedCardsBg,
    cards: cards.map(function (c, i) {
      return { id: i, number: i + 1, title: c.title, showTitle: c.showTitle !== false, content: c.content };
    })
  };
}

// ── Live preview ──
function renderCardsPreview() {
  var data = buildCardsData();
  var container = document.getElementById('cardsPreview');
  container.innerHTML = '';

  var theme = CARDS_THEMES[selectedCardsTheme] || CARDS_THEMES.blue;

  var wrapper = document.createElement('div');
  wrapper.className = 'cpv-wrapper';
  wrapper.style.setProperty('--cpv-primary', theme.primary);
  wrapper.style.setProperty('--cpv-accent', theme.accent);

  if (data.showActivityTitle) {
    var titleEl = document.createElement('div');
    titleEl.className = 'cpv-title';
    titleEl.textContent = data.title;
    wrapper.appendChild(titleEl);
  }

  var bubble = null;
  if (data.showSpeechBubble) {
    bubble = document.createElement('div');
    bubble.className = 'cpv-bubble';
    bubble.textContent = data.speechBubble;
    wrapper.appendChild(bubble);
  }

  var box = document.createElement('div');
  box.className = 'cpv-container';

  var expandedByDefault = (data.settings && data.settings.expandedByDefault) || false;
  var horizontalLayout = (data.settings && data.settings.horizontalLayout) || false;

  if (data.showIntroParagraph && data.introParagraph) {
    var introEl = document.createElement('p');
    introEl.className = 'cpv-intro';
    introEl.textContent = data.introParagraph;
    box.appendChild(introEl);
  }

  var cardList = document.createElement('div');
  var cardListClasses = 'cpv-cards';
  if (expandedByDefault) cardListClasses += ' cpv-cards--expanded';
  if (horizontalLayout) cardListClasses += ' cpv-cards--horizontal';
  cardList.className = cardListClasses;

  data.cards.forEach(function (card, i) {
    var num = String(card.number || i + 1).padStart(2, '0');
    var noTitle = card.showTitle === false;
    var cardEl = document.createElement('div');
    cardEl.className = 'cpv-card' + (expandedByDefault ? ' open' : '') + (noTitle ? ' no-title' : '');

    var header = document.createElement('div');
    header.className = 'cpv-card-header';
    var titleHtml = noTitle ? '' : '<span class="cpv-card-title">' + escT(card.title) + '</span>';
    header.innerHTML = '<span class="cpv-card-num">' + num + '</span>' + titleHtml;

    var body = document.createElement('div');
    body.className = 'cpv-card-body';
    body.textContent = card.content;

    cardEl.appendChild(header);
    if (!expandedByDefault) {
      var icon = document.createElement('span');
      icon.className = 'cpv-card-icon';
      icon.innerHTML = '&#8250;';
      cardEl.appendChild(icon);
    }
    cardEl.appendChild(body);
    cardList.appendChild(cardEl);

    cardEl.addEventListener('click', function () {
      if (expandedByDefault) { if (bubble) bubble.classList.add('hidden'); return; }
      var isOpen = cardEl.classList.contains('open');
      cardList.querySelectorAll('.cpv-card').forEach(function (c) { c.classList.remove('open'); });
      if (!isOpen) cardEl.classList.add('open');
      if (bubble) bubble.classList.add('hidden');
    });
  });

  if (bubble) {
    var timeout = (data.settings && data.settings.speechBubbleTimeout) || 8000;
    setTimeout(function () { bubble.classList.add('hidden'); }, timeout);
  }

  box.appendChild(cardList);
  wrapper.appendChild(box);
  container.appendChild(wrapper);
}

// ── Debounced refresh ──
var cardsTimer = null;
function refreshCards() {
  clearTimeout(cardsTimer);
  cardsTimer = setTimeout(renderCardsPreview, 300);
}

// ── Downloads ──
function downloadCardsHTML() {
  var blob = new Blob([buildCardsHTML(buildCardsData())], { type: 'text/html' });
  triggerDownload(blob, 'index.html');
  showToast('index.html downloaded');
}

function copyCardsCode() {
  copyToClipboard(buildCardsHTML(buildCardsData()));
}
