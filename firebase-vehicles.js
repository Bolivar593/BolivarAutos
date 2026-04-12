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

// Modal para ver todas las fotos
function fbOpenGallery(fotosJson) {
  const fotos = JSON.parse(decodeURIComponent(fotosJson));
  let html = `
    <div id="fbModal" onclick="document.getElementById('fbModal').remove()" style="
      position:fixed; top:0; left:0; width:100%; height:100%; 
      background:rgba(0,0,0,0.9); z-index:99999; 
      display:flex; flex-direction:column; align-items:center; 
      justify-content:center; padding:20px; box-sizing:border-box; cursor:pointer;">
      <p style="color:white; margin-bottom:15px; font-size:14px;">Toca en cualquier lugar para cerrar</p>
      <div style="display:flex; flex-direction:column; gap:10px; overflow-y:auto; max-height:85vh; width:100%; max-width:600px;">`;
  fotos.forEach(function(src) {
    html += `<img src="${src}" style="width:100%; border-radius:8px; display:block;">`;
  });
  html += `</div></div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

async function loadFirebaseVEHICULOS_BG() {
  try {
    const snapshot = await db.collection("VEHICULOS_BG").get();
    if (snapshot.empty) return;
    snapshot.forEach(doc => {
      const v = doc.data();
      const nombre = v.nombre || "";
      const precio = v.precio ? Number(v.precio).toLocaleString() : "";
      const km = v.km ? Number(v.km).toLocaleString() : "";
      const fotos = (v.fotos && v.fotos.length > 0) ? v.fotos : [];
      const img1 = fotos[0] || "";
      const fotosParam = encodeURIComponent(JSON.stringify(fotos));

      const card = document.createElement("div");
      card.className = "bg-white rounded-2xl shadow-lg overflow-hidden card-hover";

      card.innerHTML = `
        <div style="position:relative; width:100%; height:200px; overflow:hidden; background:#e5e7eb;">
          ${img1 
            ? `<img src="${img1}" style="width:100%; height:100%; object-fit:cover; display:block;">`
            : `<div style="width:100%; height:100%; background:#d1d5db;"></div>`
          }
          ${fotos.length > 0 ? `
          <button onclick="fbOpenGallery('${fotosParam}')" style="
            position:absolute; bottom:10px; right:10px; 
            background:rgba(0,0,0,0.6); color:white; border:none; 
            border-radius:20px; padding:6px 14px; font-size:13px; cursor:pointer;">
            &#128247; Ver Fotos
          </button>` : ''}
        </div>
        <div class="p-5">
          <h3 class="font-bold text-xl text-gray-900 mb-2">${nombre}</h3>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="color:#2563eb; font-weight:bold; font-size:1.4rem;">CAD $${precio}</span>
            <span style="color:#6b7280; font-size:0.9rem;">${km} km</span>
          </div>
          <p style="color:#374151; font-size:0.9rem; margin-bottom:4px;">&#10003; Garantia</p>
          <p style="color:#374151; font-size:0.9rem; margin-bottom:4px;">&#10003; Safety Inspection</p>
          <p style="color:#374151; font-size:0.9rem; margin-bottom:16px;">&#10003; Carfax disponible</p>
          <div class="flex gap-2">
            <a href="https://wa.me/593998871836?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(nombre)}" 
               target="_blank" 
               style="flex:1; background:#2563eb; color:white; text-align:center; padding:12px; border-radius:10px; font-weight:600; font-size:0.95rem; text-decoration:none;">
              Consultar
            </a>
            <a href="#" onclick="return false;" 
               style="flex:1; background:#374151; color:white; text-align:center; padding:12px; border-radius:10px; font-weight:600; font-size:0.95rem; text-decoration:none;">
              Carfax
            </a>
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
