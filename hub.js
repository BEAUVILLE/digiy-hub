(() => {
  "use strict";

 // ✅ LIENS (corrigés)
// - Driver PRO : digiy-pro-driver
// - Caisse PRO : choisis UNE casse et garde-la partout (ici: digiy-caisse-pro)
const L = {
  bonneAffaire: "https://beauville.github.io/digiy-bonne-affaire/",
  driverPro:    "https://beauville.github.io/digiy-pro-driver/",
  driverClient: "https://beauville.github.io/digiy-driver-client/",
  loc:          "https://beauville.github.io/digiy-loc/",
  resto:        "https://beauville.github.io/digiy-resto/",
  resa:         "https://beauville.github.io/digiy-resa/",
  resaTable:    "https://beauville.github.io/digiy-resa-table/",

  // ✅ CAISSE PRO (entrée officielle)
  caissePro:    "https://beauville.github.io/digiy-caisse-pro/index.html",

  pay:          "https://beauville.github.io/digiy-pay/",
  build:        "https://beauville.github.io/digiy-build/",
  market:       "https://beauville.github.io/digiy-market/",
  jobs:         "https://beauville.github.io/digiy-jobs/",
  explore:      "https://beauville.github.io/digiy-explore/",
  notable:      "https://beauville.github.io/digiy-notable/",
  ndimbalMap:   "https://beauville.github.io/digiy-mdimbal-map/",
  inscriptionPro:"https://beauville.github.io/inscription-digiy/",
  espacePro:    "https://beauville.github.io/espace-pro/",
  tarifs:       "https://beauville.github.io/digiy/",
  hubDrive:     "https://beauville.github.io/digiy-hub-drive/",
  dashboard:    "https://beauville.github.io/mon-espace-digiy/"
};

  const hubOverlay = document.getElementById("hubOverlay");
  const hubFrame   = document.getElementById("hubFrame");
  const ndimbal    = document.getElementById("digiy-ndimbal");
  const qrModal    = document.getElementById("qrModal");

  function show(el){
    if(!el) return;
    el.classList.add("show");
    el.style.display = "block";
    el.style.pointerEvents = "auto";
    el.setAttribute("aria-hidden","false");
  }
  function hide(el){
    if(!el) return;
    el.classList.remove("show");
    el.style.display = "none";
    el.style.pointerEvents = "none";
    el.setAttribute("aria-hidden","true");
  }

  function openInside(url, key){
  hide(ndimbal);

  const slug = getStickySlug();
  const trial = shouldPassTrial();

  // ✅ si module PRO, on colle slug (et trial si présent)
  if(key && shouldPassSlug(key)){
    url = appendParams(url, { slug, trial });
  }else{
    // modules non-pro: on peut juste propager trial (optionnel)
    if(trial) url = appendParams(url, { trial });
  }

  if(!hubOverlay || !hubFrame){
    window.location.href = url;
    return;
  }
  hubFrame.src = url;
  show(hubOverlay);
  document.body.style.overflow = "hidden";
}
function getParam(name){
  try { return (new URL(location.href)).searchParams.get(name) || ""; }
  catch { return ""; }
}

function getStickySlug(){
  const s = (getParam("slug") || "").trim();
  if(s){
    sessionStorage.setItem("DIGIY_LAST_SLUG", s);
    return s;
  }
  return (sessionStorage.getItem("DIGIY_LAST_SLUG") || "").trim();
}

function appendParams(url, params){
  try{
    const u = new URL(url, location.href);
    Object.entries(params).forEach(([k,v])=>{
      if(v !== undefined && v !== null && String(v).trim() !== ""){
        u.searchParams.set(k, String(v).trim());
      }
    });
    return u.toString();
  }catch(e){
    // fallback simple
    const qs = Object.entries(params)
      .filter(([_,v]) => v !== undefined && v !== null && String(v).trim() !== "")
      .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v).trim())}`)
      .join("&");
    if(!qs) return url;
    return url.includes("?") ? (url + "&" + qs) : (url + "?" + qs);
  }
}

function shouldPassSlug(key){
  // ✅ modules PRO qui exigent slug + pin
  return ["caissePro","driverPro","build","espacePro","dashboard","inscriptionPro"].includes(key);
}

function shouldPassTrial(){
  // si le hub est en mode demo => on propage
  const t = (getParam("trial") || "").trim();
  return t === "1" ? "1" : "";
}
    
    hubFrame.src = url;
    show(hubOverlay);
    document.body.style.overflow = "hidden";
  }

  function closeInside(){
    if(!hubOverlay || !hubFrame) return;
    hide(hubOverlay);
    hubFrame.src = "about:blank";
    document.body.style.overflow = "";
  }

  function openNdimbal(){ show(ndimbal); }
  function closeNdimbal(){ hide(ndimbal); }

  function openQR(){
    if(!qrModal) return;
    show(qrModal);
  }
  function closeQR(){
    if(!qrModal) return;
    hide(qrModal);
  }

  document.addEventListener("click", (e) => {
    const t = e.target;

    // overlay HUB
    if(t && (t.id === "hubBackBtn" || t.id === "hubCloseBtn")){
      e.preventDefault();
      e.stopPropagation();
      closeInside();
      return;
    }
    if(hubOverlay && t === hubOverlay){
      closeInside();
      return;
    }

    // top actions
    if(t && t.closest && t.closest("#btnLogin")){
      e.preventDefault();
      openInside(L.dashboard);
      return;
    }
    if(t && t.closest && t.closest("#btnGetHub")){
      e.preventDefault();
      openInside(L.inscriptionPro);
      return;
    }
    if(t && t.closest && t.closest("#btnDeals")){
      e.preventDefault();
      openInside(L.bonneAffaire);
      return;
    }

    // bubbles
    if(t && t.closest && t.closest("#tarif-bubble-btn")){
      e.preventDefault();
      openInside(L.tarifs);
      return;
    }
    if(t && t.closest && t.closest("#espace-pro-btn")){
      e.preventDefault();
      openInside(L.espacePro);
      return;
    }
    if(t && t.closest && t.closest("#digiy-help-btn")){
      e.preventDefault();
      openNdimbal();
      return;
    }

    // ndimbal modal
    if(ndimbal && t === ndimbal){
      closeNdimbal();
      return;
    }
    const act = t && t.closest ? t.closest(".digiyAct") : null;
    if(act){
      e.preventDefault();
      const action = act.getAttribute("data-action");
      closeNdimbal();
      if(action === "sell") openInside(L.hubDrive);
      else if(action === "job") openInside(L.jobs);
      else if(action === "qr") openQR();
      return;
    }
    if(t && t.closest && t.closest("#digiyCloseBtn")){
      e.preventDefault();
      closeNdimbal();
      return;
    }

    // QR modal
    if(t && t.closest && t.closest("#qrClose")){
      e.preventDefault();
      closeQR();
      return;
    }
    if(qrModal && t === qrModal){
      closeQR();
      return;
    }

    // modules cards
    const card = t && t.closest ? t.closest(".module") : null;
    if(card){
      e.preventDefault();
      const ext = card.getAttribute("data-external");
      const key = card.getAttribute("data-open");

      if(ext){
        window.open(ext, "_blank", "noopener");
        return;
      }
      if(key && L[key]){
  openInside(L[key], key);
  return;
}
      alert("Module en préparation.");
      return;
    }

    // brand = remonter
    if(t && t.closest && t.closest("#homeBrand")){
      e.preventDefault();
      closeInside();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if(e.key !== "Escape") return;

    if(qrModal && qrModal.classList.contains("show")) closeQR();
    else if(ndimbal && ndimbal.classList.contains("show")) closeNdimbal();
    else if(hubOverlay && hubOverlay.classList.contains("show")) closeInside();
  });

})();
