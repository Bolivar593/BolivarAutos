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

function fbOpenGallery(fotosJson) {
  var fotos = JSON.parse(decodeURIComponent(fotosJson));
  var modal = document.createElement('div');
  modal.id = 'fbModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;';
  var header = '<div style="display:flex;justify-content:flex-end;padding:12px 16px;flex-shrink:0;">' +
    '<button onclick="document.getElementById(\'fbModal\').remove()" style="background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:36px;height:36px;font-size:22px;cursor:pointer;line-height:1;">&#215;</button>' +
    '</div>';
  var imgs = '';
  fotos.forEach(function(src) {
    imgs += '<img src="' + src + '" style="width:100%;max-height:75vh;object-fit:contain;border-radius:8px;display:block;margin-bottom:12px;">';
  });
  modal.innerHTML = header + '<div style="overflow-y:scroll;flex:1;padding:0 16px 20px;">' + imgs + '</div>';
  document.body.appendChild(modal);
}

function getExistingPhotoHeight() {
  var grid = document.getElementById('carGrid');
  if (!grid) return 230;
  var cards = grid.querySelectorAll('.card-hover');
  for (var i = 0; i < cards.length; i++) {
    var firstChild = cards[i].firstElementChild;
    if (firstChild && firstChild.offsetHeight > 50) {
      return firstChild.offsetHeight;
    }
  }
  return 230;
}

async function loadFirebaseVEHICULOS_BG() {
  try {
    const snapshot = await db.collection("VEHICULOS_BG").get();
    if (snapshot.empty) return;

    var photoHeight = getExistingPhotoHeight();

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
        <div style="position:relative;width:100%;height:${photoHeight}px;overflow:hidden;background:white;flex-shrink:0;">
          ${img1 ? `<img src="${img1}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;">` : ''}
          <button onclick="fbOpenGallery('${fotosParam}')" style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.6);color:white;border:none;border-radius:20px;padding:6px 14px;font-size:13px;cursor:pointer;">&#128247; Ver Fotos</button>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-xl text-gray-900 mb-2">${nombre}</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="color:#2563eb;font-weight:bold;font-size:1.4rem;">CAD $${precio}</span>
            <span style="color:#6b7280;font-size:0.9rem;">${km} km</span>
          </div>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:4px;">&#10003; Garantia</p>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:4px;">&#10003; Safety Inspection</p>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:16px;">&#10003; Carfax disponible</p>
          <div class="flex gap-2">
            <a href="https://wa.me/593998871836?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl text-sm font-semibold" style="text-decoration:none;">Consultar</a>
            <a href="#" onclick="return false;" class="flex-1 bg-gray-700 hover:bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-semibold" style="text-decoration:none;">Carfax</a>
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
