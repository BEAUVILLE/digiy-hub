/* DIGIY HUB — porte BONNE AFFAIRE dans le HUB multilingue */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_BONNE_AFFAIRE__) return;
  window.__DIGIY_HUB_BONNE_AFFAIRE__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var STORE='digiy_hub_lang_7';
  var URL='https://bonne-affaire.digiylyfe.com/';
  var COPY={
    fr:{desc:'Annonces classées · photos · recherche texte ou voix · contact direct.',open:'Ouvrir',menu:'🏷️ BONNE AFFAIRE'},
    en:{desc:'Classified listings · photos · text or voice search · direct contact.',open:'Open',menu:'🏷️ BONNE AFFAIRE'},
    es:{desc:'Anuncios clasificados · fotos · búsqueda por texto o voz · contacto directo.',open:'Abrir',menu:'🏷️ BONNE AFFAIRE'},
    de:{desc:'Kleinanzeigen · Fotos · Text- oder Sprachsuche · direkter Kontakt.',open:'Öffnen',menu:'🏷️ BONNE AFFAIRE'},
    it:{desc:'Annunci classificati · foto · ricerca testuale o vocale · contatto diretto.',open:'Apri',menu:'🏷️ BONNE AFFAIRE'},
    nl:{desc:'Gerubriceerde advertenties · foto’s · tekst- of spraakzoekopdracht · direct contact.',open:'Openen',menu:'🏷️ BONNE AFFAIRE'},
    ar:{desc:'إعلانات مصنفة · صور · بحث نصي أو صوتي · تواصل مباشر.',open:'فتح',menu:'🏷️ BONNE AFFAIRE'}
  };

  var observedDocument=null;
  var observer=null;
  var scheduled=false;

  function language(){
    var value='';
    try{value=localStorage.getItem(STORE)||'';}catch(e){}
    value=(value||document.documentElement.lang||'fr').slice(0,2).toLowerCase();
    return COPY[value]?value:'fr';
  }

  function cardMarkup(lang){
    var c=COPY[lang];
    return ''+
      '<div class="icon">🏷️</div>'+
      '<div class="name">BONNE AFFAIRE</div>'+
      '<div class="desc">'+c.desc+'</div>'+
      '<div class="meta"><span class="tag public">PUBLIC</span><span class="tag">DIGIY</span><span class="tag public">0 %</span></div>'+
      '<a class="open" href="'+URL+'" target="_blank" rel="noopener noreferrer" '+
      'title="Ouverture séparée pour la recherche vocale et la proximité" '+
      'aria-label="'+c.open+' BONNE AFFAIRE">↗ '+c.open+'</a>';
  }

  function ensureCard(doc,lang){
    var grid=doc.getElementById('publicGrid');
    if(!grid) return;

    var card=grid.querySelector('[data-digiy-bonne-affaire-card]');
    if(!card){
      card=doc.createElement('article');
      card.className='card public';
      card.setAttribute('data-digiy-bonne-affaire-card','true');

      var marketLink=grid.querySelector('a.open[href*="market.digiylyfe.com"]');
      var marketCard=marketLink&&marketLink.closest('.card');
      if(marketCard&&marketCard.nextSibling){
        grid.insertBefore(card,marketCard.nextSibling);
      }else if(marketCard){
        grid.appendChild(card);
      }else{
        grid.appendChild(card);
      }
    }

    if(card.getAttribute('data-digiy-lang')!==lang){
      card.innerHTML=cardMarkup(lang);
      card.setAttribute('data-digiy-lang',lang);
    }

    var count=doc.getElementById('publicCount');
    if(count) count.textContent=String(grid.querySelectorAll(':scope > .card').length);
  }

  function ensureMenu(doc,lang){
    var drawer=doc.querySelector('.drawerGrid');
    if(!drawer) return;

    var link=drawer.querySelector('[data-digiy-bonne-affaire-menu]');
    if(!link){
      link=doc.createElement('a');
      link.className='gold';
      link.href=URL;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('data-digiy-bonne-affaire-menu','true');
      link.title='Ouverture séparée pour la recherche vocale et la proximité';

      var publicDoor=drawer.querySelector('a[href="#public"]');
      if(publicDoor&&publicDoor.nextSibling){
        drawer.insertBefore(link,publicDoor.nextSibling);
      }else if(publicDoor){
        drawer.appendChild(link);
      }else{
        drawer.appendChild(link);
      }
    }
    link.textContent=COPY[lang].menu;
  }

  function ensureSchema(doc){
    if(doc.getElementById('digiy-bonne-affaire-schema')) return;
    var node=doc.createElement('script');
    node.id='digiy-bonne-affaire-schema';
    node.type='application/ld+json';
    node.textContent=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'WebApplication',
      name:'DIGIY BONNE AFFAIRE',
      url:URL,
      applicationCategory:'BusinessApplication',
      description:'Annonces classées avec photos, recherche texte ou vocale et contact direct. 0 % de commission DIGIY.'
    });
    doc.head.appendChild(node);
  }

  function ensure(){
    scheduled=false;
    var doc;
    try{doc=frame.contentDocument;}catch(e){return;}
    if(!doc||!doc.body) return;

    var lang=language();
    ensureCard(doc,lang);
    ensureMenu(doc,lang);
    ensureSchema(doc);

    if(observedDocument!==doc){
      if(observer) observer.disconnect();
      observedDocument=doc;
      observer=new MutationObserver(function(){
        if(scheduled) return;
        scheduled=true;
        setTimeout(ensure,30);
      });
      var grid=doc.getElementById('publicGrid');
      if(grid) observer.observe(grid,{childList:true});
    }
  }

  frame.addEventListener('load',function(){
    setTimeout(ensure,0);
    setTimeout(ensure,180);
    setTimeout(ensure,500);
  });

  document.querySelectorAll('[data-shell-lang]').forEach(function(button){
    button.addEventListener('click',function(){
      setTimeout(ensure,30);
      setTimeout(ensure,220);
      setTimeout(ensure,520);
    });
  });

  setTimeout(ensure,0);
})();
