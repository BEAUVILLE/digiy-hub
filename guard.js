/* ============================================================
   DIGIY HUB GUARD — anti-loop + slug-safe (GH Pages)
   - Entry page is index.html
   - Protects selected pages
   - If not authenticated -> redirect to index.html (return_to saved)
   - Never redirects while already on index.html (anti loop)
   - Keeps ?slug=... stable (store + re-inject)
   ============================================================ */

(function () {
  const CFG = {
    module: "digiy-hub",
    entryPage: "index.html",
    sessionKey: "DIGIY_HUB_SESSION",
    returnToKey: "DIGIY_HUB_RETURN_TO",
    lastSlugKey: "DIGIY_LAST_SLUG",
    ttlMs: 8 * 60 * 60 * 1000, // 8h

    publicPages: new Set(["index.html", "offline.html"]),
    protectedPages: new Set([
      "packs.html",
      "pulse.html",
      "digiylyfe.html"
    ]),

    // si true: pages protégées exigent un slug (sinon retour index)
    requireSlugOnProtected: true,

    debug: true
  };

  const log = (...a) => CFG.debug && console.log(`[GUARD:${CFG.module}]`, ...a);
  const now = () => Date.now();

  function pageName() {
    const p = (location.pathname || "").split("/").pop() || "";
    return p || "index.html";
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function getSession() {
    return safeJsonParse(localStorage.getItem(CFG.sessionKey));
  }

  function isSessionValid(sess) {
    if (!sess || typeof sess !== "object") return false;
    const createdAt = Number(sess.created_at || sess.createdAt || 0);
    if (!createdAt) return false;
    if ((now() - createdAt) > CFG.ttlMs) return false;
    return true;
  }

  // ✅ slug from URL or localStorage + normalize
  function getSlug() {
    const u = new URL(location.href);
    let slug = (u.searchParams.get("slug") || "").trim();

    if (!slug) slug = (localStorage.getItem(CFG.lastSlugKey) || "").trim();

    slug = slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^\-|\-$/g, "");

    if (slug) localStorage.setItem(CFG.lastSlugKey, slug);
    return slug || null;
  }

  // ✅ ensure current URL has slug (only when we have one)
  function ensureSlugInUrl(slug) {
    if (!slug) return false;
    const u = new URL(location.href);
    if (u.searchParams.get("slug") === slug) return false;
    u.searchParams.set("slug", slug);
    history.replaceState(null, "", u.toString());
    return true;
  }

  function rememberReturnTo() {
    const here = location.pathname + location.search + location.hash;
    localStorage.setItem(CFG.returnToKey, here);
    log("return_to saved:", here);
  }

  function gotoEntry() {
    log("redirect -> entry:", CFG.entryPage);
    location.replace(CFG.entryPage);
  }

  try {
    const page = pageName();
    const sess = getSession();
    const ok = isSessionValid(sess);

    // slug gestion
    const slug = getSlug();
    const hadSlugInjected = ensureSlugInUrl(slug);
    if (hadSlugInjected) log("slug injected ✅", slug);

    log("page=", page, "protected=", CFG.protectedPages.has(page), "sessionOk=", ok, "slug=", slug);

    // 1) Anti-loop absolu : pas de redirect depuis pages publiques
    if (CFG.publicPages.has(page)) return;

    // 2) Si page non protégée => pas de guard
    if (!CFG.protectedPages.has(page)) return;

    // 3) Si slug requis et absent => retour index
    if (CFG.requireSlugOnProtected && !slug) {
      rememberReturnTo();
      gotoEntry();
      return;
    }

    // 4) Page protégée => session requise
    if (!ok) {
      rememberReturnTo();
      gotoEntry();
      return;
    }

    // 5) OK : accès autorisé
    log("access ok ✅");
  } catch (e) {
    console.warn("[GUARD] fatal, fallback to entry:", e);
    try {
      rememberReturnTo();
      gotoEntry();
    } catch {}
  }
})();
