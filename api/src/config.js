require("dotenv").config();

const env = process.env;

const clientUrl = env.CLIENT || "http://localhost:3000";

// Si no hay DATABASE_URL se arma con las variables sueltas (solo si están todas).
const buildDatabaseUrl = () => {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME = "consultas" } = env;
  if (!DB_USER || !DB_PASSWORD || !DB_HOST) return undefined;
  return `postgres://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/${DB_NAME}`;
};

const config = {
  nodeEnv: env.NODE_ENV || "development",
  port: env.PORT || 3005,
  apiUrl: env.API_URL, // URL pública de la API (para el webhook de Mercado Pago)
  clientUrl,
  corsOrigin: (env.CORS_ORIGIN || clientUrl).split(","),
  firebaseProjectId: env.FIREBASE_PROJECT_ID,
  databaseUrl: buildDatabaseUrl(),
  dbSsl: env.DB_SSL === "true",
  mail: { user: env.GMAIL, pass: env.GMAIL_PASS },
  mercadopago: {
    // Credenciales de la plataforma (cobro de la suscripción)
    accessToken: env.MP_ACCESS_TOKEN,
    clientId: env.MP_CLIENT_ID,
    clientSecret: env.MP_CLIENT_SECRET,
    redirectUri: env.MP_REDIRECT_URI || `${clientUrl}/payments`,
  },
  subscriptionPrice: Number(env.SUBSCRIPTION_PRICE) || 1000,
};

// Sin estas variables la API no puede funcionar.
const REQUIRED = [
  ["DATABASE_URL (o DB_USER, DB_PASSWORD y DB_HOST)", () => config.databaseUrl],
  ["FIREBASE_PROJECT_ID", () => config.firebaseProjectId],
];

// Sin estas, la API arranca pero esa funcionalidad no anda.
const OPTIONAL = [
  ["el envío de mails", ["GMAIL", "GMAIL_PASS"], () => config.mail.user && config.mail.pass],
  [
    "el cobro de suscripciones con Mercado Pago",
    ["MP_ACCESS_TOKEN"],
    () => config.mercadopago.accessToken,
  ],
  [
    "la vinculación de Mercado Pago de los profesionales",
    ["MP_CLIENT_ID", "MP_CLIENT_SECRET"],
    () => config.mercadopago.clientId && config.mercadopago.clientSecret,
  ],
];

// Se llama al arrancar el servidor (no al importar, para poder testear).
config.assertValid = () => {
  const missing = REQUIRED.filter(([, get]) => !get()).map(([name]) => name);
  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(", ")}. Ver api/.env.example`
    );
  }
  OPTIONAL.filter(([, , get]) => !get()).forEach(([feature, vars]) =>
    console.warn(`Aviso: sin ${vars.join(" / ")} queda deshabilitado: ${feature}.`)
  );
};

module.exports = config;
