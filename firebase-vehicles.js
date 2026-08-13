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
  var scrollPos = window.scrollY;

  // Block page scroll
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + scrollPos + 'px';
  document.body.style.width = '100%';

  function closeModal() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPos);
    var m = document.getElementById('fbModal');
    if (m) m.remove();
  }

  var modal = document.createElement('div');
  modal.id = 'fbModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;box-sizing:border-box;';

  var header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:flex-end;padding:12px 16px;flex-shrink:0;';
  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&#215;';
  closeBtn.style.cssText = 'background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:36px;height:36px;font-size:22px;cursor:pointer;line-height:1;';
  closeBtn.onclick = closeModal;
  header.appendChild(closeBtn);

  var body = document.createElement('div');
  body.style.cssText = 'overflow-y:scroll;flex:1;padding:0 16px 20px;';

  fotos.forEach(function(src) {
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'margin-bottom:12px;text-align:center;';
    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'width:100%;max-height:75vh;object-fit:contain;border-radius:8px;display:block;cursor:zoom-in;transition:transform 0.2s;';
    var zoomed = false;
    img.ondblclick = function() {
      zoomed = !zoomed;
      img.style.transform = zoomed ? 'scale(1.8)' : 'scale(1)';
      img.style.cursor = zoomed ? 'zoom-out' : 'zoom-in';
    };
    imgWrap.appendChild(img);
    body.appendChild(imgWrap);
  });

  modal.appendChild(header);
  modal.appendChild(body);
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

// ═══════════════════════════════════════════════════════════════════════════
//  ORDEN DEL INVENTARIO Y ETIQUETA "NUEVO"
//  · Los SUV salen siempre de primeros.
//  · Dentro de cada grupo, el auto subido más recientemente va arriba.
//  · Los autos subidos hace menos de DIAS_NUEVO días llevan etiqueta azul.
//    Pasados esos días la etiqueta desaparece sola, sin tocar nada.
// ═══════════════════════════════════════════════════════════════════════════
const DIAS_NUEVO = 14;   // ← cambia este número si quieres más o menos días

// Fecha en que se SUBIÓ el auto, en milisegundos.
// Solo se usa createdAt (la fecha de subida). No se usa updatedAt a propósito:
// así, editar el precio de un auto viejo no lo vuelve a marcar como nuevo.
function fbFechaSubida(v) {
  const c = v.createdAt;
  if (!c) return 0;                                   // autos viejos sin fecha
  if (typeof c.toMillis === 'function') return c.toMillis();
  if (c.seconds) return c.seconds * 1000;
  const t = Date.parse(c);
  return isNaN(t) ? 0 : t;
}

function fbEsNuevo(ts) {
  return ts > 0 && (Date.now() - ts) < DIAS_NUEVO * 24 * 60 * 60 * 1000;
}

function abrirCarfax(link, nombre) {
  if (link && link.startsWith('http')) {
    window.open(link, '_blank');
  } else {
    window.open('https://wa.me/12045096153?text=Hola,%20necesito%20el%20Carfax%20del%20' + nombre, '_blank');
  }
}

async function loadFirebaseVEHICULOS_BG() {
  try {
    const snapshot = await db.collection("VEHICULOS_BG").get();
    if (snapshot.empty) return;

    var photoHeight = getExistingPhotoHeight();

    // ── Se ordenan ANTES de dibujar: SUV primero, y dentro de cada
    //    grupo el más reciente arriba. Los autos sin fecha de subida
    //    (los más antiguos) quedan al final de su grupo.
    const listaOrdenada = [];
    snapshot.forEach(doc => {
      const v = doc.data();
      const cat = (v.categoria || 'sedan').toLowerCase();
      listaOrdenada.push({ v: v, ts: fbFechaSubida(v), grupo: (cat === 'suv' ? 0 : 1) });
    });
    listaOrdenada.sort((a, b) => {
      if (a.grupo !== b.grupo) return a.grupo - b.grupo;   // SUV primero
      return b.ts - a.ts;                                  // más nuevo arriba
    });

    listaOrdenada.forEach(item => {
      const v = item.v;
      const esNuevo = fbEsNuevo(item.ts);
      const textoNuevo = (typeof currentLang !== 'undefined' && currentLang === 'es') ? 'NUEVO' : 'NEW';
      const nombre = v.nombre || "";
      const precio = v.precio ? Number(v.precio).toLocaleString() : "";
      const km = v.km ? Number(v.km).toLocaleString() : "";
      const fotos = (v.fotos && v.fotos.length > 0) ? v.fotos : [];
      const img1 = fotos[0] || "";
      const fotosParam = encodeURIComponent(JSON.stringify(fotos));

      const card = document.createElement("div");
      card.className = "bg-white rounded-2xl shadow-lg overflow-hidden card-hover";
      card.dataset.category = (v.categoria || "sedan").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"");

      card.innerHTML = `
        <div style="position:relative;width:100%;height:${photoHeight}px;overflow:hidden;background:#f3f4f6;flex-shrink:0;">
          ${img1 ? `<img src="${img1}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;">` : ''}
          ${esNuevo ? `<span class="badge-nuevo" style="position:absolute;top:10px;left:10px;z-index:6;background:#2563eb;color:#fff;font-size:11px;font-weight:800;letter-spacing:1.5px;padding:5px 11px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,0.28);pointer-events:none;">${textoNuevo}</span>` : ''}
          <button onclick="fbOpenGallery('${fotosParam}')" class="btn-ver-fotos" style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.6);color:white;border:none;border-radius:20px;padding:6px 14px;font-size:13px;cursor:pointer;">&#128247; Ver Fotos</button>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-xl text-gray-900 mb-2">${nombre}</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="color:#2563eb;font-weight:bold;font-size:1.4rem;">CAD $${precio}</span>
            <span style="color:#6b7280;font-size:0.9rem;">${km} km</span>
          </div>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:4px;"><span class="txt-garantia">&#10003; Garantia</span></p>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:4px;"><span class="txt-safety">&#10003; Safety Inspection</span></p>
          <p style="color:#374151;font-size:0.9rem;margin-bottom:16px;"><span class="txt-carfaxdisp">&#10003; Carfax disponible</span></p>
          <div class="flex gap-2">
            <a href="https://wa.me/12045096153?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl text-sm font-semibold" style="text-decoration:none;"><span class="txt-consultar">Consultar</span></a>
            <button onclick="abrirCarfax('${v.carfax || ''}', '${encodeURIComponent(nombre)}')" class="flex-1 bg-gray-700 hover:bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-semibold" style="border:none;cursor:pointer;"><span class="txt-carfax">Carfax</span></button>
          </div>
        </div>`;

      const grid = document.getElementById("carGrid");
      if (grid) grid.appendChild(card);
    });

    // Aplicar el idioma actual a las tarjetas recien creadas
    if (typeof setLang === 'function') {
      setLang(typeof currentLang !== 'undefined' ? currentLang : 'en');
    }
  } catch (err) {
    console.error("Firebase error:", err);
  }
}

setTimeout(loadFirebaseVEHICULOS_BG, 1500);
