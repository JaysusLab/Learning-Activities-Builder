// ══════════════════════════════════════════════
// TAB 1 — USE CASE W STEPS: Editor Logic
// ══════════════════════════════════════════════

var STEPS_THEMES = {
  blue:   { primary: '#5564FF', accent: '#DDE0FF' },
  pink:   { primary: '#FF8FB3', accent: '#FFE9F0' },
  green:  { primary: '#00985B', accent: '#B7FFE2' },
  yellow: { primary: '#FFCB11', accent: '#FFF5CF' }
};
var selectedStepsTheme = 'blue';
var selectedStepsBg = '#EBEBEB';

function selectStepsBg(hex) {
  selectedStepsBg = hex;
  document.querySelectorAll('[id^="s-bg-"]').forEach(function (el) {
    el.classList.toggle('selected', el.dataset.color === hex);
  });
  document.getElementById('s_bgCustom').value = '';
  document.getElementById('stepsPreview').style.background = hex;
}

function applyCustomBg(val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    selectedStepsBg = val;
    document.querySelectorAll('[id^="s-bg-"]').forEach(function (el) {
      el.classList.remove('selected');
    });
    document.getElementById('stepsPreview').style.background = val;
  }
}

function selectStepsTheme(name) {
  selectedStepsTheme = name;
  document.querySelectorAll('[id^="s-swatch-"]').forEach(function (el) {
    el.classList.toggle('selected', el.id === 's-swatch-' + name);
  });
  refreshSteps();
}

var steps = [
  { stepNumber: '01', title: 'Configure the Connector Data Source', showTitle: true, content: 'The Administrator already created a WorkforcePLN connector data source, so the next step is to assign the Workforce Planning solution\u2019s Connector business rule to this data source.' },
  { stepNumber: '02', title: 'Create the Transformation Rules and Profile', showTitle: true, content: 'The Administrator has already created all required Transformation Rules and assigned them to a Transformation Profile named WorkforcePLN.' },
  { stepNumber: '03', title: 'Create a Workflow Import Input', showTitle: true, content: 'The Administrator needs to create a new Import input on the Equipment Plan NA workflow profile and name the input Workforce.' },
  { stepNumber: '04', title: 'Assign Data Source and Transformation Profile', showTitle: true, content: 'Finally, the WorkforcePLN data source and the WorkforcePLN Transformation Profile must be assigned to the Workforce Import input for the Budget scenario.' }
];

// ── Render editor cards ──
function renderSteps() {
  var container = document.getElementById('s_stepsContainer');
  container.innerHTML = '';
  steps.forEach(function (step, i) {
    var card = document.createElement('div');
    card.className = 'step-card';
    var titleChecked = step.showTitle !== false ? 'checked' : '';
    var titleInputStyle = step.showTitle !== false ? '' : 'style="display:none"';
    card.innerHTML =
      '<div class="step-card-header">' +
        '<span class="step-card-label">Step ' + (i + 1) + '</span>' +
        '<button class="step-remove" onclick="removeStep(' + i + ')" title="Remove">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="field">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
          '<label style="margin-bottom:0">Step title</label>' +
          '<label class="toggle-switch">' +
            '<input type="checkbox" ' + titleChecked + ' onchange="updateStep(' + i + ',\'showTitle\',this.checked)">' +
            '<div class="toggle-track"></div>' +
          '</label>' +
        '</div>' +
        '<input type="text" value="' + esc(step.title) + '" ' + titleInputStyle + ' oninput="updateStep(' + i + ',\'title\',this.value)">' +
      '</div>' +
      '<div class="field"><label>Step content</label>' +
        '<textarea oninput="updateStep(' + i + ',\'content\',this.value)">' + escT(step.content) + '</textarea>' +
      '</div>';
    container.appendChild(card);
  });
  document.getElementById('s_addStepBtn').style.display = steps.length >= 9 ? 'none' : 'flex';
  document.getElementById('s_stepLimitNote').style.display = steps.length >= 9 ? 'block' : 'none';
  var badge = document.getElementById('s_stepCountBadge');
  if (badge) badge.textContent = steps.length + (steps.length === 1 ? ' step' : ' steps');
}

function updateStep(i, key, val) {
  steps[i][key] = val;
  steps.forEach(function (s, idx) { s.stepNumber = String(idx + 1).padStart(2, '0'); });
  refreshSteps();
}

function addStep() {
  if (steps.length >= 9) return;
  steps.push({ stepNumber: String(steps.length + 1).padStart(2, '0'), title: '', content: '' });
  renderSteps();
  refreshSteps();
  setTimeout(function () {
    var cards = document.querySelectorAll('#s_stepsContainer .step-card');
    if (cards.length) cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function removeStep(i) {
  if (steps.length <= 1) return;
  steps.splice(i, 1);
  steps.forEach(function (s, idx) { s.stepNumber = String(idx + 1).padStart(2, '0'); });
  renderSteps();
  refreshSteps();
}

function toggleIntroTitle() {
  var checked = document.getElementById('s_introTitleToggle').checked;
  document.getElementById('s_introTitle').style.display = checked ? '' : 'none';
  refreshSteps();
}

function toggleActivitySections() {
  var showChar = document.getElementById('s_charToggle').checked;
  var showIntro = document.getElementById('s_introToggle').checked;
  var showSteps = document.getElementById('s_stepsToggle').checked;
  document.getElementById('s-char-section').style.display = showChar ? 'block' : 'none';
  document.getElementById('s-intro-section').style.display = showIntro ? 'block' : 'none';
  document.getElementById('s-acc-steps').style.display = showSteps ? 'block' : 'none';
  document.getElementById('s-acc-nav').style.display = showSteps ? 'block' : 'none';
  refreshSteps();
}

function getShowStepText() {
  var el = document.getElementById('s_stepTextToggle');
  return el ? el.checked : true;
}

// ── Build JSON data ──
function buildStepsData() {
  var imgVal = v('s_charImage').trim();
  var showChar = document.getElementById('s_charToggle').checked;
  var showIntro = document.getElementById('s_introToggle').checked;
  var showSteps = document.getElementById('s_stepsToggle').checked;
  var introSlide = showIntro
    ? [{ id: 0, type: 'introduction', showTitle: document.getElementById('s_introTitleToggle').checked, title: v('s_introTitle'), content: v('s_introContent') }]
    : [];
  var stepSlides = showSteps
    ? steps.map(function (s, i) {
        return { id: introSlide.length + i, type: 'step', stepNumber: s.stepNumber, showTitle: s.showTitle !== false, title: s.title, content: s.content };
      })
    : [];
  return {
    activityTitle: v('s_activityTitle'),
    showCharacter: showChar,
    showIntroduction: showIntro,
    showSteps: showSteps,
    showNavigation: showSteps,
    showStepCounter: getShowStepText(),
    stepBadgeLabel: v('s_stepBadgeLabel') || 'STEP',
    theme: STEPS_THEMES[selectedStepsTheme] || STEPS_THEMES.blue,
    backgroundColor: selectedStepsBg,
    character: {
      image: { type: imgVal ? 'image' : 'placeholder', source: imgVal, altText: v('s_charAlt') },
      placeholderText: v('s_charPlaceholder')
    },
    slides: introSlide.concat(stepSlides),
    navigation: {
      previousButtonText: v('s_navPrev'), nextButtonText: v('s_navNext'),
      completeButtonText: v('s_navComplete'),
      progressLabels: { introduction: v('s_navIntro'), stepFormat: 'Step {current} of {total}' }
    },
    accessibility: { previousButtonAriaLabel: 'Previous slide', nextButtonAriaLabel: 'Next slide' }
  };
}

// ── Live preview ──
function renderStepsPreview() {
  var data = buildStepsData();
  var container = document.getElementById('stepsPreview');
  container.innerHTML = '';

  var theme = STEPS_THEMES[selectedStepsTheme] || STEPS_THEMES.blue;
  var wrap = document.createElement('div');
  wrap.className = 'spv-container';
  wrap.style.setProperty('--theme-primary', theme.primary);
  wrap.style.setProperty('--theme-accent', theme.accent);

  var hdr = document.createElement('div');
  hdr.className = 'spv-header';
  hdr.textContent = data.activityTitle;
  wrap.appendChild(hdr);

  var cw = document.createElement('div');
  cw.className = 'spv-content-wrapper ' + (data.showCharacter ? 'with-portrait' : 'no-portrait');

  if (data.showCharacter) {
    var imgCol = document.createElement('div');
    var pc = document.createElement('div');
    pc.className = 'spv-portrait-container';
    var img = data.character.image;
    if (img.type === 'image' && img.source) {
      var imgEl = document.createElement('img');
      imgEl.className = 'spv-portrait-img';
      imgEl.src = img.source;
      imgEl.alt = img.altText || 'Portrait';
      imgEl.onerror = function () {
        pc.innerHTML = '';
        var ph = document.createElement('div');
        ph.className = 'spv-portrait-placeholder';
        ph.textContent = data.character.placeholderText || 'Portrait';
        pc.appendChild(ph);
      };
      pc.appendChild(imgEl);
    } else {
      var phEl = document.createElement('div');
      phEl.className = 'spv-portrait-placeholder';
      phEl.textContent = data.character.placeholderText || 'Portrait';
      pc.appendChild(phEl);
    }
    imgCol.appendChild(pc);
    cw.appendChild(imgCol);
  }

  var textCol = document.createElement('div');
  textCol.className = 'spv-text-col';
  var slidesDiv = document.createElement('div');

  data.slides.forEach(function (slide, i) {
    var d = document.createElement('div');
    d.className = 'spv-slide' + (i === 0 ? ' active' : '');
    if (slide.type === 'introduction') {
      var introTitleHtml = slide.showTitle ? '<p class="spv-intro-title">' + escT(slide.title) + '</p>' : '';
      d.innerHTML = '<div class="spv-step-content">' + introTitleHtml + '<p>' + escTBr(slide.content) + '</p></div>';
    } else {
      var stepTitleHtml = slide.showTitle ? '<div class="spv-step-title">' + escT(slide.title) + '</div>' : '';
      d.innerHTML = '<div class="spv-step-badge">' + escT((data.stepBadgeLabel || 'STEP').toUpperCase()) + ' ' + slide.stepNumber + '</div>' +
        stepTitleHtml +
        '<div class="spv-step-content">' + escTBr(slide.content) + '</div>';
    }
    slidesDiv.appendChild(d);
  });
  textCol.appendChild(slidesDiv);

  var totalSlides = data.slides.length;
  var totalSteps = data.slides.filter(function (s) { return s.type === 'step'; }).length;
  var cur = 0;
  var prevBtn, nextBtn, prog;

  if (data.showNavigation) {
    var nav = document.createElement('div');
    nav.className = 'spv-nav';
    prevBtn = document.createElement('button');
    prevBtn.className = 'spv-nav-btn';
    if (data.showStepCounter) {
      prog = document.createElement('span');
      prog.className = 'spv-progress';
    }
    nextBtn = document.createElement('button');
    nextBtn.className = 'spv-nav-btn';
    nav.appendChild(prevBtn);
    if (data.showStepCounter) nav.appendChild(prog);
    nav.appendChild(nextBtn);
    textCol.appendChild(nav);
  }

  cw.appendChild(textCol);
  wrap.appendChild(cw);
  container.appendChild(wrap);

  function updateNav() {
    slidesDiv.querySelectorAll('.spv-slide').forEach(function (s, i) { s.classList.toggle('active', i === cur); });
    if (!data.showNavigation) return;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === totalSlides - 1;
    var arrowL = '<svg class="spv-arrow" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>';
    var arrowR = '<svg class="spv-arrow" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>';
    prevBtn.innerHTML = arrowL + escT(data.navigation.previousButtonText);
    var nextLabel = cur === totalSlides - 1 ? data.navigation.completeButtonText : data.navigation.nextButtonText;
    nextBtn.innerHTML = escT(nextLabel) + arrowR;
    if (data.showStepCounter && prog) {
      var firstSlide = data.slides[0];
      if (cur === 0 && firstSlide && firstSlide.type === 'introduction') {
        prog.textContent = data.navigation.progressLabels.introduction;
      } else {
        var stepIdx = data.showIntroduction ? cur : cur + 1;
        prog.textContent = data.navigation.progressLabels.stepFormat.replace('{current}', stepIdx).replace('{total}', totalSteps);
      }
    }
  }

  if (data.showNavigation) {
    prevBtn.addEventListener('click', function () { if (cur > 0) { cur--; updateNav(); } });
    nextBtn.addEventListener('click', function () { if (cur < totalSlides - 1) { cur++; updateNav(); } });
  }
  updateNav();
}

// ── Debounced refresh ──
var stepsTimer = null;
function refreshSteps() {
  clearTimeout(stepsTimer);
  stepsTimer = setTimeout(renderStepsPreview, 300);
}

// ── Downloads ──
function downloadStepsJSON() {
  var blob = new Blob([JSON.stringify(buildStepsData(), null, 2)], { type: 'application/json' });
  triggerDownload(blob, 'data_learningactivity.json');
  showToast('data_learningactivity.json downloaded');
}

function downloadStepsHTML() {
  var blob = new Blob([buildStepsHTML(buildStepsData())], { type: 'text/html' });
  triggerDownload(blob, 'index.html');
  showToast('index.html downloaded');
}

function downloadStepsZIP() {
  var data = buildStepsData();
  var zip = new JSZip();
  zip.file('index.html', buildStepsHTML(data));
  zip.file('data_learningactivity.json', JSON.stringify(data, null, 2));
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    triggerDownload(blob, 'rise-activity-steps.zip');
    showToast('rise-activity-steps.zip downloaded');
  });
}
