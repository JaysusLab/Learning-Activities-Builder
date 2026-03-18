// ══════════════════════════════════════════════
// TEMPLATE: Use Case w Steps — Downloadable HTML
// ══════════════════════════════════════════════
// Edit this file to change the exported HTML structure,
// styles, and runtime behaviour of the Steps activity.

function buildStepsHTML(data) {
  var gridCols = data.showCharacter ? '200px 1fr' : '1fr';
  var portraitCol = data.showCharacter
    ? '<div class="image-column"><div id="portraitContainer" class="portrait-container"></div></div>'
    : '';

  // ── Embedded CSS ──
  var p = data.theme.primary;
  var a = data.theme.accent;
  var css = [
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{font-family:Arial,sans-serif;background:' + data.backgroundColor + ';padding:20px;line-height:1.6;color:#000;min-height:100vh;display:flex;align-items:center;justify-content:center}',
    '.activity-container{background:#fff;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.1);border:1px solid #F2F2F2;max-width:900px;margin:0 auto;padding:30px}',
    '.activity-header{font-family:"Andale Mono",monospace;font-size:1.2rem;font-weight:bold;text-transform:uppercase;color:#000;margin-bottom:25px;text-align:center;border-bottom:3px solid ' + p + ';padding-bottom:15px}',
    '.content-wrapper{display:grid;grid-template-columns:' + gridCols + ';gap:30px;align-items:start}',
    '.image-column{position:sticky;top:20px}',
    '.portrait-container{width:200px;height:200px;border-radius:6px;overflow:hidden}',
    '.portrait-placeholder{width:100%;height:100%;background:' + a + ';border:2px solid ' + p + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:"Andale Mono",monospace;font-size:.9rem;color:#000;text-transform:uppercase;font-weight:bold;text-align:center;padding:10px}',
    '.portrait-image{width:100%;height:100%;object-fit:cover;border:2px solid ' + p + ';border-radius:6px}',
    '.text-column{padding:0 10px}',
    '.content-slide{display:none;animation:fadeIn .5s ease-in-out}',
    '.content-slide.active{display:block}',
    '.step-badge{display:inline-block;background:' + p + ';color:#000;font-family:"Andale Mono",monospace;font-weight:bold;font-size:18px;padding:6px 12px;border-radius:6px;margin-bottom:15px}',
    '.step-title{font-family:"Andale Mono",monospace;font-size:1.1rem;font-weight:bold;text-transform:uppercase;color:#000;margin-bottom:15px}',
    '.intro-title{font-size:1rem;font-weight:bold;color:#000;margin-bottom:15px}',
    '.step-content{font-size:1rem;color:#000;line-height:1.7}',
    '.navigation-controls{display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding-top:20px;border-top:1px solid #F2F2F2}',
    '.nav-btn{min-width:120px;height:44px;background:' + p + ';color:#000;border:none;border-radius:6px;font-size:14px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 16px;transition:filter .3s}',
    '.nav-btn:hover{filter:brightness(0.88)}',
    '.nav-btn:disabled{background:#F2F2F2;color:#757575;cursor:not-allowed;opacity:.6;filter:none}',
    '.progress-indicator{font-family:"Andale Mono",monospace;font-size:14px;color:' + p + ';font-weight:bold}',
    '.arrow-icon{width:20px;height:20px;fill:currentColor}',
    '@keyframes fadeIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}',
    '@media(max-width:768px){.content-wrapper{grid-template-columns:1fr}.image-column{position:static}.portrait-container{width:150px;height:150px;margin:0 auto}.activity-container{padding:20px}}'
  ].join('\n');

  // ── Embedded JS ──
  var js = [
    'var D=' + JSON.stringify(data) + ',cur=0,total=0,steps=0;',
    'function init(){',
    '  document.getElementById("activityHeader").textContent=D.activityTitle;',
    '  if(D.showCharacter)setupPortrait();',
    '  if(D.showNavigation){document.getElementById("prevBtnText").textContent=D.navigation.previousButtonText;document.getElementById("nextBtnText").textContent=D.navigation.nextButtonText;}',
    '  buildSlides();',
    '  total=D.slides.length;',
    '  steps=D.slides.filter(function(s){return s.type==="step";}).length;',
    '  if(D.showNavigation)updateNav();',
    '}',
    'function setupPortrait(){',
    '  var c=document.getElementById("portraitContainer");c.innerHTML="";',
    '  var img=D.character.image;',
    '  if(img.type==="image"&&img.source){var el=document.createElement("img");el.src=img.source;el.alt=img.altText||"";el.className="portrait-image";el.onerror=function(){c.innerHTML="";var p=document.createElement("div");p.className="portrait-placeholder";p.textContent=D.character.placeholderText||"Portrait";c.appendChild(p);};c.appendChild(el);}else{var p=document.createElement("div");p.className="portrait-placeholder";p.textContent=D.character.placeholderText||"Portrait";c.appendChild(p);}',
    '}',
    'function buildSlides(){',
    '  var c=document.getElementById("slidesContainer");c.innerHTML="";',
    '  D.slides.forEach(function(slide,i){',
    '    var d=document.createElement("div");d.className="content-slide";if(i===0)d.classList.add("active");',
    '    if(slide.type==="introduction"){var t=slide.showTitle?"<p class=\'intro-title\'>"+slide.title+"</p>":"";var txt=slide.content.replace(/\\n/g,"<br>");d.innerHTML="<div class=\'step-content\'>"+t+"<p>"+txt+"</p></div>";}',
    '    else{var t=slide.showTitle?"<h2 class=\'step-title\'>"+slide.title+"</h2>":"";var txt=slide.content.replace(/\\n/g,"<br>");d.innerHTML="<div class=\'step-badge\'>STEP "+slide.stepNumber+"</div>"+t+"<div class=\'step-content\'><p>"+txt+"</p></div>";}',
    '    c.appendChild(d);',
    '  });',
    '}',
    'function changeSlide(dir){',
    '  var slides=document.querySelectorAll(".content-slide");',
    '  slides[cur].classList.remove("active");cur+=dir;',
    '  if(cur<0)cur=0;if(cur>=total)cur=total-1;',
    '  slides[cur].classList.add("active");updateNav();',
    '}',
    'function updateNav(){',
    '  if(!D.showNavigation)return;',
    '  var prev=document.getElementById("prevBtn"),next=document.getElementById("nextBtn"),ntxt=document.getElementById("nextBtnText"),prog=document.getElementById("progressIndicator");',
    '  prev.disabled=cur===0;next.disabled=cur===total-1;',
    '  ntxt.textContent=cur===total-1?D.navigation.completeButtonText:D.navigation.nextButtonText;',
    '  var first=D.slides[0];',
    '  if(cur===0&&first&&first.type==="introduction"){prog.textContent=D.navigation.progressLabels.introduction;}',
    '  else{var si=D.showIntroduction?cur:cur+1;prog.textContent=D.navigation.progressLabels.stepFormat.replace("{current}",si).replace("{total}",steps);}',
    '}',
    'document.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"&&cur>0)changeSlide(-1);else if(e.key==="ArrowRight"&&cur<total-1)changeSlide(1);});',
    'init();'
  ].join('\n');

  var navControls = data.showNavigation
    ? '      <div class="navigation-controls">\n' +
      '        <button class="nav-btn" id="prevBtn" onclick="changeSlide(-1)">\n' +
      '          <svg class="arrow-icon" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>\n' +
      '          <span id="prevBtnText"></span>\n' +
      '        </button>\n' +
      '        <span class="progress-indicator" id="progressIndicator"></span>\n' +
      '        <button class="nav-btn" id="nextBtn" onclick="changeSlide(1)">\n' +
      '          <span id="nextBtnText"></span>\n' +
      '          <svg class="arrow-icon" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>\n' +
      '        </button>\n' +
      '      </div>\n'
    : '';

  // ── Assemble full HTML document ──
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(data.activityTitle) + '</title>\n' +
    '<style>\n' + css + '\n</style>\n' +
    '</head>\n<body>\n' +
    '<div class="activity-container">\n' +
    '  <h1 class="activity-header" id="activityHeader"></h1>\n' +
    '  <div class="content-wrapper">\n' +
    '    ' + portraitCol + '\n' +
    '    <div class="text-column">\n' +
    '      <div id="slidesContainer"></div>\n' +
    navControls +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<script>\n' + js + '\n<\/script>\n' +
    '</body>\n</html>';
}
