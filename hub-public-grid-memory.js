/* DIGIY HUB — mémoire du dernier accès depuis la grille PUBLIC */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PUBLIC_GRID_MEMORY__) return;
  window.__DIGIY_HUB_PUBLIC_GRID_MEMORY__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var LAST_KEY='digiy_hub_public_dernier_v1';
  var installedDoc=null;

  function cleanText(value,fallback){
    value=String(value||'').replace(/\s+/g,' ').trim();
    return value||fallback;
  }

  function cleanUrl(value,doc){
    try{return new URL(value,doc.baseURI||location.href).href;}
    catch(e){return String(value||'');}
  }

  function remember(doc,anchor){
    var card=anchor.closest('.card.public');
    if(!card || !card.closest('#publicGrid')) return;

    var raw=anchor.getAttribute('href')||'';
    if(!raw || raw.charAt(0)==='#' || /^javascript:/i.test(raw)) return;

    var iconNode=card.querySelector('.icon');
    var nameNode=card.querySelector('.name');
    var data={
      url:cleanUrl(raw,doc),
      name:cleanText(nameNode&&nameNode.textContent,'PUBLIC'),
      icon:cleanText(iconNode&&iconNode.textContent,'🌍'),
      at:Date.now()
    };

    if(!data.url) return;
    try{localStorage.setItem(LAST_KEY,JSON.stringify(data));}catch(e){}
  }

  function install(){
    try{
      var doc=frame.contentDocument;
      if(!doc || !doc.body || installedDoc===doc) return;
      installedDoc=doc;

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
