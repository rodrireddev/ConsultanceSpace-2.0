const admin = require("firebase-admin");
const config = require("../config");

let app;
const getApp = () => {
  if (!app) app = admin.initializeApp({ projectId: config.firebaseProjectId });
  return app;
};

// Para verificar ID tokens alcanza con el projectId: Firebase valida la firma
// con las claves públicas de Google, no hacen falta credenciales de servicio.
module.exports = {
  verifyIdToken: (token) => getApp().auth().verifyIdToken(token),
};
