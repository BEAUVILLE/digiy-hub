/* DIGIY HUB — 3 favoris + doctrine en tête des vitrines territoire */
(function(){
  'use strict';
  if(window.__DIGIY_TERRITORY_FAVORITES__) return;
  window.__DIGIY_TERRITORY_FAVORITES__=true;

  var KEY='digiy_hub_favorites_v3_club_voix';
  var MAX=3;
  var MAP={
    'public:voixBusiness':{icon:'🎙️',name:'LA VOIX',href:'https://pro-action-digiy.digiylyfe.com/'},
    'public:reseauDigiy':{icon:'📣',name:'RÉSEAU DIGIY',href:'https://reseau-digiy.digiylyfe.com/'},
    'public:clipAly':{icon:'🦅',name:'ALY · TERRAIN',href:'https://clip-ali-digiy.digiylyfe.com/'},
    'public:explore':{icon:'🗺️',name:'EXPLORE',href:'https://explore.digiylyfe.com/'},
    'public:driver':{icon:'🚗',name:'DRIVER',href:'https://driver.digiylyfe.com/'},
    'public:chauffeurs':{icon:'👑',name:'CHAUFFEURS',href:'https://galerie-chauffeurs.digiylyfe.com/'},
    'public:loc':{icon:'🏠',name:'LOC',href:'https://loc.digiylyfe.com/'},
    'public:resa':{icon:'📅',name:'RESA',href:'https://resa-table-resto.digiylyfe.com/'},
    'public:resto':{icon:'🍽️',name:'RESTO',href:'https://resto.digiylyfe.com/'},
    'public:commerce':{icon:'👜',name:'MON COMMERCE',href:'https://mon-commerce.digiylyfe.com/'},
    'public:market':{icon:'🛍️',name:'MARKET',href:'https://market.digiylyfe.com/'},
    'public:build':{icon:'🏗️',name:'BUILD',href:'https://build.digiylyfe.com/'},
    'public:jobs':{icon:'💼',name:'JOBS',href:'https://jobs.digiylyfe.com/'},
    'public:ndimbalExpress':{icon:'⚡',name:'NDIMBAL',href:'https://ndimbal-express.digiylyfe.com/'},
    'public:pay':{icon:'📒',name:'CARNET PRO',href:'https://digiy-carnet-pro.digiylyfe.com/'},
    'public:carte':{icon:'🧭',name:'CARTE',href:'https://ndimbal-map.digiylyfe.com/'},
    'public:parolesTerrain':{icon:'🎧',name:'PAROLES',href:'https://digiylyfe.net/'},
    'public:assistant':{icon:'♾️',name:'ASSISTANT DIGIY',href:'https://knowledge.digiylyfe.com/widget/'},
    'pro:actionDigiy':{icon:'🎙️',name:'ACTION PRO',href:'https://pro-action-digiy.digiylyfe.com/'},
    'pro:inscriptionProVoix':{icon:'✍️',name:'ADHÉSION PRO',href:'https://commencer-a-payer.digiylyfe.com/'},
    'pro:espacePro':{icon:'🏢',name:'ESPACE PRO',href:'https://pro-espace.digiylyfe.com/'},
    'pro:reseauPro':{icon:'📣',name:'RÉSEAU PRO',href:'https://reseau-digiy.digiylyfe.com/hub.html'},
    'pro:activer':{icon:'💳',name:'ACTIVER',href:'https://commencer-a-payer.digiylyfe.com/'},
    'pro:tarifs':{icon:'📦',name:'TARIFS',href:'https://commencer-a-payer.digiylyfe.com/'},
    'pro:commercePro':{icon:'💰',name:'COMMERCE PRO',href:'https://commerce-pro.digiylyfe.com/pin.html'},
    'pro:marketPro':{icon:'🛍️',name:'MARKET PRO',href:'https://pro-market.digiylyfe.com/pin.html'},
    'pro:locPro':{icon:'🏠',name:'LOC PRO',href:'https://pro-loc.digiylyfe.com/pin.html'},
    'pro:resaPro':{icon:'📅',name:'RESA PRO',href:'https://pro-resa-resto.digiylyfe.com/pin.html'},
    'pro:restoPro':{icon:'🍽️',name:'RESTO PRO',href:'https://pro-resto.digiylyfe.com/pin.html'},
    'pro:driverPro':{icon:'🚗',name:'DRIVER PRO',href:'https://pro-driver.digiylyfe.com/pin.html'},
    'pro:jobsPro':{icon:'💼',name:'JOBS PRO',href:'https://pro-job.digiylyfe.com/pin.html'},
    'pro:ndimbalExpressPro':{icon:'⚡',name:'NDIMBAL PRO',href:'https://ndimbal-express.digiylyfe.com/inscription.html'},
    'pro:buildPro':{icon:'🏗️',name:'BUILD PRO',href:'https://pro-build.digiylyfe.com/pin.html'},
    'pro:explorePro':{icon:'🗺️',name:'EXPLORE PRO',href:'https://pro-explore.digiylyfe.com/pin.html'},
    'pro:payPro':{icon:'📒',name:'CARNET PRO',href:'https://pro-carnet.digiylyfe.com/pin.html?redirect=hub'}
  };

  var COPY={
    fr:{title:'MES 3 FAVORIS',empty:'Choisissez jusqu’à 3 favoris dans le HUB pour les retrouver ici.',manage:'Choisir mes favoris',flow:['Je clique.','Je parle.','J’existe.','Je suis visible.','Je suis reconnu.','J’avance.']},
    en:{title:'MY 3 FAVORITES',empty:'Choose up to 3 favorites in the HUB to find them here.',manage:'Choose my favorites',flow:['I click.','I speak.','I exist.','I am visible.','I am recognized.','I move forward.']},
    es:{title:'MIS 3 FAVORITOS',empty:'Elige hasta 3 favoritos en el HUB para encontrarlos aquí.',manage:'Elegir mis favoritos',flow:['Hago clic.','Hablo.','Existo.','Soy visible.','Soy reconocido.','Avanzo.']},
    pt:{title:'OS MEUS 3 FAVORITOS',empty:'Escolha até 3 favoritos no HUB para os encontrar aqui.',manage:'Escolher favoritos',flow:['Eu clico.','Eu falo.','Eu existo.','Sou visível.','Sou reconhecido.','Eu avanço.']},
    de:{title:'MEINE 3 FAVORITEN',empty:'Wählen Sie im HUB bis zu 3 Favoriten, um sie hier wiederzufinden.',manage:'Favoriten wählen',flow:['Ich klicke.','Ich spreche.','Ich existiere.','Ich bin sichtbar.','Ich werde erkannt.','Ich komme voran.']},
    it:{title:'I MIEI 3 PREFERITI',empty:'Scegli fino a 3 preferiti nel HUB per ritrovarli qui.',manage:'Scegli preferiti',flow:['Clicco.','Parlo.','Esisto.','Sono visibile.','Sono riconosciuto.','Vado avanti.']},
    nl:{title:'MIJN 3 FAVORIETEN',empty:'Kies maximaal 3 favorieten in de HUB om ze hier terug te vinden.',manage:'Favorieten kiezen',flow:['Ik klik.','Ik spreek.','Ik besta.','Ik ben zichtbaar.','Ik word erkend.','Ik ga vooruit.']},
    ar:{title:'مفضلاتي الثلاث',empty:'اختر حتى 3 مفضلات في HUB لتجدها هنا.',manage:'اختر المفضلات',flow:['أنقر.','أتحدث.','أنا موجود.','أنا ظاهر.','أنا معروف.','أتقدم.']}
  };

  function getLang(){
    var q=(new URLSearchParams(location.search).get('lang')||'').slice(0,2).toLowerCase();
    if(COPY[q]) return q;
    try{
      var s=(localStorage.getItem('digiy_hub_lang_8')||localStorage.getItem('digiy_hub_lang_7')||localStorage.getItem('digiy-lang')||'fr').slice(0,2).toLowerCase();
      return COPY[s]?s:'fr';
    }catch(e){return 'fr';}
  }
  function readFavs(){
    try{
      var a=JSON.parse(localStorage.getItem(KEY)||'[]');
      return (Array.isArray(a)?a:[]).filter(function(id){return typeof id==='string'&&MAP[id];}).slice(0,MAX);
    }catch(e){return [];}
  }
  function localizedHref(raw,l){
    try{
      var u=new URL(raw,location.href);
      if(/(^|\.)digiylyfe\.com$/i.test(u.hostname)) u.searchParams.set('lang',l);
      return u.href;
    }catch(e){return raw;}
  }
  function addStyle(){
    if(document.getElementById('territoryFavoritesStyle')) return;
    var s=document.createElement('style');
    s.id='territoryFavoritesStyle';
    s.textContent='.territory-favs{margin-top:14px;padding:12px;border:1px solid rgba(246,196,83,.32);border-radius:22px;background:linear-gradient(135deg,rgba(246,196,83,.10),rgba(34,197,94,.07));box-shadow:0 12px 28px rgba(0,0,0,.16)}.territory-favs-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.territory-favs-title{color:#fff3cf;font-size:11px;font-weight:1000;letter-spacing:.10em}.territory-favs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.territory-fav{min-height:58px;display:grid;grid-template-columns:34px minmax(0,1fr) 16px;align-items:center;gap:8px;padding:9px 10px;border-radius:17px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.065);text-decoration:none;color:#fff}.territory-fav-icon{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(246,196,83,.24),rgba(34,197,94,.18));font-size:18px}.territory-fav-name{min-width:0;font-size:10.5px;line-height:1.15;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.territory-fav-arrow{color:#f6c453;font-size:18px;font-weight:1000}.territory-favs-empty{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border-radius:16px;background:rgba(255,255,255,.05);color:rgba(248,250,252,.74);font-size:10.5px;font-weight:850}.territory-favs-empty a{flex:0 0 auto;padding:7px 9px;border-radius:999px;background:linear-gradient(135deg,#f6c453,#22c55e);color:#06140f;text-decoration:none;font-weight:1000}.territory-doctrine{margin-top:10px;padding:10px 12px;border-radius:18px;border:1px solid rgba(246,196,83,.26);background:rgba(255,255,255,.045);display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;text-align:center}.territory-doctrine span{font-size:11px;font-weight:950;color:#fff}.territory-doctrine i{font-style:normal;color:rgba(246,196,83,.62);font-weight:1000}.territory-doctrine strong{font-size:12px;font-weight:1000;color:#f6c453;letter-spacing:.05em}@media(max-width:620px){.territory-favs{margin-top:10px;padding:9px;border-radius:18px}.territory-favs-grid{gap:5px}.territory-fav{min-height:50px;grid-template-columns:28px minmax(0,1fr) 12px;gap:5px;padding:7px;border-radius:14px}.territory-fav-icon{width:28px;height:28px;border-radius:10px;font-size:15px}.territory-fav-name{font-size:8.5px}.territory-fav-arrow{font-size:14px}.territory-favs-empty{font-size:9px}.territory-doctrine{gap:4px;padding:8px 7px}.territory-doctrine span{font-size:9px}.territory-doctrine i{font-size:9px}.territory-doctrine strong{font-size:10px}}';
    document.head.appendChild(s);
  }
  function render(){
    var top=document.querySelector('.top');
    var hero=document.querySelector('.hero');
    if(!top||!hero) return;
    addStyle();
    var oldFav=document.getElementById('territoryFavorites');if(oldFav)oldFav.remove();
    var oldDoc=document.getElementById('territoryDoctrine');if(oldDoc)oldDoc.remove();
    var l=getLang(),c=COPY[l],ids=readFavs();
    var fav=document.createElement('section');
    fav.id='territoryFavorites';fav.className='territory-favs';
    var html='<div class="territory-favs-head"><strong class="territory-favs-title">⭐ '+c.title+'</strong></div>';
    if(ids.length){
      html+='<div class="territory-favs-grid">'+ids.map(function(id){var x=MAP[id];return '<a class="territory-fav" href="'+localizedHref(x.href,l)+'"><span class="territory-fav-icon">'+x.icon+'</span><span class="territory-fav-name">'+x.name+'</span><span class="territory-fav-arrow">›</span></a>';}).join('')+'</div>';
    }else{
      var hub='./?lang='+encodeURIComponent(l)+'#favoris';
      html+='<div class="territory-favs-empty"><span>'+c.empty+'</span><a href="'+hub+'">'+c.manage+'</a></div>';
    }
    fav.innerHTML=html;
    hero.parentNode.insertBefore(fav,hero);

    var doc=document.createElement('div');
    doc.id='territoryDoctrine';doc.className='territory-doctrine';
    var pieces=[];c.flow.forEach(function(t){pieces.push('<span>'+t+'</span>');pieces.push('<i>·</i>');});pieces.push('<strong>DIGIYLYFE</strong>');
    doc.innerHTML=pieces.join('');
    hero.parentNode.insertBefore(doc,hero);
  }
  function boot(){render();window.addEventListener('storage',function(e){if(e.key===KEY)render();});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();