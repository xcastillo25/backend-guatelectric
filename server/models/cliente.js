module.exports = (sequelize, DataTypes) => {
    const Clientes = sequelize.define(
        'tblclientes',
        {
            idcliente: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nit: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            nombre: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            apellidos: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            correo: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            direccion: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            idtelefono: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tbltelefonos',
                    key: 'idtelefono'
                }
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            observaciones: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            idtipocliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tbltipoclientes',
                    key: 'idtipocliente'
                }
            },
        },
        {
            timestamps: false,
        }
    );
    return Clientes;
};
