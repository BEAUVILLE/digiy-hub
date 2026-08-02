/* DIGIY HUB — moteur territorial mondial permanent */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_TERRITORIES__) return;
  window.__DIGIY_HUB_TERRITORIES__=true;

  var COPY={
    fr:{eyebrow:'MOTEUR TERRITORIAL MONDIAL',title:'DIGIYLYFE — HUB MONDIAL',sub:'Choisissez le territoire, puis le besoin. Le contact reste direct.',doctrine:'0 % commission · Le professionnel garde la main.',open:'OUVRIR',pc:'Petite Côte',pcCountry:'SÉNÉGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Vallée de la Dordogne',ddCountry:'FRANCE',ddSub:'Sarlat · communes et villages du territoire'},
    en:{eyebrow:'GLOBAL TERRITORIAL ENGINE',title:'DIGIYLYFE — GLOBAL HUB',sub:'Choose the territory, then the need. Contact stays direct.',doctrine:'0% commission · The professional stays in control.',open:'OPEN',pc:'Petite Côte',pcCountry:'SENEGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordogne Valley',ddCountry:'FRANCE',ddSub:'Sarlat · towns and villages across the territory'},
    es:{eyebrow:'MOTOR TERRITORIAL MUNDIAL',title:'DIGIYLYFE — HUB MUNDIAL',sub:'Elige el territorio y después la necesidad. El contacto sigue siendo directo.',doctrine:'0 % de comisión · El profesional mantiene el control.',open:'ABRIR',pc:'Petite Côte',pcCountry:'SENEGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Valle del Dordoña',ddCountry:'FRANCIA',ddSub:'Sarlat · municipios y pueblos del territorio'},
    de:{eyebrow:'WELTWEITER REGIONALMOTOR',title:'DIGIYLYFE — GLOBALER HUB',sub:'Zuerst die Region, dann den Bedarf wählen. Der Kontakt bleibt direkt.',doctrine:'0 % Provision · Der Profi behält die Kontrolle.',open:'ÖFFNEN',pc:'Petite Côte',pcCountry:'SENEGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordogne-Tal',ddCountry:'FRANKREICH',ddSub:'Sarlat · Gemeinden und Dörfer der Region'},
    it:{eyebrow:'MOTORE TERRITORIALE MONDIALE',title:'DIGIYLYFE — HUB MONDIALE',sub:'Scegli il territorio, poi il bisogno. Il contatto resta diretto.',doctrine:'0 % commissioni · Il professionista mantiene il controllo.',open:'APRI',pc:'Petite Côte',pcCountry:'SENEGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Valle della Dordogna',ddCountry:'FRANCIA',ddSub:'Sarlat · comuni e villaggi del territorio'},
    nl:{eyebrow:'WERELDWIJDE GEBIEDSMOTOR',title:'DIGIYLYFE — WERELDWIJDE HUB',sub:'Kies eerst het gebied en daarna de behoefte. Het contact blijft rechtstreeks.',doctrine:'0% commissie · De professional houdt de regie.',open:'OPENEN',pc:'Petite Côte',pcCountry:'SENEGAL',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'Dordognevallei',ddCountry:'FRANKRIJK',ddSub:'Sarlat · gemeenten en dorpen in het gebied'},
    ar:{eyebrow:'محرك إقليمي عالمي',title:'DIGIYLYFE — مركز عالمي',sub:'اختر المنطقة ثم حاجتك. يبقى التواصل مباشراً.',doctrine:'عمولة 0٪ · المهني يبقى صاحب القرار.',open:'فتح',pc:'الساحل الصغير',pcCountry:'السنغال',pcSub:'AIBD · Ndayane · Popenguine · Somone · Ngaparou · Saly · Mbour',dd:'وادي دوردوني',ddCountry:'فرنسا',ddSub:'سارلا · مدن وقرى المنطقة'}
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
      :root{--territory-h:158px}.frame-wrap{height:calc(100dvh - var(--bar-h) - var(--territory-h))!important}.digiyTerritoryBar{height:var(--territory-h);padding:12px;background:radial-gradient(620px 190px at 6% 0,rgba(246,196,83,.24),transparent 62%),radial-gradient(620px 190px at 94% 100%,rgba(34,197,94,.24),transparent 62%),linear-gradient(135deg,#04130c,#0a3924 54%,#07180f);border-top:1px solid rgba(246,196,83,.38);border-bottom:2px solid rgba(246,196,83,.62);box-shadow:0 18px 42px rgba(0,0,0,.40);position:relative;z-index:19;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.digiyTerritoryBar:before{content:"";position:absolute;inset:7px;border:1px solid rgba(255,255,255,.08);border-radius:25px;pointer-events:none}.digiyTerritoryInner{position:relative;height:100%;max-width:1180px;margin:auto;display:grid;grid-template-columns:minmax(270px,1.05fr) minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:stretch}.digiyTerritoryIntro{min-width:0;padding:13px 15px;border-radius:23px;border:1px solid rgba(246,196,83,.36);background:linear-gradient(145deg,rgba(246,196,83,.13),rgba(255,255,255,.045));display:flex;flex-direction:column;justify-content:center}.digiyTerritoryEyebrow{display:block;color:#86efac;font-size:9px;line-height:1.1;font-weight:1000;letter-spacing:.13em}.digiyTerritoryTitle{display:block;margin-top:7px;color:#fff3cf;font-size:clamp(19px,2.4vw,28px);line-height:.92;font-weight:1000;letter-spacing:-.035em}.digiyTerritorySub{display:block;margin-top:8px;color:rgba(248,250,252,.82);font-size:11px;line-height:1.32;font-weight:850}.digiyTerritoryDoctrine{display:inline-flex;align-self:flex-start;margin-top:9px;padding:6px 9px;border-radius:999px;border:1px solid rgba(34,197,94,.38);background:rgba(34,197,94,.10);color:#dcfce7;font-size:8.5px;line-height:1.1;font-weight:1000}.digiyTerritoryLink{min-width:0;border:2px solid rgba(255,255,255,.15);border-radius:23px;background:radial-gradient(360px 140px at 100% 0,rgba(246,196,83,.16),transparent 64%),rgba(255,255,255,.065);display:grid;grid-template-columns:54px minmax(0,1fr) 32px;gap:11px;align-items:center;padding:13px 14px;color:#fff;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.20);transition:transform .15s ease,border-color .15s ease,background .15s ease}.digiyTerritoryLink:hover{transform:translateY(-2px);border-color:rgba(246,196,83,.78);background-color:rgba(255,255,255,.10)}.digiyTerritoryFlag{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.12);font-size:28px}.digiyTerritoryCountry{display:block;color:#86efac;font-size:8.5px;line-height:1;font-weight:1000;letter-spacing:.13em}.digiyTerritoryLink b{display:block;margin-top:6px;color:#fff3cf;font-size:clamp(15px,1.8vw,21px);line-height:1.02;font-weight:1000}.digiyTerritoryLink small{display:block;margin-top:7px;color:rgba(248,250,252,.72);font-size:9.5px;line-height:1.28;font-weight:800}.digiyTerritoryOpen{display:block;margin-top:7px;color:#bbf7d0;font-size:8.5px;line-height:1;font-weight:1000;letter-spacing:.10em}.digiyTerritoryArrow{color:#f6c453;font-size:31px;font-weight:1000;text-align:right}html[dir="rtl"] .digiyTerritoryInner{direction:rtl}html[dir="rtl"] .digiyTerritoryArrow{transform:rotate(180deg)}@media(max-width:720px){:root{--territory-h:148px}.digiyTerritoryBar{padding:9px 8px}.digiyTerritoryBar:before{inset:5px;border-radius:20px}.digiyTerritoryInner{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:0 2px}.digiyTerritoryInner::-webkit-scrollbar{display:none}.digiyTerritoryIntro{flex:0 0 190px;padding:11px 12px;border-radius:19px}.digiyTerritoryEyebrow{font-size:7.5px}.digiyTerritoryTitle{font-size:19px}.digiyTerritorySub{font-size:9.5px;margin-top:6px}.digiyTerritoryDoctrine{font-size:7.5px;margin-top:7px;padding:5px 7px}.digiyTerritoryLink{flex:0 0 min(286px,78vw);grid-template-columns:47px minmax(0,1fr) 24px;border-radius:19px;padding:10px}.digiyTerritoryFlag{width:47px;height:47px;border-radius:15px;font-size:24px}.digiyTerritoryLink b{font-size:16px}.digiyTerritoryLink small{font-size:8.5px;margin-top:5px}.digiyTerritoryOpen{font-size:7.5px;margin-top:6px}.digiyTerritoryArrow{font-size:25px}}';
    document.head.appendChild(style);
  }

  function render(){
    var bar=document.getElementById('digiyTerritoryBar');
    if(!bar) return;
    var l=language(),c=COPY[l];
    bar.dir=l==='ar'?'rtl':'ltr';
    Object.keys(c).forEach(function(key){
      var node=bar.querySelector('[data-copy="'+key+'"]');
      if(node) node.textContent=c[key];
    });
  }

  function territoryCard(code,flag,url){
    return '<a class="digiyTerritoryLink" href="'+url+'"><span class="digiyTerritoryFlag">'+flag+'</span><span><span class="digiyTerritoryCountry" data-copy="'+code+'Country"></span><b data-copy="'+code+'"></b><small data-copy="'+code+'Sub"></small><span class="digiyTerritoryOpen" data-copy="open"></span></span><span class="digiyTerritoryArrow">›</span></a>';
  }

  function install(){
    if(document.getElementById('digiyTerritoryBar')){render();return;}
    addStyles();
    var header=document.querySelector('.language-shell');
    if(!header) return;
    var bar=document.createElement('nav');
    bar.id='digiyTerritoryBar';
    bar.className='digiyTerritoryBar';
    bar.setAttribute('aria-label','Moteur territorial mondial DIGIYLYFE');
    bar.innerHTML='<div class="digiyTerritoryInner"><div class="digiyTerritoryIntro"><span class="digiyTerritoryEyebrow" data-copy="eyebrow"></span><strong class="digiyTerritoryTitle" data-copy="title"></strong><span class="digiyTerritorySub" data-copy="sub"></span><span class="digiyTerritoryDoctrine" data-copy="doctrine"></span></div>'+territoryCard('pc','🇸🇳','./territoire.html?zone=petite-cote')+territoryCard('dd','🇫🇷','./territoire.html?zone=vallee-dordogne')+'</div>';
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
