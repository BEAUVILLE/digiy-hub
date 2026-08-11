/* DIGIY HUB — Portuguese overlay for WORLD8 — production */
(function(){
  'use strict';
  var qs=new URLSearchParams(location.search);
  var requested=(qs.get('lang')||'').slice(0,2).toLowerCase();
  try{if(!requested) requested=(localStorage.getItem('digiy_hub_lang_8')||localStorage.getItem('digiy-lang')||'').slice(0,2).toLowerCase()}catch(e){}
  var active=requested==='pt';
  var frame=document.getElementById('hubFrame');
  var nav=document.getElementById('hubLanguages');

  var PT={
    'Club des Métiers du Terrain':'Clube dos Profissionais do Terreno',
    '🧭 Club des Métiers du Terrain':'🧭 Clube dos Profissionais do Terreno',
    '🎙️ La Voix':'🎙️ A Voz','🌍 Site':'🌍 Site','✍️ Activer mon module':'✍️ Ativar o meu módulo',
    'Je clique.':'Eu clico.','Je parle.':'Eu falo.','J’existe.':'Eu existo.','Je suis visible.':'Sou visível.','Je suis reconnu.':'Sou reconhecido.','J’avance.':'Eu avanço.',
    '🎙️ La Voix du Business':'🎙️ A Voz dos Negócios','⭐ Favoris':'⭐ Favoritos','🌍 Public':'🌍 Público','🏢 Pro':'🏢 Profissional',
    '📣 RÉSEAU DIGIY':'📣 REDE DIGIY','🎧 Lire et écouter':'🎧 Ler e ouvir','🔐 Espace pro':'🔐 Espaço profissional','← Site':'← Site',
    'DIGIY HUB.':'DIGIY HUB.','Club des Métiers du Terrain.':'Clube dos Profissionais do Terreno.',
    "L'architecture des bras numériques DIGIY.":'A arquitetura dos braços digitais DIGIY.',
    "DIGIYLYFE n'est pas une appli de plus : c'est le Club des Métiers du Terrain. La voix ouvre. Les fiches remontent. Le pro garde la main.":'DIGIYLYFE não é apenas mais uma aplicação: é o Clube dos Profissionais do Terreno. A voz abre as portas. Os perfis aparecem. O profissional mantém o controlo.',
    'Chauffeurs, artisans, commerçants, loueurs, recruteurs : chaque métier a ses bras numériques. Le HUB ouvre la bonne porte — sans détour, sans commission, sans intermédiaire.':'Motoristas, artesãos, comerciantes, anfitriões e recrutadores: cada profissão tem os seus braços digitais. O HUB abre a porta certa — sem desvio, sem comissão e sem intermediário.',
    'Portes utiles':'Portas úteis','Public + Pro':'Público + Profissional','Activation':'Ativação','Favoris rapides':'Favoritos rápidos',
    '🌍 Portes publiques':'🌍 Portas públicas','🏢 Portes pro':'🏢 Portas profissionais','📣 Ouvrir RÉSEAU DIGIY':'📣 Abrir REDE DIGIY',
    '🎧 Lire et écouter sur le .net':'🎧 Ler e ouvir no .net','🎙️ Ouvrir la voix':'🎙️ Abrir a voz','3 rapides':'3 rápidos',
    'Garde ici les trois portes que tu utilises le plus : une publique, une pro, une activation ou une entrée métier.':'Guarda aqui as três portas que mais utilizas: uma pública, uma profissional, uma ativação ou uma entrada de profissão.',
    'Réinitialiser':'Repor','Ajoute jusqu’à 3 portes du Club selon ton métier : une publique, une pro, une action.':'Adiciona até 3 portas do Clube conforme a tua profissão: uma pública, uma profissional e uma ação.',
    'Pour trouver, réserver, acheter, contacter, écouter ou découvrir.':'Para encontrar, reservar, comprar, contactar, ouvir ou descobrir.','Voir le pro ↓':'Ver profissional ↓',
    'Pour les pros : d’abord s’inscrire ou activer, ensuite entrer par PIN dans le module protégé.':'Para profissionais: primeiro registar-se ou ativar, depois entrar no módulo protegido com o PIN.',
    'Activer mon module':'Ativar o meu módulo','Public ↑':'Público ↑','🎧 Lire et écouter les paroles du terrain':'🎧 Ler e ouvir as vozes do terreno',
    '✍️ S’inscrire côté pro':'✍️ Registar-se como profissional','🌍 Retour site':'🌍 Voltar ao site','Remonter':'Voltar ao topo','Site':'Site','RÉSEAU':'REDE','Lire / écouter':'Ler / ouvir','Accueil':'Início','Menu':'Menu',
    '☰ Portes DIGIY':'☰ Portas DIGIY','Club des Métiers du Terrain : choisis ta porte, entre dans ton module.':'Clube dos Profissionais do Terreno: escolhe a tua porta e entra no teu módulo.',
    '🏠 Accueil DIGIYLYFE':'🏠 Início DIGIYLYFE','🧭 Haut du HUB':'🧭 Topo do HUB','🎁 50 invitations pilotes':'🎁 50 convites piloto','← Retour site':'← Voltar ao site','📰 Revue':'📰 Revista',
    'La Voix':'A Voz','Favoris':'Favoritos','LA VOIX · ACTION PRO':'A VOZ · AÇÃO PRO','La Voix du Business':'A Voz dos Negócios',
    'La porte d’entrée du Club des Métiers du Terrain. Tu parles, DIGIY oriente, les fiches remontent. Le pro garde la main.':'A porta de entrada do Clube dos Profissionais do Terreno. Tu falas, a DIGIY orienta, os perfis aparecem. O profissional mantém o controlo.',
    'RÉSEAU DIGIY':'REDE DIGIY','Découvre les professionnels, leurs fiches et leurs contacts directs. Leurs raisonnements et paroles du terrain se lisent et s’écoutent sur DIGIYLYFE.net.':'Descobre os profissionais, os seus perfis e contactos diretos. As suas ideias e vozes do terreno podem ser lidas e ouvidas em DIGIYLYFE.net.',
    'La Voix du Terrain · Aly':'A Voz do Terreno · Aly','Aly Kane te fait le tour du terrain en dix vues : le HUB, Saly, Sarlat. Il ouvre les portes, tu gardes la main.':'Aly Kane leva-te pelo terreno em dez vistas: o HUB, Saly e Sarlat. Ele abre as portas; tu manténs o controlo.',
    'Découvrir le territoire':'Descobrir o território','Découvre les lieux et les spots du territoire. Le terrain se montre.':'Descobre lugares e pontos do território. O terreno mostra-se.',
    'Trouver un chauffeur':'Encontrar um motorista','Un chauffeur du Club, un trajet direct. Zéro commission, contact réel.':'Um motorista do Clube, uma viagem direta. Zero comissão, contacto real.',
    'Nos chauffeurs':'Os nossos motoristas','Les chauffeurs du Club : profils, style, présence terrain. Tu choisis, tu contactes.':'Motoristas do Clube: perfis, estilo e presença no terreno. Tu escolhes e contactas.',
    'Trouver où dormir':'Encontrar alojamento','Logements du Club : propriétaire direct, zéro intermédiaire. Tu réserves, il garde la main.':'Alojamentos do Clube: proprietário direto, zero intermediários. Tu reservas; o proprietário mantém o controlo.',
    'Réserver':'Reservar','Réserve un créneau directement chez le pro. Simple, direct, sans détour.':'Reserva diretamente com o profissional. Simples, direto, sem desvio.',
    'Restaurants':'Restaurantes','Restaurants validés : carte, photos, contact direct. Le restaurateur garde sa relation.':'Restaurantes validados: menu, fotos e contacto direto. O restaurante mantém a relação com o cliente.',
    'Mon commerce':'O meu comércio','Les commerces du Club : vitrine visible, contact simple. Le commerçant garde son client.':'Comércios do Clube: montra visível e contacto simples. O comerciante mantém o cliente.',
    'Les boutiques':'As lojas','Le marché local numérisé : produits visibles, vendeur direct, zéro commission.':'O mercado local digitalizado: produtos visíveis, vendedor direto, zero comissão.',
    'Trouver un artisan':'Encontrar um artesão','Les artisans du Club : travaux, dépannage, services. L’artisan reste le patron.':'Artesãos do Clube: obras, reparações e serviços. O artesão continua no comando.',
    'Trouver du travail':'Encontrar trabalho','Missions et opportunités du terrain. Le terrain recrute en direct, sans intermédiaire.':'Missões e oportunidades do terreno. O terreno recruta diretamente, sem intermediário.',
    'NDIMBAL Express':'NDIMBAL Express','Annonces terrain validées par DIGIY : 7 jours, 15 jours ou 30 jours. Ticket durée, contact direct, 0 % commission.':'Anúncios do terreno validados pela DIGIY: 7, 15 ou 30 dias. Ticket por duração, contacto direto e 0% de comissão.',
    'DIGIY CARNET PRO':'DIGIY CARNET PRO','Encaissements, dépenses, réserves et preuves. Ton activité devient claire sans que DIGIY touche à ton argent.':'Receitas, despesas, reservas e comprovativos. A tua atividade fica clara sem a DIGIY tocar no teu dinheiro.',
    'La carte':'O mapa','La carte du terrain : pros, lieux, services autour de toi. Le Club visible sur la carte.':'O mapa do terreno: profissionais, lugares e serviços à tua volta. O Clube visível no mapa.',
    'Paroles du terrain':'Vozes do terreno','Raisonnements, témoignages et expériences à lire ou à écouter sur DIGIYLYFE.net. La parole est conservée et reliée à l’humain.':'Ideias, testemunhos e experiências para ler ou ouvir em DIGIYLYFE.net. A voz é preservada e ligada à pessoa.',
    'Mon assistant DIGIY':'O meu assistente DIGIY','L’assistant du Club : une question, la bonne porte. Simple, humain, direct.':'O assistente do Clube: uma pergunta, a porta certa. Simples, humano e direto.',
    'Dis ou écris ton besoin. DIGIY t’oriente vers le bon métier et le bon professionnel.':'Diz ou escreve o que precisas. A DIGIY orienta-te para a profissão e o profissional certos.',
    'S’inscrire côté pro':'Registar-se como profissional','Rejoins le Club des Métiers du Terrain. Un module, un abonnement fixe, 0 % commission.':'Junta-te ao Clube dos Profissionais do Terreno. Um módulo, uma subscrição fixa e 0% de comissão.',
    'Mon activité':'A minha atividade','Ton espace membre du Club : modules, activité, suivi.':'O teu espaço de membro do Clube: módulos, atividade e acompanhamento.',
    'MON RÉSEAU DIGIY':'A MINHA REDE DIGIY','Gère ta fiche, tes offres et ta visibilité. Relie aussi tes paroles publiées, lues et écoutées sur DIGIYLYFE.net.':'Gere o teu perfil, ofertas e visibilidade. Liga também as tuas palavras publicadas, lidas e ouvidas em DIGIYLYFE.net.'
  };

  function translateDoc(doc){
    if(!doc||!active) return;
    doc.documentElement.lang='pt';doc.documentElement.dir='ltr';
    var walker=doc.createTreeWalker(doc.body||doc.documentElement,NodeFilter.SHOW_TEXT);
    var n;while((n=walker.nextNode())){
      var raw=n.nodeValue,trim=raw.trim();if(!trim||!PT[trim])continue;
      n.nodeValue=raw.replace(trim,PT[trim]);
    }
    doc.querySelectorAll('[title],[aria-label],[placeholder]').forEach(function(el){
      ['title','aria-label','placeholder'].forEach(function(a){var v=el.getAttribute(a);if(v&&PT[v])el.setAttribute(a,PT[v])});
    });
    doc.querySelectorAll('a[href]').forEach(function(a){try{var u=new URL(a.href,location.href);if(/(^|\.)digiylyfe\.com$/i.test(u.hostname)){u.searchParams.set('lang','pt');a.href=u.toString()}}catch(e){}});
  }

  function markButton(){
    if(!nav)return;
    nav.querySelectorAll('[data-shell-lang]').forEach(function(b){b.classList.toggle('active',active&&b.dataset.shellLang==='pt')});
  }
  function apply(){
    markButton();
    if(!active||!frame)return;
    try{translateDoc(frame.contentDocument)}catch(e){}
  }
  if(frame){frame.addEventListener('load',function(){apply();try{var d=frame.contentDocument;if(d){new MutationObserver(apply).observe(d.documentElement,{subtree:true,childList:true,characterData:true})}}catch(e){}})}
  document.addEventListener('DOMContentLoaded',apply);
  setTimeout(apply,250);setTimeout(apply,900);

  if(nav){nav.addEventListener('click',function(ev){var b=ev.target.closest('[data-shell-lang="pt"]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();try{localStorage.setItem('digiy_hub_lang_8','pt');localStorage.setItem('digiy-lang','pt');localStorage.setItem('digiy_lang','pt');localStorage.setItem('digiy_hub_lang_7','fr')}catch(e){}var u=new URL(location.href);u.searchParams.set('lang','pt');location.href=u.toString()},true)}
})();