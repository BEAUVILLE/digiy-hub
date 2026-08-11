/* DIGIY HUB — porte DIGIY RENCONTRE dans le HUB multilingue */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_RENCONTRE__) return;
  window.__DIGIY_HUB_RENCONTRE__=true;

  var frame=document.getElementById('hubFrame');
  if(!frame) return;

  var URL='./rencontre/';
  var TABLE_URL='./rencontre/table-monde-traduction.html';
  var COPY={
    fr:{name:'DIGIY RENCONTRE',desc:'Amitié · connaissances · activités · cercles. Ici, tu ne collectionnes pas des profils : tu rencontres ton territoire.',open:'Ouvrir',table:'🌍 TABLE MONDE — TEST',menu:'🤝 DIGIY RENCONTRE'},
    en:{name:'DIGIY RENCONTRE',desc:'Friendship · people · activities · circles. Meet your territory, not a catalogue of profiles.',open:'Open',table:'🌍 WORLD TABLE — TEST',menu:'🤝 DIGIY RENCONTRE'},
    es:{name:'DIGIY RENCONTRE',desc:'Amistad · personas · actividades · círculos. Conoce tu territorio, no un catálogo de perfiles.',open:'Abrir',table:'🌍 MESA MUNDO — PRUEBA',menu:'🤝 DIGIY RENCONTRE'},
    pt:{name:'DIGIY RENCONTRE',desc:'Amizade · pessoas · atividades · círculos. Conhece o teu território, não um catálogo de perfis.',open:'Abrir',table:'🌍 MESA MUNDO — TESTE',menu:'🤝 DIGIY RENCONTRE'},
    de:{name:'DIGIY RENCONTRE',desc:'Freundschaft · Menschen · Aktivitäten · Kreise. Begegne deinem Umfeld statt Profile zu sammeln.',open:'Öffnen',table:'🌍 WELTTISCH — TEST',menu:'🤝 DIGIY RENCONTRE'},
    it:{name:'DIGIY RENCONTRE',desc:'Amicizia · persone · attività · cerchie. Incontra il territorio, non una raccolta di profili.',open:'Apri',table:'🌍 TAVOLO MONDO — TEST',menu:'🤝 DIGIY RENCONTRE'},
    nl:{name:'DIGIY RENCONTRE',desc:'Vriendschap · mensen · activiteiten · kringen. Ontmoet je omgeving, geen catalogus van profielen.',open:'Openen',table:'🌍 WERELDTAFEL — TEST',menu:'🤝 DIGIY RENCONTRE'},
    ar:{name:'DIGIY RENCONTRE',desc:'صداقة · تعارف · أنشطة · دوائر. تعرّف على محيطك بدل جمع الملفات الشخصية.',open:'فتح',table:'🌍 طاولة العالم — اختبار',menu:'🤝 DIGIY RENCONTRE'}
  };

  function language(){
    var value='fr';
    try{value=(localStorage.getItem('digiy_hub_lang_7')||localStorage.getItem('digiy_hub_lang_v1')||'fr').slice(0,2).toLowerCase();}catch(e){}
    return COPY[value]?value:'fr';
  }

  function cardMarkup(lang){
    var c=COPY[lang];
    return ''+
      '<div class="icon">🤝</div>'+
      '<div class="name">'+c.name+'</div>'+
      '<div class="desc">'+c.desc+'</div>'+
      '<div class="meta"><span class="tag public">PUBLIC</span><span class="tag">DIGIY</span><span class="tag public">18+</span></div>'+
      '<a class="open" href="'+URL+'" aria-label="'+c.open+' DIGIY RENCONTRE">→ '+c.open+'</a>'+
      '<a class="open" href="'+TABLE_URL+'" target="_top" rel="noopener" style="margin-top:8px;background:linear-gradient(135deg,#f6c453,#22c55e);color:#06140f;border-color:transparent" aria-label="'+c.table+'">'+c.table+'</a>';
  }

  function ensureCard(doc,lang){
    var grid=doc.getElementById('publicGrid');
    if(!grid) return;

    var card=grid.querySelector('[data-digiy-rencontre-card]');
    if(!card){
      card=doc.createElement('article');
      card.className='card public';
      card.setAttribute('data-digiy-rencontre-card','true');

      var exploreLink=grid.querySelector('a.open[href*="explore.digiylyfe.com"]');
      var exploreCard=exploreLink&&exploreLink.closest('.card');
      if(exploreCard&&exploreCard.nextSibling){
        grid.insertBefore(card,exploreCard.nextSibling);
      }else if(exploreCard){
        grid.appendChild(card);
      }else{
        grid.insertBefore(card,grid.firstChild);
      }
    }

    if(card.getAttribute('data-digiy-lang')!==lang || !card.querySelector('a[href*="table-monde-traduction.html"]')){
      card.innerHTML=cardMarkup(lang);
      card.setAttribute('data-digiy-lang',lang);
    }

    var count=doc.getElementById('publicCount');
    if(count) count.textContent=String(grid.querySelectorAll(':scope > .card').length);
  }

  function ensureMenu(doc,lang){
    var drawer=doc.querySelector('.drawerGrid');
    if(!drawer) return;
    var link=drawer.querySelector('[data-digiy-rencontre-menu]');
    if(!link){
      link=doc.createElement('a');
      link.className='green';
      link.href=URL;
      link.setAttribute('data-digiy-rencontre-menu','true');
      var publicDoor=drawer.querySelector('a[href="#public"]');
      if(publicDoor&&publicDoor.nextSibling) drawer.insertBefore(link,publicDoor.nextSibling);
      else drawer.appendChild(link);
    }
    link.textContent=COPY[lang].menu;

    var tableLink=drawer.querySelector('[data-digiy-table-menu]');
    if(!tableLink){
      tableLink=doc.createElement('a');
      tableLink.className='green';
      tableLink.setAttribute('data-digiy-table-menu','true');
      if(link.nextSibling) drawer.insertBefore(tableLink,link.nextSibling);
      else drawer.appendChild(tableLink);
    }
    tableLink.href=TABLE_URL;
    tableLink.target='_top';
    tableLink.rel='noopener';
    tableLink.textContent=COPY[lang].table;
  }

  function ensure(){
    var doc;
    try{doc=frame.contentDocument;}catch(e){return;}
    if(!doc||!doc.body) return;
    var lang=language();
    ensureCard(doc,lang);
    ensureMenu(doc,lang);
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
