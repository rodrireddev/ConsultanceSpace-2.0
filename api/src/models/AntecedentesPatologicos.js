const {DataTypes} = require('sequelize');
//Exportamos por modulo la funcion que define el modelo de las actividades
module.exports = (sequelize) => {
    //definimos el modelo.
    sequelize.define('antecedentesPatologicos', {
		embarazo: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        enfermedades_infancia: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        accidente: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        transfusion: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        operacion: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        alergia: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        cooperador: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        orientado: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        constitucion: {
			type: DataTypes.STRING,
			allowNull: true	
		},
        complexion: {
			type: DataTypes.STRING,
			allowNull: true	
		},
        facie: {
			type: DataTypes.STRING,
			allowNull: true	
		},
        conformacion: {
			type: DataTypes.STRING,
			allowNull: true	
		},
        movimientos_anormales: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        marchas_patologicas: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
        bajo_tratamiento: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        pildoras_anticonceptivas: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        diabetes: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        hepatitis: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        tosferina: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        hemorragias: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        cardiopatias: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        hipotension: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        hipertension: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        fiebre_reumatica: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        paludismo: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        VIH: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        parasitos: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        sarampion: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        amigdalitis: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        epilepsia: {
			type: DataTypes.BOOLEAN,
			allowNull: true	
		},
        ETS: {
			type: DataTypes.STRING,
			allowNull: true	
		},
        comentarios: {
			type: DataTypes.TEXT,
			allowNull: true	
		},
	}
	);
};