const {Sequelize,DataTypes} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
    //definimos el modelo.
    sequelize.define('horario', {
		lunes: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		martes: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		miercoles: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		jueves: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		viernes: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		sabado: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		},
		domingo: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		}
	},{
		timestamps: false,

	});
};