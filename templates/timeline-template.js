// ══════════════════════════════════════════════
// TEMPLATE: Setup Steps Timeline — Downloadable HTML
// ══════════════════════════════════════════════
// Edit this file to change the exported HTML structure,
// styles, and runtime behaviour of the Timeline activity.

function buildTimelineHTML(data) {
  var p  = (data.theme && data.theme.primary) ? data.theme.primary : '#00985B';
  var a  = (data.theme && data.theme.accent)  ? data.theme.accent  : '#B7FFE2';
  var bg = data.backgroundColor || '#D4D4D4';

  // ── Embedded CSS ──
  var css = [
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{font-family:"OneStream Sans Regular",Arial,sans-serif;background-color:' + bg + ';min-height:100vh;padding:20px;display:flex;justify-content:center;align-items:center}',
    '.activity-container{background-color:#FFF;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.1);border:1px solid #F2F2F2;max-width:900px;width:100%;padding:40px;min-height:500px}',
    'h1{font-family:"OneStream Fono","Andale Mono",monospace;text-transform:uppercase;color:#000;font-size:24px;font-weight:bold;margin-bottom:30px;text-align:center}',
    '.timeline-wrapper{position:relative;padding:20px 0}',
    '.timeline-step{position:relative;margin-bottom:20px;opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}',
    '.timeline-step.visible{opacity:1;transform:translateY(0)}',
    '.step-content{background-color:' + a + ';border-radius:6px;padding:20px;border:2px solid ' + p + '}',
    '.step-header{display:flex;align-items:center;gap:15px;margin-bottom:15px}',
    '.step-number{background-color:' + p + ';color:#000;border-radius:6px;padding:8px 12px;display:inline-flex;align-items:center;justify-content:center;font-family:"OneStream Fono","Andale Mono",monospace;font-size:18px;font-weight:bold;white-space:nowrap}',
    '.step-title{font-family:"OneStream Fono","Andale Mono",monospace;font-size:16px;font-weight:bold;text-transform:uppercase;color:#000;flex-grow:1}',
    '.step-description{font-size:14px;line-height:1.6;color:#000}',
    '.step-next-container{margin-top:15px;text-align:center;transition:opacity .3s ease,max-height .3s ease;max-height:60px;overflow:hidden}',
    '.step-next-container.hidden{opacity:0;max-height:0;margin-top:0}',
    '.next-button{min-width:100px;height:40px;padding:0 20px;background-color:' + p + ';color:#000;border:none;border-radius:6px;font-family:"OneStream Sans Regular",Arial,sans-serif;font-size:14px;font-weight:bold;cursor:pointer;transition:background-color .3s ease,box-shadow .3s ease;display:inline-flex;align-items:center;justify-content:center;gap:8px}',
    '.next-button:hover{filter:brightness(0.88);box-shadow:0 4px 8px rgba(0,0,0,.15)}',
    '.next-button:focus{outline:2px solid ' + p + ';outline-offset:2px}',
    '.nav-icon{width:20px;height:20px}',
    '.connector-line{position:relative;left:50%;transform:translateX(-50%);width:3px;height:40px;background-color:' + p + ';opacity:0;transition:opacity .5s ease;margin-bottom:20px}',
    '.connector-line.visible{opacity:1}',
    '@media(max-width:768px){.activity-container{padding:30px 20px}h1{font-size:20px}.step-header{flex-direction:column;align-items:flex-start;gap:10px}.step-content{padding:15px}.connector-line{height:30px}}',
    '@media(max-width:400px){.activity-container{padding:20px 15px}h1{font-size:18px}.step-number{font-size:14px;padding:6px 10px}.step-title{font-size:14px}.step-description{font-size:13px}.next-button{max-width:200px}.connector-line{height:25px}}'
  ].join('\n');

  // ── Embedded JS ──
  var js = [
    'var DATA=' + JSON.stringify(data) + ';',
    'var currentStep=0;',
    'function pad(n){return String(n).padStart(2,"0");}',
    'function init(){',
    '  if(DATA.showActivityTitle){var at=document.getElementById("activityTitle");if(at)at.textContent=DATA.title;}',
    '  var container=document.getElementById("timelineSteps");',
    '  container.innerHTML="";',
    '  DATA.steps.forEach(function(step,i){',
    '    var isLast=i===DATA.steps.length-1;',
    '    var stepEl=document.createElement("div");',
    '    stepEl.className="timeline-step";',
    '    stepEl.id="step-"+i;',
    '    var nextBtn=isLast?"":\'<div class="step-next-container" id="next-container-\'+i+\'"><button class="next-button" id="next-\'+i+\'" aria-label="Show next step"><span>\'+DATA.navigation.next+\'</span><svg class="nav-icon" fill="#000" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button></div>\';',
    '    var connectorLine=isLast?"":\'<div class="connector-line" id="connector-\'+i+\'"></div>\';',
    '    stepEl.innerHTML=\'<div class="step-content"><div class="step-header"><div class="step-number">STEP \'+pad(i+1)+\'</div><h2 class="step-title">\'+step.title+\'</h2></div><p class="step-description">\'+step.description+\'</p>\'+nextBtn+\'</div>\'+connectorLine;',
    '    container.appendChild(stepEl);',
    '  });',
    '  DATA.steps.forEach(function(step,i){',
    '    if(i<DATA.steps.length-1){',
    '      var btn=document.getElementById("next-"+i);',
    '      if(btn)btn.addEventListener("click",function(){showNextStep(i);});',
    '    }',
    '  });',
    '  showStep(0);',
    '}',
    'function showStep(idx){',
    '  var el=document.getElementById("step-"+idx);',
    '  if(el)setTimeout(function(){el.classList.add("visible");},100);',
    '}',
    'function showNextStep(current){',
    '  var nextContainer=document.getElementById("next-container-"+current);',
    '  if(nextContainer){',
    '    nextContainer.classList.add("hidden");',
    '    setTimeout(function(){',
    '      var connector=document.getElementById("connector-"+current);',
    '      if(connector)connector.classList.add("visible");',
    '      setTimeout(function(){showStep(current+1);},300);',
    '    },300);',
    '  }',
    '}',
    'document.addEventListener("DOMContentLoaded",init);'
  ].join('\n');

  // ── Assemble full HTML document ──
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(data.title) + '</title>\n' +
    '<style>\n' + css + '\n</style>\n' +
    '</head>\n<body>\n' +
    '<div class="activity-container">\n' +
    (data.showActivityTitle ? '  <h1 id="activityTitle"></h1>\n' : '') +
    '  <div class="timeline-wrapper" id="timelineSteps"></div>\n' +
    '</div>\n' +
    '<script>\n' + js + '\n<\/script>\n' +
    '</body>\n</html>';
}
