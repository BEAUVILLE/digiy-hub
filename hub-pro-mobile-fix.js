/* DIGIY HUB — adaptation mobile de la cartouche PRO */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_PRO_MOBILE_FIX__) return;
  window.__DIGIY_HUB_PRO_MOBILE_FIX__=true;
  var frame=document.getElementById('hubFrame');
  if(!frame) return;
  var observed=null,observer=null;

  function apply(doc){
    if(!doc||!doc.head||!doc.body) return;
    if(!doc.getElementById('digiyProMobileFixStyle')){
      var style=doc.createElement('style');
      style.id='digiyProMobileFixStyle';
      style.textContent='.digiyProMobile{display:none!important}';
      doc.head.appendChild(style);
    }

    var entry=doc.querySelector('[data-digiy-pro-mobile-entry]')||doc.querySelector('.bottomNav a[href="#pro"]');
    if(entry){
      entry.setAttribute('data-digiy-pro-mobile-entry','true');
      if(!entry.__digiyProMobileBound){
        entry.__digiyProMobileBound=true;
        entry.addEventListener('click',function(e){
          if(window.matchMedia('(max-width:760px)').matches){
            e.preventDefault();
            var trigger=doc.getElementById('digiyProTab');
            if(trigger) trigger.click();
          }
        });
      }
    }

    doc.querySelectorAll('.digiyProLink,.digiyProActivate').forEach(function(link){
      link.removeAttribute('target');
      link.removeAttribute('rel');
    });
  }

  function install(){
    try{
      var doc=frame.contentDocument;
      if(!doc||!doc.body) return;
      apply(doc);
      if(observed!==doc){
        observed=doc;
        if(observer) observer.disconnect();
        observer=new MutationObserver(function(){apply(doc);});
        observer.observe(doc.body,{childList:true,subtree:true});
      }
    }catch(e){}
  }

  frame.addEventListener('load',function(){setTimeout(install,90);});
  setInterval(install,1400);
  setTimeout(install,180);
})();
