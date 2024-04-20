module.exports = (sequelize, DataTypes) => {
    const ViewMapeo = sequelize.define('viewmapeo', {
        idmedidor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            primaryKey: true  // Asumiendo que idmedidor puede actuar como una clave primaria en la vista
        },
        nombre_completo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true // Ajustar según la configuración y necesidad real
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ubicacion: {
            type: DataTypes.STRING,  // Asegúrate de que el tipo de dato es el correcto según lo que devuelva la vista
            allowNull: true
        },
        idcliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idtipomedidor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipomedidor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tarifa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alumbradopublico:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cargofijo:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
    }, {
        tableName: 'viewmapeo',
        timestamps: false, // No gestionar campos de timestamp automáticamente
        freezeTableName: true // Utilizar el nombre de tabla exactamente como está definido
    });

    return ViewMapeo;
};
