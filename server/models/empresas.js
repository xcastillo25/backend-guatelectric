module.exports = (sequelize, DataTypes) => {
    const Empresas = sequelize.define(
        'tblempresas',
        {
            idempresa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            empresa: {
                type: DataTypes.STRING,
                allowNull: false
            },
            direccion: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nit: {
                type: DataTypes.STRING,
                allowNull: false
            },
            telefono: {
                type: DataTypes.STRING,
                allowNull: false
            },
            celular: {
                type: DataTypes.STRING,
                allowNull: false
            },
            foto: {
                type: DataTypes.STRING,
                allowNull: false
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            timestamps: false,
        }
    );

    return Empresas;
};
