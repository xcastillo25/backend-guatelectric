module.exports = (sequelize, DataTypes) => {
    const Telefonos = sequelize.define(
        'tbltelefonos',
        {
            idtelefono: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            telefono: {
                type: DataTypes.STRING(15),
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

    return Telefonos;
}
