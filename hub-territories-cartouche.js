/* DIGIY HUB — bandeau territorial mondial permanent */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_TERRITORIES__) return;
  window.__DIGIY_HUB_TERRITORIES__=true;

  var COPY={
    fr:{title:'TERRITOIRES',sub:'Choisis ton terrain, puis ton besoin.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Vallée de la Dordogne',ddSub:'Sarlat · Dordogne'},
    en:{title:'TERRITORIES',sub:'Choose your area, then your need.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Dordogne Valley',ddSub:'Sarlat · Dordogne'},
    es:{title:'TERRITORIOS',sub:'Elige tu territorio y después tu necesidad.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Valle del Dordoña',ddSub:'Sarlat · Dordoña'},
    de:{title:'REGIONEN',sub:'Wähle zuerst die Region, dann deinen Bedarf.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Dordogne-Tal',ddSub:'Sarlat · Dordogne'},
    it:{title:'TERRITORI',sub:'Scegli il territorio, poi il bisogno.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Valle della Dordogna',ddSub:'Sarlat · Dordogna'},
    nl:{title:'GEBIEDEN',sub:'Kies je gebied en daarna je behoefte.',pc:'Petite Côte',pcSub:'AIBD · Saly · Mbour',dd:'Dordognevallei',ddSub:'Sarlat · Dordogne'},
    ar:{title:'المناطق',sub:'اختر المنطقة ثم اختر حاجتك.',pc:'الساحل الصغير',pcSub:'AIBD · Saly · Mbour',dd:'وادي دوردوني',ddSub:'سارلا · دوردوني'}
  };

  function language(){
    var value='fr';
    try{value=(localStorage.getItem('digiy_hub_lang_v1')||'fr').slice(0,2).toLowerCase();}catch(e){}
    return COPY[value]?value:'fr';
  }

  function addStyles(){
    if(document.getElementById('digiyTerritoryBarStyles')) return;
    var style=document.createElement('style');
    style.id='digiyTerritoryBarStyles';
    style.textContent='\
      :root{--territory-h:92px}.frame-wrap{height:calc(100dvh - var(--bar-h) - var(--territory-h))!important}.digiyTerritoryBar{height:var(--territory-h);padding:8px 10px;background:linear-gradient(135deg,#07180f,#0b3020 55%,#102416);border-bottom:1px solid rgba(246,196,83,.30);box-shadow:0 10px 28px rgba(0,0,0,.24);position:relative;z-index:19;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.digiyTerritoryInner{height:100%;max-width:1180px;margin:auto;display:grid;grid-template-columns:minmax(170px,.7fr) minmax(0,1fr) minmax(0,1fr);gap:9px;align-items:stretch}.digiyTerritoryIntro{display:flex;align-items:center;gap:10px;min-width:0;padding:4px 8px}.digiyTerritoryGlobe{width:44px;height:44px;flex:0 0 auto;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#f6c453,#22c55e);color:#06140f;font-size:22px;box-shadow:0 10px 24px rgba(0,0,0,.24)}.digiyTerritoryIntro b{display:block;color:#fff3cf;font-size:12px;letter-spacing:.08em}.digiyTerritoryIntro small{display:block;margin-top:4px;color:rgba(248,250,252,.68);font-size:10px;line-height:1.25;font-weight:800}.digiyTerritoryLink{min-width:0;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.055);display:grid;grid-template-columns:42px minmax(0,1fr) 24px;gap:9px;align-items:center;padding:9px 11px;color:#fff;text-decoration:none;transition:transform .15s ease,border-color .15s ease,background .15s ease}.digiyTerritoryLink:hover{transform:translateY(-1px);border-color:rgba(246,196,83,.62);background:rgba(255,255,255,.09)}.digiyTerritoryFlag{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:22px}.digiyTerritoryLink b{display:block;color:#fff3cf;font-size:14px;line-height:1.1}.digiyTerritoryLink small{display:block;margin-top:4px;color:rgba(248,250,252,.66);font-size:9.5px;line-height:1.2;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.digiyTerritoryArrow{color:#86efac;font-size:22px;font-weight:1000;text-align:right}html[dir="rtl"] .digiyTerritoryInner{direction:rtl}html[dir="rtl"] .digiyTerritoryArrow{transform:rotate(180deg)}@media(max-width:720px){:root{--territory-h:86px}.digiyTerritoryBar{padding:7px 8px}.digiyTerritoryInner{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none}.digiyTerritoryInner::-webkit-scrollbar{display:none}.digiyTerritoryIntro{flex:0 0 118px;padding:3px 5px}.digiyTerritoryGlobe{width:38px;height:38px;border-radius:13px;font-size:19px}.digiyTerritoryIntro small{display:none}.digiyTerritoryIntro b{font-size:10px}.digiyTerritoryLink{flex:0 0 min(252px,72vw);grid-template-columns:38px minmax(0,1fr) 20px;border-radius:16px;padding:7px 9px}.digiyTerritoryFlag{width:38px;height:38px;border-radius:12px;font-size:20px}.digiyTerritoryLink b{font-size:12px}.digiyTerritoryLink small{font-size:9px}}';
    document.head.appendChild(style);
  }

  function render(){
    var bar=document.getElementById('digiyTerritoryBar');
    if(!bar) return;
    var l=language(),c=COPY[l];
    bar.dir=l==='ar'?'rtl':'ltr';
    bar.querySelector('[data-copy="title"]').textContent=c.title;
    bar.querySelector('[data-copy="sub"]').textContent=c.sub;
    bar.querySelector('[data-copy="pc"]').textContent=c.pc;
    bar.querySelector('[data-copy="pcSub"]').textContent=c.pcSub;
    bar.querySelector('[data-copy="dd"]').textContent=c.dd;
    bar.querySelector('[data-copy="ddSub"]').textContent=c.ddSub;
  }

  function install(){
    if(document.getElementById('digiyTerritoryBar')){render();return;}
    addStyles();
    var header=document.querySelector('.language-shell');
    if(!header) return;
    var bar=document.createElement('nav');
    bar.id='digiyTerritoryBar';
    bar.className='digiyTerritoryBar';
    bar.setAttribute('aria-label','Territoires DIGIY');
    bar.innerHTML='<div class="digiyTerritoryInner"><div class="digiyTerritoryIntro"><span class="digiyTerritoryGlobe">🌍</span><span><b data-copy="title">TERRITOIRES</b><small data-copy="sub"></small></span></div><a class="digiyTerritoryLink" href="./territoire.html?zone=petite-cote"><span class="digiyTerritoryFlag">🇸🇳</span><span><b data-copy="pc"></b><small data-copy="pcSub"></small></span><span class="digiyTerritoryArrow">›</span></a><a class="digiyTerritoryLink" href="./territoire.html?zone=vallee-dordogne"><span class="digiyTerritoryFlag">🇫🇷</span><span><b data-copy="dd"></b><small data-copy="ddSub"></small></span><span class="digiyTerritoryArrow">›</span></a></div>';
    header.insertAdjacentElement('afterend',bar);
    render();
    document.addEventListener('click',function(event){
      if(event.target&&event.target.closest&&event.target.closest('[data-shell-lang]')) setTimeout(render,120);
    });
    setInterval(render,1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
