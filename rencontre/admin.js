(() => {
  'use strict';

  const cfg = window.DIGIY_RENCONTRE_CONFIG || {};
  const client = cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
    : null;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const state = { snapshot: null };

  const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const niceDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? esc(v) : d.toLocaleString('fr-FR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  };
  const pick = (o, keys, fallback = '—') => {
    for (const k of keys) {
      const v = o?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return fallback;
  };

  function setStatus(message, type = '') {
    const el = $('#status');
    el.textContent = message;
    el.className = `status${type ? ' ' + type : ''}`;
  }

  function empty(target, label) {
    $(target).innerHTML = `<div class="empty">${esc(label)}</div>`;
  }

  function setStats(stats = {}) {
    $('#sProfiles').textContent = Number(stats.profiles_total || 0);
    $('#sActive').textContent = Number(stats.profiles_active || 0);
    $('#sActivities').textContent = Number(stats.activities_total || 0);
    $('#sReports').textContent = Number(stats.reports_total || 0);
    $('#sContacts').textContent = Number(stats.contacts_total || 0);
  }

  function renderProfiles(rows = []) {
    if (!rows.length) return empty('#profiles', 'Aucun membre RENCONTRE.');
    $('#profiles').innerHTML = rows.map(p => {
      const active = Boolean(p.is_active);
      return `<article class="row">
        <div class="row-top">
          <div>
            <h3>${esc(p.display_name || 'Profil sans nom')}</h3>
            <div class="meta">📍 ${esc(p.zone_label || 'Zone non précisée')} · intention ${esc(p.intention || '—')} · inscrit ${niceDate(p.created_at)}</div>
            <div class="meta">18+ : ${p.is_adult ? 'oui' : 'non'} · identifiant profil : ${esc(p.id || '—')}</div>
          </div>
          <span class="badge ${active ? 'ok' : 'off'}">${active ? 'ACTIF' : 'DÉSACTIVÉ'}</span>
        </div>
        <div class="actions">
          ${active
            ? `<button class="btn danger profile-toggle" data-id="${esc(p.id)}" data-active="false">Désactiver le profil</button>`
            : `<button class="btn green profile-toggle" data-id="${esc(p.id)}" data-active="true">Réactiver le profil</button>`}
        </div>
      </article>`;
    }).join('');
  }

  function renderReports(rows = []) {
    if (!rows.length) return empty('#reports', 'Aucun signalement pour le moment.');
    $('#reports').innerHTML = rows.map(r => {
      const reason = pick(r, ['reason','category','type','report_type'], 'Motif non précisé');
      const details = pick(r, ['details','description','message','note'], '');
      const reporter = pick(r, ['reporter_profile_id','reporter_id','created_by_profile_id'], '—');
      const target = pick(r, ['reported_profile_id','target_profile_id','reported_id'], '—');
      const created = pick(r, ['created_at','reported_at'], null);
      return `<article class="row">
        <div class="row-top"><div><h3>🚨 ${esc(reason)}</h3><div class="meta">Signalé par ${esc(reporter)} · cible ${esc(target)} · ${niceDate(created)}</div></div><span class="badge off">À CONTRÔLER</span></div>
        ${details ? `<div class="meta" style="margin-top:8px">${esc(details)}</div>` : ''}
      </article>`;
    }).join('');
  }

  function renderActivities(rows = []) {
    if (!rows.length) return empty('#activities', 'Aucune activité publiée.');
    $('#activities').innerHTML = rows.map(a => `<article class="row">
      <div class="row-top">
        <div><h3>${esc(a.title || 'Activité')}</h3><div class="meta">Par ${esc(a.creator_name || 'membre')} · 📍 ${esc(a.zone_label || '—')} · ${niceDate(a.start_at)}</div><div class="meta">Statut ${esc(a.status || '—')} · capacité ${esc(a.capacity ?? '—')}</div></div>
        <span class="badge">ACTIVITÉ</span>
      </div>
      <div class="actions"><button class="btn danger activity-delete" data-id="${esc(a.id)}" data-title="${esc(a.title || 'cette activité')}">Retirer l’activité</button></div>
    </article>`).join('');
  }

  function renderBlocks(rows = []) {
    if (!rows.length) return empty('#blocks', 'Aucun blocage enregistré.');
    $('#blocks').innerHTML = rows.map(b => `<article class="row"><h3>🧱 Blocage</h3><div class="meta">${esc(pick(b,['blocker_name','blocker_profile_id'],'—'))} → ${esc(pick(b,['blocked_name','blocked_profile_id'],'—'))} · ${niceDate(pick(b,['created_at'],null))}</div></article>`).join('');
  }

  function renderContacts(rows = []) {
    if (!rows.length) return empty('#contacts', 'Aucune demande de contact.');
    $('#contacts').innerHTML = rows.map(c => `<article class="row"><div class="row-top"><div><h3>🤝 ${esc(c.status || 'PENDING')}</h3><div class="meta">${esc(pick(c,['sender_name','sender_profile_id'],'—'))} → ${esc(pick(c,['receiver_name','receiver_profile_id'],'—'))} · ${niceDate(c.created_at)}</div></div><span class="badge">${esc(c.status || '—')}</span></div></article>`).join('');
  }

  function render(snapshot) {
    state.snapshot = snapshot || {};
    setStats(state.snapshot.stats || {});
    renderProfiles(state.snapshot.profiles || []);
    renderReports(state.snapshot.reports || []);
    renderActivities(state.snapshot.activities || []);
    renderBlocks(state.snapshot.blocks || []);
    renderContacts(state.snapshot.contact_requests || []);
  }

  async function load() {
    if (!client) {
      setStatus('Configuration Supabase absente.', 'bad');
      return;
    }
    setStatus('Lecture du cockpit…');
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData?.session) {
      setStatus('Connexion DIGIY requise. Connecte d’abord un compte administrateur.', 'bad');
      return;
    }

    const { data, error } = await client.rpc('digiy_rencontre_admin_snapshot');
    if (error) {
      console.error(error);
      const msg = String(error.message || '');
      if (msg.includes('ADMIN_REQUIRED')) setStatus('Accès refusé : ce compte n’est pas administrateur DIGIY.', 'bad');
      else if (msg.toLowerCase().includes('function') || msg.toLowerCase().includes('schema cache')) setStatus('Cockpit front prêt : le SQL admin Supabase doit encore être installé.', 'bad');
      else setStatus('Cockpit bloqué : ' + msg, 'bad');
      return;
    }
    render(data || {});
    setStatus('Cockpit actif. Tu as la main sur la modération RENCONTRE.', 'good');
  }

  async function toggleProfile(id, active) {
    const verb = active ? 'réactiver' : 'désactiver';
    if (!confirm(`Confirmer : ${verb} ce profil ?`)) return;
    const { error } = await client.rpc('digiy_rencontre_admin_set_profile_active', {p_profile_id:id, p_active:active});
    if (error) {
      console.error(error);
      setStatus('Action refusée : ' + error.message, 'bad');
      return;
    }
    setStatus(`Profil ${active ? 'réactivé' : 'désactivé'} ✓`, 'good');
    await load();
  }

  async function deleteActivity(id, title) {
    if (!confirm(`Retirer définitivement « ${title} » ?`)) return;
    const { error } = await client.rpc('digiy_rencontre_admin_delete_activity', {p_activity_id:id});
    if (error) {
      console.error(error);
      setStatus('Retrait impossible : ' + error.message, 'bad');
      return;
    }
    setStatus('Activité retirée ✓', 'good');
    await load();
  }

  $$('.tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    $$('.panel').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    $('#panel-' + btn.dataset.tab).classList.add('active');
  }));

  document.addEventListener('click', async (e) => {
    if (e.target.closest('.refresh')) return load();
    const p = e.target.closest('.profile-toggle');
    if (p) return toggleProfile(p.dataset.id, p.dataset.active === 'true');
    const a = e.target.closest('.activity-delete');
    if (a) return deleteActivity(a.dataset.id, a.dataset.title || 'cette activité');
  });

  load();
})();
