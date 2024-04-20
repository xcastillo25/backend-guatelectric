module.exports = (sequelize, DataTypes) => {
    const TipoMedidores = sequelize.define(
        'tbltipomedidores',
        {
            idtipomedidor: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            tipomedidor: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            tarifa: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            alumbradopublico: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            cargofijo: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            timestamps: false,
        }
    );

    return TipoMedidores;
};
