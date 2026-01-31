// pulse-worker.mjs v2.0 — Claim atomique + retry logic pro
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// ===================== CONFIG =====================
const SUPABASE_URL = process.env.SUPABASE_URL || "https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || "";
const PULSE_API_BASE = process.env.PULSE_API_BASE || "http://127.0.0.1:3200";
const PULSE_SEND_PATH = process.env.PULSE_SEND_PATH || "/loc/pulse/send";
const PULSE_API_TOKEN = process.env.PULSE_API_TOKEN || "";

// Cadence
const TICK_MS = Number(process.env.PULSE_TICK_MS || 15000); // 15s
const BATCH = Number(process.env.PULSE_BATCH || 10);
const RETRY_DELAYS = [5, 15, 30, 60]; // minutes selon attempt
const MAX_ATTEMPTS = 5;

// Worker ID unique (pour traçabilité multi-workers)
const WORKER_ID = `worker-${randomUUID().slice(0, 8)}`;

// ===================================================
if (!SUPABASE_SERVICE_ROLE) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function isoNow() { return new Date().toISOString(); }
function addMinutesISO(min) {
  return new Date(Date.now() + min * 60 * 1000).toISOString();
}

// ===================== CLAIM ATOMIQUE =====================
async function claimBatch(batch = 10) {
  const { data, error } = await sb.rpc("claim_digiy_loc_pulse_outbox", {
    p_worker_id: WORKER_ID,
    p_batch_size: batch
  });

  if (error) {
    console.error("❌ Claim RPC error:", error.message);
    throw error;
  }

  return data || [];
}

// ===================== SEND VIA API =====================
async function sendViaApi(pulse) {
  const url = new URL(PULSE_SEND_PATH, PULSE_API_BASE);

  const body = {
    id: pulse.id,
    phone: pulse.phone,
    channel: pulse.channel || "whatsapp",
    message: pulse.message || "",
    title: pulse.title || "",
    payload: pulse.payload || {}
  };

  const headers = { "Content-Type": "application/json" };
  if (PULSE_API_TOKEN) headers["Authorization"] = `Bearer ${PULSE_API_TOKEN}`;

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  let out = null;
  try { out = await res.json(); } catch { out = null; }

  return { ok: res.ok, status: res.status, out };
}

// ===================== MARK SUCCESS =====================
async function markSuccess(id) {
  const { error } = await sb
    .from("digiy_loc_pulse_outbox")
    .update({
      status: "seen",
      sent_at: isoNow(),
      locked_at: null,
      locked_by: null,
      updated_at: isoNow()
    })
    .eq("id", id);

  if (error) {
    console.error("❌ markSuccess error:", error.message);
    throw error;
  }
}

// ===================== MARK FAILURE + RETRY =====================
async function markFailure(id, attempt, errorMsg) {
  const nextDelay = RETRY_DELAYS[Math.min(attempt - 1, RETRY_DELAYS.length - 1)];
  
  const update = {
    last_error: errorMsg?.substring(0, 500) || "Unknown error",
    locked_at: null,
    locked_by: null,
    updated_at: isoNow()
  };

  // Si max attempts atteint → on archive (ou tu peux créer un status 'failed')
  if (attempt >= MAX_ATTEMPTS) {
    update.status = "archived";
    update.next_try_at = null;
  } else {
    update.next_try_at = addMinutesISO(nextDelay);
  }

  const { error } = await sb
    .from("digiy_loc_pulse_outbox")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("❌ markFailure error:", error.message);
    throw error;
  }

  return attempt >= MAX_ATTEMPTS ? "archived" : `retry +${nextDelay}m`;
}

// ===================== TICK =====================
async function tick() {
  const claimed = await claimBatch(BATCH);
  
  if (claimed.length === 0) {
    console.log(`🟢 [${WORKER_ID}] tick: rien à envoyer`);
    return;
  }

  console.log(`🟡 [${WORKER_ID}] tick: ${claimed.length} pulse(s) claimed`);

  for (const pulse of claimed) {
    const attempt = pulse.attempts || 1;
    
    try {
      const result = await sendViaApi(pulse);
      
      if (result.ok) {
        await markSuccess(pulse.id);
        console.log(`✅ [${pulse.kind}] ${pulse.phone} → seen (attempt ${attempt})`);
      } else {
        const action = await markFailure(
          pulse.id,
          attempt,
          `HTTP ${result.status}: ${JSON.stringify(result.out)}`
        );
        console.log(`⚠️ [${pulse.kind}] ${pulse.phone} → ${action} (attempt ${attempt})`);
      }
    } catch (err) {
      const action = await markFailure(pulse.id, attempt, err.message);
      console.log(`❌ [${pulse.kind}] ${pulse.phone} → ${action} (attempt ${attempt}): ${err.message}`);
    }
  }
}

// ===================== MAIN LOOP =====================
async function main() {
  console.log("🦅 DIGIY PULSE WORKER v2.0 — Atomique + Retry");
  console.log(`➡️  Worker ID: ${WORKER_ID}`);
  console.log(`➡️  Supabase: ${SUPABASE_URL}`);
  console.log(`➡️  Pulse API: ${PULSE_API_BASE}${PULSE_SEND_PATH}`);
  console.log(`➡️  Tick: ${TICK_MS}ms | Batch: ${BATCH} | Max attempts: ${MAX_ATTEMPTS}`);
  console.log(`➡️  Retry delays: ${RETRY_DELAYS.join(', ')} minutes\n`);

  while (true) {
    try {
      await tick();
    } catch (err) {
      console.error("❌ tick error:", err.message);
    }
    await sleep(TICK_MS);
  }
}

main().catch(err => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
