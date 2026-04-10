const firebaseConfig = {
  apiKey: "AIzaSyBuRACKx_I-WLsCmmquAH9eWwkubwsdmUQ",
  authDomain: "bolivarautos-919e4.firebaseapp.com",
  projectId: "bolivarautos-919e4",
  storageBucket: "bolivarautos-919e4.firebasestorage.app",
  messagingSenderId: "397354528397",
  appId: "1:397354528397:web:52fd2ec53984af7aaa7cc4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

async function loadFirebaseVEHICULOS_BG() {
  try {
    const snapshot = await db.collection("VEHICULOS_BG")
      
      .get();
    if (snapshot.empty) return;
    const vehicles = [];
    snapshot.forEach(doc => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });
    injectVehicles(vehicles);
  } catch (err) {
    console.error("Firebase load error:", err);
  }
}

function injectVehicles(vehicles) {
  const container = document.getElementById("firebase-inventory");
  if (!container) return;
  container.innerHTML = "";
  vehicles.forEach(v => {
    const price = v.precio ? "CAD $" + Number(v.precio).toLocaleString() : "Consultar";
    const img = (v.fotos && v.fotos[0]) ? v.fotos[0] : "";
    const km = v.km ? Number(v.km).toLocaleString() + " km" : "";
    const card = document.createElement("div");
    card.style.cssText = "background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin:20px auto;max-width:400px;";
    card.innerHTML = `
      ${img ? `<img src="${img}" style="width:100%;height:220px;object-fit:cover;">` : `<div style="height:220px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;color:#9ca3af;">Sin foto</div>`}
      <div style="padding:16px;">
        <h3 style="margin:0 0 8px;font-size:1.1rem;color:#1e293b;">${v.nombre || ""}</h3>
        ${km ? `<p style="margin:0 0 4px;color:#64748b;font-size:0.9rem;">🛣 ${km}</p>` : ""}
        ${v.categoria ? `<p style="margin:0 0 4px;color:#64748b;font-size:0.9rem;">🚗 ${v.categoria}</p>` : ""}
        <p style="margin:8px 0 0;font-size:1.2rem;font-weight:bold;color:#2563eb;">${price}</p>
      </div>`;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadFirebaseVEHICULOS_BG);
