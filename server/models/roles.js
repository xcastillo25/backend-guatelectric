module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define(
        'tblroles',
        {
            idrol: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            rol: {
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

    return Roles;
};
