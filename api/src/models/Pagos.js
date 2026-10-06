const {DataTypes,Sequelize} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
	//* defino el modelo
	sequelize.define('pago', {
		comprobante: {
			type: DataTypes.STRING,
		},
		completado:{
			type: DataTypes.BOOLEAN
		}
	});
};