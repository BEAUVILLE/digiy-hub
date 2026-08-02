/* DIGIY HUB — accès rapide aux modules PRO */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PRO_CARTOUCHE__) return;
  window.__DIGIY_HUB_PRO_CARTOUCHE__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var STORE='digiy_hub_lang_v1';
  var STORE_LEGACY='digiy_hub_lang_7';
  var COPY={
    fr:{tab:'PRO',mobile:'Mes modules PRO',title:'Mes modules PRO',sub:'Ouvre directement ton cockpit professionnel.',close:'Fermer',activate:'Activer un module',open:'Ouvrir'},
    en:{tab:'PRO',mobile:'My PRO modules',title:'My PRO modules',sub:'Open your professional cockpit directly.',close:'Close',activate:'Activate a module',open:'Open'},
    es:{tab:'PRO',mobile:'Mis módulos PRO',title:'Mis módulos PRO',sub:'Abre directamente tu panel profesional.',close:'Cerrar',activate:'Activar un módulo',open:'Abrir'},
    de:{tab:'PRO',mobile:'Meine PRO-Module',title:'Meine PRO-Module',sub:'Öffne dein professionelles Cockpit direkt.',close:'Schließen',activate:'Modul aktivieren',open:'Öffnen'},
    it:{tab:'PRO',mobile:'I miei moduli PRO',title:'I miei moduli PRO',sub:'Apri direttamente il tuo cockpit professionale.',close:'Chiudi',activate:'Attiva un modulo',open:'Apri'},
    nl:{tab:'PRO',mobile:'Mijn PRO-modules',title:'Mijn PRO-modules',sub:'Open direct je professionele cockpit.',close:'Sluiten',activate:'Module activeren',open:'Openen'},
    ar:{tab:'مهني',mobile:'وحداتي المهنية',title:'وحداتي المهنية',sub:'افتح لوحة عملك المهنية مباشرة.',close:'إغلاق',activate:'تفعيل وحدة',open:'فتح'}
  };

  var MODULES=[
    {icon:'🎙️',url:'https://pro-action-digiy.digiylyfe.com/',names:{fr:'ACTION PRO',en:'ACTION PRO',es:'ACTION PRO',de:'ACTION PRO',it:'ACTION PRO',nl:'ACTION PRO',ar:'ACTION PRO'}},
    {icon:'💰',url:'https://commerce-pro.digiylyfe.com/pin.html',names:{fr:'MON COMMERCE',en:'MY BUSINESS',es:'MI COMERCIO',de:'MEIN GESCHÄFT',it:'IL MIO COMMERCIO',nl:'MIJN HANDEL',ar:'متجري'}},
    {icon:'🛍️',url:'https://pro-market.digiylyfe.com/pin.html',names:{fr:'MARKET PRO',en:'MARKET PRO',es:'MARKET PRO',de:'MARKET PRO',it:'MARKET PRO',nl:'MARKET PRO',ar:'MARKET PRO'}},
    {icon:'🏠',url:'https://pro-loc.digiylyfe.com/pin.html',names:{fr:'LOC PRO',en:'LOC PRO',es:'LOC PRO',de:'LOC PRO',it:'LOC PRO',nl:'LOC PRO',ar:'LOC PRO'}},
    {icon:'📅',url:'https://pro-resa-resto.digiylyfe.com/pin.html',names:{fr:'RESA PRO',en:'RESA PRO',es:'RESA PRO',de:'RESA PRO',it:'RESA PRO',nl:'RESA PRO',ar:'RESA PRO'}},
    {icon:'🍽️',url:'https://pro-resto.digiylyfe.com/pin.html',names:{fr:'RESTO PRO',en:'RESTO PRO',es:'RESTO PRO',de:'RESTO PRO',it:'RESTO PRO',nl:'RESTO PRO',ar:'RESTO PRO'}},
    {icon:'🚗',url:'https://pro-driver.digiylyfe.com/pin.html',names:{fr:'DRIVER PRO',en:'DRIVER PRO',es:'DRIVER PRO',de:'DRIVER PRO',it:'DRIVER PRO',nl:'DRIVER PRO',ar:'DRIVER PRO'}},
    {icon:'💼',url:'https://pro-job.digiylyfe.com/pin.html',names:{fr:'JOBS PRO',en:'JOBS PRO',es:'JOBS PRO',de:'JOBS PRO',it:'JOBS PRO',nl:'JOBS PRO',ar:'JOBS PRO'}},
    {icon:'🏗️',url:'https://pro-build.digiylyfe.com/pin.html',names:{fr:'BUILD PRO',en:'BUILD PRO',es:'BUILD PRO',de:'BUILD PRO',it:'BUILD PRO',nl:'BUILD PRO',ar:'BUILD PRO'}},
    {icon:'🗺️',url:'https://pro-explore.digiylyfe.com/pin.html',names:{fr:'EXPLORE PRO',en:'EXPLORE PRO',es:'EXPLORE PRO',de:'EXPLORE PRO',it:'EXPLORE PRO',nl:'EXPLORE PRO',ar:'EXPLORE PRO'}},
    {icon:'📒',url:'https://pro-carnet.digiylyfe.com/pin.html?redirect=hub',names:{fr:'CARNET PRO',en:'PRO LEDGER',es:'CARNET PRO',de:'PRO CARNET',it:'CARNET PRO',nl:'PRO CARNET',ar:'دفتر المهني'}},
    {icon:'⚡',url:'https://ndimbal-express.digiylyfe.com/inscription.html',names:{fr:'NDIMBAL Express — Dépôt annonce',en:'NDIMBAL Express — Ad submission',es:'NDIMBAL Express — Publicar anuncio',de:'NDIMBAL Express — Anzeige aufgeben',it:'NDIMBAL Express — Pubblica annuncio',nl:'NDIMBAL Express — Advertentie plaatsen',ar:'NDIMBAL Express — نشر إعلان'}}
  ];

  var observedDoc=null,observer=null,lastLanguage='';

  function language(doc){
    var value='';
    try{
      value=localStorage.getItem(STORE)||'';
      if(!value){
        var legacy=(localStorage.getItem(STORE_LEGACY)||'').slice(0,2).toLowerCase();
        if(COPY[legacy]){
          value=legacy;
          localStorage.setItem(STORE,legacy);
        }
      }
    }catch(e){}
    value=(value||(doc&&doc.documentElement.lang)||'fr').slice(0,2).toLowerCase();
    return COPY[value]?value:'fr';
  }

  function styles(){return ''+
    '.digiyProQuick{position:fixed;z-index:112;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'+
    '.digiyProTab{position:fixed;left:8px;top:50%;transform:translateY(-50%);width:62px;min-height:128px;border:1px solid rgba(246,196,83,.58);border-radius:21px;background:linear-gradient(180deg,#fff1bd,#f6c453,#22c55e);color:#06140f;box-shadow:0 16px 38px rgba(0,0,0,.36);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:10px 5px;font-weight:1000;cursor:pointer}'+
    '.digiyProTab strong{font-size:25px}.digiyProTab span{font-size:11px;letter-spacing:.08em;writing-mode:vertical-rl;transform:rotate(180deg)}'+
    '.digiyProMobile{display:none;position:fixed;left:10px;right:78px;bottom:88px;min-height:50px;border:1px solid rgba(246,196,83,.62);border-radius:999px;background:linear-gradient(135deg,#fff1bd,#f6c453,#22c55e);color:#06140f;box-shadow:0 14px 32px rgba(0,0,0,.34);font-weight:1000;font-size:13px;align-items:center;justify-content:center;gap:8px;padding:0 15px;cursor:pointer}'+
    '.digiyProOverlay{position:fixed;inset:0;z-index:120;display:none;background:rgba(0,0,0,.68);backdrop-filter:blur(7px);padding:14px}.digiyProOverlay.open{display:flex}'+
    '.digiyProPanel{width:min(390px,calc(100% - 20px));max-height:88svh;overflow:auto;margin:auto auto auto 72px;border:1px solid rgba(246,196,83,.52);border-radius:28px;background:radial-gradient(520px 240px at 0 0,rgba(246,196,83,.18),transparent 65%),radial-gradient(520px 240px at 100% 0,rgba(0,166,81,.18),transparent 65%),#06150f;box-shadow:0 28px 80px rgba(0,0,0,.58);padding:14px;color:#fff}'+
    '.digiyProHead{position:sticky;top:-14px;z-index:2;display:grid;grid-template-columns:52px minmax(0,1fr) 42px;gap:11px;align-items:center;padding:14px 2px 12px;border-bottom:1px solid rgba(255,255,255,.10);background:rgba(6,21,15,.97);backdrop-filter:blur(12px)}'+
    '.digiyProBadge{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#fff1bd,#f6c453,#22c55e);color:#06140f;font-size:25px}'+
    '.digiyProTitle{margin:0;font-size:24px;line-height:1;font-weight:1000;color:#fff3cf}.digiyProSub{margin-top:5px;color:rgba(248,250,252,.72);font-size:11.5px;line-height:1.35;font-weight:800}'+
    '.digiyProClose{width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;font-size:22px;cursor:pointer}'+
    '.digiyProGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}'+
    '.digiyProLink{min-height:70px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.065);display:grid;grid-template-columns:39px 1fr;gap:9px;align-items:center;padding:10px;color:#fff;text-decoration:none;transition:.14s}'+
    '.digiyProLink:hover{transform:translateY(-1px);border-color:rgba(246,196,83,.48);background:rgba(246,196,83,.10)}'+
    '.digiyProIcon{width:39px;height:39px;border-radius:13px;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:20px}.digiyProLink b{display:block;font-size:11.5px;line-height:1.16;font-weight:1000}.digiyProLink small{display:block;margin-top:3px;color:rgba(248,250,252,.62);font-size:9.5px;font-weight:800}'+
    '.digiyProActivate{min-height:48px;margin-top:11px;border-radius:16px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#fff1bd,#f6c453,#22c55e);color:#06140f;font-size:12.5px;font-weight:1000;text-decoration:none}'+
    '@media(max-width:760px){.digiyProTab{display:none}.digiyProMobile{display:flex}.digiyProOverlay{align-items:flex-end;padding:8px}.digiyProPanel{width:100%;max-height:82svh;margin:0;border-radius:27px 27px 17px 17px}.digiyProGrid{grid-template-columns:1fr 1fr}}'+
    '@media(max-width:430px){.digiyProMobile{right:70px;bottom:86px;font-size:12px}.digiyProGrid{grid-template-columns:1fr}.digiyProLink{min-height:61px}}';}

  function moduleMarkup(lang){
    var c=COPY[lang];
    return MODULES.map(function(item){
      var name=item.names[lang]||item.names.fr;
      return '<a class="digiyProLink" href="'+item.url+'" target="_blank" rel="noopener noreferrer" aria-label="'+c.open+' '+name+'"><span class="digiyProIcon">'+item.icon+'</span><span><b>'+name+'</b><small>'+c.open+' →</small></span></a>';
    }).join('');
  }

  function close(doc){
    var overlay=doc.getElementById('digiyProOverlay');
    if(!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    doc.body.style.overflow=doc.body.dataset.digiyProOverflow||'';
  }

  function open(doc){
    var overlay=doc.getElementById('digiyProOverlay');
    if(!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    doc.body.dataset.digiyProOverflow=doc.body.style.overflow||'';
    doc.body.style.overflow='hidden';
  }

  function render(doc){
    var lang=language(doc),c=COPY[lang],root=doc.getElementById('digiyProQuick');
    if(!root){
      var style=doc.createElement('style');style.id='digiyProQuickStyle';style.textContent=styles();doc.head.appendChild(style);
      root=doc.createElement('div');root.id='digiyProQuick';root.className='digiyProQuick';
      root.innerHTML='<button class="digiyProTab" id="digiyProTab" type="button"><strong>🏢</strong><span></span></button><button class="digiyProMobile" id="digiyProMobile" type="button">🏢 <span></span></button><div class="digiyProOverlay" id="digiyProOverlay" aria-hidden="true"><section class="digiyProPanel" role="dialog" aria-modal="true" aria-labelledby="digiyProTitle"><header class="digiyProHead"><div class="digiyProBadge">🏢</div><div><h2 class="digiyProTitle" id="digiyProTitle"></h2><div class="digiyProSub"></div></div><button class="digiyProClose" type="button">×</button></header><div class="digiyProGrid"></div><a class="digiyProActivate" href="https://commencer-a-payer.digiylyfe.com/" target="_blank" rel="noopener noreferrer"></a></section></div>';
      doc.body.appendChild(root);
      doc.getElementById('digiyProTab').addEventListener('click',function(){open(doc);});
      doc.getElementById('digiyProMobile').addEventListener('click',function(){open(doc);});
      root.querySelector('.digiyProClose').addEventListener('click',function(){close(doc);});
      doc.getElementById('digiyProOverlay').addEventListener('click',function(e){if(e.target===this) close(doc);});
      doc.addEventListener('keydown',function(e){if(e.key==='Escape') close(doc);});
    }
    root.querySelector('.digiyProTab span').textContent=c.tab;
    root.querySelector('.digiyProMobile span').textContent=c.mobile;
    root.querySelector('.digiyProTitle').textContent=c.title;
    root.querySelector('.digiyProSub').textContent=c.sub;
    root.querySelector('.digiyProClose').setAttribute('aria-label',c.close);
    root.querySelector('.digiyProGrid').innerHTML=moduleMarkup(lang);
    root.querySelector('.digiyProActivate').textContent='✍️ '+c.activate;
    lastLanguage=lang;
  }

  function install(){
    try{
      var doc=frame.contentDocument;
      if(!doc||!doc.head||!doc.body) return;
      render(doc);
      if(observedDoc!==doc){
        observedDoc=doc;
        if(observer) observer.disconnect();
        observer=new MutationObserver(function(){if(language(doc)!==lastLanguage) render(doc);});
        observer.observe(doc.documentElement,{attributes:true,attributeFilter:['lang','dir']});
      }
    }catch(e){}
  }

  frame.addEventListener('load',function(){setTimeout(install,40);});
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-shell-lang]')) setTimeout(install,80);});
  setInterval(function(){try{var doc=frame.contentDocument;if(doc&&doc.body&&(!doc.getElementById('digiyProQuick')||language(doc)!==lastLanguage)) install();}catch(e){}},1200);
  setTimeout(install,120);
})();