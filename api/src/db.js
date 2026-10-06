const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const config = require("./config");

if (!config.databaseUrl) {
  throw new Error("Falta DATABASE_URL (o DB_USER, DB_PASSWORD y DB_HOST). Ver api/.env.example");
}

const sequelize = new Sequelize(config.databaseUrl, {
  logging: false,
  define: { freezeTableName: true },
  dialectOptions: config.dbSsl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);

sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const {
  Usuario,
  Profesional,
  Paciente,
  ProfesionalPaciente,
  Especialidad,
  Cita,
  Stock,
  AntecedentesPatologicos,
  AntecedentesNoPatologicos,
  Horario,
  Tratamientos,
  Pago } = sequelize.models;


///aqui van las relaciones
Usuario.hasOne(Profesional);
Profesional.belongsTo(Usuario);
//Relacion Usuario- Paciente
Usuario.hasOne(Paciente);
Paciente.belongsTo(Usuario);
//Relacion  Paciente - profesional
Paciente.belongsToMany(Profesional, { through: ProfesionalPaciente });
Profesional.belongsToMany(Paciente, { through: ProfesionalPaciente });
//// comprobantes de subcripcion
Profesional.hasMany(Pago)
Pago.belongsTo(Profesional)
//Profesional - especialidad
Profesional.belongsToMany(Especialidad, {
  through: "profesional_especialidad",
});
Especialidad.belongsToMany(Profesional, {
  through: "profesional_especialidad",
});

//Profesional - stock
Usuario.hasOne(Stock);
Stock.belongsTo(Usuario);

//Profesional - horario
Profesional.hasOne(Horario);
Horario.belongsTo(Profesional);

//cita-profesional
Profesional.hasMany(Cita);
Cita.belongsTo(Profesional);

// cita-paciente
Paciente.hasMany(Cita);
Cita.belongsTo(Paciente);

//tratamientos profesional
Cita.hasMany(Tratamientos);
Tratamientos.belongsTo(Cita)

//AntecedentesPatologicos paciente
AntecedentesPatologicos.hasOne(Paciente)
Paciente.belongsTo(AntecedentesPatologicos)

//AntecedentesNoPatologicos paciente
AntecedentesNoPatologicos.hasOne(Paciente)
Paciente.belongsTo(AntecedentesNoPatologicos)
module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
