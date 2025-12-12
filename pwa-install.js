// 🦅 DIGIY HUB - PWA Installation Script (GitHub Pages friendly)
// L'Afrique enracinée, connectée au monde 🇸🇳

(function () {
  'use strict';

  let deferredPrompt;
  let installButton;

  // Enregistrement du Service Worker (IMPORTANT: chemin relatif)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration.scope);

          // Vérifie les mises à jour toutes les heures (ok)
          setInterval(() => registration.update(), 3600000);
        })
        .catch((error) => console.error('❌ Erreur Service Worker:', error));
    });
  }

  function hideInstallPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.style.animation = 'slideDown 0.25s ease-in forwards';
      setTimeout(() => prompt.remove(), 260);
    }
  }

  // Instructions iOS
  function showIOSInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;

    if (isIOS && !isInStandaloneMode) {
      alert(`📱 Installation sur iPhone/iPad:

1) Appuie sur Partager
2) "Sur l'écran d'accueil"
3) Ajouter

🦅 DIGIY HUB sera accessible comme une app.`);
    } else {
      alert('✅ Pour installer DIGIY HUB : menu du navigateur → "Installer l’application".');
    }
  }

  // Création du bouton d'installation
  function createInstallButton() {
    if (document.getElementById('pwa-install-prompt')) return;

    const promptHTML = `
      <div id="pwa-install-prompt" style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        background: linear-gradient(135deg, #00853F 0%, #FDEF42 50%, #E31B23 100%);
        padding: 3px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 133, 63, 0.8);
        animation: slideUp 0.45s ease-out, pulse 2.2s infinite;
        max-width: 90%;
        width: 420px;
      ">
        <div style="
          background: #0B1120;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #D4AF37, #FDEF42);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            flex-shrink: 0;
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.6);
          ">∞</div>

          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'Outfit', sans-serif;
              font-size: 16px;
              font-weight: 900;
              color: #f9fafb;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">📲 Installer DIGIY HUB</div>

            <div style="
              font-size: 13px;
              color: #e5e7eb;
              font-weight: 600;
            ">L'aigle royal à portée de main 🦅</div>
          </div>

          <button id="pwa-install-btn" style="
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: #111827;
            border: none;
            padding: 10px 20px;
            border-radius: 999px;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            white-space: nowrap;
            box-shadow: 0 8px 20px rgba(249, 115, 22, 0.5);
            transition: transform 0.2s;
          ">INSTALLER</button>

          <button id="pwa-close-btn" aria-label="Fermer" style="
            background: transparent;
            border: none;
            color: #9ca3af;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          ">×</button>
        </div>
      </div>

      <style>
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(110px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to   { opacity: 0; transform: translateX(-50%) translateY(110px); }
        }
        @keyframes pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.08); }
        }

        #pwa-install-btn:hover { transform: scale(1.05); }
        #pwa-install-btn:active { transform: scale(0.95); }
        #pwa-close-btn:hover { color: #f97316; }

        @media (max-width: 768px) {
          #pwa-install-prompt { bottom: 10px; width: calc(100% - 20px); left: 10px; transform: none; }
          #pwa-install-prompt > div { padding: 16px; gap: 12px; }
          #pwa-install-btn { padding: 8px 16px; font-size: 13px; }
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', promptHTML);

    installButton = document.getElementById('pwa-install-btn');

    // Installer
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) {
        showIOSInstructions();
        return;
      }

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`Installation: ${outcome}`);

      if (outcome === 'accepted') {
        hideInstallPrompt();
        localStorage.setItem('digiy-pwa-installed', 'true');
      }

      deferredPrompt = null;
    });

    // Fermer
    document.getElementById('pwa-close-btn').addEventListener('click', () => {
      hideInstallPrompt();
      localStorage.setItem('digiy-pwa-dismissed', String(Date.now() + (7 * 24 * 60 * 60 * 1000)));
    });
  }

  // beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installed = localStorage.getItem('digiy-pwa-installed');
    const dismissedUntil = Number(localStorage.getItem('digiy-pwa-dismissed') || '0');

    if (installed) return;
    if (dismissedUntil && Date.now() < dismissedUntil) return;

    setTimeout(createInstallButton, 2500);
  });

  // appinstalled
  window.addEventListener('appinstalled', () => {
    console.log('✅ DIGIY HUB installé avec succès ! 🦅🇸🇳');
    hideInstallPrompt();
    localStorage.setItem('digiy-pwa-installed', 'true');

    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', { event_category: 'PWA', event_label: 'Installation réussie' });
    }
  });

  // standalone détecté
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('✅ DIGIY HUB lancé en mode APP ! 🦅');
    localStorage.setItem('digiy-pwa-installed', 'true');
  }

  console.log(`
🦅 ═══════════════════════════════════════════════════════
   DIGIY HUB - L'Aigle Royal
   L'Afrique enracinée, connectée au monde 🇸🇳

   0% commission • Paiement direct au pro
   Pierre par pierre, nous construisons l'avenir ! ∞
═══════════════════════════════════════════════════════ 🦅
  `);
})();
