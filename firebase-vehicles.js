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
      const img2 = fotos[1] || "";
      const img3 = fotos[2] || "";
      const km = v.km ? Number(v.km).toLocaleString() + " km" : "";

      // Build photo section
      let photoHTML = "";
      if (img1 && img2 && img3) {
        photoHTML = `
          <div style="display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; height:200px; gap:2px;">
            <img src="${img1}" style="grid-row:1/3; width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
            <img src="${img2}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
            <img src="${img3}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
          </div>`;
      } else if (img1 && img2) {
        photoHTML = `
          <div style="display:grid; grid-template-columns:1fr 1fr; height:200px; gap:2px;">
            <img src="${img1}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
            <img src="${img2}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
          </div>`;
      } else if (img1) {
        photoHTML = `<img src="${img1}" style="width:100%; height:200px; object-fit:cover;" onerror="this.style.display='none'">`;
      } else {
        photoHTML = `<div style="width:100%; height:200px; background:#e5e7eb; display:flex; align-items:center; justify-content:center; color:#9ca3af;">Sin foto</div>`;
      }

      const card = document.createElement("div");
      card.className = "bg-white rounded-2xl shadow-lg overflow-hidden card-hover";
      card.innerHTML = `
        ${photoHTML}
        <div class="p-5">
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
