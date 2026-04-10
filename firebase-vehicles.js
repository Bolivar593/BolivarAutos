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
  const container = document.getElementById("firebase-inventory");
  if (!container) { console.log("NO HAY CONTENEDOR"); return; }
  container.innerHTML = "<p style='color:red;font-size:20px;'>Conectando Firebase...</p>";
  try {
    const snapshot = await db.collection("VEHICULOS_BG").get();
    container.innerHTML = "<p style='color:green;font-size:20px;'>Carros encontrados: " + snapshot.size + "</p>";
  } catch (err) {
    container.innerHTML = "<p style='color:red;font-size:20px;'>Error: " + err.message + "</p>";
  }
}

loadFirebaseVEHICULOS_BG();
