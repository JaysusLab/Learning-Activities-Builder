// ══════════════════════════════════════════════
// TEMPLATE: Accordion — Downloadable HTML
// ══════════════════════════════════════════════
// Edit this file to change the exported HTML structure,
// styles, and runtime behaviour of the Accordion activity.

function buildAccordionHTML(data) {
  var p = (data.theme && data.theme.primary) ? data.theme.primary : '#5564FF';
  var a = (data.theme && data.theme.accent)  ? data.theme.accent  : '#DDE0FF';
  var bg = data.backgroundColor || '#EBEBEB';

  // ── Embedded CSS ──
  var css = [
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{font-family:"OneStream Sans Regular",Arial,sans-serif;background:' + bg + ';padding:20px;color:#000;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding-top:40px}',
    '.activity-wrapper{max-width:600px;width:100%;margin:0 auto}',
    '.speech-bubble{background:' + a + ';border:2px solid ' + p + ';border-radius:6px;width:50%;padding:12px 20px;font-size:14px;color:#000;margin-bottom:15px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.15);opacity:0;animation:fadeIn .5s ease .3s forwards;position:relative}',
    '.speech-bubble::after{content:"";position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid ' + p + '}',
    '.speech-bubble::before{content:"";position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border-left:9px solid transparent;border-right:9px solid transparent;border-top:9px solid ' + a + '}',
    '.speech-bubble.hide{animation:fadeOut .3s ease forwards}',
    '.activity-title{font-family:"OneStream Fono","Andale Mono",monospace;font-size:1.1rem;font-weight:bold;text-transform:uppercase;color:#000;margin-bottom:20px;text-align:center;border-bottom:3px solid ' + p + ';padding-bottom:14px}',
    '.container{width:100%;background:#FFF;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.1);border:1px solid #F2F2F2;padding:14px 18px 18px;opacity:0;transition:opacity .3s ease}',
    '.container.loaded{opacity:1}',
    '.intro-paragraph{font-size:.9rem;line-height:1.65;margin-bottom:16px;color:#000}',
    '.accordion-list{display:flex;flex-direction:column;gap:6px}',
    '.accordion-item{border:2px solid ' + a + ';border-radius:6px;overflow:hidden;transition:border-color .25s ease}',
    '.accordion-item.open{border-color:' + p + '}',
    '.accordion-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;background:#fff;transition:background .2s ease;gap:12px;-webkit-user-select:none;user-select:none}',
    '.accordion-item.open .accordion-header,.accordion-header:hover{background:' + a + '}',
    '.accordion-header-title{font-weight:bold;font-size:.95rem;line-height:1.3;flex-grow:1}',
    '.accordion-chevron{width:20px;height:20px;flex-shrink:0;color:' + p + ';transition:transform .25s ease}',
    '.accordion-item.open .accordion-chevron{transform:rotate(180deg)}',
    '.accordion-body{max-height:0;overflow:hidden;transition:max-height .35s ease}',
    '.accordion-item.open .accordion-body{max-height:600px}',
    '.accordion-body-inner{padding:10px 14px;font-size:.9rem;line-height:1.65;color:#000;border-top:1px solid ' + a + '}',
    '.accordion-item.open .accordion-body-inner{border-top-color:' + p + '}',
    '@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes fadeOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}',
    '@media(max-width:600px){.container{padding:12px 14px 14px}.accordion-header{padding:10px 12px}.accordion-body-inner{padding:10px 12px}}'
  ].join('\n');

  // ── Embedded JS ──
  var js = [
    'var DATA=' + JSON.stringify(data) + ',hasInteracted=false,bubbleTimeout;',
    'var sb=DATA.showSpeechBubble?document.getElementById("speechBubble"):null;',
    'function init(){',
    '  var container=document.getElementById("accordionContainer");',
    '  var allowMultiple=DATA.settings&&DATA.settings.allowMultiple;',
    '  var firstOpen=DATA.settings&&DATA.settings.firstItemOpen;',
    '  if(DATA.showActivityTitle){var t=document.getElementById("activityTitle");if(t)t.textContent=DATA.title;}',
    '  if(sb){sb.textContent=DATA.speechBubble;sb.style.display="block";var tout=(DATA.settings&&DATA.settings.speechBubbleTimeout)||8000;bubbleTimeout=setTimeout(function(){if(!hasInteracted)sb.classList.add("hide");},tout);}',
    '  container.innerHTML=DATA.items.map(function(item,i){',
    '    var open=firstOpen&&i===0;',
    '    return\'<div class="accordion-item\'+(open?\' open\':\'\')+\'" tabindex="0" role="button" aria-expanded="\'+(open?\'true\':\'false\')+\'" data-i="\'+i+\'">\'',
    '      +\'<div class="accordion-header">\'',
    '      +\'<span class="accordion-header-title">\'+item.title+\'</span>\'',
    '      +\'<svg class="accordion-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>\'',
    '      +\'</div>\'',
    '      +\'<div class="accordion-body"><div class="accordion-body-inner">\'+item.content+\'</div></div>\'',
    '      +\'</div>\';',
    '  }).join("");',
    '  setTimeout(function(){document.getElementById("mainContainer").classList.add("loaded");},100);',
    '  var items=document.querySelectorAll(".accordion-item");',
    '  items.forEach(function(el){',
    '    el.addEventListener("click",function(){',
    '      if(sb&&!hasInteracted){hasInteracted=true;sb.classList.add("hide");clearTimeout(bubbleTimeout);}',
    '      var wasOpen=this.classList.contains("open");',
    '      if(!allowMultiple){items.forEach(function(x){x.classList.remove("open");x.setAttribute("aria-expanded","false");});}',
    '      if(!wasOpen){this.classList.add("open");this.setAttribute("aria-expanded","true");}',
    '      else{this.classList.remove("open");this.setAttribute("aria-expanded","false");}',
    '      this.blur();',
    '    });',
    '    el.addEventListener("keydown",function(e){',
    '      if(e.key==="Enter"||e.key===" "){e.preventDefault();this.click();this.focus();}',
    '      else if(e.key==="ArrowDown"){e.preventDefault();var n=this.nextElementSibling;if(n&&n.classList.contains("accordion-item"))n.focus();}',
    '      else if(e.key==="ArrowUp"){e.preventDefault();var p=this.previousElementSibling;if(p&&p.classList.contains("accordion-item"))p.focus();}',
    '    });',
    '  });',
    '}',
    'init();'
  ].join('\n');

  var titleHtml  = data.showActivityTitle ? '  <h1 class="activity-title" id="activityTitle"></h1>\n' : '';
  var bubbleHtml = data.showSpeechBubble ? '  <div class="speech-bubble" id="speechBubble" style="display:none"></div>\n' : '';
  var introHtml  = (data.showIntroParagraph && data.introParagraph)
    ? '    <p class="intro-paragraph">' + esc(data.introParagraph).replace(/\n/g, '<br>') + '</p>\n'
    : '';

  // ── Assemble full HTML document ──
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(data.title) + '</title>\n' +
    '<style>\n' + css + '\n</style>\n' +
    '</head>\n<body>\n' +
    '<div class="activity-wrapper">\n' +
    titleHtml +
    bubbleHtml +
    '  <div class="container" id="mainContainer">\n' +
    introHtml +
    '    <div class="accordion-list" id="accordionContainer"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<script>\n' + js + '\n<\/script>\n' +
    '</body>\n</html>';
}
