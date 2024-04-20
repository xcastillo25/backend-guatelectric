module.exports = (sequelize, DataTypes) => {
    const Factura = sequelize.define('tblfacturas', {
        idfactura: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nofactura: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: sequelize.literal('NEXT VALUE FOR FacturaSeq'), 
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,    
        },
        idcliente: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tblclientes',
                key: 'idcliente'
            }
        },
        idmedidor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tblmedidores',
                key: 'idmedidor'
            }
        },
        idconsumo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tblconsumos',
                key: 'idconsumo'
            }
        },
        iva: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        timestamps: false,
        tableName: 'tblfacturas', 
    });

    return Factura;
};
