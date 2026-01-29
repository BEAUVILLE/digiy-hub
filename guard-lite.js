/* =========================================
   DIGIY — GUARD LITE (KPI SAFE)
   - Expose Supabase client seulement
   - ❌ Aucune redirection
   - ✅ Parfait pour Température Business
========================================= */

(function(){
  "use strict";

  const SUPABASE_URL =
    "https://wesqmwjjtsefyjnluosj.supabase.co";

  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

  // Supabase SDK must exist
  if(!window.supabase){
    console.warn("❌ Supabase SDK non chargé");
    return;
  }

  // ✅ Create client
  const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  // ✅ DIGIY standard exports
  window.__digiy_sb__ = sb;
  window.supa = sb;

  console.log("✅ DIGIY GUARD LITE ready (no redirect)");
})();
