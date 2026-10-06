// Entorno y utilidades para tests que no tocan la base de datos real:
// se reemplaza el verificador de Firebase y los métodos de los modelos por stubs.
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://u:p@127.0.0.1:1/test";
process.env.FIREBASE_PROJECT_ID = "test-project";

const firebase = require("../../src/services/firebase");
const db = require("../../src/db");

// token de prueba -> claims que devolvería Firebase
const TOKENS = {
  "pac-token": { email: "pac@test.com", email_verified: true },
  "pac2-token": { email: "pac2@test.com", email_verified: true },
  "prof-token": { email: "prof@test.com", email_verified: true },
  "prof2-token": { email: "prof2@test.com", email_verified: true },
  "unverified-token": { email: "nuevo@test.com", email_verified: false },
  "ghost-token": { email: "ghost@test.com", email_verified: true },
};

const USERS = {
  "pac@test.com": { tipo_usuario: "paciente", paciente: { id: 1 } },
  "pac2@test.com": { tipo_usuario: "paciente", paciente: { id: 2 } },
  "prof@test.com": { tipo_usuario: "profesional", profesional: { id: 10 } },
  "prof2@test.com": { tipo_usuario: "profesional", profesional: { id: 20 } },
};

const originals = [];
const stub = (obj, name, impl) => {
  originals.push([obj, name, obj[name]]);
  obj[name] = impl;
};

// Instala los stubs de auth. Llamar en beforeEach y restore() en afterEach.
const install = () => {
  stub(firebase, "verifyIdToken", async (token) => {
    if (!TOKENS[token]) throw new Error("invalid");
    return TOKENS[token];
  });
  // loadMe: busca el Usuario por email (case-insensitive) y su perfil.
  stub(db.Usuario, "findOne", async (opts) => {
    // where(fn("lower", col("email")), valor) guarda el valor en `logic`.
    const found = Object.keys(USERS).find((e) => e === String(opts.where.logic).toLowerCase());
    return found ? { email: found, tipo_usuario: USERS[found].tipo_usuario } : null;
  });
  stub(db.Profesional, "findOne", async (opts) => {
    const u = USERS[opts.where.usuarioEmail];
    return u && u.profesional ? u.profesional : null;
  });
  stub(db.Paciente, "findOne", async (opts) => {
    const u = USERS[opts.where.usuarioEmail];
    return u && u.paciente ? u.paciente : null;
  });
};

const restore = () => {
  while (originals.length) {
    const [obj, name, original] = originals.pop();
    obj[name] = original;
  }
};

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { install, restore, stub, bearer, db };
