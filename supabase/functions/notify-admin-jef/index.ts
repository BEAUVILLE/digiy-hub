// supabase/functions/notify-admin-jef/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Payload = {
  id: string;
  title?: string;
  zone?: string;
  phone?: string;
  note?: string;
  when_text?: string;
  created_at?: string;
};

function mustGetEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const secret = mustGetEnv("DIGIY_NOTIFY_SECRET");
    const got = req.headers.get("x-digiy-secret") || "";
    if (got !== secret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = (await req.json()) as Payload;

    const adminEmails = (Deno.env.get("ADMIN_EMAILS") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!adminEmails.length) {
      return new Response("No ADMIN_EMAILS configured", { status: 200 });
    }

    // Email via Resend
    const RESEND_API_KEY = mustGetEnv("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM") || "DIGIY JËF <onboarding@resend.dev>";

    const subject = `🔔 Nouvelle mission JËF (${payload.zone || "Zone"}) — ${payload.title || "Sans titre"}`;

    const whenLine = payload.when_text ? `🕒 Quand : ${payload.when_text}\n` : "";
    const noteLine = payload.note ? `📝 Détails : ${payload.note}\n` : "";

    const text = [
      "♾️ DIGIY JËF — Nouvelle mission reçue",
      "",
      `📌 Titre : ${payload.title || "-"}`,
      `📍 Zone : ${payload.zone || "-"}`,
      `📞 Téléphone : ${payload.phone || "-"}`,
      whenLine.trimEnd(),
      noteLine.trimEnd(),
      "",
      `🆔 ID : ${payload.id}`,
      `🕒 Créée : ${payload.created_at || "-"}`,
      "",
      "Action admin : ouvre ton panel JËF Admin pour approuver/rejeter.",
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>♾️ DIGIY JËF — Nouvelle mission</h2>
        <p><b>📌 Titre :</b> ${escapeHtml(payload.title || "-")}</p>
        <p><b>📍 Zone :</b> ${escapeHtml(payload.zone || "-")}</p>
        <p><b>📞 Téléphone :</b> ${escapeHtml(payload.phone || "-")}</p>
        ${payload.when_text ? `<p><b>🕒 Quand :</b> ${escapeHtml(payload.when_text)}</p>` : ""}
        ${payload.note ? `<p><b>📝 Détails :</b> ${escapeHtml(payload.note)}</p>` : ""}
        <hr/>
        <p style="color:#555"><b>ID :</b> ${escapeHtml(payload.id)}</p>
        <p style="color:#555"><b>Créée :</b> ${escapeHtml(payload.created_at || "-")}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmails,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error:", res.status, body);
      return new Response("Email send failed", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("notify-admin-jef error:", e);
    return new Response("Error", { status: 500 });
  }
});

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
