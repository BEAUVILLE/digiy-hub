/* DIGIY HUB — présence garantie de Lamine dans le moteur territorial Petite Côte */
(function(){
  'use strict';
  if(window.__DIGIY_TERRITORY_LAMINE_VISIBLE__) return;
  window.__DIGIY_TERRITORY_LAMINE_VISIBLE__=true;

  var busy=false;
  var timer=0;

  function text(value){
    return String(value||'').trim().toLowerCase();
  }

  function isEnglish(){
    return (document.documentElement.lang||'fr').slice(0,2).toLowerCase()==='en';
  }

  function territoryIsPetiteCote(){
    return (new URLSearchParams(location.search).get('zone')||'petite-cote')==='petite-cote';
  }

  function transportIsVisible(){
    var active=document.querySelector('.need.active');
    if(!active) return true;
    var icon=active.querySelector('strong');
    return !!(icon&&icon.textContent.indexOf('🚗')!==-1);
  }

  function zoneAllowsLamine(){
    var active=document.querySelector('.chip.active');
    if(!active) return true;
    var value=text(active.textContent);
    return [
      'tout le territoire',
      'whole territory',
      'aibd',
      'saly',
      'mbour'
    ].indexOf(value)!==-1;
  }

  function hasLiveLamine(root){
    return Array.prototype.some.call(root.querySelectorAll('.card:not([data-digiy-lamine-fallback]) h3'),function(title){
      return text(title.textContent).indexOf('lamine')!==-1;
    });
  }

  function cardMarkup(){
    var en=isEnglish();
    var summary=en
      ? 'Private driver in Saly for AIBD transfers, local rides and Petite Côte trips.'
      : 'Chauffeur privé à Saly pour transferts AIBD, courses locales et trajets Petite Côte.';
    var meta=en
      ? '📍 Based in Saly · Mobile service\n🚐 Serves AIBD · Saly · Mbour'
      : '📍 Basé à Saly · Service mobile\n🚐 Intervient à AIBD · Saly · Mbour';
    var profile=en?'View profile':'Voir la fiche';
    var call=en?'Call':'Appeler';

    return '<h3>Lamine — Chauffeur privé</h3>'+
      '<p class="summary">'+summary+'</p>'+
      '<div class="meta" style="white-space:pre-line">'+meta+'</div>'+
      '<div class="services">'+
        '<span class="service">'+(en?'AIBD transfer':'Transfert AIBD')+'</span>'+
        '<span class="service">'+(en?'Local rides':'Courses locales')+'</span>'+
        '<span class="service">'+(en?'Petite Côte trips':'Circuits Petite Côte')+'</span>'+
      '</div>'+
      '<div class="actions">'+
        '<a href="https://partenaire-lamine.digiylyfe.com/" target="_blank" rel="noopener noreferrer">'+profile+'</a>'+
        '<a href="https://wa.me/221784413680?text=Bonjour%20Lamine%2C%20je%20viens%20de%20DIGIYLYFE%20et%20je%20souhaite%20organiser%20un%20trajet." target="_blank" rel="noopener noreferrer">WhatsApp</a>'+
        '<a href="tel:+221784413680">'+call+'</a>'+
      '</div>';
  }

  function updateCount(root){
    var status=document.getElementById('status');
    if(!status) return;
    var count=root.querySelectorAll('.card').length;
    status.textContent=count+' '+(isEnglish()?'professional(s) available':'professionnel(s) disponible(s)');
  }

  function apply(){
    if(busy||!territoryIsPetiteCote()) return;
    var root=document.getElementById('results');
    if(!root) return;

    busy=true;
    try{
      var fallback=root.querySelector('[data-digiy-lamine-fallback]');
      var show=transportIsVisible()&&zoneAllowsLamine();
      var live=hasLiveLamine(root);

      if((!show||live)&&fallback){
        fallback.remove();
        updateCount(root);
        return;
      }

      if(!show||live||fallback) return;

      var card=document.createElement('article');
      card.className='card';
      card.setAttribute('data-digiy-lamine-fallback','true');
      card.innerHTML=cardMarkup();
      root.appendChild(card);
      updateCount(root);
    }finally{
      busy=false;
    }
  }

  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(apply,25);
  }

  function install(){
    var results=document.getElementById('results');
    var needs=document.getElementById('needs');
    var zones=document.getElementById('zones');
    if(!results||!needs||!zones){setTimeout(install,80);return;}

    var observer=new MutationObserver(schedule);
    observer.observe(results,{childList:true,subtree:true});
    observer.observe(needs,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    observer.observe(zones,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',schedule,true);
    schedule();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
