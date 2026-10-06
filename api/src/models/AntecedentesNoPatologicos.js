const {DataTypes} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
    //definimos el modelo.
    sequelize.define('antecedentesNoPatologicos', {
		alimentacion: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
		higiene_corporal: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
		higiene_bucal: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
		vacunas: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
		toxicomanias: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
		alcoholismo: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
		tabaquismo: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
		tatuajes: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
		comentarios: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
	}
	);
};