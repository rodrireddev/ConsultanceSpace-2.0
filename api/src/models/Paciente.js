const {DataTypes,Sequelize} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
	//* defino el modelo
	sequelize.define('paciente', {
		cedula: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		nombre: {
			type: DataTypes.STRING,
			allowNull : false,
		},
		apellidos:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		telefono:{
			type : DataTypes.BIGINT,
			allowNull: false,
		},
		fecha_de_nacimiento:{
			type: DataTypes.DATE,
			allowNull: false,
		},
		direccion:{
			type: DataTypes.TEXT,
			allowNull : false,
		},
		pais:{
			type: DataTypes.STRING,
			allowNull: false
		},
		genero:{
			type: DataTypes.STRING,
			allowNull: true
		},
		estado_civil:{
			type: DataTypes.STRING,
			allowNull: true
		},
		fullName: {
			type: DataTypes.VIRTUAL,
			get: function() {
				// return `${this.nombre} ${this.apellidos}`;
				return this.nombre + ' ' + this.apellidos;
			},
		}
	},{
		timestamps: false,
	});
};