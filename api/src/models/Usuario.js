const {Sequelize,DataTypes} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
    //definimos el modelo.
    sequelize.define('usuario', {
        email: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			validate:{
				isEmail: true,
			}
		},
		tipo_usuario: {
			type: DataTypes.STRING,
			allowNull: false	
		}
		
	},{
		timestamps: false,

	});
};