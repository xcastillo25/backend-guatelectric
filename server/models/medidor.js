module.exports = (sequelize, DataTypes) => {
    const Medidores = sequelize.define(
        'tblmedidores',
        {
            idmedidor: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            serie: {
                type: DataTypes.STRING(25),
                allowNull: false
            },
            codigo: {
                type: DataTypes.STRING(25),
                allowNull: false
            },
            ubicacion: {
                type: DataTypes.GEOMETRY('POINT', 4326),
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            idtipomedidor: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tbltipomedidores',
                    key: 'idtipomedidor'
                }
            },
            idcliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tblclientes',
                    key: 'idcliente'
                }
            },
            direccion: {
                type: DataTypes.STRING(100),
                allowNull: false
            }
        },
        {
            timestamps: false,
        }
    );

    return Medidores;
};