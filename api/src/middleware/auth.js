const { fn, col, where } = require("sequelize");
const config = require("../config");
const firebase = require("../services/firebase");
const { Usuario, Profesional, Paciente } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const sameEmail = (a, b) =>
  typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();

// Valida el ID token de Firebase (header `Authorization: Bearer <token>`).
// Deja en req.auth la identidad verificada: { email, emailVerified }.
const authenticate = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) throw httpError(401, "Falta el token de autenticación");
  if (!config.firebaseProjectId) throw httpError(500, "FIREBASE_PROJECT_ID no está configurado");

  let decoded;
  try {
    decoded = await firebase.verifyIdToken(token);
  } catch (err) {
    throw httpError(401, "Token inválido o vencido");
  }
  if (!decoded.email) throw httpError(401, "El token no tiene email");

  req.auth = { email: decoded.email, emailVerified: Boolean(decoded.email_verified) };
  next();
});

// Exige que el email de la cuenta de Firebase esté verificado.
const requireVerified = (req, res, next) =>
  req.auth.emailVerified ? next() : next(httpError(403, "Verificá tu email para continuar"));

// Carga el usuario registrado en la plataforma y su perfil:
// req.me = { email, tipo_usuario, profesional, paciente }
const loadMe = asyncHandler(async (req, res, next) => {
  const usuario = await Usuario.findOne({
    where: where(fn("lower", col("email")), req.auth.email.toLowerCase()),
  });
  if (!usuario) throw httpError(403, "Usuario no registrado en la plataforma");

  const [profesional, paciente] = await Promise.all([
    usuario.tipo_usuario === "profesional"
      ? Profesional.findOne({ where: { usuarioEmail: usuario.email } })
      : null,
    usuario.tipo_usuario === "paciente"
      ? Paciente.findOne({ where: { usuarioEmail: usuario.email } })
      : null,
  ]);
  req.me = { email: usuario.email, tipo_usuario: usuario.tipo_usuario, profesional, paciente };
  next();
});

const requireRole = (tipo) => (req, res, next) =>
  req.me.tipo_usuario === tipo && req.me[tipo]
    ? next()
    : next(httpError(403, `Solo disponible para usuarios de tipo ${tipo}`));

module.exports = { authenticate, requireVerified, loadMe, requireRole, sameEmail };
