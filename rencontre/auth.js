(() => {
  'use strict';

  const cfg = window.DIGIY_RENCONTRE_CONFIG || {};
  const ready = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const client = ready ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const PENDING_KEY = 'digiy_rencontre_pending_profile_v1';

  const zones = [
    ['e04e2305-29f7-4055-bb77-cc80d88fac03','Saly'],
    ['4ad4b7dd-a0f2-4027-b64a-ccf602aa4e0a','Somone'],
    ['72b3a7ca-694c-4e80-a1f5-71cd83620329','Ngaparou'],
    ['b66f4abe-6b46-43c0-961d-c76564e14f19','Mbour'],
    ['31f30ac1-3235-43ab-9b44-339e71f7cf5a','Popenguine'],
    ['98edc9b5-ecbf-4b0f-b316-b16396cc066f','Ndayane']
  ];

  function normalizePhone(p){
    p=String(p||'').trim().replace(/[^\d+]/g,'');
    if(/^0\d{8,}$/.test(p)) p='+221'+p.replace(/^0+/,'');
    if(/^\d{9}$/.test(p)) p='+221'+p;
    if(/^\d{11,15}$/.test(p) && !p.startsWith('+')) p='+'+p;
    return p.startsWith('+') ? p : '';
  }

  function addStyles(){
    const style=document.createElement('style');
    style.textContent=`
      .auth-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}.auth-actions button{min-height:48px;border-radius:999px;padding:0 16px;border:1px solid rgba(255,255,255,.16);font-weight:1000}.auth-create{background:linear-gradient(135deg,#dcb45a,#f2cc78);color:#062414;border:0!important}.auth-login{background:rgba(255,255,255,.07);color:#fff}.auth-me{margin-left:auto;background:rgba(18,183,106,.12)!important;color:#dfffea!important;border-color:rgba(18,183,106,.35)!important}.auth-modal{position:fixed;inset:0;z-index:120;display:none;align-items:flex-end;background:rgba(0,0,0,.68);backdrop-filter:blur(7px);padding:10px}.auth-modal.open{display:flex}.auth-sheet{width:min(620px,100%);max-height:92svh;overflow:auto;margin:0 auto;border-radius:28px 28px 18px 18px;border:1px solid rgba(220,180,90,.38);background:#071a13;padding:18px;box-shadow:0 28px 80px rgba(0,0,0,.55)}.auth-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.auth-head h2{margin:0;font-size:26px}.auth-close{width:40px;height:40px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff}.auth-grid{display:grid;gap:10px;margin-top:14px}.auth-field{display:grid;gap:6px}.auth-field label{font-size:13px;font-weight:950;color:#fff4ca}.auth-field input,.auth-field select,.auth-field textarea{width:100%;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#091f17;color:#fff;padding:12px}.auth-field textarea{min-height:82px}.auth-check{display:flex;gap:9px;align-items:flex-start;padding:10px;border-radius:14px;border:1px solid rgba(18,183,106,.22);background:rgba(18,183,106,.06);font-size:13px;color:rgba(255,255,255,.78);font-weight:800}.auth-submit{min-height:48px;border:0;border-radius:999px;background:linear-gradient(135deg,#12b76a,#f2cc78);color:#062414;font-weight:1000}.auth-msg{min-height:20px;margin-top:9px;color:#fff2bf;font-size:13px;font-weight:900}.auth-switch{margin-top:10px;border:0;background:transparent;color:#fff2bf;text-decoration:underline;font-weight:900}.auth-private{font-size:12px;color:rgba(255,255,255,.64);font-weight:800}
    `;
    document.head.appendChild(style);
  }

  function injectUI(){
    const hero=document.querySelector('.hero-card');
    if(!hero || document.getElementById('digiyAuthActions')) return;
    const actions=document.createElement('div');
    actions.id='digiyAuthActions';
    actions.className='auth-actions';
    actions.innerHTML='<button class="auth-create" id="authCreate">✨ CRÉER MON PROFIL</button><button class="auth-login" id="authLogin">🔐 SE CONNECTER</button>';
    hero.appendChild(actions);

    const modal=document.createElement('div');
    modal.id='authModal'; modal.className='auth-modal';
    modal.innerHTML=`<div class="auth-sheet">
      <div class="auth-head"><div><span class="tag">DIGIY RENCONTRE · 18+</span><h2 id="authTitle">Créer mon profil</h2></div><button class="auth-close" id="authClose" aria-label="Fermer">×</button></div>
      <div class="auth-grid" id="signupFields">
        <div class="auth-field"><label>Prénom ou pseudo</label><input id="authName" maxlength="60" placeholder="Ex. Awa" autocomplete="nickname"></div>
        <div class="auth-field"><label>Email de connexion</label><input id="authEmail" type="email" placeholder="vous@exemple.com" autocomplete="email"></div>
        <div class="auth-field"><label>Téléphone privé</label><input id="authPhone" inputmode="tel" placeholder="+221 77 123 45 67" autocomplete="tel"><div class="auth-private">Jamais affiché dans ton profil RENCONTRE.</div></div>
        <div class="auth-field"><label>Zone générale</label><select id="authZone">${zones.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></div>
        <div class="auth-field"><label>Ce qui t’amène ici</label><select id="authIntention"><option value="OUVERT">OUVERT</option><option value="AMITIE">AMITIÉ</option><option value="CONNAISSANCE">CONNAISSANCE</option><option value="RENCONTRE">RENCONTRE</option><option value="CURIEUX">CURIEUX</option></select></div>
        <div class="auth-field"><label>Quelques mots</label><textarea id="authBio" maxlength="500" placeholder="Ce que tu aimes, ce que tu veux découvrir…"></textarea></div>
        <label class="auth-check"><input id="authAdult" type="checkbox"> <span>Je confirme avoir 18 ans ou plus et accepter les règles V1 de sécurité.</span></label>
      </div>
      <div class="auth-grid" id="loginFields" style="display:none"><div class="auth-field"><label>Email</label><input id="loginEmail" type="email" placeholder="vous@exemple.com" autocomplete="email"></div></div>
      <button class="auth-submit" id="authSubmit">Recevoir mon lien de connexion</button>
      <div class="auth-msg" id="authMsg"></div>
      <button class="auth-switch" id="authSwitch">J’ai déjà un compte</button>
    </div>`;
    document.body.appendChild(modal);
  }

  let mode='signup';
  const q=id=>document.getElementById(id);
  function setMode(next){
    mode=next;
    q('signupFields').style.display=mode==='signup'?'grid':'none';
    q('loginFields').style.display=mode==='login'?'grid':'none';
    q('authTitle').textContent=mode==='signup'?'Créer mon profil':'Se connecter';
    q('authSubmit').textContent=mode==='signup'?'Recevoir mon lien de connexion':'M’envoyer le lien';
    q('authSwitch').textContent=mode==='signup'?'J’ai déjà un compte':'Créer un nouveau profil';
    q('authMsg').textContent='';
  }
  function open(modeWanted){setMode(modeWanted);q('authModal').classList.add('open')}
  function close(){q('authModal').classList.remove('open')}

  async function sendLink(){
    if(!client){q('authMsg').textContent='Connexion DIGIY indisponible pour le moment.';return;}
    let email='';
    if(mode==='signup'){
      const name=q('authName').value.trim();
      const phone=normalizePhone(q('authPhone').value);
      email=q('authEmail').value.trim().toLowerCase();
      if(name.length<2){q('authMsg').textContent='Choisis un prénom ou pseudo.';return;}
      if(!email.includes('@')){q('authMsg').textContent='Email invalide.';return;}
      if(!phone){q('authMsg').textContent='Téléphone invalide.';return;}
      if(!q('authAdult').checked){q('authMsg').textContent='Le module V1 est réservé aux 18+.';return;}
      localStorage.setItem(PENDING_KEY,JSON.stringify({display_name:name,phone_number:phone,zone_id:q('authZone').value,intention:q('authIntention').value,bio:q('authBio').value.trim()||null,is_adult:true}));
    }else{
      email=q('loginEmail').value.trim().toLowerCase();
      if(!email.includes('@')){q('authMsg').textContent='Email invalide.';return;}
    }
    q('authSubmit').disabled=true;
    q('authMsg').textContent='Envoi du lien…';
    const redirectTo=location.origin+location.pathname;
    const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo,shouldCreateUser:mode==='signup'}});
    q('authSubmit').disabled=false;
    q('authMsg').textContent=error?'Envoi impossible : '+error.message:'Lien envoyé ✓ Ouvre ton email puis reviens ici.';
  }

  async function finalizePending(session){
    if(!client || !session) return;
    const raw=localStorage.getItem(PENDING_KEY);
    if(!raw) return;
    let pending; try{pending=JSON.parse(raw)}catch(e){return;}
    const {error}=await client.rpc('digiy_rencontre_register_profile',{
      p_phone_number:pending.phone_number,
      p_display_name:pending.display_name,
      p_zone_id:pending.zone_id,
      p_intention:pending.intention,
      p_bio:pending.bio,
      p_is_adult:true
    });
    if(!error){localStorage.removeItem(PENDING_KEY);location.reload();return;}
    console.error('[DIGIY RENCONTRE] finalisation',error);
    const status=document.getElementById('status');
    if(status) status.textContent='Connexion réussie. Finalisation du profil à terminer.';
  }

  async function sessionUI(){
    if(!client) return;
    const {data}=await client.auth.getSession();
    const session=data?.session;
    if(session){
      await finalizePending(session);
      const actions=q('digiyAuthActions');
      if(actions){actions.innerHTML='<button class="auth-login auth-me" id="authLogout">✓ CONNECTÉ · SE DÉCONNECTER</button>';q('authLogout').onclick=async()=>{await client.auth.signOut();location.reload();};}
    }
  }

  addStyles(); injectUI();
  q('authCreate').onclick=()=>open('signup');
  q('authLogin').onclick=()=>open('login');
  q('authClose').onclick=close;
  q('authModal').addEventListener('click',e=>{if(e.target===q('authModal')) close();});
  q('authSwitch').onclick=()=>setMode(mode==='signup'?'login':'signup');
  q('authSubmit').onclick=sendLink;
  sessionUI();
})();
