// ══════════════════════════════════════════════
// TEMPLATE: Card Interaction — Downloadable HTML
// ══════════════════════════════════════════════
// Edit this file to change the exported HTML structure,
// styles, and runtime behaviour of the Cards activity.

function buildCardsHTML(data) {
  var p = (data.theme && data.theme.primary) ? data.theme.primary : '#5564FF';
  var a = (data.theme && data.theme.accent)  ? data.theme.accent  : '#DDE0FF';
  var bg = data.backgroundColor || '#D4D4D4';

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
    '.container{width:100%;background:#FFF;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.1);border:1px solid #F2F2F2;padding:20px 30px 30px;opacity:0;transition:opacity .3s ease}',
    '.container.loaded{opacity:1}',
    '.cards-container{display:flex;flex-direction:column;gap:15px}',
    '.card{background:#FFF;border:2px solid ' + a + ';border-radius:6px;padding:25px;cursor:pointer;transition:all .3s ease;position:relative;min-height:80px}',
    '.card:hover,.card.active{border-color:' + p + ';box-shadow:0 4px 12px rgba(0,0,0,.15)}',
    '.card:hover{transform:translateX(5px)}',
    '.card.active{background:' + a + ';transform:translateX(0)}',
    '.card-header{display:flex;align-items:center;gap:15px}',
    '.card-number{display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:' + p + ';color:#000;font-family:"OneStream Fono","Andale Mono",monospace;font-weight:bold;font-size:18px;border-radius:6px;flex-shrink:0}',
    '.card-title{font-weight:bold;font-size:1rem;line-height:1.3;flex-grow:1}',
    '.card-icon{position:absolute;right:25px;top:50%;transform:translateY(-50%);transition:transform .3s ease;font-size:24px;color:' + p + '}',
    '.card.active .card-icon{transform:translateY(-50%) rotate(90deg)}',
    '.card-content{max-height:0;overflow:hidden;transition:max-height .3s ease;line-height:1.6;padding-left:55px}',
    '.card.active .card-content{max-height:300px;margin-top:15px}',
    '.card.no-title .card-content{padding-left:0}',
    '.expanded-default .card{cursor:default}',
    '.expanded-default .card:hover{transform:none;box-shadow:0 4px 12px rgba(0,0,0,.15)}',
    '.intro-paragraph{font-size:.9rem;line-height:1.65;margin-bottom:20px;color:#000}',
    '.cards-container.cards-horizontal{flex-direction:row;flex-wrap:wrap}',
    '.cards-horizontal .card{flex:0 1 calc((100% - 30px)/3);min-width:0}',
    '.cards-horizontal .card-content{padding-left:0}',
    '.cards-horizontal .card:hover{transform:translateY(-4px)}',
    '.cards-horizontal .card.active{transform:translateY(0)}',
    '.expanded-default.cards-horizontal .card:hover{transform:none}',
    '@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes fadeOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}',
    '@media(max-width:768px){.container{padding:20px}.card{padding:20px}.card-content{padding-left:0;margin-left:55px}.card.no-title .card-content{margin-left:0}.cards-horizontal .card{flex:0 1 100%}}'
  ].join('\n');

  // ── Embedded JS ──
  var js = [
    'var DATA=' + JSON.stringify(data) + ',hasInteracted=false,bubbleTimeout;',
    'var sb=DATA.showSpeechBubble?document.getElementById("speechBubble"):null;',
    'function pad(n){return String(n).padStart(2,"0");}',
    'function init(){',
    '  var cc=document.getElementById("cardsContainer");',
    '  var expandedByDefault=DATA.settings&&DATA.settings.expandedByDefault;',
    '  var horizontalLayout=DATA.settings&&DATA.settings.horizontalLayout;',
    '  if(expandedByDefault)cc.classList.add("expanded-default");',
    '  if(horizontalLayout)cc.classList.add("cards-horizontal");',
    '  cc.innerHTML=DATA.cards.map(function(c,i){var n=pad(c.number||i+1);var noTitle=c.showTitle===false;var titleHtml=noTitle?\'\':\' <span class="card-title">\'+c.title+\'</span>\';var iconHtml=expandedByDefault?\'\':\' <span class="card-icon">&#8250;</span>\';return\'<div class="card\'+(noTitle?\' no-title\':\'\')+\'" tabindex="0" role="button" aria-expanded="false" data-i="\'+i+\'"><div class="card-header"><span class="card-number">\'+n+\'</span>\'+titleHtml+\'</div>\'+iconHtml+\'<div class="card-content">\'+c.content+\'</div></div>\';}).join("");',
    '  if(DATA.showActivityTitle){var th=document.getElementById("activityTitle");if(th)th.textContent=DATA.title;}',
    '  if(sb){sb.textContent=DATA.speechBubble;sb.style.display="block";var tout=(DATA.settings&&DATA.settings.speechBubbleTimeout)||8000;bubbleTimeout=setTimeout(function(){if(!hasInteracted)sb.classList.add("hide");},tout);}',
    '  setTimeout(function(){document.getElementById("mainContainer").classList.add("loaded");},100);',
    '  var allC=document.querySelectorAll(".card");',
    '  if(expandedByDefault){allC.forEach(function(c){c.classList.add("active");c.setAttribute("aria-expanded","true");});}',
    '  allC.forEach(function(card){',
    '    card.addEventListener("click",function(){',
    '      if(sb&&!hasInteracted){hasInteracted=true;sb.classList.add("hide");clearTimeout(bubbleTimeout);}',
    '      if(expandedByDefault){this.blur();return;}',
    '      var was=this.classList.contains("active");',
    '      allC.forEach(function(c){c.classList.remove("active");c.setAttribute("aria-expanded","false");});',
    '      if(!was){this.classList.add("active");this.setAttribute("aria-expanded","true");}',
    '      this.blur();',
    '    });',
    '    card.addEventListener("keydown",function(e){',
    '      if(e.key==="Enter"||e.key===" "){e.preventDefault();this.click();this.focus();}',
    '      else if(e.key==="ArrowDown"){e.preventDefault();var n=this.nextElementSibling;if(n&&n.classList.contains("card"))n.focus();}',
    '      else if(e.key==="ArrowUp"){e.preventDefault();var p=this.previousElementSibling;if(p&&p.classList.contains("card"))p.focus();}',
    '    });',
    '  });',
    '  if(!expandedByDefault){document.addEventListener("click",function(e){if(!e.target.closest(".card")){allC.forEach(function(c){c.classList.remove("active");c.setAttribute("aria-expanded","false");});}});}',
    '}',
    'init();'
  ].join('\n');

  var titleHtml = data.showActivityTitle ? '  <h1 class="activity-title" id="activityTitle"></h1>\n' : '';
  var bubbleHtml = data.showSpeechBubble ? '  <div class="speech-bubble" id="speechBubble" style="display:none"></div>\n' : '';
  var introHtml = (data.showIntroParagraph && data.introParagraph) ? '    <p class="intro-paragraph">' + esc(data.introParagraph).replace(/\n/g, '<br>') + '</p>\n' : '';

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
    '    <div class="cards-container" id="cardsContainer"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<script>\n' + js + '\n<\/script>\n' +
    '</body>\n</html>';
}
