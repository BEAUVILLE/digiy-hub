// DIGIY — Guard universel
const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_ANON_KEY = "COLLE_TON_ANON_KEY_ICI";
const supabase = window.supabase."eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";
(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Guard DIGIY
 * @param {Object} rules
 *  - role_auto: ['chauffeur','pro']
 *  - pro_type: ['driver','fret','resto']
 */
async function digiyGuard(rules = {}) {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  // ❌ Pas connecté → porte unique
  if (!user) {
    location.href = "redirection.html";
    return;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role_auto, pro_type, active_modules")
    .eq("id", user.id)
    .single();

  // ❌ Pas de profil → client
  if (error || !profile) {
    location.href = "redirection.html";
    return;
  }

  const roleOK =
    !rules.role_auto ||
    rules.role_auto.includes(profile.role_auto);

  const proTypeOK =
    !rules.pro_type ||
    rules.pro_type.includes(profile.pro_type);

  if (!roleOK || !proTypeOK) {
    // 🚫 Mauvais endroit
    location.href = "redirection.html";
    return;
  }

  // ✅ Accès autorisé → rien à faire
}
