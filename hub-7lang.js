/* DIGIY HUB — coque native 7 langues, sans fetch ni document.write */
(function(){
  'use strict';
  if(window.__DIGIY_HUB_7LANG__) return;
  window.__DIGIY_HUB_7LANG__=true;

  var SUPPORTED=['fr','en','es','de','it','nl','ar'];
  var STORE='digiy_hub_lang_7';
  var frame=document.getElementById('hubFrame');
  var loading=document.getElementById('hubLoading');
  var current='fr';
  var frameReady=false;
  var originals=new WeakMap();
  var attributeOriginals=new WeakMap();
  var observers=[];

  function row(fr,en,es,de,it,nl,ar){return [fr,en,es,de,it,nl,ar];}
  var ROWS=[
    row('Club des Métiers du Terrain','Ground Business Club','Club de los Oficios del Terreno','Club der Berufe vor Ort','Club dei Mestieri sul Territorio','Club van Beroepen op het Terrein','نادي مهن الميدان'),
    row('🧭 Club des Métiers du Terrain','🧭 Ground Business Club','🧭 Club de los Oficios del Terreno','🧭 Club der Berufe vor Ort','🧭 Club dei Mestieri sul Territorio','🧭 Club van Beroepen op het Terrein','🧭 نادي مهن الميدان'),
    row('🎙️ La Voix','🎙️ Voice','🎙️ La Voz','🎙️ Die Stimme','🎙️ La Voce','🎙️ De Stem','🎙️ الصوت'),
    row('🌍 Site','🌍 Website','🌍 Sitio','🌍 Website','🌍 Sito','🌍 Website','🌍 الموقع'),
    row('✍️ Activer mon module','✍️ Activate my module','✍️ Activar mi módulo','✍️ Mein Modul aktivieren','✍️ Attiva il mio modulo','✍️ Mijn module activeren','✍️ تفعيل وحدتي'),
    row('Je clique.','I click.','Hago clic.','Ich klicke.','Clicco.','Ik klik.','أنقر.'),
    row('Je parle.','I speak.','Hablo.','Ich spreche.','Parlo.','Ik spreek.','أتحدث.'),
    row('J’existe.','I exist.','Existo.','Ich existiere.','Esisto.','Ik besta.','أنا موجود.'),
    row('Je suis visible.','I am visible.','Soy visible.','Ich bin sichtbar.','Sono visibile.','Ik ben zichtbaar.','أنا ظاهر.'),
    row('Je suis reconnu.','I am recognized.','Soy reconocido.','Ich werde erkannt.','Sono riconosciuto.','Ik word erkend.','أنا معروف.'),
    row('J’avance.','I move forward.','Avanzo.','Ich komme voran.','Vado avanti.','Ik ga vooruit.','أتقدم.'),
    row('🎙️ La Voix du Business','🎙️ The Voice of Business','🎙️ La Voz del Negocio','🎙️ Die Stimme des Geschäfts','🎙️ La Voce del Business','🎙️ De Stem van de Zaak','🎙️ صوت الأعمال'),
    row('⭐ Favoris','⭐ Favorites','⭐ Favoritos','⭐ Favoriten','⭐ Preferiti','⭐ Favorieten','⭐ المفضلة'),
    row('🌍 Public','🌍 Public','🌍 Público','🌍 Öffentlich','🌍 Pubblico','🌍 Publiek','🌍 عام'),
    row('🏢 Pro','🏢 Pro','🏢 Profesional','🏢 Profi','🏢 Pro','🏢 Pro','🏢 مهني'),
    row('📣 RÉSEAU DIGIY','📣 DIGIY NETWORK','📣 RED DIGIY','📣 DIGIY NETZWERK','📣 RETE DIGIY','📣 DIGIY NETWERK','📣 شبكة DIGIY'),
    row('🎧 Lire et écouter','🎧 Read and listen','🎧 Leer y escuchar','🎧 Lesen und hören','🎧 Leggi e ascolta','🎧 Lezen en luisteren','🎧 اقرأ واستمع'),
    row('🔐 Espace pro','🔐 Pro space','🔐 Espacio profesional','🔐 Profi-Bereich','🔐 Spazio professionale','🔐 Pro-ruimte','🔐 مساحة المهني'),
    row('← Site','← Website','← Sitio','← Website','← Sito','← Website','← الموقع'),
    row('DIGIY HUB.','DIGIY HUB.','DIGIY HUB.','DIGIY HUB.','DIGIY HUB.','DIGIY HUB.','DIGIY HUB.'),
    row('Club des Métiers du Terrain.','Ground Business Club.','Club de los Oficios del Terreno.','Club der Berufe vor Ort.','Club dei Mestieri sul Territorio.','Club van Beroepen op het Terrein.','نادي مهن الميدان.'),
    row("L'architecture des bras numériques DIGIY.",'The architecture of DIGIY digital arms.','La arquitectura de los brazos digitales DIGIY.','Die Architektur der digitalen DIGIY-Arme.','L’architettura dei bracci digitali DIGIY.','De architectuur van de digitale DIGIY-armen.','هندسة الأذرع الرقمية لـ DIGIY.'),
    row("DIGIYLYFE n'est pas une appli de plus : c'est le Club des Métiers du Terrain. La voix ouvre. Les fiches remontent. Le pro garde la main.",'DIGIYLYFE is not just another app: it is the Ground Business Club. Voice opens the doors. Profiles rise up. The pro stays in control.','DIGIYLYFE no es otra aplicación: es el Club de los Oficios del Terreno. La voz abre. Las fichas suben. El profesional mantiene el control.','DIGIYLYFE ist nicht nur eine weitere App: Es ist der Club der Berufe vor Ort. Die Stimme öffnet. Profile steigen auf. Der Profi behält die Kontrolle.','DIGIYLYFE non è un’altra app: è il Club dei Mestieri sul Territorio. La voce apre. Le schede emergono. Il professionista mantiene il controllo.','DIGIYLYFE is niet zomaar een app: het is de Club van Beroepen op het Terrein. De stem opent. Profielen komen naar voren. De professional houdt de regie.','DIGIYLYFE ليس تطبيقاً إضافياً، بل نادي مهن الميدان. الصوت يفتح الأبواب. الملفات تظهر. والمهني يبقى مسيطراً.'),
    row('Chauffeurs, artisans, commerçants, loueurs, recruteurs : chaque métier a ses bras numériques. Le HUB ouvre la bonne porte — sans détour, sans commission, sans intermédiaire.','Drivers, artisans, merchants, hosts and recruiters: every trade has its digital arms. The HUB opens the right door — no detour, no commission, no middleman.','Conductores, artesanos, comerciantes, arrendadores y reclutadores: cada oficio tiene sus brazos digitales. El HUB abre la puerta correcta, sin desvíos, sin comisión y sin intermediarios.','Fahrer, Handwerker, Händler, Vermieter und Recruiter: Jeder Beruf hat seine digitalen Arme. Der HUB öffnet die richtige Tür — ohne Umweg, ohne Provision, ohne Vermittler.','Autisti, artigiani, commercianti, locatori e recruiter: ogni mestiere ha i suoi bracci digitali. L’HUB apre la porta giusta, senza deviazioni, commissioni o intermediari.','Chauffeurs, vakmensen, handelaars, verhuurders en recruiters: elk beroep heeft zijn digitale armen. De HUB opent de juiste deur — zonder omweg, commissie of tussenpersoon.','السائقون والحرفيون والتجار والمؤجرون ومسؤولو التوظيف: لكل مهنة أذرعها الرقمية. يفتح HUB الباب الصحيح بلا التفاف ولا عمولة ولا وسيط.'),
    row('Portes utiles','Useful doors','Puertas útiles','Nützliche Türen','Porte utili','Nuttige deuren','أبواب مفيدة'),
    row('Public + Pro','Public + Pro','Público + Profesional','Öffentlich + Profi','Pubblico + Pro','Publiek + Pro','عام + مهني'),
    row('Activation','Activation','Activación','Aktivierung','Attivazione','Activatie','تفعيل'),
    row('Favoris rapides','Quick favorites','Favoritos rápidos','Schnelle Favoriten','Preferiti rapidi','Snelle favorieten','مفضلة سريعة'),
    row('🌍 Portes publiques','🌍 Public doors','🌍 Puertas públicas','🌍 Öffentliche Türen','🌍 Porte pubbliche','🌍 Publieke deuren','🌍 الأبواب العامة'),
    row('🏢 Portes pro','🏢 Pro doors','🏢 Puertas profesionales','🏢 Profi-Türen','🏢 Porte professionali','🏢 Pro-deuren','🏢 أبواب المهنيين'),
    row('📣 Ouvrir RÉSEAU DIGIY','📣 Open DIGIY NETWORK','📣 Abrir RED DIGIY','📣 DIGIY NETZWERK öffnen','📣 Apri RETE DIGIY','📣 DIGIY NETWERK openen','📣 افتح شبكة DIGIY'),
    row('🎧 Lire et écouter sur le .net','🎧 Read and listen on .net','🎧 Leer y escuchar en .net','🎧 Auf .net lesen und hören','🎧 Leggi e ascolta su .net','🎧 Lezen en luisteren op .net','🎧 اقرأ واستمع على .net'),
    row('🎙️ Ouvrir la voix','🎙️ Open voice','🎙️ Abrir la voz','🎙️ Stimme öffnen','🎙️ Apri la voce','🎙️ Stem openen','🎙️ افتح الصوت'),
    row('3 rapides','3 quick','3 rápidos','3 schnelle','3 rapidi','3 snelle','3 سريعة'),
    row('Garde ici les trois portes que tu utilises le plus : une publique, une pro, une activation ou une entrée métier.','Keep your three most-used doors here: one public, one pro, one activation or trade entry.','Guarda aquí las tres puertas que más utilizas: una pública, una profesional, una activación o una entrada de oficio.','Speichere hier deine drei meistgenutzten Türen: öffentlich, Profi, Aktivierung oder Berufseinstieg.','Conserva qui le tre porte che usi di più: una pubblica, una professionale, un’attivazione o un ingresso mestiere.','Bewaar hier je drie meest gebruikte deuren: publiek, pro, activatie of beroepsingang.','احتفظ هنا بأكثر ثلاثة أبواب تستخدمها: باب عام، باب مهني، تفعيل أو مدخل مهنة.'),
    row('Réinitialiser','Reset','Restablecer','Zurücksetzen','Reimposta','Resetten','إعادة ضبط'),
    row('Ajoute jusqu’à 3 portes du Club selon ton métier : une publique, une pro, une action.','Add up to 3 Club doors based on your trade: one public, one pro, one action.','Añade hasta 3 puertas del Club según tu oficio: una pública, una profesional y una acción.','Füge je nach Beruf bis zu 3 Club-Türen hinzu: öffentlich, Profi und Aktion.','Aggiungi fino a 3 porte del Club secondo il tuo mestiere: pubblica, professionale e azione.','Voeg tot 3 Club-deuren toe volgens je beroep: publiek, pro en actie.','أضف حتى 3 أبواب من النادي حسب مهنتك: عام، مهني، وإجراء.'),
    row('Pour trouver, réserver, acheter, contacter, écouter ou découvrir.','To find, book, buy, contact, listen or discover.','Para encontrar, reservar, comprar, contactar, escuchar o descubrir.','Zum Finden, Buchen, Kaufen, Kontaktieren, Hören oder Entdecken.','Per trovare, prenotare, acquistare, contattare, ascoltare o scoprire.','Om te vinden, boeken, kopen, contact op te nemen, luisteren of ontdekken.','للبحث والحجز والشراء والتواصل والاستماع والاكتشاف.'),
    row('Voir le pro ↓','See pro ↓','Ver profesional ↓','Profi ansehen ↓','Vedi pro ↓','Bekijk pro ↓','عرض المهني ↓'),
    row('Pour les pros : d’abord s’inscrire ou activer, ensuite entrer par PIN dans le module protégé.','For pros: first sign up or activate, then enter the protected module with your PIN.','Para profesionales: primero registrarse o activar y después entrar al módulo protegido con el PIN.','Für Profis: zuerst registrieren oder aktivieren, dann mit PIN in das geschützte Modul.','Per i professionisti: prima registrarsi o attivare, poi entrare nel modulo protetto con il PIN.','Voor professionals: eerst registreren of activeren, daarna met PIN naar de beveiligde module.','للمهنيين: التسجيل أو التفعيل أولاً، ثم الدخول إلى الوحدة المحمية برمز PIN.'),
    row('Activer mon module','Activate my module','Activar mi módulo','Mein Modul aktivieren','Attiva il mio modulo','Mijn module activeren','تفعيل وحدتي'),
    row('Public ↑','Public ↑','Público ↑','Öffentlich ↑','Pubblico ↑','Publiek ↑','عام ↑'),
    row('🎧 Lire et écouter les paroles du terrain','🎧 Read and listen to field voices','🎧 Leer y escuchar las voces del terreno','🎧 Stimmen vom Feld lesen und hören','🎧 Leggi e ascolta le voci del territorio','🎧 Stemmen uit het veld lezen en beluisteren','🎧 اقرأ واستمع إلى أصوات الميدان'),
    row('✍️ S’inscrire côté pro','✍️ Sign up as a pro','✍️ Registrarse como profesional','✍️ Als Profi registrieren','✍️ Registrati come professionista','✍️ Registreren als professional','✍️ التسجيل كمهني'),
    row('🌍 Retour site','🌍 Back to website','🌍 Volver al sitio','🌍 Zurück zur Website','🌍 Torna al sito','🌍 Terug naar website','🌍 العودة إلى الموقع'),
    row('· Club des Métiers du Terrain · les bras numériques gardent la main au pro.','· Ground Business Club · digital arms keep the pro in control.','· Club de los Oficios del Terreno · los brazos digitales mantienen el control en manos del profesional.','· Club der Berufe vor Ort · die digitalen Arme lassen den Profi die Kontrolle behalten.','· Club dei Mestieri sul Territorio · i bracci digitali lasciano il controllo al professionista.','· Club van Beroepen op het Terrein · digitale armen houden de regie bij de professional.','· نادي مهن الميدان · الأذرع الرقمية تبقي التحكم بيد المهني.'),
    row('Remonter','Back to top','Volver arriba','Nach oben','Torna su','Naar boven','إلى الأعلى'),
    row('Site','Website','Sitio','Website','Sito','Website','الموقع'),
    row('RÉSEAU','NETWORK','RED','NETZWERK','RETE','NETWERK','الشبكة'),
    row('Lire / écouter','Read / listen','Leer / escuchar','Lesen / hören','Leggi / ascolta','Lezen / luisteren','اقرأ / استمع'),
    row('Accueil','Home','Inicio','Startseite','Home','Start','الرئيسية'),
    row('Menu','Menu','Menú','Menü','Menu','Menu','القائمة'),
    row('☰ Portes DIGIY','☰ DIGIY Doors','☰ Puertas DIGIY','☰ DIGIY-Türen','☰ Porte DIGIY','☰ DIGIY-deuren','☰ أبواب DIGIY'),
    row('Club des Métiers du Terrain : choisis ta porte, entre dans ton module.','Ground Business Club: choose your door and enter your module.','Club de los Oficios del Terreno: elige tu puerta y entra en tu módulo.','Club der Berufe vor Ort: Wähle deine Tür und öffne dein Modul.','Club dei Mestieri sul Territorio: scegli la tua porta ed entra nel modulo.','Club van Beroepen op het Terrein: kies je deur en open je module.','نادي مهن الميدان: اختر بابك وادخل إلى وحدتك.'),
    row('🏠 Accueil DIGIYLYFE','🏠 DIGIYLYFE home','🏠 Inicio DIGIYLYFE','🏠 DIGIYLYFE Start','🏠 Home DIGIYLYFE','🏠 DIGIYLYFE start','🏠 الرئيسية DIGIYLYFE'),
    row('🧭 Haut du HUB','🧭 Top of HUB','🧭 Inicio del HUB','🧭 HUB nach oben','🧭 Inizio HUB','🧭 Bovenkant HUB','🧭 أعلى HUB'),
    row('🎁 50 invitations pilotes','🎁 50 pilot invitations','🎁 50 invitaciones piloto','🎁 50 Pilot-Einladungen','🎁 50 inviti pilota','🎁 50 pilotuitnodigingen','🎁 50 دعوة تجريبية'),
    row('← Retour site','← Back to website','← Volver al sitio','← Zurück zur Website','← Torna al sito','← Terug naar website','← العودة إلى الموقع'),
    row('📰 Revue','📰 Review','📰 Revista','📰 Magazin','📰 Rivista','📰 Overzicht','📰 المراجعة'),
    row('La Voix','Voice','La Voz','Die Stimme','La Voce','De Stem','الصوت'),
    row('Favoris','Favorites','Favoritos','Favoriten','Preferiti','Favorieten','المفضلة'),
    row('LA VOIX · ACTION PRO','THE VOICE · ACTION PRO','LA VOZ · ACCIÓN PRO','DIE STIMME · PRO-AKTION','LA VOCE · AZIONE PRO','DE STEM · PRO-ACTIE','الصوت · إجراء مهني'),
    row('La Voix du Business','The Voice of Business','La Voz del Negocio','Die Stimme des Geschäfts','La Voce del Business','De Stem van de Zaak','صوت الأعمال'),
    row('La porte d’entrée du Club des Métiers du Terrain. Tu parles, DIGIY oriente, les fiches remontent. Le pro garde la main.','The entrance to the Ground Business Club. You speak, DIGIY routes, profiles rise up. The pro stays in control.','La entrada al Club de los Oficios del Terreno. Hablas, DIGIY orienta, las fichas suben. El profesional mantiene el control.','Der Eingang zum Club der Berufe vor Ort. Du sprichst, DIGIY leitet, Profile steigen auf. Der Profi behält die Kontrolle.','L’ingresso al Club dei Mestieri sul Territorio. Parli, DIGIY orienta, le schede emergono. Il professionista mantiene il controllo.','De ingang van de Club van Beroepen op het Terrein. Jij spreekt, DIGIY stuurt, profielen komen naar voren. De professional houdt de regie.','مدخل نادي مهن الميدان. أنت تتحدث، وDIGIY يوجّه، والملفات تظهر، والمهني يبقى مسيطراً.'),
    row('RÉSEAU DIGIY','DIGIY NETWORK','RED DIGIY','DIGIY NETZWERK','RETE DIGIY','DIGIY NETWERK','شبكة DIGIY'),
    row('Découvre les professionnels, leurs fiches et leurs contacts directs. Leurs raisonnements et paroles du terrain se lisent et s’écoutent sur DIGIYLYFE.net.','Discover professionals, their profiles and direct contacts. Their reasoning and field voices can be read and heard on DIGIYLYFE.net.','Descubre a los profesionales, sus fichas y contactos directos. Sus ideas y voces del terreno se leen y escuchan en DIGIYLYFE.net.','Entdecke Profis, ihre Profile und direkten Kontakte. Ihre Gedanken und Stimmen vom Feld kann man auf DIGIYLYFE.net lesen und hören.','Scopri i professionisti, le loro schede e i contatti diretti. Le loro idee e voci del territorio si leggono e ascoltano su DIGIYLYFE.net.','Ontdek professionals, hun profielen en directe contacten. Hun inzichten en stemmen uit het veld zijn te lezen en te horen op DIGIYLYFE.net.','اكتشف المهنيين وملفاتهم ووسائل تواصلهم المباشر. تُقرأ أفكارهم وأصوات الميدان وتُسمع على DIGIYLYFE.net.'),
    row('La Voix du Terrain · Aly','The Field Voice · Aly','La Voz del Terreno · Aly','Die Stimme des Feldes · Aly','La Voce del Territorio · Aly','De Stem van het Veld · Aly','صوت الميدان · علي'),
    row('Aly Kane te fait le tour du terrain en dix vues : le HUB, Saly, Sarlat. Il ouvre les portes, tu gardes la main.','Aly Kane takes you around the field in ten views: the HUB, Saly and Sarlat. He opens the doors; you stay in control.','Aly Kane te muestra el terreno en diez vistas: el HUB, Saly y Sarlat. Él abre las puertas y tú mantienes el control.','Aly Kane zeigt dir das Feld in zehn Ansichten: HUB, Saly und Sarlat. Er öffnet die Türen; du behältst die Kontrolle.','Aly Kane ti mostra il territorio in dieci viste: HUB, Saly e Sarlat. Lui apre le porte, tu mantieni il controllo.','Aly Kane toont het terrein in tien beelden: HUB, Saly en Sarlat. Hij opent de deuren; jij houdt de regie.','يأخذك علي كاني في جولة من عشر لقطات: HUB وسالي وسارلا. هو يفتح الأبواب وأنت تبقى مسيطراً.'),
    row('Découvrir le territoire','Discover the territory','Descubrir el territorio','Die Region entdecken','Scopri il territorio','Het gebied ontdekken','اكتشاف المنطقة'),
    row('Découvre les lieux et les spots du territoire. Le terrain se montre.','Discover places and spots across the territory. The field shows itself.','Descubre los lugares y puntos del territorio. El terreno se muestra.','Entdecke Orte und Plätze in der Region. Das Feld zeigt sich.','Scopri luoghi e punti del territorio. Il territorio si mostra.','Ontdek plaatsen en plekken in het gebied. Het terrein laat zich zien.','اكتشف الأماكن والنقاط في المنطقة. الميدان يظهر نفسه.'),
    row('Trouver un chauffeur','Find a driver','Encontrar un conductor','Fahrer finden','Trova un autista','Een chauffeur vinden','العثور على سائق'),
    row('Un chauffeur du Club, un trajet direct. Zéro commission, contact réel.','A Club driver, a direct ride. Zero commission, real contact.','Un conductor del Club, un trayecto directo. Cero comisión y contacto real.','Ein Fahrer aus dem Club, eine direkte Fahrt. Null Provision, echter Kontakt.','Un autista del Club, una corsa diretta. Zero commissioni, contatto reale.','Een Club-chauffeur, een directe rit. Nul commissie, echt contact.','سائق من النادي، رحلة مباشرة، صفر عمولة وتواصل حقيقي.'),
    row('Nos chauffeurs','Our drivers','Nuestros conductores','Unsere Fahrer','I nostri autisti','Onze chauffeurs','سائقونا'),
    row('Les chauffeurs du Club : profils, style, présence terrain. Tu choisis, tu contactes.','Club drivers: profiles, style and field presence. You choose, you contact.','Conductores del Club: perfiles, estilo y presencia en el terreno. Tú eliges y contactas.','Club-Fahrer: Profile, Stil und Präsenz vor Ort. Du wählst und kontaktierst.','Autisti del Club: profili, stile e presenza sul territorio. Scegli e contatti.','Club-chauffeurs: profielen, stijl en aanwezigheid op het terrein. Jij kiest en neemt contact op.','سائقو النادي: ملفات وأسلوب وحضور ميداني. أنت تختار وتتواصل.'),
    row('Trouver où dormir','Find a place to stay','Encontrar alojamiento','Unterkunft finden','Trova dove dormire','Een verblijf vinden','العثور على سكن'),
    row('Logements du Club : propriétaire direct, zéro intermédiaire. Tu réserves, il garde la main.','Club stays: direct owner, zero middleman. You book; the owner stays in control.','Alojamientos del Club: propietario directo, cero intermediarios. Tú reservas y el propietario mantiene el control.','Club-Unterkünfte: direkter Eigentümer, kein Vermittler. Du buchst; der Eigentümer behält die Kontrolle.','Alloggi del Club: proprietario diretto, nessun intermediario. Prenoti e il proprietario mantiene il controllo.','Club-verblijven: directe eigenaar, geen tussenpersoon. Jij boekt; de eigenaar houdt de regie.','سكن من النادي: مالك مباشر بلا وسيط. أنت تحجز والمالك يبقى مسيطراً.'),
    row('Réserver','Book','Reservar','Buchen','Prenota','Boeken','حجز'),
    row('Réserve un créneau directement chez le pro. Simple, direct, sans détour.','Book a slot directly with the professional. Simple, direct, no detour.','Reserva un horario directamente con el profesional. Simple, directo y sin desvíos.','Buche direkt einen Termin beim Profi. Einfach, direkt, ohne Umweg.','Prenota direttamente con il professionista. Semplice, diretto, senza deviazioni.','Boek rechtstreeks bij de professional. Eenvoudig, direct, zonder omweg.','احجز موعداً مباشرة لدى المهني. بسيط ومباشر بلا التفاف.'),
    row('Restaurants','Restaurants','Restaurantes','Restaurants','Ristoranti','Restaurants','مطاعم'),
    row('Restaurants validés : carte, photos, contact direct. Le restaurateur garde sa relation.','Validated restaurants: menu, photos and direct contact. The restaurant keeps the relationship.','Restaurantes validados: carta, fotos y contacto directo. El restaurador conserva su relación.','Geprüfte Restaurants: Karte, Fotos und direkter Kontakt. Das Restaurant behält die Beziehung.','Ristoranti verificati: menu, foto e contatto diretto. Il ristoratore mantiene la relazione.','Gevalideerde restaurants: menu, foto’s en direct contact. De restauranthouder behoudt de relatie.','مطاعم معتمدة: قائمة وصور وتواصل مباشر. المطعم يحتفظ بعلاقته مع العميل.'),
    row('Mon commerce','My shop','Mi comercio','Mein Geschäft','Il mio commercio','Mijn winkel','متجري'),
    row('Les commerces du Club : vitrine visible, contact simple. Le commerçant garde son client.','Club shops: visible storefront and simple contact. The merchant keeps the customer.','Comercios del Club: escaparate visible y contacto sencillo. El comerciante conserva al cliente.','Club-Geschäfte: sichtbares Schaufenster und einfacher Kontakt. Der Händler behält den Kunden.','Negozi del Club: vetrina visibile e contatto semplice. Il commerciante mantiene il cliente.','Club-winkels: zichtbare etalage en eenvoudig contact. De handelaar behoudt de klant.','متاجر النادي: واجهة ظاهرة وتواصل بسيط. التاجر يحتفظ بعميله.'),
    row('Les boutiques','Shops','Tiendas','Geschäfte','Negozi','Winkels','المتاجر'),
    row('Le marché local numérisé : produits visibles, vendeur direct, zéro commission.','The local market made digital: visible products, direct seller, zero commission.','El mercado local digitalizado: productos visibles, vendedor directo y cero comisión.','Der lokale Markt digital: sichtbare Produkte, direkter Verkäufer, null Provision.','Il mercato locale digitale: prodotti visibili, venditore diretto, zero commissioni.','De lokale markt digitaal: zichtbare producten, directe verkoper, nul commissie.','السوق المحلي رقمياً: منتجات ظاهرة وبائع مباشر وصفر عمولة.'),
    row('Trouver un artisan','Find an artisan','Encontrar un artesano','Handwerker finden','Trova un artigiano','Een vakman vinden','العثور على حرفي'),
    row('Les artisans du Club : travaux, dépannage, services. L’artisan reste le patron.','Club artisans: work, repairs and services. The artisan remains the boss.','Artesanos del Club: obras, reparaciones y servicios. El artesano sigue siendo el jefe.','Club-Handwerker: Arbeiten, Reparaturen und Dienste. Der Handwerker bleibt der Chef.','Artigiani del Club: lavori, riparazioni e servizi. L’artigiano resta il capo.','Club-vakmensen: werk, reparaties en diensten. De vakman blijft de baas.','حرفيو النادي: أعمال وإصلاحات وخدمات. الحرفي يبقى صاحب القرار.'),
    row('Trouver du travail','Find work','Encontrar trabajo','Arbeit finden','Trova lavoro','Werk vinden','العثور على عمل'),
    row('Missions et opportunités du terrain. Le terrain recrute en direct, sans intermédiaire.','Field missions and opportunities. The field recruits directly, without a middleman.','Misiones y oportunidades del terreno. El terreno contrata directamente, sin intermediarios.','Aufträge und Chancen vor Ort. Das Feld rekrutiert direkt, ohne Vermittler.','Missioni e opportunità sul territorio. Il territorio assume direttamente, senza intermediari.','Opdrachten en kansen op het terrein. Het veld werft rechtstreeks, zonder tussenpersoon.','مهام وفرص ميدانية. الميدان يوظف مباشرة بلا وسيط.'),
    row('NDIMBAL Express','NDIMBAL Express','NDIMBAL Express','NDIMBAL Express','NDIMBAL Express','NDIMBAL Express','NDIMBAL Express'),
    row('Annonces terrain validées par DIGIY : 7 jours, 15 jours ou 30 jours. Ticket durée, contact direct, 0 % commission.','Field ads validated by DIGIY: 7, 15 or 30 days. Duration ticket, direct contact, 0% commission.','Anuncios del terreno validados por DIGIY: 7, 15 o 30 días. Ticket por duración, contacto directo y 0% comisión.','Von DIGIY geprüfte Anzeigen: 7, 15 oder 30 Tage. Laufzeit-Ticket, direkter Kontakt, 0% Provision.','Annunci territoriali verificati da DIGIY: 7, 15 o 30 giorni. Ticket a durata, contatto diretto, 0% commissioni.','Veldadvertenties gevalideerd door DIGIY: 7, 15 of 30 dagen. Duurticket, direct contact, 0% commissie.','إعلانات ميدانية معتمدة من DIGIY لمدة 7 أو 15 أو 30 يوماً. تذكرة مدة وتواصل مباشر وصفر عمولة.'),
    row('DIGIY CARNET PRO','DIGIY CARNET PRO','DIGIY CARNET PRO','DIGIY CARNET PRO','DIGIY CARNET PRO','DIGIY CARNET PRO','DIGIY CARNET PRO'),
    row('Encaissements, dépenses, réserves et preuves. Ton activité devient claire sans que DIGIY touche à ton argent.','Income, expenses, reserves and evidence. Your activity becomes clear without DIGIY touching your money.','Ingresos, gastos, reservas y comprobantes. Tu actividad se vuelve clara sin que DIGIY toque tu dinero.','Einnahmen, Ausgaben, Rücklagen und Belege. Deine Tätigkeit wird klar, ohne dass DIGIY dein Geld berührt.','Incassi, spese, riserve e prove. La tua attività diventa chiara senza che DIGIY tocchi il tuo denaro.','Inkomsten, uitgaven, reserves en bewijzen. Je activiteit wordt duidelijk zonder dat DIGIY je geld aanraakt.','مداخيل ومصاريف واحتياطات وإثباتات. يصبح نشاطك واضحاً دون أن تلمس DIGIY أموالك.'),
    row('La carte','The map','El mapa','Die Karte','La mappa','De kaart','الخريطة'),
    row('La carte du terrain : pros, lieux, services autour de toi. Le Club visible sur la carte.','The field map: professionals, places and services around you. The Club visible on the map.','El mapa del terreno: profesionales, lugares y servicios a tu alrededor. El Club visible en el mapa.','Die Karte vor Ort: Profis, Orte und Dienste in deiner Nähe. Der Club sichtbar auf der Karte.','La mappa del territorio: professionisti, luoghi e servizi intorno a te. Il Club visibile sulla mappa.','De terreinkaart: professionals, plaatsen en diensten om je heen. De Club zichtbaar op de kaart.','خريطة الميدان: مهنيون وأماكن وخدمات حولك. النادي ظاهر على الخريطة.'),
    row('Paroles du terrain','Field voices','Voces del terreno','Stimmen vom Feld','Voci del territorio','Stemmen uit het veld','أصوات الميدان'),
    row('Raisonnements, témoignages et expériences à lire ou à écouter sur DIGIYLYFE.net. La parole est conservée et reliée à l’humain.','Reasoning, testimonials and experiences to read or hear on DIGIYLYFE.net. Each voice is preserved and connected to the person.','Ideas, testimonios y experiencias para leer o escuchar en DIGIYLYFE.net. La voz se conserva y se conecta con la persona.','Gedanken, Berichte und Erfahrungen zum Lesen oder Hören auf DIGIYLYFE.net. Jede Stimme bleibt erhalten und mit dem Menschen verbunden.','Ragionamenti, testimonianze ed esperienze da leggere o ascoltare su DIGIYLYFE.net. La voce è conservata e collegata alla persona.','Inzichten, getuigenissen en ervaringen om te lezen of beluisteren op DIGIYLYFE.net. Elke stem blijft verbonden met de persoon.','أفكار وشهادات وتجارب للقراءة أو الاستماع على DIGIYLYFE.net. يُحفظ الصوت ويرتبط بصاحبه.'),
    row('Mon assistant DIGIY','My DIGIY assistant','Mi asistente DIGIY','Mein DIGIY-Assistent','Il mio assistente DIGIY','Mijn DIGIY-assistent','مساعدي DIGIY'),
    row('L’assistant du Club : une question, la bonne porte. Simple, humain, direct.','The Club assistant: one question, the right door. Simple, human and direct.','El asistente del Club: una pregunta, la puerta correcta. Simple, humano y directo.','Der Club-Assistent: eine Frage, die richtige Tür. Einfach, menschlich und direkt.','L’assistente del Club: una domanda, la porta giusta. Semplice, umano e diretto.','De Club-assistent: één vraag, de juiste deur. Eenvoudig, menselijk en direct.','مساعد النادي: سؤال واحد والباب الصحيح. بسيط وإنساني ومباشر.'),
    row('Dis ou écris ton besoin. DIGIY t’oriente vers le bon métier et le bon professionnel.','Say or write what you need. DIGIY routes you to the right trade and professional.','Di o escribe lo que necesitas. DIGIY te orienta al oficio y profesional adecuados.','Sag oder schreibe, was du brauchst. DIGIY führt dich zum passenden Beruf und Profi.','Di’ o scrivi ciò di cui hai bisogno. DIGIY ti orienta verso il mestiere e il professionista giusti.','Zeg of schrijf wat je nodig hebt. DIGIY stuurt je naar het juiste beroep en de juiste professional.','قل أو اكتب ما تحتاجه. توجهك DIGIY إلى المهنة والمهني المناسبين.'),
    row('S’inscrire côté pro','Sign up as a pro','Registrarse como profesional','Als Profi registrieren','Registrati come professionista','Registreren als professional','التسجيل كمهني'),
    row('Rejoins le Club des Métiers du Terrain. Un module, un abonnement fixe, 0 % commission.','Join the Ground Business Club. One module, one fixed subscription, 0% commission.','Únete al Club de los Oficios del Terreno. Un módulo, una suscripción fija y 0% comisión.','Tritt dem Club der Berufe vor Ort bei. Ein Modul, ein fester Tarif, 0% Provision.','Entra nel Club dei Mestieri sul Territorio. Un modulo, un abbonamento fisso, 0% commissioni.','Word lid van de Club van Beroepen op het Terrein. Eén module, één vast abonnement, 0% commissie.','انضم إلى نادي مهن الميدان. وحدة واحدة واشتراك ثابت وصفر عمولة.'),
    row('Mon activité','My activity','Mi actividad','Meine Aktivität','La mia attività','Mijn activiteit','نشاطي'),
    row('Ton espace membre du Club : modules, activité, suivi.','Your Club member space: modules, activity and tracking.','Tu espacio de miembro del Club: módulos, actividad y seguimiento.','Dein Club-Mitgliederbereich: Module, Aktivität und Übersicht.','Il tuo spazio membro del Club: moduli, attività e monitoraggio.','Je Club-ledenruimte: modules, activiteit en opvolging.','مساحة عضويتك في النادي: وحدات ونشاط ومتابعة.'),
    row('MON RÉSEAU DIGIY','MY DIGIY NETWORK','MI RED DIGIY','MEIN DIGIY NETZWERK','LA MIA RETE DIGIY','MIJN DIGIY NETWERK','شبكتي DIGIY'),
    row('Gère ta fiche, tes offres et ta visibilité. Relie aussi tes paroles publiées, lues et écoutées sur DIGIYLYFE.net.','Manage your profile, offers and visibility. Also connect your published words, available to read and hear on DIGIYLYFE.net.','Gestiona tu ficha, ofertas y visibilidad. Conecta también tus palabras publicadas, leídas y escuchadas en DIGIYLYFE.net.','Verwalte Profil, Angebote und Sichtbarkeit. Verknüpfe auch deine veröffentlichten Worte auf DIGIYLYFE.net.','Gestisci scheda, offerte e visibilità. Collega anche le tue parole pubblicate, lette e ascoltate su DIGIYLYFE.net.','Beheer je profiel, aanbiedingen en zichtbaarheid. Koppel ook je gepubliceerde woorden op DIGIYLYFE.net.','أدر ملفك وعروضك وظهورك. واربط أيضاً كلماتك المنشورة والمقروءة والمسموعة على DIGIYLYFE.net.'),
    row('Ouvre ton bras numérique. Un métier, un module, tu gardes la main.','Open your digital arm. One trade, one module; you stay in control.','Abre tu brazo digital. Un oficio, un módulo y tú mantienes el control.','Öffne deinen digitalen Arm. Ein Beruf, ein Modul; du behältst die Kontrolle.','Apri il tuo braccio digitale. Un mestiere, un modulo; mantieni il controllo.','Open je digitale arm. Eén beroep, één module; jij houdt de regie.','افتح ذراعك الرقمية. مهنة واحدة ووحدة واحدة وأنت تبقى مسيطراً.'),
    row('Nos tarifs','Our prices','Nuestras tarifas','Unsere Preise','Le nostre tariffe','Onze tarieven','أسعارنا'),
    row('Abonnement fixe, sans surprise. Choisis ton métier, active ton module.','Fixed subscription, no surprises. Choose your trade and activate your module.','Suscripción fija, sin sorpresas. Elige tu oficio y activa tu módulo.','Fester Tarif ohne Überraschungen. Wähle deinen Beruf und aktiviere dein Modul.','Abbonamento fisso, senza sorprese. Scegli il mestiere e attiva il modulo.','Vast abonnement, zonder verrassingen. Kies je beroep en activeer je module.','اشتراك ثابت بلا مفاجآت. اختر مهنتك وفعّل وحدتك.'),
    row('La caisse du terrain : encaisser, suivre, garder la main sur chaque vente.','The field cash register: collect, track and stay in control of every sale.','La caja del terreno: cobrar, seguir y mantener el control de cada venta.','Die Kasse vor Ort: kassieren, verfolgen und jede Zahlung kontrollieren.','La cassa del territorio: incassare, seguire e controllare ogni vendita.','De veldkassa: innen, volgen en controle houden over elke verkoop.','صندوق الميدان: تحصيل ومتابعة والتحكم في كل عملية بيع.'),
    row('Je vends','I sell','Vendo','Ich verkaufe','Vendo','Ik verkoop','أبيع'),
    row('Ton marché numérique : produits visibles, contact direct, zéro intermédiaire.','Your digital market: visible products, direct contact, zero middleman.','Tu mercado digital: productos visibles, contacto directo y cero intermediarios.','Dein digitaler Markt: sichtbare Produkte, direkter Kontakt, kein Vermittler.','Il tuo mercato digitale: prodotti visibili, contatto diretto, zero intermediari.','Je digitale markt: zichtbare producten, direct contact, geen tussenpersoon.','سوقك الرقمي: منتجات ظاهرة وتواصل مباشر بلا وسيط.'),
    row('Je loue','I rent','Alquilo','Ich vermiete','Affitto','Ik verhuur','أؤجر'),
    row('Tes logements en ligne, tes clients en direct. Tu loues, tu gardes ta relation.','Your stays online, your clients direct. You rent and keep the relationship.','Tus alojamientos en línea y tus clientes directos. Alquilas y conservas la relación.','Deine Unterkünfte online, deine Kunden direkt. Du vermietest und behältst die Beziehung.','I tuoi alloggi online, i clienti diretti. Affitti e mantieni la relazione.','Je verblijven online, je klanten direct. Jij verhuurt en behoudt de relatie.','مساكنك على الإنترنت وعملاؤك مباشرة. تؤجر وتحافظ على العلاقة.'),
    row('Je réserve','I take bookings','Gestiono reservas','Ich verwalte Buchungen','Gestisco prenotazioni','Ik beheer boekingen','أدير الحجوزات'),
    row('Ton planning terrain : créneaux, rendez-vous, clients — zéro détour.','Your field schedule: slots, appointments and clients — no detour.','Tu agenda del terreno: horarios, citas y clientes, sin desvíos.','Dein Zeitplan vor Ort: Zeiten, Termine und Kunden — ohne Umweg.','La tua agenda sul territorio: fasce, appuntamenti e clienti, senza deviazioni.','Je veldplanning: tijdsloten, afspraken en klanten — zonder omweg.','جدولك الميداني: أوقات ومواعيد وعملاء بلا التفاف.'),
    row('Mon restaurant','My restaurant','Mi restaurante','Mein Restaurant','Il mio ristorante','Mijn restaurant','مطعمي'),
    row('Ton module restaurant : action RESTO, fiche, calendrier, réservation simple et acompte direct.','Your restaurant module: RESTO action, profile, calendar, simple booking and direct deposit.','Tu módulo de restaurante: acción RESTO, ficha, calendario, reserva sencilla y anticipo directo.','Dein Restaurantmodul: RESTO-Aktion, Profil, Kalender, einfache Buchung und direkte Anzahlung.','Il tuo modulo ristorante: azione RESTO, scheda, calendario, prenotazione semplice e acconto diretto.','Je restaurantmodule: RESTO-actie, profiel, kalender, eenvoudige reservering en directe aanbetaling.','وحدة مطعمك: إجراء RESTO وملف وتقويم وحجز بسيط وعربون مباشر.'),
    row('Je conduis','I drive','Conduzco','Ich fahre','Guido','Ik rijd','أقود'),
    row('Ton cockpit chauffeur : trajets, tarifs, profil visible. Tu conduis, tu gardes ta course.','Your driver cockpit: rides, prices and visible profile. You drive and keep your ride.','Tu cabina de conductor: trayectos, tarifas y perfil visible. Conduces y conservas tu viaje.','Dein Fahrer-Cockpit: Fahrten, Preise und sichtbares Profil. Du fährst und behältst deine Fahrt.','Il tuo cockpit autista: corse, tariffe e profilo visibile. Guidi e mantieni la corsa.','Je chauffeurscockpit: ritten, tarieven en zichtbaar profiel. Jij rijdt en behoudt je rit.','قمرة السائق: رحلات وأسعار وملف ظاهر. أنت تقود وتحتفظ برحلتك.'),
    row('Je recrute','I recruit','Recluto','Ich rekrutiere','Assumo','Ik werf','أوظف'),
    row('Tes offres terrain, tes candidats directs. Tu recrutes sans passer par un intermédiaire.','Your field offers, your direct candidates. You recruit without a middleman.','Tus ofertas del terreno y candidatos directos. Reclutas sin intermediarios.','Deine Angebote vor Ort, deine direkten Kandidaten. Du rekrutierst ohne Vermittler.','Le tue offerte sul territorio, i candidati diretti. Assumi senza intermediari.','Je veldvacatures, je directe kandidaten. Je werft zonder tussenpersoon.','عروضك الميدانية ومرشحوك مباشرة. توظف بلا وسيط.'),
    row('NDIMBAL Express — Dépôt annonce','NDIMBAL Express — Ad submission','NDIMBAL Express — Publicar anuncio','NDIMBAL Express — Anzeige einreichen','NDIMBAL Express — Pubblica annuncio','NDIMBAL Express — Advertentie plaatsen','NDIMBAL Express — إيداع إعلان'),
    row('Déposer une annonce avec durée 7, 15 ou 30 jours via PIN. Validation DIGIY séparée.','Submit an ad for 7, 15 or 30 days via PIN. Separate DIGIY validation.','Publica un anuncio de 7, 15 o 30 días mediante PIN. Validación DIGIY separada.','Eine Anzeige für 7, 15 oder 30 Tage per PIN einreichen. Separate DIGIY-Prüfung.','Pubblica un annuncio di 7, 15 o 30 giorni tramite PIN. Validazione DIGIY separata.','Plaats een advertentie voor 7, 15 of 30 dagen via PIN. Aparte DIGIY-validatie.','أودع إعلاناً لمدة 7 أو 15 أو 30 يوماً عبر PIN. اعتماد DIGIY منفصل.'),
    row('Mes services','My services','Mis servicios','Meine Dienste','I miei servizi','Mijn diensten','خدماتي'),
    row('Tes services visibles, tes demandes directes. L’artisan garde son client.','Your visible services, your direct requests. The artisan keeps the customer.','Tus servicios visibles y solicitudes directas. El artesano conserva al cliente.','Deine sichtbaren Dienste, deine direkten Anfragen. Der Handwerker behält den Kunden.','I tuoi servizi visibili e richieste dirette. L’artigiano mantiene il cliente.','Je zichtbare diensten en directe aanvragen. De vakman behoudt de klant.','خدماتك ظاهرة وطلباتك مباشرة. الحرفي يحتفظ بعميله.'),
    row('Me faire connaître','Get discovered','Dar a conocer mi actividad','Bekannt werden','Farmi conoscere','Bekend worden','التعريف بنفسي'),
    row('Ton lieu sur la carte, ton territoire visible. Le public te trouve, tu gardes le contact.','Your place on the map, your territory visible. The public finds you; you keep the contact.','Tu lugar en el mapa y tu territorio visible. El público te encuentra y conservas el contacto.','Dein Ort auf der Karte, deine Region sichtbar. Das Publikum findet dich; du behältst den Kontakt.','Il tuo luogo sulla mappa e il territorio visibile. Il pubblico ti trova e mantieni il contatto.','Je plek op de kaart, je gebied zichtbaar. Het publiek vindt je; jij behoudt het contact.','مكانك على الخريطة ومنطقتك ظاهرة. يجدك الجمهور وتحافظ على التواصل.'),
    row('PRO CARNET','PRO CARNET','PRO CARNET','PRO CARNET','PRO CARNET','PRO CARNET','PRO CARNET'),
    row('Tes encaissements, tes dépenses, ta réserve et tes preuves. Tu vois clairement ce que ton activité produit.','Your income, expenses, reserve and evidence. You clearly see what your activity produces.','Tus ingresos, gastos, reserva y comprobantes. Ves claramente lo que produce tu actividad.','Deine Einnahmen, Ausgaben, Rücklage und Belege. Du siehst klar, was deine Tätigkeit erwirtschaftet.','I tuoi incassi, spese, riserva e prove. Vedi chiaramente ciò che produce la tua attività.','Je inkomsten, uitgaven, reserve en bewijzen. Je ziet duidelijk wat je activiteit oplevert.','مداخيلك ومصاريفك واحتياطك وإثباتاتك. ترى بوضوح ما ينتجه نشاطك.'),
    row('Un seul module dans le HUB. Ses pages utiles restent réunies ici pour éviter le défilement.','One module in the HUB. Its useful pages stay grouped here to avoid long scrolling.','Un solo módulo en el HUB. Sus páginas útiles permanecen reunidas aquí para evitar desplazamientos largos.','Ein Modul im HUB. Seine nützlichen Seiten bleiben hier gebündelt, um langes Scrollen zu vermeiden.','Un solo modulo nell’HUB. Le pagine utili restano riunite qui per evitare lunghi scorrimenti.','Eén module in de HUB. De nuttige pagina’s blijven hier samen om lang scrollen te vermijden.','وحدة واحدة في HUB. تبقى صفحاتها المفيدة مجمعة هنا لتجنب التمرير الطويل.'),
    row('Nouvelle doctrine du module :','New module doctrine:','Nueva doctrina del módulo:','Neue Modul-Doktrin:','Nuova dottrina del modulo:','Nieuwe moduleleer:','مبدأ الوحدة الجديد:'),
    row('le HUB montre une porte courte. La cartouche distribue ensuite vers le public, la lecture écoutée sur DIGIYLYFE.net et l’atelier professionnel.','the HUB shows one short door. The drawer then routes to the public side, read-aloud content on DIGIYLYFE.net and the professional workshop.','el HUB muestra una puerta corta. El panel dirige después al público, al contenido leído y escuchado en DIGIYLYFE.net y al taller profesional.','der HUB zeigt eine kurze Tür. Das Panel führt dann zur öffentlichen Seite, zu Lese- und Hörinhalten auf DIGIYLYFE.net und zur Profi-Werkstatt.','l’HUB mostra una porta breve. Il pannello indirizza poi al pubblico, ai contenuti letti e ascoltati su DIGIYLYFE.net e al laboratorio professionale.','de HUB toont één korte deur. Het paneel leidt daarna naar publiek, lees- en luisterinhoud op DIGIYLYFE.net en de professionele werkplaats.','يعرض HUB باباً مختصراً. ثم توجّه اللوحة إلى الجانب العام ومحتوى القراءة والاستماع على DIGIYLYFE.net وورشة المهنيين.'),
    row('🌍 Découvrir','🌍 Discover','🌍 Descubrir','🌍 Entdecken','🌍 Scopri','🌍 Ontdekken','🌍 اكتشف'),
    row('🎧 Lire / écouter','🎧 Read / listen','🎧 Leer / escuchar','🎧 Lesen / hören','🎧 Leggi / ascolta','🎧 Lezen / luisteren','🎧 اقرأ / استمع'),
    row('🏢 Atelier PRO','🏢 PRO workshop','🏢 Taller PRO','🏢 PRO-Werkstatt','🏢 Laboratorio PRO','🏢 PRO-werkplaats','🏢 ورشة المهنيين'),
    row('Portes publiques','Public doors','Puertas públicas','Öffentliche Türen','Porte pubbliche','Publieke deuren','الأبواب العامة'),
    row('Voir, comprendre, contacter','See, understand, contact','Ver, comprender, contactar','Sehen, verstehen, kontaktieren','Vedere, capire, contattare','Zien, begrijpen, contact opnemen','شاهد وافهم وتواصل'),
    row('Accueil RÉSEAU','NETWORK home','Inicio de la RED','NETZWERK-Start','Home RETE','NETWERK-start','رئيسية الشبكة'),
    row('Découvrir la mission et choisir sa direction.','Discover the mission and choose a direction.','Descubrir la misión y elegir una dirección.','Die Mission entdecken und eine Richtung wählen.','Scopri la missione e scegli una direzione.','Ontdek de missie en kies een richting.','اكتشف المهمة واختر الاتجاه.'),
    row('Professionnels en lumière','Featured professionals','Profesionales destacados','Profis im Rampenlicht','Professionisti in evidenza','Professionals in beeld','مهنيون في الواجهة'),
    row('Fiches, offres, QR et contacts directs.','Profiles, offers, QR codes and direct contacts.','Fichas, ofertas, QR y contactos directos.','Profile, Angebote, QR-Codes und direkte Kontakte.','Schede, offerte, QR e contatti diretti.','Profielen, aanbiedingen, QR-codes en directe contacten.','ملفات وعروض ورموز QR وتواصل مباشر.'),
    row('Journal du réseau','Network journal','Diario de la red','Netzwerk-Journal','Giornale della rete','Netwerkjournaal','صحيفة الشبكة'),
    row('Actualités et publications sélectionnées.','Selected news and publications.','Noticias y publicaciones seleccionadas.','Ausgewählte Nachrichten und Veröffentlichungen.','Notizie e pubblicazioni selezionate.','Geselecteerd nieuws en publicaties.','أخبار ومنشورات مختارة.'),
    row('Fiches du réseau','Network profiles','Fichas de la red','Netzwerk-Profile','Schede della rete','Netwerkprofielen','ملفات الشبكة'),
    row('Voir les présences professionnelles validées.','See validated professional presences.','Ver las presencias profesionales validadas.','Geprüfte professionelle Präsenzen ansehen.','Vedi le presenze professionali convalidate.','Bekijk gevalideerde professionele profielen.','عرض الوجود المهني المعتمد.'),
    row('Lexique terrain','Field glossary','Glosario del terreno','Feld-Glossar','Glossario del territorio','Veldwoordenlijst','معجم الميدان'),
    row('Mots simples, français et repères locaux.','Simple words, French and local references.','Palabras sencillas, francés y referencias locales.','Einfache Wörter, Französisch und lokale Hinweise.','Parole semplici, francese e riferimenti locali.','Eenvoudige woorden, Frans en lokale aanknopingspunten.','كلمات بسيطة وفرنسية ومراجع محلية.'),
    row('Poser une question','Ask a question','Hacer una pregunta','Eine Frage stellen','Fai una domanda','Een vraag stellen','طرح سؤال'),
    row('DIGIY écoute avant de publier ou d’orienter.','DIGIY listens before publishing or routing.','DIGIY escucha antes de publicar u orientar.','DIGIY hört zu, bevor veröffentlicht oder weitergeleitet wird.','DIGIY ascolta prima di pubblicare o orientare.','DIGIY luistert vóór publicatie of doorverwijzing.','تستمع DIGIY قبل النشر أو التوجيه.'),
    row('La lecture et l’écoute vivent sur le .net','Reading and listening live on .net','La lectura y la escucha viven en .net','Lesen und Hören leben auf .net','Lettura e ascolto vivono su .net','Lezen en luisteren leven op .net','القراءة والاستماع يعيشان على .net'),
    row('Lire et écouter sur DIGIYLYFE.net','Read and listen on DIGIYLYFE.net','Leer y escuchar en DIGIYLYFE.net','Auf DIGIYLYFE.net lesen und hören','Leggi e ascolta su DIGIYLYFE.net','Lezen en luisteren op DIGIYLYFE.net','اقرأ واستمع على DIGIYLYFE.net'),
    row('Raisonnements, témoignages et expériences du terrain.','Field reasoning, testimonials and experiences.','Ideas, testimonios y experiencias del terreno.','Gedanken, Berichte und Erfahrungen vom Feld.','Ragionamenti, testimonianze ed esperienze del territorio.','Inzichten, getuigenissen en ervaringen uit het veld.','أفكار وشهادات وتجارب الميدان.'),
    row('Proposer une parole','Share a field voice','Proponer una voz','Eine Stimme teilen','Proponi una voce','Een stem delen','مشاركة كلمة'),
    row('Transmettre un texte ou une note vocale à DIGIY.','Send a text or voice note to DIGIY.','Enviar un texto o una nota de voz a DIGIY.','Text oder Sprachnachricht an DIGIY senden.','Invia un testo o una nota vocale a DIGIY.','Stuur een tekst of spraakbericht naar DIGIY.','إرسال نص أو ملاحظة صوتية إلى DIGIY.'),
    row('Préparer avec ACTION','Prepare with ACTION','Preparar con ACTION','Mit ACTION vorbereiten','Prepara con ACTION','Voorbereiden met ACTION','التحضير مع ACTION'),
    row('Clarifier la parole avant validation humaine.','Clarify the voice before human validation.','Aclarar la voz antes de la validación humana.','Die Aussage vor menschlicher Freigabe klären.','Chiarire la voce prima della convalida umana.','De boodschap verduidelijken vóór menselijke validatie.','توضيح الكلام قبل الاعتماد البشري.'),
    row('Assistant RÉSEAU','NETWORK assistant','Asistente de RED','NETZWERK-Assistent','Assistente RETE','NETWERK-assistent','مساعد الشبكة'),
    row('Trouver la bonne porte sans se perdre.','Find the right door without getting lost.','Encontrar la puerta correcta sin perderse.','Die richtige Tür finden, ohne sich zu verirren.','Trova la porta giusta senza perderti.','Vind de juiste deur zonder te verdwalen.','العثور على الباب الصحيح دون ضياع.'),
    row('Atelier professionnel','Professional workshop','Taller profesional','Professionelle Werkstatt','Laboratorio professionale','Professionele werkplaats','ورشة مهنية'),
    row('Préparer, valider, publier','Prepare, validate, publish','Preparar, validar, publicar','Vorbereiten, prüfen, veröffentlichen','Preparare, convalidare, pubblicare','Voorbereiden, valideren, publiceren','تحضير واعتماد ونشر'),
    row('Gérer MON RÉSEAU','Manage MY NETWORK','Gestionar MI RED','MEIN NETZWERK verwalten','Gestisci LA MIA RETE','MIJN NETWERK beheren','إدارة شبكتي'),
    row('Fiche, offre, visibilité et contact direct.','Profile, offer, visibility and direct contact.','Ficha, oferta, visibilidad y contacto directo.','Profil, Angebot, Sichtbarkeit und direkter Kontakt.','Scheda, offerta, visibilità e contatto diretto.','Profiel, aanbod, zichtbaarheid en direct contact.','ملف وعرض وظهور وتواصل مباشر.'),
    row('Demande / inscription','Request / registration','Solicitud / inscripción','Anfrage / Registrierung','Richiesta / iscrizione','Aanvraag / registratie','طلب / تسجيل'),
    row('Préparer l’entrée du professionnel.','Prepare the professional entry.','Preparar la entrada del profesional.','Den Einstieg des Profis vorbereiten.','Prepara l’ingresso del professionista.','De toegang van de professional voorbereiden.','تحضير دخول المهني.'),
    row('Préparer une annonce','Prepare an ad','Preparar un anuncio','Anzeige vorbereiten','Prepara un annuncio','Een advertentie voorbereiden','تحضير إعلان'),
    row('Annonce datée et visibilité qualifiée.','Dated ad and qualified visibility.','Anuncio fechado y visibilidad cualificada.','Datierte Anzeige und qualifizierte Sichtbarkeit.','Annuncio datato e visibilità qualificata.','Gedateerde advertentie en gerichte zichtbaarheid.','إعلان مؤرخ وظهور مؤهل.'),
    row('Offres et règlement','Offers and payment','Ofertas y pago','Angebote und Zahlung','Offerte e pagamento','Aanbiedingen en betaling','العروض والدفع'),
    row('R7, R15, R30 ou FIRST après validation.','R7, R15, R30 or FIRST after validation.','R7, R15, R30 o FIRST tras validación.','R7, R15, R30 oder FIRST nach Prüfung.','R7, R15, R30 o FIRST dopo la convalida.','R7, R15, R30 of FIRST na validatie.','R7 أو R15 أو R30 أو FIRST بعد الاعتماد.'),
    row('ACTION RÉSEAU','NETWORK ACTION','ACCIÓN RED','NETZWERK-AKTION','AZIONE RETE','NETWERK-ACTIE','إجراء الشبكة'),
    row('Préparer la demande avec la voix ou le texte.','Prepare the request with voice or text.','Preparar la solicitud con voz o texto.','Die Anfrage per Stimme oder Text vorbereiten.','Prepara la richiesta con voce o testo.','Bereid de aanvraag voor met stem of tekst.','تحضير الطلب بالصوت أو النص.'),
    row('Session du module','Module session','Sesión del módulo','Modulsitzung','Sessione del modulo','Modulesessie','جلسة الوحدة'),
    row('Retrouver les éléments préparés localement.','Retrieve items prepared locally.','Recuperar los elementos preparados localmente.','Lokal vorbereitete Elemente wiederfinden.','Ritrova gli elementi preparati localmente.','Vind lokaal voorbereide onderdelen terug.','استرجاع العناصر المحضرة محلياً.'),
    row('DIGIYLYFE.net porte les voix. RÉSEAU DIGIY porte les personnes, leurs activités et leurs contacts directs.','DIGIYLYFE.net carries the voices. DIGIY NETWORK carries people, their activities and direct contacts.','DIGIYLYFE.net lleva las voces. RED DIGIY lleva a las personas, sus actividades y contactos directos.','DIGIYLYFE.net trägt die Stimmen. DIGIY NETZWERK trägt Menschen, Tätigkeiten und direkte Kontakte.','DIGIYLYFE.net porta le voci. RETE DIGIY porta persone, attività e contatti diretti.','DIGIYLYFE.net draagt de stemmen. DIGIY NETWERK draagt mensen, activiteiten en directe contacten.','يحمل DIGIYLYFE.net الأصوات. وتحمل شبكة DIGIY الأشخاص وأنشطتهم ووسائل تواصلهم المباشر.'),
    row('☰ Ouvrir les portes','☰ Open the doors','☰ Abrir las puertas','☰ Türen öffnen','☰ Apri le porte','☰ Deuren openen','☰ افتح الأبواب'),
    row('FAVORI','FAVORITE','FAVORITO','FAVORIT','PREFERITO','FAVORIET','مفضل'),
    row('↗ Ouvrir','↗ Open','↗ Abrir','↗ Öffnen','↗ Apri','↗ Openen','↗ فتح'),
    row('Retirer des favoris','Remove from favorites','Quitar de favoritos','Aus Favoriten entfernen','Rimuovi dai preferiti','Uit favorieten verwijderen','إزالة من المفضلة'),
    row('Ajouter aux favoris','Add to favorites','Añadir a favoritos','Zu Favoriten hinzufügen','Aggiungi ai preferiti','Aan favorieten toevoegen','إضافة إلى المفضلة'),
    row('Ouvrir le menu','Open menu','Abrir menú','Menü öffnen','Apri menu','Menu openen','فتح القائمة'),
    row('Fermer','Close','Cerrar','Schließen','Chiudi','Sluiten','إغلاق'),
    row('Fermer RÉSEAU DIGIY','Close DIGIY NETWORK','Cerrar RED DIGIY','DIGIY NETZWERK schließen','Chiudi RETE DIGIY','DIGIY NETWERK sluiten','إغلاق شبكة DIGIY'),
    row('Actions principales','Main actions','Acciones principales','Hauptaktionen','Azioni principali','Hoofdacties','الإجراءات الرئيسية'),
    row('Navigation HUB','HUB navigation','Navegación HUB','HUB-Navigation','Navigazione HUB','HUB-navigatie','تنقل HUB'),
    row('Navigation rapide DIGIY','Quick DIGIY navigation','Navegación rápida DIGIY','Schnelle DIGIY-Navigation','Navigazione rapida DIGIY','Snelle DIGIY-navigatie','تنقل DIGIY السريع'),
    row('Choisir une partie de RÉSEAU DIGIY','Choose a DIGIY NETWORK section','Elegir una sección de RED DIGIY','Einen Bereich von DIGIY NETZWERK wählen','Scegli una sezione di RETE DIGIY','Kies een onderdeel van DIGIY NETWERK','اختر جزءاً من شبكة DIGIY'),
    row('Maximum 3 favoris : garde seulement les portes vraiment utiles.','Maximum 3 favorites: keep only the doors you really need.','Máximo 3 favoritos: conserva solo las puertas realmente útiles.','Maximal 3 Favoriten: Behalte nur die wirklich nützlichen Türen.','Massimo 3 preferiti: conserva solo le porte davvero utili.','Maximaal 3 favorieten: bewaar alleen de deuren die je echt nodig hebt.','الحد الأقصى 3 مفضلات: احتفظ فقط بالأبواب المفيدة فعلاً.')
  ];

  var PACKS={};
  SUPPORTED.forEach(function(lang,index){
    var pack={};
    ROWS.forEach(function(r){pack[r[0]]=r[index];});
    PACKS[lang]=pack;
  });

  var META={
    fr:['DIGIY HUB — Club des Métiers du Terrain','La gare centrale des métiers du terrain : portes publiques et professionnelles, contact direct et 0% commission.'],
    en:['DIGIY HUB — Ground Business Club','The central station for ground businesses: public and professional doors, direct contact and 0% commission.'],
    es:['DIGIY HUB — Club de los Oficios del Terreno','La estación central de los oficios del terreno: puertas públicas y profesionales, contacto directo y 0% comisión.'],
    de:['DIGIY HUB — Club der Berufe vor Ort','Die zentrale Station für Berufe vor Ort: öffentliche und professionelle Türen, direkter Kontakt und 0% Provision.'],
    it:['DIGIY HUB — Club dei Mestieri sul Territorio','La stazione centrale dei mestieri sul territorio: porte pubbliche e professionali, contatto diretto e 0% commissioni.'],
    nl:['DIGIY HUB — Club van Beroepen op het Terrein','Het centrale station voor beroepen op het terrein: publieke en professionele deuren, direct contact en 0% commissie.'],
    ar:['DIGIY HUB — نادي مهن الميدان','المحطة المركزية لمهن الميدان: أبواب عامة ومهنية وتواصل مباشر وصفر عمولة.']
  };

  function valid(value){value=(value||'').slice(0,2).toLowerCase();return SUPPORTED.indexOf(value)>=0?value:'fr';}
  function initial(){
    var params=new URLSearchParams(location.search);
    if(params.has('lang'))return valid(params.get('lang'));
    try{return valid(localStorage.getItem(STORE)||'fr');}catch(e){return 'fr';}
  }
  function preserve(raw,next){return (raw.match(/^\s*/)||[''])[0]+next+(raw.match(/\s*$/)||[''])[0];}
  function originalText(node){
    if(!originals.has(node))originals.set(node,node.nodeValue);
    return originals.get(node);
  }
  function originalAttrs(el){
    if(!attributeOriginals.has(el)){
      var data={};['aria-label','title','alt'].forEach(function(a){if(el.hasAttribute&&el.hasAttribute(a))data[a]=el.getAttribute(a);});
      attributeOriginals.set(el,data);
    }
    return attributeOriginals.get(el);
  }
  function translateString(raw,lang){
    if(!raw)return raw;
    var key=raw.trim();
    var pack=PACKS[lang]||PACKS.fr;
    if(pack[key]!=null)return preserve(raw,pack[key]);
    var next=raw;
    Object.keys(pack).sort(function(a,b){return b.length-a.length;}).some(function(k){
      if(k.length>18&&next.indexOf(k)>=0){next=next.split(k).join(pack[k]);return true;}
      return false;
    });
    return next;
  }
  function translateNode(root,lang){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){root.nodeValue=translateString(originalText(root),lang);return;}
    var doc=root.ownerDocument||root;
    var walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(node){
      var p=node.parentElement;
      if(!p||p.closest('script,style,textarea,input,select,option'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(n){n.nodeValue=translateString(originalText(n),lang);});
    if(root.querySelectorAll){
      var all=[root].concat(Array.prototype.slice.call(root.querySelectorAll('[aria-label],[title],[alt]')));
      all.forEach(function(el){
        if(!el.getAttribute)return;
        var data=originalAttrs(el);
        Object.keys(data).forEach(function(a){el.setAttribute(a,translateString(data[a],lang));});
      });
    }
  }
  function setFrameDirection(doc,lang){
    doc.documentElement.lang=lang;
    doc.documentElement.dir=lang==='ar'?'rtl':'ltr';
    var style=doc.getElementById('digiy-hub-shell-style');
    if(!style){style=doc.createElement('style');style.id='digiy-hub-shell-style';style.textContent='.langSwitch{display:none!important}html[dir="rtl"] body{text-align:right}html[dir="rtl"] .card,html[dir="rtl"] .drawerGrid a,html[dir="rtl"] .reseauRoute{text-align:right}html[dir="rtl"] .starBtn{right:auto;left:10px}html[dir="rtl"] .icon{margin-right:0;margin-left:40px}';doc.head.appendChild(style);}
  }
  function updateShell(lang){
    current=lang;
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.title=META[lang][0];
    var desc=document.querySelector('meta[name="description"]');if(desc)desc.content=META[lang][1];
    document.querySelectorAll('[data-shell-lang]').forEach(function(btn){
      var on=btn.getAttribute('data-shell-lang')===lang;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false');
    });
    try{localStorage.setItem(STORE,lang);localStorage.setItem('digiy_hub_lang_v1','fr');}catch(e){}
    if(history.replaceState){var u=new URL(location.href);u.searchParams.set('lang',lang);u.searchParams.delete('v');history.replaceState({},'',u.pathname+u.search+u.hash);}
  }
  function apply(lang){
    lang=valid(lang);updateShell(lang);
    if(!frameReady)return;
    var doc=frame.contentDocument;
    if(!doc)return;
    setFrameDirection(doc,lang);
    translateNode(doc.body,lang);
    try{doc.title=META[lang][0];}catch(e){}
  }
  function watchGrids(doc){
    observers.forEach(function(o){o.disconnect();});observers=[];
    ['publicGrid','proGrid','favGrid'].forEach(function(id){
      var target=doc.getElementById(id);if(!target)return;
      var o=new MutationObserver(function(mutations){mutations.forEach(function(m){Array.prototype.forEach.call(m.addedNodes,function(n){translateNode(n,current);});});});
      o.observe(target,{childList:true,subtree:true});observers.push(o);
    });
  }
  function routeLinks(doc){
    doc.addEventListener('click',function(e){
      var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;
      var href=a.getAttribute('href')||'';
      if(!href||href.charAt(0)==='#')return;
      e.preventDefault();
      try{window.top.location.href=a.href;}catch(err){location.href=a.href;}
    },true);
  }
  function translateAlert(win){
    var nativeAlert=win.alert.bind(win);
    win.alert=function(message){nativeAlert(translateString(String(message||''),current));};
  }
  function goToHash(doc){
    var id=(location.hash||'').slice(1);if(!id)return;
    setTimeout(function(){var target=doc.getElementById(id);if(target)target.scrollIntoView({block:'start'});},80);
  }
  function onFrameLoad(){
    frameReady=true;
    var doc=frame.contentDocument;var win=frame.contentWindow;
    if(!doc||!win)return;
    try{win.localStorage.setItem('digiy_hub_lang_v1','fr');if(typeof win.digiySetLang==='function')win.digiySetLang('fr');}catch(e){}
    routeLinks(doc);translateAlert(win);watchGrids(doc);apply(current);goToHash(doc);
    loading.classList.add('hidden');
  }

  document.querySelectorAll('[data-shell-lang]').forEach(function(btn){btn.addEventListener('click',function(){apply(btn.getAttribute('data-shell-lang'));});});
  frame.addEventListener('load',onFrameLoad);
  current=initial();updateShell(current);
  frame.src='./hub-core.html?v=20260730-hub7a';
})();
