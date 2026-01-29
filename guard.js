/* =========================
   DIGIY — Guard universel (JS)
   - Init Supabase
   - Expose: window.__digiy_sb__ + window.supa
   - Expose: window.digiyGuard()
========================= */

(function(){
  const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

  function safeLog(){ try{ console.log.apply(console, arguments); }catch(e){} }

  if(!window.supabase || !window.supabase.createClient){
    safeLog("❌ DIGIY GUARD: Supabase SDK non chargé. Ajoute <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> avant guard.js");
    return;
  }

  // ✅ init SB
  const SB = window.__digiy_sb__ || window.supa || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ✅ expose global
  window.__digiy_sb__ = SB;
  window.supa = SB;

  /**
   * digiyGuard(rules)
   * rules:
   *  - allow_admin: true/false (default true)
   *  - role_auto: ["pro", "chauffeur", ...]
   *  - pro_type: ["store","driver","loc",...]
   *  - redirect_to: "redirection.html" (default)
   */
  window.digiyGuard = async function(rules = {}){
    const allowAdmin = (rules.allow_admin !== false);
    const redirectTo = rules.redirect_to || "redirection.html";

    // 1) session
    const { data: sessionData, error: sErr } = await SB.auth.getSession();
    const user = sessionData?.session?.user;

    if(sErr || !user){
      safeLog("🚫 Guard: pas connecté → redirect", redirectTo);
      location.href = redirectTo;
      return { ok:false, reason:"no_session" };
    }

    // 2) admin bypass
    if(allowAdmin){
      const { data: adminRow, error: aErr } = await SB
        .from("admin_users")
        .select("user_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if(!aErr && adminRow?.user_id){
        safeLog("✅ Guard: ADMIN BYPASS", adminRow.role || "admin");
        return { ok:true, admin:true, user_id:user.id };
      }
    }

    // 3) profiles
    const { data: profile, error: pErr } = await SB
      .from("profiles")
      .select("role_auto, pro_type, active_modules, role")
      .eq("id", user.id)
      .maybeSingle();

    if(pErr || !profile){
      safeLog("🚫 Guard: pas de profil → redirect", redirectTo);
      location.href = redirectTo;
      return { ok:false, reason:"no_profile" };
    }

    const roleOK = !rules.role_auto || rules.role_auto.includes(profile.role_auto);
    const proTypeOK = !rules.pro_type || rules.pro_type.includes(profile.pro_type);

    if(!roleOK || !proTypeOK){
      safeLog("🚫 Guard: règles KO → redirect", redirectTo);
      location.href = redirectTo;
      return { ok:false, reason:"rules_failed" };
    }

    safeLog("✅ Guard OK", { user_id:user.id, role_auto:profile.role_auto, pro_type:profile.pro_type });
    return { ok:true, user_id:user.id, profile };
  };

  safeLog("✅ DIGIY GUARD JS ready");
})();
