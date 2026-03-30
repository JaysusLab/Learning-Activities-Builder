// ══════════════════════════════════════════════
// TAB 3 — SETUP STEPS TIMELINE: Editor Logic
// ══════════════════════════════════════════════

var TIMELINE_THEMES = {
  blue:   { primary: '#5564FF', accent: '#DDE0FF' },
  pink:   { primary: '#FF8FB3', accent: '#FFE9F0' },
  green:  { primary: '#00985B', accent: '#B7FFE2' },
  yellow: { primary: '#FFCB11', accent: '#FFF5CF' }
};
var selectedTimelineTheme = 'green';
var selectedTimelineBg = '#D4D4D4';

function selectTimelineBg(hex) {
  selectedTimelineBg = hex;
  document.querySelectorAll('[id^="t-bg-"]').forEach(function (el) {
    el.classList.toggle('selected', el.dataset.color === hex);
  });
  document.getElementById('t_bgCustom').value = '';
  document.getElementById('timelinePreview').style.background = hex;
}

function applyCustomTimelineBg(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    selectedTimelineBg = val;
    document.querySelectorAll('[id^="t-bg-"]').forEach(function (el) { el.classList.remove('selected'); });
    document.getElementById('timelinePreview').style.background = val;
  }
}

function selectTimelineTheme(name) {
  selectedTimelineTheme = name;
  document.querySelectorAll('[id^="t-swatch-"]').forEach(function (el) {
    el.classList.toggle('selected', el.id === 't-swatch-' + name);
  });
  refreshTimeline();
}

var timelineSteps = [
  { title: 'Register Definition', description: 'This page allows administrators to configure how users interact with the Register grid, including which fields are available and how they interact with them. Here, data types are assigned for each field, and it is also established which are required and which are editable.' },
  { title: 'Accounts', description: 'This page allows administrators to establish all accounts required to support calculation logic and facilitate accurate result storage within the solution. These accounts play a vital role in categorizing calculated values - including personnel costs, bonuses, and merit increases - appropriately within plan tables.' },
  { title: 'Security', description: 'This page allows administrators to set access levels and permissions via platform security groups, offering detailed control over who can perform specific actions, access different pages, and view and edit data. Security is initially established by the read and read/write groups on the referenced Entity dimension and its members.' }
];

// ── Render editor step cards ──
function renderTimeline() {
  var container = document.getElementById('t_stepsContainer');
  container.innerHTML = '';
  timelineSteps.forEach(function (step, i) {
    var el = document.createElement('div');
    el.className = 'step-card';
    el.innerHTML =
      '<div class="step-card-header">' +
        '<span class="step-card-label">Step ' + (i + 1) + '</span>' +
        '<button class="step-remove" onclick="removeTimelineStep(' + i + ')" title="Remove">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="field"><label>Step title</label>' +
        '<input type="text" value="' + esc(step.title) + '" oninput="updateTimelineStep(' + i + ',\'title\',this.value)">' +
      '</div>' +
      '<div class="field"><label>Step description</label>' +
        '<textarea oninput="updateTimelineStep(' + i + ',\'description\',this.value)">' + escT(step.description) + '</textarea>' +
      '</div>';
    container.appendChild(el);
  });
  document.getElementById('t_addStepBtn').style.display = timelineSteps.length >= 9 ? 'none' : 'flex';
  document.getElementById('t_stepLimitNote').style.display = timelineSteps.length >= 9 ? 'block' : 'none';
  var badge = document.getElementById('t_stepCountBadge');
  if (badge) badge.textContent = timelineSteps.length + (timelineSteps.length === 1 ? ' step' : ' steps');
}

function updateTimelineStep(i, key, val) {
  timelineSteps[i][key] = val;
  refreshTimeline();
}

function addTimelineStep() {
  if (timelineSteps.length >= 9) return;
  timelineSteps.push({ title: '', description: '' });
  renderTimeline();
  refreshTimeline();
  setTimeout(function () {
    var els = document.querySelectorAll('#t_stepsContainer .step-card');
    if (els.length) els[els.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function removeTimelineStep(i) {
  if (timelineSteps.length <= 1) return;
  timelineSteps.splice(i, 1);
  renderTimeline();
  refreshTimeline();
}

function toggleTimelineActivityTitle() {
  var show = document.getElementById('t_showActivityTitle').checked;
  document.getElementById('t-title-section').style.display = show ? 'block' : 'none';
  refreshTimeline();
}

// ── Build JSON data ──
function buildTimelineData() {
  var showActivityTitle = document.getElementById('t_showActivityTitle') ? document.getElementById('t_showActivityTitle').checked : false;
  return {
    title: v('t_activityTitle'),
    showActivityTitle: showActivityTitle,
    speechBubbleText: v('t_speechBubble'),
    navigation: { next: v('t_navNext') },
    theme: TIMELINE_THEMES[selectedTimelineTheme] || TIMELINE_THEMES.green,
    backgroundColor: selectedTimelineBg,
    steps: timelineSteps.map(function (s) {
      return { title: s.title, description: s.description };
    })
  };
}

// ── Live preview ──
function renderTimelinePreview() {
  var data = buildTimelineData();
  var container = document.getElementById('timelinePreview');
  container.innerHTML = '';

  var theme = TIMELINE_THEMES[selectedTimelineTheme] || TIMELINE_THEMES.green;

  var wrapper = document.createElement('div');
  wrapper.className = 'tpv-container';
  wrapper.style.setProperty('--tpv-primary', theme.primary);
  wrapper.style.setProperty('--tpv-accent', theme.accent);

  if (data.showActivityTitle) {
    var title = document.createElement('h1');
    title.className = 'tpv-title';
    title.textContent = data.title;
    wrapper.appendChild(title);
  }

  var timelineWrapper = document.createElement('div');
  timelineWrapper.className = 'tpv-timeline';

  data.steps.forEach(function (step, i) {
    var isLast = i === data.steps.length - 1;
    var num = String(i + 1).padStart(2, '0');

    var stepEl = document.createElement('div');
    stepEl.className = 'tpv-step';
    stepEl.id = 'tpv-step-' + i;

    var stepContent = document.createElement('div');
    stepContent.className = 'tpv-step-content';

    var header = document.createElement('div');
    header.className = 'tpv-step-header';
    header.innerHTML =
      '<div class="tpv-step-num">STEP ' + num + '</div>' +
      '<div class="tpv-step-title">' + escT(step.title) + '</div>';

    var desc = document.createElement('p');
    desc.className = 'tpv-step-desc';
    desc.textContent = step.description;

    stepContent.appendChild(header);
    stepContent.appendChild(desc);

    if (!isLast) {
      var nextWrap = document.createElement('div');
      nextWrap.className = 'tpv-next-wrap';
      nextWrap.id = 'tpv-next-wrap-' + i;

      var nextBtn = document.createElement('button');
      nextBtn.className = 'tpv-next-btn';
      nextBtn.innerHTML =
        '<span>' + escT(data.navigation.next) + '</span>' +
        '<svg width="18" height="18" fill="#000" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
      nextBtn.addEventListener('click', (function (idx) {
        return function () { tpvShowNextStep(idx); };
      })(i));

      nextWrap.appendChild(nextBtn);
      stepContent.appendChild(nextWrap);
    }

    stepEl.appendChild(stepContent);

    if (!isLast) {
      var connector = document.createElement('div');
      connector.className = 'tpv-connector';
      connector.id = 'tpv-connector-' + i;
      stepEl.appendChild(connector);
    }

    timelineWrapper.appendChild(stepEl);
  });

  wrapper.appendChild(timelineWrapper);
  container.appendChild(wrapper);

  // Show first step
  setTimeout(function () {
    var first = document.getElementById('tpv-step-0');
    if (first) first.classList.add('visible');
  }, 100);
}

function tpvShowNextStep(current) {
  var nextWrap = document.getElementById('tpv-next-wrap-' + current);
  if (nextWrap) {
    nextWrap.classList.add('hidden');
    setTimeout(function () {
      var connector = document.getElementById('tpv-connector-' + current);
      if (connector) connector.classList.add('visible');
      setTimeout(function () {
        var nextStep = document.getElementById('tpv-step-' + (current + 1));
        if (nextStep) nextStep.classList.add('visible');
      }, 300);
    }, 300);
  }
}

// ── Debounced refresh ──
var timelineTimer = null;
function refreshTimeline() {
  clearTimeout(timelineTimer);
  timelineTimer = setTimeout(renderTimelinePreview, 300);
}

// ── Downloads ──
function downloadTimelineHTML() {
  var blob = new Blob([buildTimelineHTML(buildTimelineData())], { type: 'text/html' });
  triggerDownload(blob, 'index.html');
  showToast('index.html downloaded');
}

function copyTimelineCode() {
  copyToClipboard(buildTimelineHTML(buildTimelineData()));
}
