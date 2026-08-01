/* DIGIY HUB — raccourci PUBLIC au-dessus de PRO */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PUBLIC_CARTOUCHE__) return;
  window.__DIGIY_HUB_PUBLIC_CARTOUCHE__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var LANG_KEY='digiy_hub_lang_7';
  var FAV_KEY='digiy_hub_public_favoris_v1';
  var LAST_KEY='digiy_hub_public_dernier_v1';
  var MAX_FAVS=3;
  var observedDoc=null;
  var observer=null;
  var syncing=false;
  var lastSignature='';

  var COPY={
    fr:{tab:'PUBLIC',title:'Mes raccourcis publics',sub:'Trouve directement la bonne porte sans parcourir tout le HUB.',resume:'Reprendre mon dernier accès',favorites:'Mes raccourcis',empty:'Ajoute jusqu’à 3 favoris avec l’étoile.',max:'Maximum 3 favoris : retire une étoile avant d’en ajouter une autre.',find:'Trouver et être orienté',move:'Se déplacer et réserver',trade:'Acheter, vendre et travailler',network:'Réseau et outils',open:'Ouvrir',close:'Fermer',doors:'portes'},
    en:{tab:'PUBLIC',title:'My public shortcuts',sub:'Open the right door without scrolling through the whole HUB.',resume:'Resume my last access',favorites:'My shortcuts',empty:'Add up to 3 favorites with the star.',max:'Maximum 3 favorites: remove one star first.',find:'Find and get guidance',move:'Travel and book',trade:'Buy, sell and work',network:'Network and tools',open:'Open',close:'Close',doors:'doors'},
    es:{tab:'PÚBLICO',title:'Mis accesos públicos',sub:'Abre la puerta correcta sin recorrer todo el HUB.',resume:'Retomar mi último acceso',favorites:'Mis accesos directos',empty:'Añade hasta 3 favoritos con la estrella.',max:'Máximo 3 favoritos: quita primero una estrella.',find:'Buscar y orientarse',move:'Moverse y reservar',trade:'Comprar, vender y trabajar',network:'Red y herramientas',open:'Abrir',close:'Cerrar',doors:'puertas'},
    de:{tab:'PUBLIC',title:'Meine öffentlichen Zugänge',sub:'Öffne die richtige Tür, ohne durch den ganzen HUB zu scrollen.',resume:'Letzten Zugang fortsetzen',favorites:'Meine Schnellzugriffe',empty:'Füge mit dem Stern bis zu 3 Favoriten hinzu.',max:'Maximal 3 Favoriten: Entferne zuerst einen Stern.',find:'Finden und orientieren',move:'Fahren und buchen',trade:'Kaufen, verkaufen und arbeiten',network:'Netzwerk und Werkzeuge',open:'Öffnen',close:'Schließen',doors:'Türen'},
    it:{tab:'PUBBLICO',title:'Le mie scorciatoie pubbliche',sub:'Apri la porta giusta senza scorrere tutto l’HUB.',resume:'Riprendi il mio ultimo accesso',favorites:'Le mie scorciatoie',empty:'Aggiungi fino a 3 preferiti con la stella.',max:'Massimo 3 preferiti: rimuovi prima una stella.',find:'Trovare e orientarsi',move:'Spostarsi e prenotare',trade:'Comprare, vendere e lavorare',network:'Rete e strumenti',open:'Apri',close:'Chiudi',doors:'porte'},
    nl:{tab:'PUBLIEK',title:'Mijn publieke snelkoppelingen',sub:'Open de juiste deur zonder door de hele HUB te scrollen.',resume:'Mijn laatste toegang hervatten',favorites:'Mijn snelkoppelingen',empty:'Voeg met de ster maximaal 3 favorieten toe.',max:'Maximaal 3 favorieten: verwijder eerst een ster.',find:'Vinden en begeleiden',move:'Reizen en boeken',trade:'Kopen, verkopen en werken',network:'Netwerk en hulpmiddelen',open:'Openen',close:'Sluiten',doors:'deuren'},
    ar:{tab:'عام',title:'اختصاراتي العامة',sub:'افتح الباب المناسب مباشرة من دون تصفح HUB بالكامل.',resume:'متابعة آخر وصول',favorites:'اختصاراتي',empty:'أضف حتى 3 مفضلات بواسطة النجمة.',max:'الحد الأقصى 3 مفضلات: أزل نجمة أولاً.',find:'البحث والتوجيه',move:'التنقل والحجز',trade:'الشراء والبيع والعمل',network:'الشبكة والأدوات',open:'فتح',close:'إغلاق',doors:'أبواب'}
  };

  function language(doc){
    var value='';
    try{value=localStorage.getItem(LANG_KEY)||'';}catch(e){}
    value=(value||(doc&&doc.documentElement.lang)||'fr').slice(0,2).toLowerCase();
    return COPY[value]?value:'fr';
  }

  function read(key,fallback){
    try{
      var raw=localStorage.getItem(key);
      if(!raw) return fallback;
      var value=JSON.parse(raw);
      return value==null?fallback:value;
    }catch(e){return fallback;}
  }

  function write(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}
  }

  function cleanUrl(url){
    try{return new URL(url,location.href).href;}catch(e){return url||'';}
  }

  function groupFor(url){
    url=(url||'').toLowerCase();
    if(url.indexOf('driver.')!==-1 || url.indexOf('galerie-chauffeurs')!==-1 || url.indexOf('loc.')!==-1 || url.indexOf('resa-table')!==-1 || url.indexOf('resto.')!==-1 || url.indexOf('explore.')!==-1 || url.indexOf('ndimbal-map')!==-1) return 'move';
    if(url.indexOf('mon-commerce')!==-1 || url.indexOf('market.')!==-1 || url.indexOf('bonne-affaire')!==-1 || url.indexOf('build.')!==-1 || url.indexOf('jobs.')!==-1 || url.indexOf('ndimbal-express')!==-1) return 'trade';
    if(url.indexOf('reseau-digiy')!==-1 || url.indexOf('digiylyfe.net')!==-1 || url.indexOf('carnet')!==-1) return 'network';
    return 'find';
  }

  function getFavs(){
    var list=read(FAV_KEY,[]);
    if(!Array.isArray(list)) list=[];
    var result=[];
    list.forEach(function(url){url=cleanUrl(url);if(url&&!result.includes(url)) result.push(url);});
    return result.slice(0,MAX_FAVS);
  }

  function extract(doc){
    var cards=Array.prototype.slice.call(doc.querySelectorAll('#publicGrid article.card.public, #publicGrid .card.public'));
    var seen={};
    return cards.map(function(card){
      var link=card.querySelector('a.open[href]');
      if(!link) return null;
      var url=cleanUrl(link.getAttribute('href')||'');
      if(!url||seen[url]) return null;
      seen[url]=true;
      var icon=card.querySelector('.icon');
      var name=card.querySelector('.name');
      var desc=card.querySelector('.desc');
      return {url:url,icon:icon?icon.textContent.trim():'🌍',name:name?name.textContent.trim():'PUBLIC',desc:desc?desc.textContent.trim():'',group:groupFor(url)};
    }).filter(Boolean);
  }

  function styles(){return ''+
    '@media(min-width:761px){.digiyProTab{top:calc(50% + 72px)!important}.digiyPublicTab{display:flex!important}}'+
    '.digiyPublicTab{position:fixed;left:8px;top:calc(50% - 72px);transform:translateY(-50%);z-index:113;width:62px;min-height:120px;border:1px solid rgba(120,220,255,.62);border-radius:21px;background:linear-gradient(180deg,#dff8ff,#5eead4,#22c55e);color:#052017;box-shadow:0 16px 38px rgba(0,0,0,.36);display:none;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:10px 5px;font-weight:1000;cursor:pointer}'+
    '.digiyPublicTab strong{font-size:25px}.digiyPublicTab span{font-size:10px;letter-spacing:.07em;writing-mode:vertical-rl;transform:rotate(180deg)}'+
    '.digiyPublicOverlay{position:fixed;inset:0;z-index:121;display:none;background:rgba(0,0,0,.68);backdrop-filter:blur(7px);padding:14px}.digiyPublicOverlay.open{display:flex}'+
    '.digiyPublicPanel{width:min(430px,calc(100% - 20px));max-height:88svh;overflow:auto;margin:auto auto auto 72px;border:1px solid rgba(94,234,212,.48);border-radius:28px;background:radial-gradient(520px 240px at 0 0,rgba(94,234,212,.18),transparent 65%),radial-gradient(520px 240px at 100% 0,rgba(34,197,94,.18),transparent 65%),#06150f;box-shadow:0 28px 80px rgba(0,0,0,.58);padding:14px;color:#fff}'+
    '.digiyPublicHead{position:sticky;top:-14px;z-index:2;display:grid;grid-template-columns:52px minmax(0,1fr) 42px;gap:11px;align-items:center;padding:14px 2px 12px;border-bottom:1px solid rgba(255,255,255,.10);background:rgba(6,21,15,.97);backdrop-filter:blur(12px)}'+
    '.digiyPublicBadge{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#dff8ff,#5eead4,#22c55e);color:#052017;font-size:25px}'+
    '.digiyPublicTitle{margin:0;font-size:23px;line-height:1;font-weight:1000;color:#dffeff}.digiyPublicSub{margin-top:5px;color:rgba(248,250,252,.72);font-size:11.5px;line-height:1.35;font-weight:800}'+
    '.digiyPublicClose{width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;font-size:22px;cursor:pointer}'+
    '.digiyPublicBody{display:grid;gap:10px;margin-top:12px}.digiyPublicSectionTitle{margin:0 2px;color:#cffff8;font-size:11px;font-weight:1000;letter-spacing:.10em;text-transform:uppercase}'+
    '.digiyPublicResume{min-height:64px;border:1px solid rgba(94,234,212,.48);border-radius:18px;background:linear-gradient(135deg,rgba(94,234,212,.18),rgba(34,197,94,.14));display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center;padding:10px 12px;color:#fff;text-decoration:none}'+
    '.digiyPublicResumeIcon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#dff8ff,#5eead4,#22c55e);color:#052017;font-size:21px}.digiyPublicResume b{display:block;font-size:12.5px;font-weight:1000}.digiyPublicResume small{display:block;margin-top:3px;color:rgba(248,250,252,.68);font-size:10px;font-weight:800}'+
    '.digiyPublicFavBox{padding:10px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(255,255,255,.045)}.digiyPublicFavList{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.digiyPublicFavEmpty{margin-top:8px;color:rgba(248,250,252,.62);font-size:10.5px;font-weight:800}'+
    '.digiyPublicFav{min-height:68px;border:1px solid rgba(255,255,255,.12);border-radius:15px;background:rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:7px;color:#fff;text-align:center;text-decoration:none}.digiyPublicFav strong{font-size:22px}.digiyPublicFav span{font-size:9px;line-height:1.12;font-weight:1000}'+
    '.digiyPublicGroup{border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(255,255,255,.035);overflow:hidden}.digiyPublicGroup summary{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;cursor:pointer;color:#dffeff;font-size:12px;font-weight:1000}.digiyPublicGroup summary span:last-child{color:rgba(248,250,252,.55);font-size:9.5px}.digiyPublicGroupGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 9px 9px}'+
    '.digiyPublicLink{position:relative;min-height:72px;border:1px solid rgba(255,255,255,.12);border-radius:17px;background:rgba(255,255,255,.06);display:grid;grid-template-columns:38px 1fr;gap:8px;align-items:center;padding:9px 34px 9px 9px;color:#fff;text-decoration:none}.digiyPublicIcon{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:19px}.digiyPublicLink b{display:block;font-size:10.8px;line-height:1.14;font-weight:1000}.digiyPublicLink small{display:block;margin-top:3px;color:rgba(248,250,252,.58);font-size:9px;font-weight:800}.digiyPublicStar{position:absolute;right:6px;top:6px;width:29px;height:29px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.22);color:#fff3cf;font-size:15px;cursor:pointer}.digiyPublicStar.active{background:rgba(246,196,83,.18);border-color:rgba(246,196,83,.55)}'+
    '@media(max-width:760px){.digiyPublicTab{display:none!important}.digiyPublicOverlay{align-items:flex-end;padding:8px}.digiyPublicPanel{width:100%;max-height:82svh;margin:0;border-radius:27px 27px 17px 17px}.digiyPublicGroupGrid{grid-template-columns:1fr 1fr}}'+
    '@media(max-width:430px){.digiyPublicGroupGrid{grid-template-columns:1fr}.digiyPublicLink{min-height:62px}.digiyPublicFavList{grid-template-columns:repeat(3,minmax(0,1fr))}}';}

  function track(data){write(LAST_KEY,{url:data.url,name:data.name,icon:data.icon,at:Date.now()});}

  function toggleFavorite(data,c,doc){
    var favs=getFavs();
    var index=favs.indexOf(data.url);
    if(index>=0) favs.splice(index,1);
    else {
      if(favs.length>=MAX_FAVS){alert(c.max);return;}
      favs.push(data.url);
    }
    write(FAV_KEY,favs);
    lastSignature='';
    render(doc,true);
  }

  function makeLink(doc,data,c,favs){
    var wrap=doc.createElement('div');wrap.className='digiyPublicLink';
    var a=doc.createElement('a');a.href=data.url;a.style.display='contents';a.setAttribute('aria-label',c.open+' '+data.name);
    var icon=doc.createElement('span');icon.className='digiyPublicIcon';icon.textContent=data.icon;
    var copy=doc.createElement('span');
    var name=doc.createElement('b');name.textContent=data.name;
    var open=doc.createElement('small');open.textContent=c.open+' →';
    copy.appendChild(name);copy.appendChild(open);a.appendChild(icon);a.appendChild(copy);
    a.addEventListener('click',function(){track(data);});
    var star=doc.createElement('button');star.type='button';star.className='digiyPublicStar'+(favs.includes(data.url)?' active':'');star.textContent=favs.includes(data.url)?'★':'☆';star.setAttribute('aria-label',c.favorites+' '+data.name);
    star.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleFavorite(data,c,doc);});
    wrap.appendChild(a);wrap.appendChild(star);return wrap;
  }

  function makeFavorite(doc,data){
    var a=doc.createElement('a');a.className='digiyPublicFav';a.href=data.url;
    var icon=doc.createElement('strong');icon.textContent=data.icon;
    var name=doc.createElement('span');name.textContent=data.name;
    a.appendChild(icon);a.appendChild(name);a.addEventListener('click',function(){track(data);});return a;
  }

  function render(doc,force){
    if(syncing||!doc||!doc.body) return;
    var items=extract(doc);
    if(!items.length) return;
    var lang=language(doc),c=COPY[lang],favs=getFavs();
    var signature=lang+'|'+favs.join('|')+'|'+items.map(function(x){return x.url+'@'+x.name;}).join('|');
    if(!force&&signature===lastSignature&&doc.getElementById('digiyPublicQuick')) return;
    syncing=true;
    try{
      lastSignature=signature;
      var style=doc.getElementById('digiyPublicStyle');
      if(!style){style=doc.createElement('style');style.id='digiyPublicStyle';style.textContent=styles();doc.head.appendChild(style);}
      var root=doc.getElementById('digiyPublicQuick');
      if(!root){
        root=doc.createElement('div');root.id='digiyPublicQuick';
        root.innerHTML='<button class="digiyPublicTab" id="digiyPublicTab" type="button"><strong>🌍</strong><span></span></button><div class="digiyPublicOverlay" id="digiyPublicOverlay" aria-hidden="true"><section class="digiyPublicPanel" role="dialog" aria-modal="true" aria-labelledby="digiyPublicTitle"><header class="digiyPublicHead"><div class="digiyPublicBadge">🌍</div><div><h2 class="digiyPublicTitle" id="digiyPublicTitle"></h2><div class="digiyPublicSub"></div></div><button class="digiyPublicClose" type="button">×</button></header><div class="digiyPublicBody"></div></section></div>';
        doc.body.appendChild(root);
        root.querySelector('.digiyPublicTab').addEventListener('click',function(){var o=root.querySelector('.digiyPublicOverlay');o.classList.add('open');o.setAttribute('aria-hidden','false');doc.body.dataset.digiyPublicOverflow=doc.body.style.overflow||'';doc.body.style.overflow='hidden';});
        root.querySelector('.digiyPublicClose').addEventListener('click',function(){close(doc);});
        root.querySelector('.digiyPublicOverlay').addEventListener('click',function(e){if(e.target===this) close(doc);});
        doc.addEventListener('keydown',function(e){if(e.key==='Escape') close(doc);});
      }
      root.querySelector('.digiyPublicTab span').textContent=c.tab;
      root.querySelector('.digiyPublicTitle').textContent=c.title;
      root.querySelector('.digiyPublicSub').textContent=c.sub;
      root.querySelector('.digiyPublicClose').setAttribute('aria-label',c.close);
      var body=root.querySelector('.digiyPublicBody');body.innerHTML='';
      var known={};items.forEach(function(item){known[item.url]=item;});
      var last=read(LAST_KEY,null);
      if(last&&known[last.url]){
        var data=known[last.url];
        var resume=doc.createElement('a');resume.className='digiyPublicResume';resume.href=data.url;
        resume.innerHTML='<span class="digiyPublicResumeIcon">'+data.icon+'</span><span><b>'+c.resume+'</b><small></small></span><strong>→</strong>';
        resume.querySelector('small').textContent=data.name;resume.addEventListener('click',function(){track(data);});body.appendChild(resume);
      }
      var favBox=doc.createElement('section');favBox.className='digiyPublicFavBox';
      var favTitle=doc.createElement('div');favTitle.className='digiyPublicSectionTitle';favTitle.textContent='⭐ '+c.favorites;favBox.appendChild(favTitle);
      var favList=doc.createElement('div');favList.className='digiyPublicFavList';favs.forEach(function(url){if(known[url]) favList.appendChild(makeFavorite(doc,known[url]));});
      if(favList.children.length) favBox.appendChild(favList);else {var empty=doc.createElement('div');empty.className='digiyPublicFavEmpty';empty.textContent=c.empty;favBox.appendChild(empty);}body.appendChild(favBox);
      var groups={find:[],move:[],trade:[],network:[]};items.forEach(function(item){groups[item.group].push(item);});
      ['find','move','trade','network'].forEach(function(key,index){
        if(!groups[key].length) return;
        var details=doc.createElement('details');details.className='digiyPublicGroup';if(window.innerWidth>760||index===0) details.open=true;
        var summary=doc.createElement('summary');summary.innerHTML='<span></span><span></span>';summary.children[0].textContent=c[key];summary.children[1].textContent=groups[key].length+' '+c.doors;
        var grid=doc.createElement('div');grid.className='digiyPublicGroupGrid';groups[key].forEach(function(item){grid.appendChild(makeLink(doc,item,c,favs));});
        details.appendChild(summary);details.appendChild(grid);body.appendChild(details);
      });
      bindMobile(doc);
    }finally{syncing=false;}
  }

  function close(doc){
    var overlay=doc.getElementById('digiyPublicOverlay');if(!overlay)return;
    overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');doc.body.style.overflow=doc.body.dataset.digiyPublicOverflow||'';
  }

  function open(doc){
    var overlay=doc.getElementById('digiyPublicOverlay');if(!overlay)return;
    overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');doc.body.dataset.digiyPublicOverflow=doc.body.style.overflow||'';doc.body.style.overflow='hidden';
  }

  function bindMobile(doc){
    var entry=doc.querySelector('[data-digiy-public-mobile-entry]')||doc.querySelector('.bottomNav a[href="#public"]');
    if(!entry) return;
    entry.setAttribute('data-digiy-public-mobile-entry','true');
    if(entry.__digiyPublicBound) return;
    entry.__digiyPublicBound=true;
    entry.addEventListener('click',function(e){if(window.matchMedia('(max-width:760px)').matches){e.preventDefault();render(doc,true);open(doc);}});
  }

  function install(){
    try{
      var doc=frame.contentDocument;if(!doc||!doc.body)return;
      render(doc,false);
      if(observedDoc!==doc){
        observedDoc=doc;if(observer)observer.disconnect();
        observer=new MutationObserver(function(){setTimeout(function(){render(doc,false);},40);});
        observer.observe(doc.body,{childList:true,subtree:true});
      }
    }catch(e){}
  }

  frame.addEventListener('load',function(){setTimeout(install,220);});
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-shell-lang]')){lastSignature='';setTimeout(install,180);}});
  setInterval(install,1400);
  setTimeout(install,320);
})();
