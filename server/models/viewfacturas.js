module.exports = (sequelize, DataTypes) => {
    const ViewFactura = sequelize.define('viewfactura', {
        idmedidor: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        idfactura: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        enviado: {
            type: DataTypes.BOOLEAN,
            allowNull: true
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
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cargofijo: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        mes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        consumokw: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        },
        monto: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cuotaalumbrado: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        lectura_actual: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lectura_anterior: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_lectura: {
            type: DataTypes.DATE,
            allowNull: false
        },
        nofactura: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        iva: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        consumo1: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        consumo2: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        consumo3: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        consumo4: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        },
        consumo5: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        timestamps: false,  // No timestamps are to be maintained
        tableName: 'viewfactura',
    });

    return ViewFactura;
};
