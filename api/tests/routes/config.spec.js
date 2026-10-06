// La configuración debe fallar con un mensaje claro si falta algo obligatorio.
const { expect } = require("chai");

const loadConfig = (env) => {
  const saved = { ...process.env };
  ["DATABASE_URL", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_NAME", "FIREBASE_PROJECT_ID"].forEach(
    (key) => delete process.env[key]
  );
  Object.assign(process.env, env);
  delete require.cache[require.resolve("../../src/config")];
  const config = require("../../src/config");
  process.env = saved;
  delete require.cache[require.resolve("../../src/config")];
  return config;
};

describe("Configuración", () => {
  it("falla indicando qué variables obligatorias faltan", () => {
    const config = loadConfig({ DOTENV_CONFIG_QUIET: "true" });
    expect(() => config.assertValid()).to.throw(/DATABASE_URL.*FIREBASE_PROJECT_ID/);
  });

  it("arma la URL de la base con las variables sueltas y escapa la contraseña", () => {
    const config = loadConfig({ DB_USER: "u", DB_PASSWORD: "p@ss/word", DB_HOST: "h:5432" });
    expect(config.databaseUrl).to.equal("postgres://u:p%40ss%2Fword@h:5432/consultas");
  });

  it("no arma una URL a medias si faltan variables", () => {
    expect(loadConfig({ DB_USER: "u" }).databaseUrl).to.equal(undefined);
  });

  it("es válida con lo mínimo (mail y pagos son opcionales)", () => {
    const config = loadConfig({ DATABASE_URL: "postgres://a:b@c/d", FIREBASE_PROJECT_ID: "x" });
    const warn = console.warn;
    console.warn = () => {};
    try {
      expect(() => config.assertValid()).to.not.throw();
    } finally {
      console.warn = warn;
    }
  });
});
