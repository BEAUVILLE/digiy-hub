/* =========================================
   DIGIY — GUARD LITE (KPI SAFE)
   - Expose Supabase client seulement
   - Aucune redirection
   - Parfait pour Température Business / Pulse
========================================= */

(function(){
  "use strict";

  const SUPABASE_URL =
    "https://wesqmwjjtsefyjnluosj.supabase.co";

  const SUPABASE_ANON_KEY =
    "TA_CLE_ANON_ICI";

  if (window.__digiy_sb__ || window.supa) {
    console.log("✅ DIGIY GUARD LITE déjà prêt");
    return;
  }

  if (!window.supabase) {
    console.warn("❌ Supabase SDK non chargé");
    return;
  }

  const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );

  window.__digiy_sb__ = sb;
  window.supa = sb;

  console.log("✅ DIGIY GUARD LITE ready (no redirect)");
})();
