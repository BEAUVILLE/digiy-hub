(function(){
  'use strict';

  var SUPABASE_URL='https://wesqmwjjtsefyjnluosj.supabase.co';
  var SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA';

  var params=new URLSearchParams(location.search);
  var territoryId=params.get('zone')||'petite-cote';
  var storedLanguage='';
  try{storedLanguage=localStorage.getItem('digiy_hub_lang_v1')||'';}catch(e){}
  var state={lang:storedLanguage==='en'?'en':'fr',need:'',zone:'all',territories:[],needs:[],professionals:[],dataSource:'json'};
  var copy={
    fr:{needTitle:'Que recherchez-vous ?',zoneTitle:'Préciser la zone',all:'Tout le territoire',results:'professionnel(s) disponible(s)',empty:'Aucun professionnel ne correspond encore à ce filtre.',based:'Basé à',serves:'Intervient à',whole:'Tout le territoire',fixed:'Établissement fixe',mobile:'Service mobile',mixed:'Activité mixte',doctrine:'0 % commission DIGIY · Contact direct · Le professionnel garde la main.',loadError:'Impossible de charger les données territoriales.',profile:'Voir la fiche',whatsapp:'WhatsApp',call:'Appeler'},
    en:{needTitle:'What are you looking for?',zoneTitle:'Choose an area',all:'Whole territory',results:'professional(s) available',empty:'No professional matches this filter yet.',based:'Based in',serves:'Serves',whole:'Whole territory',fixed:'Fixed location',mobile:'Mobile service',mixed:'Mixed activity',doctrine:'0% DIGIY commission · Direct contact · The professional stays in control.',loadError:'Unable to load territory data.',profile:'View profile',whatsapp:'WhatsApp',call:'Call'}
  };

  function pick(value){
    if(value&&typeof value==='object') return value[state.lang]||value.fr||Object.values(value)[0]||'';
    return value||'';
  }

  function loadJson(url){
    return fetch(url,{cache:'no-store'}).then(function(response){
      if(!response.ok) throw new Error(url);
      return response.json();
    });
  }

  function supabaseTable(table,query){
    var url=SUPABASE_URL+'/rest/v1/'+table+'?'+query.toString();
    return fetch(url,{
      cache:'no-store',
      headers:{
        apikey:SUPABASE_ANON_KEY,
        Authorization:'Bearer '+SUPABASE_ANON_KEY,
        Accept:'application/json'
      }
    }).then(function(response){
      if(!response.ok) throw new Error(table+' '+response.status);
      return response.json();
    });
  }

  function territory(){
    return state.territories.find(function(item){return item.id===territoryId;})||state.territories[0];
  }

  function zoneName(id){
    var current=territory();
    var zone=current&&current.zones.find(function(item){return item.id===id;});
    if(zone) return pick(zone.name);
    return String(id||'').replace(/-/g,' ').replace(/\b\w/g,function(letter){return letter.toUpperCase();});
  }

  function phoneDigits(value){
    return String(value||'').replace(/\D/g,'');
  }

  function phoneHref(value){
    var digits=phoneDigits(value);
    return digits?'tel:+'+digits:'';
  }

  function whatsappHref(value,name){
    var digits=phoneDigits(value);
    if(!digits) return '';
    var message='Bonjour '+name+', je viens de DIGIYLYFE.';
    return 'https://wa.me/'+digits+'?text='+encodeURIComponent(message);
  }

  function primaryNeed(metier,category){
    var slug=metier&&metier.slug||'';
    var map={
      chauffeur:'transport',
      plombier:'artisan',
      electricien:'artisan',
      macon:'artisan',
      solaire:'artisan',
      logement:'accommodation',
      'market-produits':'shopping',
      restaurant:'food',
      restauration:'food',
      jobs:'jobs',
      annonces:'announcements'
    };
    if(map[slug]) return map[slug];
    var categories={transport:'transport',artisan:'artisan',logement:'accommodation',hebergement:'accommodation',commerce:'shopping',shopping:'shopping',restauration:'food',emploi:'jobs',annonces:'announcements'};
    return categories[category]||'';
  }

  function activityMode(need){
    if(need==='transport'||need==='artisan') return 'mobile';
    if(need==='accommodation'||need==='shopping'||need==='food') return 'fixed';
    return 'mixed';
  }

  function resolveTerritoryId(mainZone,zones){
    var candidates=[mainZone].concat(zones||[]).filter(Boolean);
    var direct=state.territories.find(function(item){return candidates.indexOf(item.id)!==-1;});
    if(direct) return direct.id;
    var matched=state.territories.find(function(item){
      return item.zones.some(function(zone){return candidates.indexOf(zone.id)!==-1;});
    });
    return matched?matched.id:(state.territories[0]&&state.territories[0].id||territoryId);
  }

  function servicesFrom(card,metier){
    var label=card.activity_label||(metier&&metier.label)||'';
    var values=label.split(/\s*[·•]\s*/).map(function(item){return item.trim();}).filter(Boolean);
    return values.length?values:[label].filter(Boolean);
  }

  function contactsFrom(card){
    var contacts=[];
    if(card.public_url){
      contacts.push({type:'website',label:{fr:copy.fr.profile,en:copy.en.profile},url:card.public_url});
    }
    var whatsapp=whatsappHref(card.whatsapp_public,card.display_name);
    if(whatsapp){
      contacts.push({type:'whatsapp',label:{fr:copy.fr.whatsapp,en:copy.en.whatsapp},url:whatsapp});
    }
    var phone=phoneHref(card.phone_public);
    if(phone){
      contacts.push({type:'phone',label:{fr:copy.fr.call,en:copy.en.call},url:phone});
    }
    return contacts;
  }

  function convertSupabaseProfessionals(cards,metiers,zones,zoneLinks){
    var metierById={};
    var zoneById={};
    var zonesByCard={};

    metiers.forEach(function(item){metierById[item.id]=item;});
    zones.forEach(function(item){zoneById[item.id]=item;});
    zoneLinks.forEach(function(link){
      var zone=zoneById[link.zone_id];
      if(!zone) return;
      zonesByCard[link.card_id]=zonesByCard[link.card_id]||[];
      if(zonesByCard[link.card_id].indexOf(zone.slug)===-1) zonesByCard[link.card_id].push(zone.slug);
    });

    return cards.map(function(card){
      var metier=metierById[card.metier_id]||null;
      var mainZone=zoneById[card.zone_id]&&zoneById[card.zone_id].slug||'';
      var linkedZones=zonesByCard[card.id]||[];
      var resolvedTerritory=resolveTerritoryId(mainZone,linkedZones);
      var visibleZones=linkedZones.filter(function(slug){return slug!==resolvedTerritory;});
      if(mainZone&&visibleZones.indexOf(mainZone)===-1) visibleZones.unshift(mainZone);
      var need=primaryNeed(metier,card.category);
      var summary=card.short_description||card.activity_label||(metier&&metier.label)||'';

      return {
        id:'sql-'+card.id,
        territoryId:resolvedTerritory,
        name:card.display_name,
        primaryNeed:need,
        services:servicesFrom(card,metier),
        mainZone:mainZone||visibleZones[0]||resolvedTerritory,
        coverageMode:'selected_zones',
        zones:visibleZones,
        activityMode:activityMode(need),
        summary:{fr:summary,en:summary},
        contacts:contactsFrom(card),
        rankWeight:Number(card.rank_weight)||50
      };
    });
  }

  function loadSupabaseProfessionals(){
    var cardQuery=new URLSearchParams();
    cardQuery.set('select','id,display_name,activity_label,short_description,metier_id,zone_id,category,status,public_url,whatsapp_public,phone_public,rank_weight');
    cardQuery.set('entry_type','eq.professional');
    cardQuery.set('is_public','eq.true');
    cardQuery.set('is_active','eq.true');
    cardQuery.set('order','rank_weight.asc,display_name.asc');

    var metierQuery=new URLSearchParams();
    metierQuery.set('select','id,slug,label,module_code,category,rank_weight');
    metierQuery.set('is_active','eq.true');

    var zoneQuery=new URLSearchParams();
    zoneQuery.set('select','id,slug,label,parent_zone_id,rank_weight');
    zoneQuery.set('is_active','eq.true');

    var linkQuery=new URLSearchParams();
    linkQuery.set('select','card_id,zone_id,weight');

    return Promise.all([
      supabaseTable('digiy_annuaire_public',cardQuery),
      supabaseTable('digiy_metiers',metierQuery),
      supabaseTable('digiy_zones',zoneQuery),
      supabaseTable('digiy_annuaire_public_zones',linkQuery)
    ]).then(function(data){
      if(!Array.isArray(data[0])||!data[0].length) throw new Error('Aucune fiche publique Supabase');
      return convertSupabaseProfessionals(data[0],data[1]||[],data[2]||[],data[3]||[]);
    });
  }

  function mergeTerritoryFallback(liveProfessionals,jsonProfessionals){
    var liveTerritories={};
    liveProfessionals.forEach(function(item){liveTerritories[item.territoryId]=true;});
    return liveProfessionals.concat(jsonProfessionals.filter(function(item){
      return !liveTerritories[item.territoryId];
    }));
  }

  function revealResults(){
    var section=document.getElementById('resultSection')||document.getElementById('status');
    if(!section) return;
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    requestAnimationFrame(function(){
      section.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});

      var first=document.querySelector('#results .card');
      if(!first) return;
      first.classList.remove('result-focus');
      void first.offsetWidth;
      first.classList.add('result-focus');
      window.setTimeout(function(){first.classList.remove('result-focus');},1500);
    });
  }

  function renderHeader(){
    var current=territory();
    if(!current) return;
    document.documentElement.lang=state.lang;
    document.title='DIGIY '+pick(current.name);
    document.getElementById('country').textContent=pick(current.countryName);
    document.getElementById('territoryName').textContent='DIGIY '+pick(current.name).toUpperCase();
    document.getElementById('tagline').textContent=pick(current.tagline);
    document.querySelector('.doctrine').textContent=copy[state.lang].doctrine;
    document.getElementById('needTitle').textContent=copy[state.lang].needTitle;
    document.getElementById('zoneTitle').textContent=copy[state.lang].zoneTitle;
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'),function(button){
      button.classList.toggle('active',button.dataset.lang===state.lang);
    });
  }

  function renderNeeds(){
    var root=document.getElementById('needs');
    root.innerHTML='';
    state.needs.forEach(function(need){
      var button=document.createElement('button');
      button.type='button';
      button.className='need'+(state.need===need.id?' active':'');
      button.innerHTML='<strong>'+need.icon+'</strong><span></span>';
      button.querySelector('span').textContent=pick(need.label);
      button.addEventListener('click',function(){
        if(need.url){
          location.href=need.url;
          return;
        }
        state.need=state.need===need.id?'':need.id;
        render();
        revealResults();
      });
      root.appendChild(button);
    });
  }

  function renderZones(){
    var root=document.getElementById('zones');
    var current=territory();
    root.innerHTML='';
    if(!current) return;
    [{id:'all'}].concat(current.zones).forEach(function(zone){
      var button=document.createElement('button');
      button.type='button';
      button.className='chip'+(state.zone===zone.id?' active':'');
      button.textContent=zone.id==='all'?copy[state.lang].all:pick(zone.name);
      button.addEventListener('click',function(){
        state.zone=zone.id;
        renderZones();
        renderResults();
        revealResults();
      });
      root.appendChild(button);
    });
  }

  function matches(professional){
    var current=territory();
    if(!current||professional.territoryId!==current.id) return false;
    if(state.need&&professional.primaryNeed!==state.need) return false;
    if(state.zone==='all') return true;
    if(professional.coverageMode==='whole_territory') return true;
    return Array.isArray(professional.zones)&&professional.zones.indexOf(state.zone)!==-1;
  }

  function priority(professional){
    if(state.zone==='all') return Number(professional.rankWeight)||0;
    if(professional.mainZone===state.zone) return 0;
    if(Array.isArray(professional.zones)&&professional.zones.indexOf(state.zone)!==-1) return 1;
    if(professional.coverageMode==='whole_territory') return 2;
    return 3;
  }

  function renderResults(){
    var root=document.getElementById('results');
    root.innerHTML='';
    var list=state.professionals.filter(matches).sort(function(a,b){
      return priority(a)-priority(b)||a.name.localeCompare(b.name);
    });
    document.getElementById('status').textContent=list.length+' '+copy[state.lang].results;
    if(!list.length){
      var empty=document.createElement('div');
      empty.className='empty';
      empty.textContent=copy[state.lang].empty;
      root.appendChild(empty);
      return;
    }
    list.forEach(function(professional){
      var card=document.createElement('article');
      var coverage=professional.coverageMode==='whole_territory'?copy[state.lang].whole:(professional.zones||[]).map(zoneName).join(' · ');
      var mode=copy[state.lang][professional.activityMode]||professional.activityMode||'';
      card.className='card';
      card.innerHTML='<h3></h3><p class="summary"></p><div class="meta"></div><div class="services"></div><div class="actions"></div>';
      card.querySelector('h3').textContent=professional.name;
      card.querySelector('.summary').textContent=pick(professional.summary);
      card.querySelector('.meta').textContent='📍 '+copy[state.lang].based+' '+zoneName(professional.mainZone)+' · '+mode+'\n🚐 '+copy[state.lang].serves+' '+coverage;
      card.querySelector('.meta').style.whiteSpace='pre-line';
      var services=card.querySelector('.services');
      (professional.services||[]).forEach(function(service){
        var span=document.createElement('span');
        span.className='service';
        span.textContent=service;
        services.appendChild(span);
      });
      var actions=card.querySelector('.actions');
      (professional.contacts||[]).forEach(function(contact){
        var link=document.createElement('a');
        link.href=contact.url;
        link.target=contact.type==='phone'?'_self':'_blank';
        link.rel='noopener noreferrer';
        link.textContent=pick(contact.label);
        actions.appendChild(link);
      });
      root.appendChild(card);
    });
  }

  function render(){
    renderHeader();
    renderNeeds();
    renderZones();
    renderResults();
  }

  document.addEventListener('click',function(event){
    var button=event.target.closest('[data-lang]');
    if(!button) return;
    state.lang=button.dataset.lang;
    try{localStorage.setItem('digiy_hub_lang_v1',state.lang);}catch(e){}
    render();
  });

  Promise.all([
    loadJson('./assets/data/territories.json'),
    loadJson('./assets/data/needs.json'),
    loadJson('./assets/data/professionals.json')
  ]).then(function(data){
    state.territories=data[0].territories||[];
    state.needs=data[1].needs||[];
    var jsonProfessionals=data[2].professionals||[];

    return loadSupabaseProfessionals().then(function(liveProfessionals){
      state.professionals=mergeTerritoryFallback(liveProfessionals,jsonProfessionals);
      state.dataSource='supabase';
      render();
      console.info('DIGIY HUB : Supabase actif, JSON conservé par territoire non migré.');
    }).catch(function(error){
      state.professionals=jsonProfessionals;
      state.dataSource='json';
      render();
      console.warn('DIGIY HUB : secours JSON actif.',error);
    });
  }).catch(function(){
    document.getElementById('status').textContent=copy[state.lang].loadError;
  });
})();
