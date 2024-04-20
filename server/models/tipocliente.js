module.exports = (sequelize, DataTypes) => {
    const TipoClientes = sequelize.define(
        'tbltipoclientes',
        {
            idtipocliente: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            tipocliente: {
                type: DataTypes.STRING(50),
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

    return TipoClientes;
};
