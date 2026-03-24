let mode = "demo";

// SWITCH MODE
function setMode(m) {
  mode = m;

  document.getElementById("demoBtn").style.background = m === "demo" ? "#FFD700" : "#1a1a1a";
  document.getElementById("liveBtn").style.background = m === "live" ? "#FFD700" : "#1a1a1a";
}

// 🔥 PREPARAZIONE API (placeholder)
async function getLivePrice() {
  try {
    let res = await fetch("https://api.bitget.com/api/mix/v1/market/ticker?symbol=XAUUSDT_UMCBL");
    let data = await res.json();
    return parseFloat(data.data.last);
  } catch {
    return null;
  }
}

// CALCOLO
async function calcola() {

  let capitale = parseFloat(document.getElementById("capitale").value);
  let rischioPerc = parseFloat(document.getElementById("rischio").value) / 100;
  let entry = parseFloat(document.getElementById("entry").value);
  let sl = parseFloat(document.getElementById("sl").value);

  // LIVE MODE → prende prezzo automatico
  if (mode === "live") {
    let livePrice = await getLivePrice();
    if (livePrice) {
      entry = livePrice;
      document.getElementById("entry").value = livePrice;
    }
  }

  if (!capitale || !rischioPerc || !entry || !sl) {
    document.getElementById("output").innerHTML = "⚠️ Inserisci dati";
    return;
  }

  let rischio = capitale * rischioPerc;
  let distanzaSL = Math.abs(entry - sl);

  // DIREZIONE
  let direzione = entry > sl ? "LONG 🟢" : "SHORT 🔴";

  // MT5
  let lotti = rischio / (distanzaSL * 100);

  // Lotto minimo
  let lottoMin = 0.01;
  let rischioReale = distanzaSL * 100 * lottoMin;
  let warning = lotti < lottoMin 
    ? `⚠️ Lotto minimo 0.01 → rischio reale ${rischioReale.toFixed(2)}$`
    : "";

  // Bitget
  let qty = rischio / distanzaSL;
  let size = qty * entry;

  // Leva minima
  let levaMin = size / capitale;

  document.getElementById("output").innerHTML = `
    📍 Direzione: ${direzione}<br><br>
    💸 Rischio: ${rischio.toFixed(2)}$<br><br>

    📊 MT5<br>
    Lotti: ${lotti.toFixed(4)}<br>
    ${warning}<br><br>

    🪙 Bitget<br>
    Qty: ${qty.toFixed(3)}<br>
    Size: ${size.toFixed(0)}$<br><br>

    ⚡ Leva minima: 1:${levaMin.toFixed(2)}
  `;
}

