/* DIGIY HUB — mémoire du dernier accès depuis la grille PUBLIC + retrait FG NAILS */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PUBLIC_GRID_MEMORY__) return;
  window.__DIGIY_HUB_PUBLIC_GRID_MEMORY__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var LAST_KEY='digiy_hub_public_dernier_v1';
  var FAV_KEYS=['digiy_hub_public_favoris_v1','digiy_hub_favorites_v3_club_voix'];
  var installedDoc=null;
  var observer=null;

  function cleanText(value,fallback){
    value=String(value||'').replace(/\s+/g,' ').trim();
    return value||fallback;
  }

  function cleanUrl(value,doc){
    try{return new URL(value,doc.baseURI||location.href).href;}
    catch(e){return String(value||'');}
  }

  function isFg(value){
    value=String(value||'').toLowerCase();
    return value.indexOf('f-g-nails.digiylyfe.com')!==-1 || /fg\s*nails/i.test(value);
  }

  function purgeStorage(){
    try{
      var last=JSON.parse(localStorage.getItem(LAST_KEY)||'null');
      if(last && (isFg(last.url)||isFg(last.name))) localStorage.removeItem(LAST_KEY);
    }catch(e){}

    FAV_KEYS.forEach(function(key){
      try{
        var value=JSON.parse(localStorage.getItem(key)||'[]');
        if(!Array.isArray(value)) return;
        var cleaned=value.filter(function(item){
          if(typeof item==='string') return !isFg(item);
          if(item && typeof item==='object') return !isFg(item.url) && !isFg(item.href) && !isFg(item.name);
          return true;
        });
        if(cleaned.length!==value.length) localStorage.setItem(key,JSON.stringify(cleaned));
      }catch(e){}
    });
  }

  function purgeFg(doc){
    if(!doc) return;
    try{
      Array.prototype.slice.call(doc.querySelectorAll('a[href]')).forEach(function(anchor){
        var href=anchor.getAttribute('href')||'';
        if(!isFg(href)) return;
        var block=anchor.closest('.card,article,.listing,li');
        (block||anchor).remove();
      });

      Array.prototype.slice.call(doc.querySelectorAll('.card,article,.listing')).forEach(function(block){
        if(isFg(block.textContent||'')) block.remove();
      });
    }catch(e){}
  }

  function remember(doc,anchor){
    var card=anchor.closest('.card.public');
    if(!card || !card.closest('#publicGrid')) return;

    var raw=anchor.getAttribute('href')||'';
    if(!raw || raw.charAt(0)==='#' || /^javascript:/i.test(raw) || isFg(raw)) return;

    var iconNode=card.querySelector('.icon');
    var nameNode=card.querySelector('.name');
    var data={
      url:cleanUrl(raw,doc),
      name:cleanText(nameNode&&nameNode.textContent,'PUBLIC'),
      icon:cleanText(iconNode&&iconNode.textContent,'🌍'),
      at:Date.now()
    };

    if(!data.url || isFg(data.url) || isFg(data.name)) return;
    try{localStorage.setItem(LAST_KEY,JSON.stringify(data));}catch(e){}
  }

  function install(){
    try{
      var doc=frame.contentDocument;
      purgeStorage();
      purgeFg(document);
      purgeFg(doc);
      if(!doc || !doc.body || installedDoc===doc) return;
      installedDoc=doc;

      if(observer){try{observer.disconnect();}catch(e){}}
      observer=new MutationObserver(function(){purgeFg(doc);purgeStorage();});
      observer.observe(doc.body,{childList:true,subtree:true});

      doc.addEventListener('click',function(event){
        var target=event.target;
        var anchor=target&&target.closest?target.closest('#publicGrid .card.public a.open[href]'):null;
        if(anchor) remember(doc,anchor);
      },true);
    }catch(e){}
  }

  frame.addEventListener('load',function(){setTimeout(install,80);});
  setInterval(install,1200);
  setTimeout(install,180);
})();
