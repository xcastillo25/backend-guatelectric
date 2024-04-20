module.exports = (sequelize, DataTypes) => {
    const Consumo = sequelize.define(
        'tblconsumos',
        {
            idconsumo: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            idcliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tlbclientes',
                    key: 'idcliente'
                }
            },
            idmedidor: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tlbmedidores',
                    key: 'idmedidor'
                }
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
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false
            },
            monto: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false
            },
            cuotaalumbrado: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false
            },
            leido: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            lectura_actual: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: true,
            },
            lectura_anterior: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: true
            },
            pagado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            fecha_lectura: {
                type: DataTypes.DATE,
                allowNull: true
            },
            facturado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            cargofijo: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false
            },
        },
        {
            timestamps: false,
            tableName: 'tblconsumos', 
        }
    );

    return Consumo;
};
