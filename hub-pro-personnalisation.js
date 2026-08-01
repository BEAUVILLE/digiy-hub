/* DIGIY HUB — personnalisation locale de l'atelier PRO */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PRO_PERSONNALISATION__) return;
  window.__DIGIY_HUB_PRO_PERSONNALISATION__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var LANG_KEY='digiy_hub_lang_7';
  var FAV_KEY='digiy_hub_pro_favoris_v1';
  var LAST_KEY='digiy_hub_pro_dernier_v1';
  var MAX_FAVS=3;

  var COPY={
    fr:{resume:'Reprendre mon dernier module',favorites:'Mes raccourcis',all:'Tous les modules',empty:'Ajoute jusqu’à 3 favoris avec l’étoile.',max:'Maximum 3 favoris : retire une étoile avant d’en ajouter une autre.',open:'Ouvrir',orient:'M’orienter',work:'Travailler',sell:'Vendre et réserver',manage:'Gérer mon activité',modules:'modules'},
    en:{resume:'Resume my last module',favorites:'My shortcuts',all:'All modules',empty:'Add up to 3 favorites with the star.',max:'Maximum 3 favorites: remove one star before adding another.',open:'Open',orient:'Get guidance',work:'Work',sell:'Sell and book',manage:'Manage my activity',modules:'modules'},
    es:{resume:'Retomar mi último módulo',favorites:'Mis accesos directos',all:'Todos los módulos',empty:'Añade hasta 3 favoritos con la estrella.',max:'Máximo 3 favoritos: quita una estrella antes de añadir otra.',open:'Abrir',orient:'Orientarme',work:'Trabajar',sell:'Vender y reservar',manage:'Gestionar mi actividad',modules:'módulos'},
    de:{resume:'Letztes Modul fortsetzen',favorites:'Meine Schnellzugriffe',all:'Alle Module',empty:'Füge mit dem Stern bis zu 3 Favoriten hinzu.',max:'Maximal 3 Favoriten: Entferne zuerst einen Stern.',open:'Öffnen',orient:'Orientierung',work:'Arbeiten',sell:'Verkaufen und buchen',manage:'Aktivität verwalten',modules:'Module'},
    it:{resume:'Riprendi il mio ultimo modulo',favorites:'Le mie scorciatoie',all:'Tutti i moduli',empty:'Aggiungi fino a 3 preferiti con la stella.',max:'Massimo 3 preferiti: rimuovi prima una stella.',open:'Apri',orient:'Orientarmi',work:'Lavorare',sell:'Vendere e prenotare',manage:'Gestire la mia attività',modules:'moduli'},
    nl:{resume:'Mijn laatste module hervatten',favorites:'Mijn snelkoppelingen',all:'Alle modules',empty:'Voeg met de ster maximaal 3 favorieten toe.',max:'Maximaal 3 favorieten: verwijder eerst een ster.',open:'Openen',orient:'Begeleiding',work:'Werken',sell:'Verkopen en reserveren',manage:'Mijn activiteit beheren',modules:'modules'},
    ar:{resume:'متابعة آخر وحدة',favorites:'اختصاراتي',all:'كل الوحدات',empty:'أضف حتى 3 مفضلات بواسطة النجمة.',max:'الحد الأقصى 3 مفضلات: أزل نجمة قبل إضافة أخرى.',open:'فتح',orient:'التوجيه',work:'العمل',sell:'البيع والحجز',manage:'إدارة نشاطي',modules:'وحدات'}
  };

  var META=[
    {id:'action',match:'pro-action-digiy.digiylyfe.com',group:'orient'},
    {id:'commerce',match:'commerce-pro.digiylyfe.com',group:'sell'},
    {id:'market',match:'pro-market.digiylyfe.com',group:'sell'},
    {id:'loc',match:'pro-loc.digiylyfe.com',group:'sell'},
    {id:'resa',match:'pro-resa-resto.digiylyfe.com',group:'sell'},
    {id:'resto',match:'pro-resto.digiylyfe.com',group:'sell'},
    {id:'driver',match:'pro-driver.digiylyfe.com',group:'work'},
    {id:'jobs',match:'pro-job.digiylyfe.com',group:'work'},
    {id:'build',match:'pro-build.digiylyfe.com',group:'work'},
    {id:'explore',match:'pro-explore.digiylyfe.com',group:'work'},
    {id:'carnet',match:'pro-carnet.digiylyfe.com',group:'manage'}
  ];

  var syncing=false;
  var lastSignature='';

  function lang(doc){
    var value='';
    try{value=localStorage.getItem(LANG_KEY)||'';}catch(e){}
    value=(value||(doc&&doc.documentElement.lang)||'fr').slice(0,2).toLowerCase();
    return COPY[value]?value:'fr';
  }

  function read(key,fallback){
    try{
      var raw=localStorage.getItem(key);
      if(!raw) return fallback;
      var parsed=JSON.parse(raw);
      return parsed==null?fallback:parsed;
    }catch(e){return fallback;}
  }

  function write(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}
  }

  function cleanUrl(url){
    try{return new URL(url,location.href).href;}catch(e){return url||'';}
  }

  function metaFor(url){
    return META.find(function(item){return (url||'').indexOf(item.match)!==-1;})||null;
  }

  function getFavs(){
    var list=read(FAV_KEY,[]);
    if(!Array.isArray(list)) list=[];
    var unique=[];
    list.forEach(function(url){url=cleanUrl(url);if(url&&!unique.includes(url)) unique.push(url);});
    return unique.slice(0,MAX_FAVS);
  }

  function setFavs(list){write(FAV_KEY,list.slice(0,MAX_FAVS));}

  function moduleData(link){
    var url=cleanUrl(link.getAttribute('href')||'');
    var iconNode=link.querySelector('.digiyProIcon');
    var nameNode=link.querySelector('b');
    return {url:url,icon:iconNode?iconNode.textContent.trim():'🏢',name:nameNode?nameNode.textContent.trim():'PRO',meta:metaFor(url)};
  }

  function styles(){return ''+
    '.digiyProGrid{display:block!important}'+
    '.digiyProSmart{display:grid;gap:10px;margin-top:12px}'+
    '.digiyProSmartTitle{margin:0 2px;color:#fff3cf;font-size:11px;font-weight:1000;letter-spacing:.10em;text-transform:uppercase}'+
    '.digiyProResume{min-height:64px;border:1px solid rgba(246,196,83,.52);border-radius:18px;background:linear-gradient(135deg,rgba(246,196,83,.20),rgba(0,166,81,.15));display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center;padding:10px 12px;color:#fff;text-decoration:none}'+
    '.digiyProResumeIcon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#fff1bd,#f6c453,#22c55e);color:#06140f;font-size:21px}'+
    '.digiyProResume b{display:block;font-size:12.5px;font-weight:1000}.digiyProResume small{display:block;margin-top:3px;color:rgba(248,250,252,.68);font-size:10px;font-weight:800}.digiyProResumeArrow{color:#fff3cf;font-size:19px;font-weight:1000}'+
    '.digiyProFavBox{padding:10px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(255,255,255,.045)}'+
    '.digiyProFavList{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}'+
    '.digiyProFavItem{min-height:58px;border:1px solid rgba(246,196,83,.28);border-radius:15px;background:rgba(246,196,83,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:7px 4px;color:#fff;text-decoration:none;text-align:center}'+
    '.digiyProFavItem strong{font-size:20px;line-height:1}.digiyProFavItem span{font-size:9px;line-height:1.12;font-weight:1000}'+
    '.digiyProFavEmpty{margin-top:7px;color:rgba(248,250,252,.62);font-size:10.5px;line-height:1.35;font-weight:800}'+
    '.digiyProGroups{display:grid;gap:8px;margin-top:12px}'+
    '.digiyProGroup{border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(255,255,255,.04);overflow:hidden}'+
    '.digiyProGroup summary{list-style:none;min-height:50px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px;color:#fff3cf;font-size:12px;font-weight:1000;cursor:pointer}.digiyProGroup summary::-webkit-details-marker{display:none}'+
    '.digiyProGroup summary span:last-child{color:rgba(248,250,252,.55);font-size:10px}'+
    '.digiyProGroupGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 9px 9px}'+
    '.digiyProGroup .digiyProLink{position:relative;grid-template-columns:39px minmax(0,1fr) 32px!important}'+
    '.digiyProStar{width:32px;height:32px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:#fff3cf;font-size:17px;cursor:pointer;display:grid;place-items:center}.digiyProStar.active{background:rgba(246,196,83,.18);border-color:rgba(246,196,83,.52)}'+
    '.digiyProRailFavs{position:fixed;left:13px;top:calc(50% + 73px);z-index:113;display:grid;gap:6px}'+
    '.digiyProRailFav{width:52px;height:44px;border-radius:15px;border:1px solid rgba(246,196,83,.46);background:rgba(6,21,15,.96);box-shadow:0 10px 24px rgba(0,0,0,.30);display:grid;place-items:center;color:#fff;text-decoration:none;font-size:20px}'+
    '@media(max-width:760px){.digiyProRailFavs{display:none}.digiyProFavList{grid-template-columns:repeat(3,minmax(0,1fr))}.digiyProGroupGrid{grid-template-columns:1fr}.digiyProGroup:not([open]) .digiyProGroupGrid{display:none}}'+
    '@media(max-width:390px){.digiyProFavList{grid-template-columns:1fr 1fr}.digiyProFavItem:last-child:nth-child(odd){grid-column:1/-1}}';}

  function ensureStyle(doc){
    if(doc.getElementById('digiyProPersonalStyle')) return;
    var style=doc.createElement('style');
    style.id='digiyProPersonalStyle';
    style.textContent=styles();
    doc.head.appendChild(style);
  }

  function addStar(doc,link,data,favs,c){
    var old=link.querySelector('.digiyProStar');
    if(old) old.remove();
    var star=doc.createElement('button');
    star.type='button';
    star.className='digiyProStar'+(favs.includes(data.url)?' active':'');
    star.textContent=favs.includes(data.url)?'★':'☆';
    star.setAttribute('aria-label',data.name);
    star.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var current=getFavs();
      var index=current.indexOf(data.url);
      if(index>=0) current.splice(index,1);
      else{
        if(current.length>=MAX_FAVS){alert(c.max);return;}
        current.push(data.url);
      }
      setFavs(current);
      lastSignature='';
      sync(doc,true);
    });
    link.appendChild(star);
  }

  function track(link,data){
    if(link.__digiyLastBound) return;
    link.__digiyLastBound=true;
    link.addEventListener('click',function(e){
      if(e.target&&e.target.closest&&e.target.closest('.digiyProStar')) return;
      write(LAST_KEY,{url:data.url,name:data.name,icon:data.icon,at:Date.now()});
    });
  }

  function makeResume(doc,last,known,c){
    if(!last||!last.url) return null;
    var data=known[last.url]||last;
    var a=doc.createElement('a');
    a.className='digiyProResume';
    a.href=data.url;
    a.innerHTML='<span class="digiyProResumeIcon">'+(data.icon||'🏢')+'</span><span><b>'+c.resume+'</b><small>'+((data.name||'PRO'))+'</small></span><span class="digiyProResumeArrow">→</span>';
    a.addEventListener('click',function(){write(LAST_KEY,{url:data.url,name:data.name,icon:data.icon,at:Date.now()});});
    return a;
  }

  function makeFavorite(doc,data){
    var a=doc.createElement('a');
    a.className='digiyProFavItem';
    a.href=data.url;
    a.innerHTML='<strong>'+data.icon+'</strong><span>'+data.name+'</span>';
    a.addEventListener('click',function(){write(LAST_KEY,{url:data.url,name:data.name,icon:data.icon,at:Date.now()});});
    return a;
  }

  function groupTitle(c,key){return c[key]||key;}

  function rebuild(doc,grid,links,c,favs){
    var known={};
    var groups={orient:[],work:[],sell:[],manage:[]};
    links.forEach(function(link){
      var data=moduleData(link);
      if(!data.url||!data.meta) return;
      known[data.url]=data;
      link.setAttribute('data-digiy-pro-url',data.url);
      addStar(doc,link,data,favs,c);
      track(link,data);
      groups[data.meta.group].push(link);
    });

    var oldSmart=grid.parentNode.querySelector('.digiyProSmart');
    if(oldSmart) oldSmart.remove();
    var smart=doc.createElement('div');smart.className='digiyProSmart';
    var last=read(LAST_KEY,null);
    var resume=makeResume(doc,last,known,c);
    if(resume) smart.appendChild(resume);

    var favBox=doc.createElement('section');favBox.className='digiyProFavBox';
    favBox.innerHTML='<div class="digiyProSmartTitle">⭐ '+c.favorites+'</div>';
    var favList=doc.createElement('div');favList.className='digiyProFavList';
    favs.forEach(function(url){if(known[url]) favList.appendChild(makeFavorite(doc,known[url]));});
    if(favList.children.length) favBox.appendChild(favList);
    else {var empty=doc.createElement('div');empty.className='digiyProFavEmpty';empty.textContent=c.empty;favBox.appendChild(empty);}
    smart.appendChild(favBox);
    grid.parentNode.insertBefore(smart,grid);

    grid.innerHTML='';
    var wrapper=doc.createElement('div');wrapper.className='digiyProGroups';
    ['orient','work','sell','manage'].forEach(function(key,index){
      if(!groups[key].length) return;
      var details=doc.createElement('details');details.className='digiyProGroup';
      if(window.innerWidth>760 || index===0) details.open=true;
      var summary=doc.createElement('summary');
      summary.innerHTML='<span>'+groupTitle(c,key)+'</span><span>'+groups[key].length+' '+c.modules+'</span>';
      var inner=doc.createElement('div');inner.className='digiyProGroupGrid';
      groups[key].forEach(function(link){inner.appendChild(link);});
      details.appendChild(summary);details.appendChild(inner);wrapper.appendChild(details);
    });
    grid.appendChild(wrapper);

    var root=doc.getElementById('digiyProQuick');
    var rail=root&&root.querySelector('.digiyProRailFavs');
    if(!rail&&root){rail=doc.createElement('nav');rail.className='digiyProRailFavs';rail.setAttribute('aria-label',c.favorites);root.appendChild(rail);}
    if(rail){
      rail.innerHTML='';
      favs.forEach(function(url){
        var data=known[url];if(!data)return;
        var a=doc.createElement('a');a.className='digiyProRailFav';a.href=data.url;a.textContent=data.icon;a.title=data.name;
        a.addEventListener('click',function(){write(LAST_KEY,{url:data.url,name:data.name,icon:data.icon,at:Date.now()});});
        rail.appendChild(a);
      });
    }
  }

  function sync(doc,force){
    if(syncing||!doc||!doc.body) return;
    var grid=doc.querySelector('.digiyProGrid');
    if(!grid) return;
    syncing=true;
    try{
      ensureStyle(doc);
      var links=Array.prototype.slice.call(grid.querySelectorAll('.digiyProLink'));
      if(!links.length) return;
      var language=lang(doc),favs=getFavs();
      var signature=language+'|'+favs.join('|')+'|'+links.map(function(link){return cleanUrl(link.getAttribute('href')||'');}).join('|');
      if(!force&&signature===lastSignature&&grid.querySelector('.digiyProGroups')) return;
      lastSignature=signature;
      rebuild(doc,grid,links,COPY[language],favs);
    }finally{syncing=false;}
  }

  function install(){
    try{var doc=frame.contentDocument;if(doc&&doc.body) sync(doc,false);}catch(e){}
  }

  frame.addEventListener('load',function(){setTimeout(install,180);});
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-shell-lang]')){lastSignature='';setTimeout(install,180);}});
  setInterval(install,1300);
  setTimeout(install,260);
})();
