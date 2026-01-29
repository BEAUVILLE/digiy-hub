<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>DIGIY — Guard universel</title>

  <!-- Supabase v2 -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; padding:16px}
    pre{background:#111827;color:#e5e7eb;padding:12px;border-radius:10px;overflow:auto}
  </style>
</head>

<body>
  <h1>DIGIY — Guard universel (CLEAN)</h1>
  <p>Si tu vois cette page en prod, c’est juste un test. Le guard fonctionne en arrière-plan.</p>
  <pre id="log">Boot…</pre>

<script>
/* =========================
   DIGIY — Guard universel (CLEAN)
   - Init Supabase FIX ✅
   - Bypass admin via admin_users ✅
   - Rules role_auto / pro_type ✅
   - Redirection unique: redirection.html ✅
========================= */

const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

const logEl = document.getElementById("log");
function logLine(msg){
  console.log(msg);
  if(!logEl) return;
  logEl.textContent += "\n" + msg;
}

if(!window.supabase){
  logLine("❌ Supabase SDK non chargé. Vérifie le <script supabase-js>.");
}

// ✅ init propre (la ligne cassée chez toi venait de là)
const SB = globalThis.SB || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
globalThis.SB = SB;

/**
 * Guard DIGIY
 * @param {Object} rules
 *  - role_auto: ['chauffeur','pro']
 *  - pro_type: ['driver','fret','resto','store',...]
 *  - allow_admin: true (par défaut)
 */
async function digiyGuard(rules = {}) {
  const allowAdmin = (rules.allow_admin !== false);

  // 1) Session
  const { data: sessionData, error: sErr } = await SB.auth.getSession();
  const user = sessionData?.session?.user;

  // ❌ Pas connecté
  if (sErr || !user) {
    logLine("🚫 Pas connecté → redirection");
    location.href = "redirection.html";
    return;
  }

  logLine("👤 User OK: " + user.id);

  // 2) ✅ BYPASS ADMIN (si activé)
  // NOTE: nécessite que l'utilisateur puisse lire SA ligne admin_users (policy SELECT OK)
  if (allowAdmin) {
    const { data: adminRow, error: aErr } = await SB
      .from("admin_users")
      .select("user_id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!aErr && adminRow?.user_id) {
      logLine("✅ ADMIN BYPASS: " + (adminRow.role || "admin"));
      return; // accès autorisé
    } else {
      logLine("ℹ️ admin_users: " + (aErr ? ("error=" + aErr.message) : "no row"));
    }
  }

  // 3) Profiles (logique normale)
  const { data: profile, error: pErr } = await SB
    .from("profiles")
    .select("role_auto, pro_type, active_modules, role")
    .eq("id", user.id)
    .maybeSingle();

  // ❌ Pas de profil
  if (pErr || !profile) {
    logLine("🚫 Pas de profil → redirection");
    location.href = "redirection.html";
    return;
  }

  logLine("📌 Profile: role_auto=" + (profile.role_auto ?? "null") + " pro_type=" + (profile.pro_type ?? "null") + " role=" + (profile.role ?? "null"));

  const roleOK =
    !rules.role_auto ||
    rules.role_auto.includes(profile.role_auto);

  const proTypeOK =
    !rules.pro_type ||
    rules.pro_type.includes(profile.pro_type);

  if (!roleOK || !proTypeOK) {
    logLine("🚫 Règles non respectées → redirection");
    location.href = "redirection.html";
    return;
  }

  logLine("✅ GUARD OK (profiles)");
  // ✅ Accès autorisé → rien à faire
}

/* =========================
   EXEMPLES D’USAGE
   ➜ Choisis un seul appel par page
========================= */

// Exemple 1: page POS Boutique (pro store)
// digiyGuard({ role_auto: ["pro"], pro_type: ["store"] });

// Exemple 2: page chauffeur
// digiyGuard({ role_auto: ["chauffeur"], pro_type: ["driver"] });

// Exemple 3: page ADMIN ONLY (super_admin/admin via admin_users)
// Astuce: on met une règle impossible côté profiles pour forcer le passage uniquement via admin_users
digiyGuard({ allow_admin: true, role_auto: ["__never__"] });

</script>
</body>
</html>

