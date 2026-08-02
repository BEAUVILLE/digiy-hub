/* DIGIY HUB — portes territoriales mondiales */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_TERRITORIES__) return;
  window.__DIGIY_HUB_TERRITORIES__=true;

  var COPY={
    fr:{button:'TERRITOIRES',title:'Choisir un territoire',sub:'Un HUB mondial. Des portes territoriales. Des besoins locaux. Un contact direct.',open:'Ouvrir le territoire',close:'Fermer',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Vallée de la Dordogne',ddSub:'Sarlat · communes et villages du territoire'},
    en:{button:'TERRITORIES',title:'Choose a territory',sub:'One global HUB. Territorial doors. Local needs. Direct contact.',open:'Open territory',close:'Close',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordogne Valley',ddSub:'Sarlat · towns and villages across the territory'},
    es:{button:'TERRITORIOS',title:'Elegir un territorio',sub:'Un HUB mundial. Puertas territoriales. Necesidades locales. Contacto directo.',open:'Abrir territorio',close:'Cerrar',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Valle del Dordoña',ddSub:'Sarlat · municipios y pueblos del territorio'},
    de:{button:'REGIONEN',title:'Region auswählen',sub:'Ein globaler HUB. Regionale Zugänge. Lokale Bedürfnisse. Direkter Kontakt.',open:'Region öffnen',close:'Schließen',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordogne-Tal',ddSub:'Sarlat · Gemeinden und Dörfer der Region'},
    it:{button:'TERRITORI',title:'Scegli un territorio',sub:'Un HUB mondiale. Porte territoriali. Bisogni locali. Contatto diretto.',open:'Apri territorio',close:'Chiudi',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Valle della Dordogna',ddSub:'Sarlat · comuni e villaggi del territorio'},
    nl:{button:'GEBIEDEN',title:'Kies een gebied',sub:'Eén wereldwijde HUB. Territoriale ingangen. Lokale behoeften. Direct contact.',open:'Gebied openen',close:'Sluiten',pc:'Petite Côte',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordognevallei',ddSub:'Sarlat · gemeenten en dorpen in het gebied'},
    ar:{button:'المناطق',title:'اختر منطقة',sub:'HUB عالمي واحد. بوابات إقليمية. احتياجات محلية. تواصل مباشر.',open:'فتح المنطقة',close:'إغلاق',pc:'الساحل الصغير',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'وادي دوردوني',ddSub:'سارلا · مدن وقرى المنطقة'}
  };

  function lang(){
    var value='fr';
    try{value=(localStorage.getItem('digiy_hub_lang_v1')||'fr').slice(0,2).toLowerCase();}catch(e){}
    return COPY[value]?value:'fr';
  }

  function addStyles(){
    if(document.getElementById('digiyTerritoryStyles')) return;
    var style=document.createElement('style');
    style.id='digiyTerritoryStyles';
    style.textContent='\
      .digiyTerritoryButton{position:fixed;right:14px;bottom:14px;z-index:80;min-height:52px;border:1px solid rgba(246,196,83,.72);border-radius:18px;background:linear-gradient(135deg,#f6c453,#22c55e);color:#06140f;box-shadow:0 16px 38px rgba(0,0,0,.42);display:flex;align-items:center;gap:8px;padding:0 15px;font:1000 12px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.05em;cursor:pointer}.digiyTerritoryButton strong{font-size:22px}.digiyTerritoryOverlay{position:fixed;inset:0;z-index:130;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px)}.digiyTerritoryOverlay.open{display:flex}.digiyTerritoryPanel{width:min(620px,100%);max-height:90svh;overflow:auto;border:1px solid rgba(246,196,83,.42);border-radius:28px;background:radial-gradient(500px 240px at 0 0,rgba(0,166,81,.23),transparent 62%),radial-gradient(500px 240px at 100% 0,rgba(246,196,83,.18),transparent 62%),#06150f;box-shadow:0 30px 90px rgba(0,0,0,.62);padding:18px;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.digiyTerritoryHead{display:grid;grid-template-columns:54px 1fr 42px;gap:12px;align-items:center;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.11)}.digiyTerritoryBadge{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#f6c453,#22c55e);color:#06140f;font-size:26px}.digiyTerritoryTitle{margin:0;color:#fff3cf;font-size:24px;line-height:1.05;font-weight:1000}.digiyTerritorySub{margin:6px 0 0;color:rgba(248,250,252,.72);font-size:12px;line-height:1.4;font-weight:750}.digiyTerritoryClose{width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;font-size:22px;cursor:pointer}.digiyTerritoryGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}.digiyTerritoryCard{display:flex;flex-direction:column;min-height:190px;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:rgba(255,255,255,.055);padding:16px;color:#fff;text-decoration:none;transition:transform .15s ease,border-color .15s ease}.digiyTerritoryCard:hover{transform:translateY(-2px);border-color:rgba(246,196,83,.64)}.digiyTerritoryFlag{font-size:34px}.digiyTerritoryCard h3{margin:12px 0 7px;color:#fff3cf;font-size:20px;line-height:1.1}.digiyTerritoryCard p{margin:0;color:rgba(248,250,252,.70);font-size:12px;line-height:1.45;font-weight:750}.digiyTerritoryOpen{margin-top:auto;padding-top:16px;color:#86efac;font-size:12px;font-weight:1000}.digiyTerritoryDoctrine{margin:14px 2px 0;text-align:center;color:rgba(248,250,252,.66);font-size:11px;font-weight:850}@media(max-width:620px){.digiyTerritoryButton{right:10px;bottom:10px;min-height:48px;padding:0 12px;font-size:10px}.digiyTerritoryGrid{grid-template-columns:1fr}.digiyTerritoryCard{min-height:150px}.digiyTerritoryPanel{border-radius:24px;padding:14px}.digiyTerritoryTitle{font-size:21px}}';
    document.head.appendChild(style);
  }

  function render(){
    var l=lang(),c=COPY[l];
    var button=document.getElementById('digiyTerritoryButton');
    var overlay=document.getElementById('digiyTerritoryOverlay');
    if(!button||!overlay) return;
    button.querySelector('span').textContent=c.button;
    overlay.querySelector('.digiyTerritoryTitle').textContent=c.title;
    overlay.querySelector('.digiyTerritorySub').textContent=c.sub;
    overlay.querySelector('.digiyTerritoryClose').setAttribute('aria-label',c.close);
    overlay.querySelector('[data-territory="pc"] h3').textContent=c.pc;
    overlay.querySelector('[data-territory="pc"] p').textContent=c.pcSub;
    overlay.querySelector('[data-territory="pc"] .digiyTerritoryOpen').textContent=c.open+' →';
    overlay.querySelector('[data-territory="dd"] h3').textContent=c.dd;
    overlay.querySelector('[data-territory="dd"] p').textContent=c.ddSub;
    overlay.querySelector('[data-territory="dd"] .digiyTerritoryOpen').textContent=c.open+' →';
    overlay.dir=l==='ar'?'rtl':'ltr';
  }

  function install(){
    if(document.getElementById('digiyTerritoryButton')){render();return;}
    addStyles();
    var button=document.createElement('button');
    button.type='button';
    button.id='digiyTerritoryButton';
    button.className='digiyTerritoryButton';
    button.setAttribute('aria-haspopup','dialog');
    button.innerHTML='<strong>🌍</strong><span>TERRITOIRES</span>';

    var overlay=document.createElement('div');
    overlay.id='digiyTerritoryOverlay';
    overlay.className='digiyTerritoryOverlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML='<section class="digiyTerritoryPanel"><header class="digiyTerritoryHead"><div class="digiyTerritoryBadge">🌍</div><div><h2 class="digiyTerritoryTitle"></h2><p class="digiyTerritorySub"></p></div><button type="button" class="digiyTerritoryClose">×</button></header><div class="digiyTerritoryGrid"><a class="digiyTerritoryCard" data-territory="pc" href="./territoire.html?zone=petite-cote"><span class="digiyTerritoryFlag">🇸🇳</span><h3></h3><p></p><span class="digiyTerritoryOpen"></span></a><a class="digiyTerritoryCard" data-territory="dd" href="./territoire.html?zone=vallee-dordogne"><span class="digiyTerritoryFlag">🇫🇷</span><h3></h3><p></p><span class="digiyTerritoryOpen"></span></a></div><p class="digiyTerritoryDoctrine">0 % commission DIGIY · Contact direct · Le professionnel garde la main.</p></section>';

    function close(){overlay.classList.remove('open');button.setAttribute('aria-expanded','false');}
    button.addEventListener('click',function(){overlay.classList.add('open');button.setAttribute('aria-expanded','true');});
    overlay.querySelector('.digiyTerritoryClose').addEventListener('click',close);
    overlay.addEventListener('click',function(event){if(event.target===overlay) close();});
    document.addEventListener('keydown',function(event){if(event.key==='Escape') close();});
    document.body.appendChild(button);
    document.body.appendChild(overlay);
    render();
    setInterval(render,1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install);
  else install();
})();
