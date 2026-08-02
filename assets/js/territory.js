(function(){
  'use strict';

  var params=new URLSearchParams(location.search);
  var territoryId=params.get('zone')||'petite-cote';
  var storedLanguage='';
  try{storedLanguage=localStorage.getItem('digiy_hub_lang_v1')||'';}catch(e){}
  var state={lang:storedLanguage==='en'?'en':'fr',need:'',zone:'all',territories:[],needs:[],professionals:[]};
  var copy={
    fr:{needTitle:'Que recherchez-vous ?',zoneTitle:'Préciser la zone',all:'Tout le territoire',results:'professionnel(s) disponible(s)',empty:'Aucun professionnel ne correspond encore à ce filtre.',based:'Basé à',serves:'Intervient à',whole:'Tout le territoire',fixed:'Établissement fixe',mobile:'Service mobile',mixed:'Activité mixte',doctrine:'0 % commission DIGIY · Contact direct · Le professionnel garde la main.',loadError:'Impossible de charger les données territoriales.'},
    en:{needTitle:'What are you looking for?',zoneTitle:'Choose an area',all:'Whole territory',results:'professional(s) available',empty:'No professional matches this filter yet.',based:'Based in',serves:'Serves',whole:'Whole territory',fixed:'Fixed location',mobile:'Mobile service',mixed:'Mixed activity',doctrine:'0% DIGIY commission · Direct contact · The professional stays in control.',loadError:'Unable to load territory data.'}
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

  function territory(){
    return state.territories.find(function(item){return item.id===territoryId;})||state.territories[0];
  }

  function zoneName(id){
    var current=territory();
    var zone=current&&current.zones.find(function(item){return item.id===id;});
    return zone?pick(zone.name):id;
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
        state.need=state.need===need.id?'':need.id;
        render();
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
    if(state.zone==='all') return 0;
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
        link.target='_blank';
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
    state.professionals=data[2].professionals||[];
    render();
  }).catch(function(){
    document.getElementById('status').textContent=copy[state.lang].loadError;
  });
})();
