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
  { title: 'Card Title 1', content: 'This is the expandable content for the first card. Add your learning content here.' },
  { title: 'Card Title 2', content: 'This is the expandable content for the second card. Add your learning content here.' },
  { title: 'Card Title 3', content: 'This is the expandable content for the third card. Add your learning content here.' },
  { title: 'Card Title 4', content: 'This is the expandable content for the fourth card. Add your learning content here.' }
];

// ── Render editor cards ──
function renderCards() {
  var container = document.getElementById('c_cardsContainer');
  container.innerHTML = '';
  cards.forEach(function (card, i) {
    var el = document.createElement('div');
    el.className = 'step-card';
    el.innerHTML =
      '<div class="step-card-header">' +
        '<span class="step-card-label">Card ' + (i + 1) + '</span>' +
        '<button class="step-remove" onclick="removeCard(' + i + ')" title="Remove">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="field"><label>Card title</label>' +
        '<input type="text" value="' + esc(card.title) + '" oninput="updateCard(' + i + ',\'title\',this.value)">' +
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

function updateCard(i, key, val) {
  cards[i][key] = val;
  refreshCards();
}

function addCard() {
  if (cards.length >= 9) return;
  cards.push({ title: '', content: '' });
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

// ── Build JSON data ──
function buildCardsData() {
  return {
    title: v('c_activityTitle'),
    speechBubble: v('c_bubbleText'),
    settings: { speechBubbleTimeout: parseInt(v('c_bubbleTimeout')) || 8000 },
    theme: CARDS_THEMES[selectedCardsTheme] || CARDS_THEMES.blue,
    backgroundColor: selectedCardsBg,
    cards: cards.map(function (c, i) {
      return { id: i, number: i + 1, title: c.title, content: c.content };
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

  var bubble = document.createElement('div');
  bubble.className = 'cpv-bubble';
  bubble.textContent = data.speechBubble;
  wrapper.appendChild(bubble);

  var box = document.createElement('div');
  box.className = 'cpv-container';
  var cardList = document.createElement('div');
  cardList.className = 'cpv-cards';

  data.cards.forEach(function (card, i) {
    var num = String(card.number || i + 1).padStart(2, '0');
    var cardEl = document.createElement('div');
    cardEl.className = 'cpv-card';

    var header = document.createElement('div');
    header.className = 'cpv-card-header';
    header.innerHTML = '<span class="cpv-card-num">' + num + '</span><span class="cpv-card-title">' + escT(card.title) + '</span>';

    var icon = document.createElement('span');
    icon.className = 'cpv-card-icon';
    icon.innerHTML = '&#8250;';

    var body = document.createElement('div');
    body.className = 'cpv-card-body';
    body.textContent = card.content;

    cardEl.appendChild(header);
    cardEl.appendChild(icon);
    cardEl.appendChild(body);
    cardList.appendChild(cardEl);

    cardEl.addEventListener('click', function () {
      var isOpen = cardEl.classList.contains('open');
      cardList.querySelectorAll('.cpv-card').forEach(function (c) { c.classList.remove('open'); });
      if (!isOpen) cardEl.classList.add('open');
      bubble.classList.add('hidden');
    });
  });

  var timeout = (data.settings && data.settings.speechBubbleTimeout) || 8000;
  setTimeout(function () { bubble.classList.add('hidden'); }, timeout);

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
function downloadCardsJSON() {
  var blob = new Blob([JSON.stringify(buildCardsData(), null, 2)], { type: 'application/json' });
  triggerDownload(blob, 'data_learningactivity.json');
  showToast('data_learningactivity.json downloaded');
}

function downloadCardsHTML() {
  var blob = new Blob([buildCardsHTML(buildCardsData())], { type: 'text/html' });
  triggerDownload(blob, 'index.html');
  showToast('index.html downloaded');
}

function downloadCardsZIP() {
  var data = buildCardsData();
  var zip = new JSZip();
  zip.file('index.html', buildCardsHTML(data));
  zip.file('data_learningactivity.json', JSON.stringify(data, null, 2));
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    triggerDownload(blob, 'rise-activity-cards.zip');
    showToast('rise-activity-cards.zip downloaded');
  });
}
