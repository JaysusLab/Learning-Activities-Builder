// ══════════════════════════════════════════════
// IMPORT ACTIVITY
// ══════════════════════════════════════════════

function openImportModal() {
  document.getElementById('importModal').classList.add('open');
  document.getElementById('importPaste').value = '';
  document.getElementById('importError').textContent = '';
  setTimeout(function () { document.getElementById('importPaste').focus(); }, 50);
}

function closeImportModal() {
  document.getElementById('importModal').classList.remove('open');
}

document.addEventListener('click', function (e) {
  if (e.target.id === 'importModal') closeImportModal();
});

// ── JSON extraction ──
// Counts braces to correctly extract the JSON object even with nested objects.
function extractJSON(script, varName) {
  var prefix = 'var ' + varName + '=';
  var idx = script.indexOf(prefix);
  if (idx === -1) return null;
  var start = idx + prefix.length;
  while (start < script.length && script[start] !== '{') start++;
  if (start >= script.length) return null;

  var depth = 0, inStr = false, escaped = false;
  for (var i = start; i < script.length; i++) {
    var ch = script[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inStr) { escaped = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return script.substring(start, i + 1); }
  }
  return null;
}

// ── Template detection ──
// Uses unique element IDs that are only present in each template's exported HTML.
function detectTemplate(html) {
  if (html.indexOf('id="slidesContainer"') !== -1) return 'steps';
  if (html.indexOf('id="cardsContainer"') !== -1) return 'cards';
  if (html.indexOf('id="timelineSteps"') !== -1) return 'timeline';
  if (html.indexOf('id="accordionContainer"') !== -1) return 'accordion';
  return null;
}

// ── Theme / background helpers ──
var IMPORT_THEME_MAP = { '#5564FF': 'blue', '#FF8FB3': 'pink', '#00985B': 'green', '#FFCB11': 'yellow' };
var IMPORT_BG_SWATCHES = ['#EBEBEB', '#D4D4D4', '#9E9E9E'];

function importApplyTheme(primary, prefix) {
  var name = IMPORT_THEME_MAP[primary] || 'blue';
  if (prefix === 's') selectStepsTheme(name);
  else if (prefix === 'c') selectCardsTheme(name);
  else if (prefix === 't') selectTimelineTheme(name);
  else if (prefix === 'a') selectAccordionTheme(name);
}

function importApplyBg(hex, prefix) {
  if (!hex) return;
  var known = IMPORT_BG_SWATCHES.map(function (c) { return c.toUpperCase(); });
  var upper = hex.toUpperCase();
  if (prefix === 's') {
    if (known.indexOf(upper) !== -1) { selectStepsBg(hex); }
    else { selectedStepsBg = hex; document.getElementById('stepsPreview').style.background = hex; document.getElementById('s_bgCustom').value = hex; }
  } else if (prefix === 'c') {
    if (known.indexOf(upper) !== -1) { selectCardsBg(hex); }
    else { selectedCardsBg = hex; document.getElementById('cardsPreview').style.background = hex; document.getElementById('c_bgCustom').value = hex; }
  } else if (prefix === 't') {
    if (known.indexOf(upper) !== -1) { selectTimelineBg(hex); }
    else { selectedTimelineBg = hex; document.getElementById('timelinePreview').style.background = hex; document.getElementById('t_bgCustom').value = hex; }
  } else if (prefix === 'a') {
    if (known.indexOf(upper) !== -1) { selectAccordionBg(hex); }
    else { selectedAccordionBg = hex; document.getElementById('accordionPreview').style.background = hex; document.getElementById('a_bgCustom').value = hex; }
  }
}

// ── Field helpers ──
function importSetToggle(id, checked) {
  var el = document.getElementById(id);
  if (el) el.checked = !!checked;
}
function importSetVal(id, val) {
  var el = document.getElementById(id);
  if (el) el.value = (val !== undefined && val !== null) ? String(val) : '';
}
function importSetVisible(id, show) {
  var el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

// ── Populate: Use Case / Steps ──
function importPopulateSteps(data) {
  // Activity title
  importSetToggle('s_showActivityTitle', data.showActivityTitle);
  importSetVal('s_activityTitle', data.activityTitle);
  importSetVisible('s-title-section', data.showActivityTitle);

  // Character
  importSetToggle('s_charToggle', data.showCharacter);
  importSetVisible('s-char-section', data.showCharacter);
  if (data.character) {
    importSetVal('s_charImage', data.character.image && data.character.image.source);
    importSetVal('s_charAlt', data.character.image && data.character.image.altText);
    importSetVal('s_charPlaceholder', data.character.placeholderText);
  }

  // Introduction slide
  var introSlide = (data.slides || []).find(function (s) { return s.type === 'introduction'; });
  importSetToggle('s_introToggle', !!introSlide);
  importSetVisible('s-intro-section', !!introSlide);
  if (introSlide) {
    var showIntroTitle = introSlide.showTitle !== false;
    importSetToggle('s_introTitleToggle', showIntroTitle);
    importSetVal('s_introTitle', introSlide.title);
    var introTitleInput = document.getElementById('s_introTitle');
    if (introTitleInput) introTitleInput.style.display = showIntroTitle ? '' : 'none';
    importSetVal('s_introContent', introSlide.content);
  }

  // Steps
  var stepSlides = (data.slides || []).filter(function (s) { return s.type === 'step'; });
  var hasSteps = stepSlides.length > 0;
  importSetToggle('s_stepsToggle', hasSteps);
  importSetVisible('s-acc-steps', hasSteps);
  importSetVisible('s-acc-nav', hasSteps);

  steps.length = 0;
  stepSlides.forEach(function (s, i) {
    steps.push({
      stepNumber: String(i + 1).padStart(2, '0'),
      title: s.title || '',
      showTitle: s.showTitle !== false,
      content: s.content || ''
    });
  });

  // Step counter + badge label
  importSetToggle('s_stepTextToggle', data.showStepCounter !== false);
  importSetVal('s_stepBadgeLabel', data.stepBadgeLabel || 'STEP');

  // Navigation labels
  if (data.navigation) {
    importSetVal('s_navPrev', data.navigation.previousButtonText);
    importSetVal('s_navNext', data.navigation.nextButtonText);
    importSetVal('s_navComplete', data.navigation.completeButtonText);
    if (data.navigation.progressLabels) {
      importSetVal('s_navIntro', data.navigation.progressLabels.introduction);
    }
  }

  // Theme & background
  if (data.theme) importApplyTheme(data.theme.primary, 's');
  importApplyBg(data.backgroundColor, 's');

  renderSteps();
  renderStepsPreview();
}

// ── Populate: Card Interaction ──
function importPopulateCards(data) {
  var settings = data.settings || {};

  // Activity title
  importSetToggle('c_showActivityTitle', data.showActivityTitle);
  importSetVal('c_activityTitle', data.title);
  importSetVisible('c-title-section', data.showActivityTitle);

  // Speech bubble
  importSetToggle('c_showSpeechBubble', data.showSpeechBubble);
  importSetVisible('c-bubble-section', data.showSpeechBubble);
  importSetVal('c_bubbleText', data.speechBubble);
  importSetVal('c_bubbleTimeout', settings.speechBubbleTimeout || 8000);

  // Toggles
  importSetToggle('c_expandedByDefault', settings.expandedByDefault);
  importSetToggle('c_showIntroParagraph', data.showIntroParagraph);
  importSetVisible('c-intro-section', data.showIntroParagraph);
  importSetVal('c_introParagraph', data.introParagraph);
  importSetToggle('c_horizontalLayout', settings.horizontalLayout);

  // Cards array
  cards.length = 0;
  (data.cards || []).forEach(function (c) {
    cards.push({ title: c.title || '', showTitle: c.showTitle !== false, content: c.content || '' });
  });

  // Theme & background
  if (data.theme) importApplyTheme(data.theme.primary, 'c');
  importApplyBg(data.backgroundColor, 'c');

  renderCards();
  renderCardsPreview();
}

// ── Populate: Vertical Steps / Timeline ──
function importPopulateTimeline(data) {
  // Activity title
  importSetToggle('t_showActivityTitle', data.showActivityTitle);
  importSetVal('t_activityTitle', data.title);
  importSetVisible('t-title-section', data.showActivityTitle);

  // Speech bubble text
  importSetVal('t_speechBubble', data.speechBubbleText);

  // Navigation
  importSetVal('t_navNext', data.navigation && data.navigation.next);

  // Steps array
  timelineSteps.length = 0;
  (data.steps || []).forEach(function (s) {
    timelineSteps.push({ title: s.title || '', description: s.description || '' });
  });

  // Theme & background
  if (data.theme) importApplyTheme(data.theme.primary, 't');
  importApplyBg(data.backgroundColor, 't');

  renderTimeline();
  renderTimelinePreview();
}

// ── Populate: Accordion ──
function importPopulateAccordion(data) {
  var settings = data.settings || {};

  // Activity title
  importSetToggle('a_showActivityTitle', data.showActivityTitle);
  importSetVal('a_activityTitle', data.title);
  importSetVisible('a-title-section', data.showActivityTitle);

  // Speech bubble
  importSetToggle('a_showSpeechBubble', data.showSpeechBubble);
  importSetVisible('a-bubble-section', data.showSpeechBubble);
  importSetVal('a_bubbleText', data.speechBubble);
  importSetVal('a_bubbleTimeout', settings.speechBubbleTimeout || 8000);

  // Intro paragraph
  importSetToggle('a_showIntroParagraph', data.showIntroParagraph);
  importSetVisible('a-intro-section', data.showIntroParagraph);
  importSetVal('a_introParagraph', data.introParagraph);

  // Toggles
  importSetToggle('a_allowMultiple', settings.allowMultiple);
  importSetToggle('a_firstItemOpen', settings.firstItemOpen);

  // Items array
  accordionItems.length = 0;
  (data.items || []).forEach(function (item) {
    accordionItems.push({ title: item.title || '', content: item.content || '' });
  });

  // Theme & background
  if (data.theme) importApplyTheme(data.theme.primary, 'a');
  importApplyBg(data.backgroundColor, 'a');

  renderAccordion();
  renderAccordionPreview();
}

// ── Main import handler ──
function handleImport() {
  var html = document.getElementById('importPaste').value.trim();
  var errEl = document.getElementById('importError');
  errEl.textContent = '';

  if (!html) {
    errEl.textContent = 'Please paste your exported HTML first.';
    return;
  }

  var template = detectTemplate(html);
  if (!template) {
    errEl.textContent = 'Could not identify the activity template. Paste the complete exported HTML.';
    return;
  }

  var scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    errEl.textContent = 'Could not find the embedded script block in the HTML.';
    return;
  }
  var script = scriptMatch[1];

  var jsonStr, data;
  try {
    jsonStr = extractJSON(script, template === 'steps' ? 'D' : 'DATA');
    if (!jsonStr) throw new Error('no match');
    data = JSON.parse(jsonStr);
  } catch (e) {
    errEl.textContent = 'Could not parse the embedded data. The HTML may be from an incompatible version.';
    return;
  }

  closeImportModal();

  if (template === 'steps') {
    importPopulateSteps(data);
    switchTab('steps');
  } else if (template === 'cards') {
    importPopulateCards(data);
    switchTab('cards');
  } else if (template === 'timeline') {
    importPopulateTimeline(data);
    switchTab('timeline');
  } else {
    importPopulateAccordion(data);
    switchTab('accordion');
  }

  showToast('Activity imported');
}
