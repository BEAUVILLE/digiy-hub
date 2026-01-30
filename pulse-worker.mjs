// pulse-worker.mjs (ESM)
import { createClient } from "@supabase/supabase-js";

// ===================== CONFIG =====================
const SUPABASE_URL = process.env.SUPABASE_URL || "https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || "";
const PULSE_API_BASE = process.env.PULSE_API_BASE || "http://127.0.0.1:3200";
const PULSE_SEND_PATH = process.env.PULSE_SEND_PATH || "/loc/pulse/send";

// Token optionnel si ton endpoint est protégé (sinon laisse vide)
const PULSE_API_TOKEN = process.env.PULSE_API_TOKEN || ""; // ex: "xxx"

// cadence
const TICK_MS = Number(process.env.PULSE_TICK_MS || 15000); // 15s
const BATCH = Number(process.env.PULSE_BATCH || 10);
const FAIL_COOLDOWN_MIN = Number(process.env.PULSE_FAIL_COOLDOWN_MIN || 10); // 10 minutes

// ===================================================
if (!SUPABASE_SERVICE_ROLE) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY in env (service role requis pour worker).");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
function isoNow(){ return new Date().toISOString(); }
function addMinutesISO(min){
  return new Date(Date.now() + min*60*1000).toISOString();
}

// ⚠️ Ta table autorise seulement new/seen/archived.
// Pour éviter les doubles envois, on “claim” en décalant next_try_at un peu dans le futur.
async function claimDue(batch = 10) {
  // 1) sélectionner due
  const { data: due, error: e1 } = await sb
    .from("digiy_loc_pulse_outbox")
    .select("id, phone, channel, message, payload, next_try_at, status")
    .eq("status", "new")
    .not("next_try_at", "is", null)
    .lte("next_try_at", isoNow())
    .order("next_try_at", { ascending: true })
    .limit(batch);

  if (e1) throw e1;
  if (!due || due.length === 0) return [];

  const ids = due.map(x => x.id);

  // 2) “claim” = repousser next_try_at de 60s pour éviter que 2 workers prennent la même chose
  // (on garde status='new' pour respecter le check constraint)
  const claimUntil = addMinutesISO(1);

  const { data: claimed, error: e2 } = await sb
    .from("digiy_loc_pulse_outbox")
    .update({ next_try_at: claimUntil, updated_at: isoNow() })
    .in("id", ids)
    .eq("status", "new")
    .select("id, phone, channel, message, payload");

  if (e2) throw e2;
  return claimed || [];
}

async function sendViaApi(pulse) {
  const url = new URL(PULSE_SEND_PATH, PULSE_API_BASE);

  // payload minimal, adapte si ton API attend autre chose
  const body = {
    id: pulse.id,
    phone: pulse.phone,
    channel: pulse.channel || "whatsapp",
    message: pulse.message || "",
    payload: pulse.payload || {}
  };

  const headers = { "Content-Type": "application/json" };
  if (PULSE_API_TOKEN) headers["Authorization"] = `Bearer ${PULSE_API_TOKEN}`;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  // si l’API renvoie du JSON
  let out = null;
  try { out = await res.json(); } catch { out = null; }

  return { ok: res.ok, status: res.status, out };
}

async function markSeen(id) {
  const { error } = await sb
    .from("digiy_loc_pulse_outbox")
    .update({ status: "seen", updated_at: isoNow() })
    .eq("id", id)
    .eq("status", "new");
  if (error) throw error;
}

async function reschedule(id, minutes) {
  const { error } = await sb
    .from("digiy_loc_pulse_outbox")
    .update({ next_try_at: addMinutesISO(minutes), updated_at: isoNow() })
    .eq("id", id)
    .eq("status", "new");
  if (error) throw error;
}

async function tick() {
  const claimed = await claimDue(BATCH);
  if (claimed.length === 0) {
    console.log(`🟢 tick: nothing due`);
    return;
  }

  console.log(`🟡 tick: claimed ${claimed.length} pulse(s)`);

  for (const p of claimed) {
    try {
      const r = await sendViaApi(p);
      if (r.ok) {
        await markSeen(p.id);
        console.log(`✅ sent -> seen: ${p.id} (${p.phone})`);
      } else {
        await reschedule(p.id, FAIL_COOLDOWN_MIN);
        console.log(`⚠️ send failed ${r.status} -> reschedule +${FAIL_COOLDOWN_MIN}m: ${p.id}`);
      }
    } catch (err) {
      await reschedule(p.id, FAIL_COOLDOWN_MIN);
      console.log(`❌ exception -> reschedule +${FAIL_COOLDOWN_MIN}m: ${p.id}`, err?.message || err);
    }
  }
}

async function main() {
  console.log("✅ DIGIY PULSE WORKER started");
  console.log("➡️  Supabase:", SUPABASE_URL);
  console.log("➡️  Pulse API:", `${PULSE_API_BASE}${PULSE_SEND_PATH}`);
  while (true) {
    try { await tick(); }
    catch (e) { console.log("❌ tick error:", e?.message || e); }
    await sleep(TICK_MS);
  }
}

main();
