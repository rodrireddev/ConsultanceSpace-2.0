const {DataTypes,Sequelize} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
	//* defino el modelo
	sequelize.define('stock', {
		itemsName: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},
		itemsCount:{
			type: DataTypes.ARRAY(DataTypes.INTEGER),
		}
	},{
		timestamps: false,
	});
};