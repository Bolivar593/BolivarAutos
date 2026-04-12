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
    const snapshot = await db.collection("VEHICULOS_BG").get();
    if (snapshot.empty) return;
    snapshot.forEach(doc => {
      const v = doc.data();
      const price = v.precio ? "CAD $" + Number(v.precio).toLocaleString() : "Consultar";
      const fotos = (v.fotos && v.fotos.length > 0) ? v.fotos : [];
      const img1 = fotos[0] || "";
      const km = v.km ? Number(v.km).toLocaleString() + " km" : "";

      const card = document.createElement("div");
      card.className = "bg-white rounded-2xl shadow-lg overflow-hidden card-hover";
      card.style.cssText = "display:flex; flex-direction:column;";

      card.innerHTML = `
        <div style="width:100%; height:192px; overflow:hidden; flex-shrink:0;">
          ${img1
            ? `<img src="${img1}" style="width:100%; height:100%; object-fit:cover; display:block;">`
            : `<div style="width:100%; height:100%; background:#e5e7eb; display:flex; align-items:center; justify-content:center; color:#9ca3af;">Sin foto</div>`
          }
        </div>
        <div class="p-5" style="flex:1;">
          <h3 class="font-bold text-lg text-gray-900 mb-1">${v.nombre || ""}</h3>
          ${km ? `<p class="text-gray-500 text-sm mb-1">🛣 ${km}</p>` : ""}
          ${v.categoria ? `<p class="text-gray-500 text-sm mb-2">🚗 ${v.categoria}</p>` : ""}
          <p class="text-blue-600 font-bold text-xl mb-3">${price}</p>
          <div class="flex gap-2">
            <a href="https://wa.me/593998871836?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(v.nombre||'')}" target="_blank" class="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-semibold">Consultar</a>
            <a href="#" onclick="return false;" class="flex-1 bg-gray-800 text-white text-center py-2 rounded-lg text-sm font-semibold">Carfax</a>
          </div>
        </div>`;

      const grid = document.getElementById("carGrid");
      if (grid) grid.appendChild(card);
    });
  } catch (err) {
    console.error("Firebase error:", err);
  }
}

setTimeout(loadFirebaseVEHICULOS_BG, 1500);
