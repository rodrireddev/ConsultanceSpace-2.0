const config = require("./src/config");

// Antes de cargar nada más: si falta configuración se corta con un mensaje claro.
config.assertValid();

const server = require("./src/app");
const { conn, Especialidad } = require("./src/db");
const { especialidadesjson } = require("./especialidades");

const start = async () => {
  await conn.sync({ force: false });
  await Promise.all(
    especialidadesjson.map((nombre) =>
      Especialidad.findOrCreate({ where: { nombre } })
    )
  );
  server.listen(config.port, () => {
    console.log(`API listening at ${config.port}`);
  });
};

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});
