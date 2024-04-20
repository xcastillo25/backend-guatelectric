module.exports = (sequelize, DataTypes) => {
    const Empleados = sequelize.define(
        'tblempleados',
        {
            idempleado: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            apellidos: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            telefono: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            nit: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            cui: {
                type: DataTypes.STRING(13),
                allowNull: false
            },
            foto: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            idempresa: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tblempresas',
                    key: 'idempresa'
                }
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

    return Empleados;
};
