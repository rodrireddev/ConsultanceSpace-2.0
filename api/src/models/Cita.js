const {DataTypes,Sequelize} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
	//* defino el modelo
	sequelize.define('cita', {
		date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note:{
			type: DataTypes.STRING,
		},
		status:{
			type: DataTypes.STRING,
		}
	},{
		timestamps: false,
	});
};