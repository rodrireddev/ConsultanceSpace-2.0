const { Sequelize, DataTypes } = require("sequelize");
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
  //definimos el modelo.
  sequelize.define(
    "profesionalPaciente",
    {
      disable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
