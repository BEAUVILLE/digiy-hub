/* ============================================================
   DIGIY HUB GUARD — anti-loop (no dedicated login page)
   - Entry page is index.html
   - Protects selected pages
   - If not authenticated -> redirect to index.html WITH return_to
   - Never redirects while already on index.html (anti loop)
   ============================================================ */

(function () {
  const CFG = {
    module: "digiy-hub",
    entryPage: "index.html",                 // page d’entrée (pas “login”)
    sessionKey: "DIGIY_HUB_SESSION",         // adapte si tu as déjà un autre nom
    returnToKey: "DIGIY_HUB_RETURN_TO",
    ttlMs: 8 * 60 * 60 * 1000,               // 8h
    // Pages publiques (ne jamais redirect depuis celles-ci)
    publicPages: new Set(["index.html", "offline.html"]),
    // Pages protégées (HUB)
    protectedPages: new Set([
      "packs.html",
      "pulse.html",
      "digiylyfe.html"
      // ajoute ici si tu veux: "admin.html", etc.
    ]),
    debug: true
  };

  const log = (...a) => CFG.debug && console.log(`[GUARD:${CFG.module}]`, ...a);

  function now() { return Date.now(); }

  function pageName() {
    const p = (location.pathname || "").split("/").pop() || "";
    return p || "index.html";
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function getSession() {
    const raw = localStorage.getItem(CFG.sessionKey);
    return safeJsonParse(raw);
  }

  function isSessionValid(sess) {
    if (!sess || typeof sess !== "object") return false;
    const createdAt = Number(sess.created_at || sess.createdAt || 0);
    if (!createdAt) return false;
    if ((now() - createdAt) > CFG.ttlMs) return false;
    // si tu stockes un "ok:true" ou un token, c’est bonus, pas obligatoire
    return true;
  }

  function rememberReturnTo() {
    const here = location.pathname + location.search + location.hash;
    localStorage.setItem(CFG.returnToKey, here);
    log("return_to saved:", here);
  }

  function gotoEntry() {
    // On conserve le return_to via localStorage (stable sur GH Pages)
    log("redirect -> entry:", CFG.entryPage);
    location.replace(CFG.entryPage);
  }

  try {
    const page = pageName();
    const sess = getSession();
    const ok = isSessionValid(sess);

    log("page=", page, "protected=", CFG.protectedPages.has(page), "sessionOk=", ok);

    // 1) Anti-loop absolu : on ne redirige jamais depuis la page d’entrée/public
    if (CFG.publicPages.has(page)) return;

    // 2) Si page non protégée => pas de guard
    if (!CFG.protectedPages.has(page)) return;

    // 3) Page protégée => session requise
    if (!ok) {
      rememberReturnTo();
      gotoEntry();
      return;
    }

    // 4) OK : accès autorisé
    log("access ok ✅");
  } catch (e) {
    console.warn("[GUARD] fatal, fallback to entry:", e);
    try {
      rememberReturnTo();
      gotoEntry();
    } catch {}
  }
})();
