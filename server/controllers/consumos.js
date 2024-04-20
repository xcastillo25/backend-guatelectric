const { sequelize } = require('../models'); 
const { tblconsumos }  = require('../models');
const { tblfacturas }  = require('../models');
const { Op } = require('sequelize');

const crearConsumos = async (req, res) => {
    const t = await sequelize.transaction();  // Inicia una transacción
    try {
        const { idmedidor, mes, anio } = req.body;

        const existeConsumo = await tblconsumos.findOne({
            where: { idmedidor, mes, anio }
        });

        if (existeConsumo) {
            await t.rollback(); // Asegúrate de cerrar la transacción si hay un error
            return res.status(400).send({ message: 'Ya existe un registro de consumo para este medidor, mes y año.' });
        }

        // Creación de un nuevo consumo utilizando los campos proporcionados en el cuerpo de la solicitud.
        const nuevoConsumo = await tblconsumos.create({
            ...req.body,
            facturado: false  // Inicialmente marcado como no facturado
        }, { transaction: t });

        // Cálculo del IVA y total basado en el monto del consumo.
        const iva = calcularIVA(nuevoConsumo.monto);  // Suponiendo que calcularIVA es una función utilitaria definida.
        const total = nuevoConsumo.monto + iva + nuevoConsumo.cargofijo + nuevoConsumo.cuotaalumbrado;

        // Creación de la factura utilizando la secuencia SQL Server para nofactura.
        const nuevaFactura = await tblfacturas.create({
            fecha: new Date(), // La fecha se maneja directamente en el modelo como valor por defecto.
            idcliente: nuevoConsumo.idcliente,
            idmedidor: nuevoConsumo.idmedidor,
            idconsumo: nuevoConsumo.idconsumo,
            iva,
            total,
            estado: true,
            enviado: false
        }, { transaction: t });

        // Actualizar el campo facturado del consumo a true tras crear la factura.
        await nuevoConsumo.update({ facturado: true }, { transaction: t });

        await t.commit();  // Commit de la transacción si todo ha ido bien

        // Envío de la respuesta con los objetos de consumo y factura creados.
        res.status(201).send({ nuevoConsumo, nuevaFactura });
    } catch (error) {
        await t.rollback();  // Revertir todos los cambios si hay un error
        console.error('Error al crear el consumo y la factura:', error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};


function calcularIVA(monto) {
    const tasaIVA = 0.12;  // Por ejemplo, 12% de IVA
    return monto * tasaIVA;
}


function calcularIVA(monto) {
    const tasaIVA = 0.12;  // Por ejemplo, 12% de IVA
    return monto * tasaIVA;
}


const obtenerUltimoConsumo = async (req, res) => {
    try {
        const { idmedidor } = req.params; // Obtiene el idmedidor de los parámetros de la URL

        const ultimoConsumo = await tblconsumos.findOne({
            where: { idmedidor: idmedidor },
            order: [
                ['anio', 'DESC'],
                ['mes', 'DESC']
            ]
        });

        if (!ultimoConsumo) {
            return res.status(404).send({ message: "No se encontró el consumo más reciente para el medidor especificado." });
        }

        res.send(ultimoConsumo);
    } catch (error) {
        console.error('Error al obtener el último consumo:', error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    crearConsumos, obtenerUltimoConsumo
}