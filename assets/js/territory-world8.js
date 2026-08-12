/* DIGIY HUB — WORLD8 pour Petite Côte et Vallée de la Dordogne */
(function(){
  'use strict';
  if(window.__DIGIY_TERRITORY_WORLD8__) return;
  window.__DIGIY_TERRITORY_WORLD8__=true;

  var SUP=['fr','en','es','pt','de','it','nl','ar'];
  var params=new URLSearchParams(location.search);
  var zone=params.get('zone')||'petite-cote';
  var requested=(params.get('lang')||'').slice(0,2).toLowerCase();
  var stored='';
  try{stored=(localStorage.getItem('digiy_hub_lang_8')||localStorage.getItem('digiy_hub_lang_7')||localStorage.getItem('digiy-lang')||'').slice(0,2).toLowerCase();}catch(e){}
  var lang=SUP.indexOf(requested)>=0?requested:(SUP.indexOf(stored)>=0?stored:'fr');
  var applying=false;

  var C={
    fr:{need:'Que recherchez-vous ?',zone:'Préciser la zone',all:'Tout le territoire',results:'professionnel(s) disponible(s)',empty:'Aucun professionnel ne correspond encore à ce filtre.',based:'Basé à',serves:'Intervient à',whole:'Tout le territoire',fixed:'Établissement fixe',mobile:'Service mobile',mixed:'Activité mixte',doctrine:'0 % commission DIGIY · Contact direct · Le professionnel garde la main.',profile:'Voir la fiche',call:'Appeler',tag:'Les professionnels du territoire, joignables directement.',sn:'Sénégal',france:'France',pc:'Petite Côte',dd:'Vallée de la Dordogne'},
    en:{need:'What are you looking for?',zone:'Choose an area',all:'Whole territory',results:'professional(s) available',empty:'No professional matches this filter yet.',based:'Based in',serves:'Serves',whole:'Whole territory',fixed:'Fixed location',mobile:'Mobile service',mixed:'Mixed activity',doctrine:'0% DIGIY commission · Direct contact · The professional stays in control.',profile:'View profile',call:'Call',tag:'Local professionals, reachable directly.',sn:'Senegal',france:'France',pc:'Petite Côte',dd:'Dordogne Valley'},
    es:{need:'¿Qué buscas?',zone:'Precisar la zona',all:'Todo el territorio',results:'profesional(es) disponible(s)',empty:'Ningún profesional coincide todavía con este filtro.',based:'Con base en',serves:'Interviene en',whole:'Todo el territorio',fixed:'Establecimiento fijo',mobile:'Servicio móvil',mixed:'Actividad mixta',doctrine:'0 % de comisión DIGIY · Contacto directo · El profesional mantiene el control.',profile:'Ver ficha',call:'Llamar',tag:'Profesionales del territorio, contactables directamente.',sn:'Senegal',france:'Francia',pc:'Petite Côte',dd:'Valle del Dordoña'},
    pt:{need:'O que procura?',zone:'Precisar a zona',all:'Todo o território',results:'profissional(is) disponível(is)',empty:'Ainda não há profissional correspondente a este filtro.',based:'Baseado em',serves:'Atua em',whole:'Todo o território',fixed:'Estabelecimento fixo',mobile:'Serviço móvel',mixed:'Atividade mista',doctrine:'0% de comissão DIGIY · Contacto direto · O profissional mantém o controlo.',profile:'Ver ficha',call:'Ligar',tag:'Profissionais do território, contactáveis diretamente.',sn:'Senegal',france:'França',pc:'Petite Côte',dd:'Vale da Dordogne'},
    de:{need:'Was suchen Sie?',zone:'Gebiet auswählen',all:'Gesamte Region',results:'Profi(s) verfügbar',empty:'Für diesen Filter ist noch kein Profi verfügbar.',based:'Ansässig in',serves:'Tätig in',whole:'Gesamte Region',fixed:'Fester Standort',mobile:'Mobiler Service',mixed:'Gemischte Tätigkeit',doctrine:'0 % DIGIY-Provision · Direkter Kontakt · Der Profi behält die Kontrolle.',profile:'Profil ansehen',call:'Anrufen',tag:'Professionelle aus der Region, direkt erreichbar.',sn:'Senegal',france:'Frankreich',pc:'Petite Côte',dd:'Dordogne-Tal'},
    it:{need:'Cosa cerchi?',zone:'Scegli la zona',all:'Tutto il territorio',results:'professionista/i disponibile/i',empty:'Nessun professionista corrisponde ancora a questo filtro.',based:'Con sede a',serves:'Opera a',whole:'Tutto il territorio',fixed:'Sede fissa',mobile:'Servizio mobile',mixed:'Attività mista',doctrine:'0% commissione DIGIY · Contatto diretto · Il professionista mantiene il controllo.',profile:'Vedi scheda',call:'Chiama',tag:'Professionisti del territorio, contattabili direttamente.',sn:'Senegal',france:'Francia',pc:'Petite Côte',dd:'Valle della Dordogna'},
    nl:{need:'Wat zoekt u?',zone:'Kies de zone',all:'Hele gebied',results:'professional(s) beschikbaar',empty:'Nog geen professional voor dit filter.',based:'Gevestigd in',serves:'Actief in',whole:'Hele gebied',fixed:'Vaste locatie',mobile:'Mobiele dienst',mixed:'Gemengde activiteit',doctrine:'0% DIGIY-commissie · Direct contact · De professional houdt de regie.',profile:'Bekijk fiche',call:'Bellen',tag:'Professionals uit de regio, rechtstreeks bereikbaar.',sn:'Senegal',france:'Frankrijk',pc:'Petite Côte',dd:'Dordognevallei'},
    ar:{need:'ما الذي تبحث عنه؟',zone:'حدد المنطقة',all:'كل المنطقة',results:'مهني متاح',empty:'لا يوجد مهني مطابق لهذا الاختيار بعد.',based:'مقره في',serves:'يعمل في',whole:'كل المنطقة',fixed:'موقع ثابت',mobile:'خدمة متنقلة',mixed:'نشاط مختلط',doctrine:'عمولة DIGIY صفر · تواصل مباشر · المهني يبقى صاحب القرار.',profile:'عرض البطاقة',call:'اتصال',tag:'مهنيون من المنطقة يمكن التواصل معهم مباشرة.',sn:'السنغال',france:'فرنسا',pc:'الساحل الصغير',dd:'وادي دوردوني'}
  };

  var NEEDS={
    'Se déplacer':{en:'Get around',es:'Desplazarse',pt:'Deslocar-se',de:'Unterwegs sein',it:'Spostarsi',nl:'Verplaatsen',ar:'التنقل'},
    'Trouver un artisan':{en:'Find a tradesperson',es:'Encontrar un artesano',pt:'Encontrar um artesão',de:'Handwerker finden',it:'Trovare un artigiano',nl:'Een vakman vinden',ar:'العثور على حرفي'},
    'Dormir ou louer':{en:'Stay or rent',es:'Alojarse o alquilar',pt:'Dormir ou alugar',de:'Übernachten oder mieten',it:'Dormire o affittare',nl:'Overnachten of huren',ar:'الإقامة أو الاستئجار'},
    'Manger ou réserver':{en:'Eat or book',es:'Comer o reservar',pt:'Comer ou reservar',de:'Essen oder reservieren',it:'Mangiare o prenotare',nl:'Eten of reserveren',ar:'الأكل أو الحجز'},
    'Acheter local':{en:'Shop local',es:'Comprar local',pt:'Comprar local',de:'Lokal einkaufen',it:'Comprare locale',nl:'Lokaal kopen',ar:'الشراء محلياً'},
    'Emploi et missions':{en:'Jobs and gigs',es:'Empleo y misiones',pt:'Emprego e missões',de:'Jobs und Aufträge',it:'Lavoro e incarichi',nl:'Werk en opdrachten',ar:'وظائف ومهام'},
    'Annonces':{en:'Listings',es:'Anuncios',pt:'Anúncios',de:'Anzeigen',it:'Annunci',nl:'Advertenties',ar:'إعلانات'},
    'La Voix':{en:'Guidance',es:'La Voz',pt:'A Voz',de:'Die Stimme',it:'La Voce',nl:'De Stem',ar:'الصوت'}
  };

  function tr(raw){
    var t=String(raw==null?'':raw).trim();
    if(!t||lang==='fr') return raw;
    var c=C[lang];
    var exact={
      'Que recherchez-vous ?':c.need,'Préciser la zone':c.zone,'Tout le territoire':c.all,
      'Aucun professionnel ne correspond encore à ce filtre.':c.empty,
      '0 % commission DIGIY · Contact direct · Le professionnel garde la main.':c.doctrine,
      'Voir la fiche':c.profile,'Appeler':c.call,
      'Les professionnels du territoire, joignables directement.':c.tag,
      'Sénégal':c.sn,'France':c.france,'Petite Côte':c.pc,'Vallée de la Dordogne':c.dd,
      'DIGIY PETITE CÔTE':'DIGIY '+c.pc.toUpperCase(),
      'DIGIY VALLÉE DE LA DORDOGNE':'DIGIY '+c.dd.toUpperCase(),
      'Établissement fixe':c.fixed,'Service mobile':c.mobile,'Activité mixte':c.mixed
    };
    var out=exact[t]||((NEEDS[t]&&NEEDS[t][lang])||'');
    if(!out){
      var m=t.match(/^(\d+)\s+professionnel\(s\) disponible\(s\)$/);
      if(m) out=m[1]+' '+c.results;
    }
    if(!out){
      out=t.replace(/^Basé à\s+/,c.based+' ').replace(/^Intervient à\s+/,c.serves+' ')
        .replace(/ · Établissement fixe/g,' · '+c.fixed)
        .replace(/ · Service mobile/g,' · '+c.mobile)
        .replace(/ · Activité mixte/g,' · '+c.mixed)
        .replace(/^Tout le territoire$/,c.whole);
    }
    if(!out||out===t) return raw;
    return String(raw).replace(t,out);
  }

  function apply(root){
    if(applying) return;
    applying=true;
    try{
      document.documentElement.lang=lang;
      document.documentElement.dir=lang==='ar'?'rtl':'ltr';
      var c=C[lang];
      document.title='DIGIY '+(zone==='vallee-dordogne'?c.dd:c.pc);
      document.querySelectorAll('[data-lang]').forEach(function(b){
        b.classList.toggle('active',b.getAttribute('data-lang')===lang);
        b.setAttribute('aria-pressed',b.getAttribute('data-lang')===lang?'true':'false');
      });
      var back=document.querySelector('.back');
      if(back){var u=new URL('./',location.href);u.searchParams.set('lang',lang);back.href=u.pathname+u.search;}
      var base=root||document.body;
      var walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
      var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(function(n){var p=n.parentElement;if(p&&p.closest('script,style'))return;var v=tr(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;});
    }finally{applying=false;}
  }

  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-lang]');
    if(!b) return;
    e.preventDefault();e.stopImmediatePropagation();
    var l=(b.getAttribute('data-lang')||'').toLowerCase();
    if(SUP.indexOf(l)<0) return;
    lang=l;
    try{localStorage.setItem('digiy_hub_lang_8',lang);localStorage.setItem('digiy_hub_lang_7',lang==='pt'?'fr':lang);localStorage.setItem('digiy-lang',lang);}catch(_){}
    if(history.replaceState){var u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState({},'',u.pathname+u.search+u.hash);}
    location.reload();
  },true);

  function boot(){
    apply(document.body);
    new MutationObserver(function(){setTimeout(function(){apply(document.body)},0);}).observe(document.body,{childList:true,subtree:true,characterData:true});
    setTimeout(function(){apply(document.body)},250);
    setTimeout(function(){apply(document.body)},900);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
