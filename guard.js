/* =========================
   DIGIY — Guard universel (JS) v2
   ✅ Init Supabase
   ✅ Auth session OU PIN session
   ✅ Redirect SAFE (no 404) + slug propagation
   Expose:
    - window.__digiy_sb__ / window.supa
    - window.digiyGuard(rules)
========================= */

(function(){
  const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

  function safeLog(){ try{ console.log.apply(console, arguments); }catch(e){} }
  function safeWarn(){ try{ console.warn.apply(console, arguments); }catch(e){} }

  // --- Supabase SDK check
  if(!window.supabase || !window.supabase.createClient){
    safeWarn("❌ DIGIY GUARD: Supabase SDK non chargé. Ajoute supabase-js@2 avant guard.js");
    return;
  }

  // --- SB init + expose
  const SB =
    window.__digiy_sb__ ||
    window.supa ||
    window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.__digiy_sb__ = SB;
  window.supa = SB;

  // --- helpers
  function getSlugFromURL(){
    try{
      const s = new URL(location.href).searchParams.get("slug");
      return (s && String(s).trim()) ? String(s).trim().toLowerCase() : "";
    }catch(e){ return ""; }
  }

  function getSlugFromStorage(){
    try{
      const s =
        localStorage.getItem("digiy_slug") ||
        localStorage.getItem("slug");
      return (s && String(s).trim()) ? String(s).trim().toLowerCase() : "";
    }catch(e){ return ""; }
  }

  function getSlug(){
    return getSlugFromURL() || getSlugFromStorage() || "";
  }

  function withSlug(href, slug){
    try{
      const u = new URL(href, location.href);
      if(slug) u.searchParams.set("slug", slug);
      return u.toString();
    }catch(e){
      // fallback cheap
      if(!slug) return href;
      return href + (href.includes("?") ? "&" : "?") + "slug=" + encodeURIComponent(slug);
    }
  }

  // Test existence of a relative page (avoid 404 redirects)
  async function pageExists(rel){
    try{
      const u = new URL(rel, location.href).toString();
      const r = await fetch(u, { method:"HEAD", cache:"no-store" });
      return r && (r.status >= 200 && r.status < 400);
    }catch(e){ return false; }
  }

  function parseMaybeJSON(raw){
    try{ return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
  }

  function nowMs(){ return Date.now(); }

  function isNotExpired(sess){
    if(!sess) return false;
    // accepte plusieurs formats
    const exp =
      sess.expires_at || sess.expiresAt || sess.exp || null;

    if(!exp) return true; // si pas d’expiration, on accepte
    const t = (typeof exp === "number") ? exp : new Date(exp).getTime();
    if(!t || Number.isNaN(t)) return true;
    return t > nowMs();
  }

  function pickPinSession(){
    // priorité HUB, puis modules
    const keys = [
      "DIGIY_HUB_SESSION",
      "DIGIY_LOC_PRO_SESSION",
      "DIGIY_DRIVER_SESSION",
      "DIGIY_BUILD_SESSION",
      "DIGIY_PRO_SESSION"
    ];
    for(const k of keys){
      const sess = parseMaybeJSON(localStorage.getItem(k));
      if(sess && isNotExpired(sess) && (sess.ok === true || sess.slug || sess.phone)){
        return { key:k, sess };
      }
    }
    return null;
  }

  function normalizeProfileFromPin(sess){
    // profil minimal pour règles
    return {
      role_auto: sess.role_auto || sess.role || "pro",
      pro_type: sess.pro_type || sess.module || null,
      active_modules: sess.active_modules || null,
      role: sess.role || null
    };
  }

  function rulesPass(profile, rules){
    const roleOK = !rules.role_auto || (profile?.role_auto && rules.role_auto.includes(profile.role_auto));
    const proTypeOK = !rules.pro_type || (profile?.pro_type && rules.pro_type.includes(profile.pro_type));
    return roleOK && proTypeOK;
  }

  // --- core redirect logic: PIN first, then AUTH, then HUB
  async function smartRedirect(rules){
    const slug = getSlug();
    const pinPage = rules.pin_page || "./pin.html";
    const authPage = rules.auth_page || "./auth.html";
    const hubPage = rules.hub_page || "./";

    // 1) PIN page if exists
    if(await pageExists(pinPage)){
      location.href = withSlug(pinPage, slug);
      return;
    }
    // 2) AUTH page if exists
    if(await pageExists(authPage)){
      location.href = withSlug(authPage, slug);
      return;
    }
    // 3) fallback HUB (always relative to avoid root issues)
    location.href = withSlug(hubPage, slug);
  }

  /**
   * digiyGuard(rules)
   *
   * rules:
   *  - allow_admin: true/false (default true)
   *  - role_auto: ["pro","chauffeur",...]
   *  - pro_type: ["loc","driver","store",...]
   *
   * redirect:
   *  - pin_page: "./pin.html" (default)
   *  - auth_page:"./auth.html" (default)
   *  - hub_page: "./" (default)
   *
   * behavior:
   *  - tries Supabase Auth first
   *  - if no session: tries PIN session in localStorage
   *  - if still no: smartRedirect()
   */
  window.digiyGuard = async function(rules = {}){
    const allowAdmin = (rules.allow_admin !== false);

    // 0) slug stash (utile partout)
    const slug = getSlug();
    try{
      if(slug) localStorage.setItem("digiy_slug", slug);
    }catch(e){}

    // 1) Try Supabase Auth session
    let user = null;
    try{
      const { data: sessionData, error: sErr } = await SB.auth.getSession();
      user = sessionData?.session?.user || null;
      if(sErr) safeWarn("⚠️ Guard getSession error:", sErr);
    }catch(e){
      safeWarn("⚠️ Guard getSession exception:", e);
    }

    // 1.b) If authenticated, optional ADMIN bypass then profile rules
    if(user){
      // admin bypass
      if(allowAdmin){
        try{
          const { data: adminRow, error: aErr } = await SB
            .from("admin_users")
            .select("user_id, role")
            .eq("user_id", user.id)
            .maybeSingle();

          if(!aErr && adminRow?.user_id){
            safeLog("✅ Guard: ADMIN BYPASS", adminRow.role || "admin");
            return { ok:true, admin:true, user_id:user.id, slug };
          }
        }catch(e){
          // ignore admin errors silently
        }
      }

      // profile fetch
      try{
        const { data: profile, error: pErr } = await SB
          .from("profiles")
          .select("role_auto, pro_type, active_modules, role")
          .eq("id", user.id)
          .maybeSingle();

        if(pErr || !profile){
          safeWarn("🚫 Guard: pas de profil (auth) → redirect");
          await smartRedirect(rules);
          return { ok:false, reason:"no_profile", slug };
        }

        if(!rulesPass(profile, rules)){
          safeWarn("🚫 Guard: règles KO (auth) → redirect", { want: rules, got: profile });
          await smartRedirect(rules);
          return { ok:false, reason:"rules_failed", slug };
        }

        safeLog("✅ Guard OK (auth)", { user_id:user.id, role_auto:profile.role_auto, pro_type:profile.pro_type });
        return { ok:true, admin:false, user_id:user.id, profile, slug, via:"auth" };
      }catch(e){
        safeWarn("🚫 Guard: exception profile (auth) → redirect", e);
        await smartRedirect(rules);
        return { ok:false, reason:"profile_exception", slug };
      }
    }

    // 2) No Supabase session → try PIN session
    const pin = pickPinSession();
    if(pin){
      const profile = normalizeProfileFromPin(pin.sess);

      if(!rulesPass(profile, rules)){
        safeWarn("🚫 Guard: règles KO (pin) → redirect", { want: rules, got: profile });
        await smartRedirect(rules);
        return { ok:false, reason:"rules_failed", slug, via:"pin" };
      }

      // stash slug if provided by PIN session
      const slug2 = (pin.sess.slug || slug || "").toLowerCase();
      try{ if(slug2) localStorage.setItem("digiy_slug", slug2); }catch(e){}

      safeLog("✅ Guard OK (pin)", { key: pin.key, slug: slug2, phone: pin.sess.phone });
      return {
        ok:true,
        admin:false,
        user_id: pin.sess.user_id || null,
        profile,
        slug: slug2,
        via:"pin",
        pin_key: pin.key,
        phone: pin.sess.phone || null
      };
    }

    // 3) Nothing → redirect smart (PIN page > AUTH page > HUB)
    safeWarn("🚫 Guard: aucune session → redirect smart");
    await smartRedirect(rules);
    return { ok:false, reason:"no_session", slug };
  };

  safeLog("✅ DIGIY GUARD JS v2 ready");
})();

