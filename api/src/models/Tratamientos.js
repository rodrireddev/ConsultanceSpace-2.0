const { DataTypes, Sequelize } = require("sequelize");
//Exportamos por modulo la funcion que define el modelo
module.exports = (sequelize) => {
  //* defino el modelo
  sequelize.define("tratamientos", {
    treatmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM({
        values: [
          "efectivo",
          "tarjeta de credito",
          "tarjeta de debito",
          "parcialidades",
        ],
      }),
    },
    status: {
      type: DataTypes.ENUM({
        values: ["completado", "pendiente", "en proceso"],
      }),
    },
  });
};
