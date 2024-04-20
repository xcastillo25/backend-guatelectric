const { tblclientes } = require('../models');
const { Op } = require('sequelize');

const mostrarClientes = async (req, res) => {
    try {
        const clientes = await tblclientes.findAll();
        res.status(200).send({ Clientes: clientes });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};


const crearClientes = async (req, res) => {
    try {
        const existeCliente = await tblclientes.findOne({
            where: { nit: req.body.nit}
        });

        if (existeCliente) {
            return res.status(400).send({ mensaje: 'Este cliente ya está registrado' })
        }

        const nuevoCliente = await tblclientes.create(req.body, {
            fields: ['nit', 'nombre', 'apellidos', 'correo', 'direccion', 'idtelefono', 'estado', 'observaciones', 'idtipocliente'],
            individualHooks: true
        })

        res.status(201).send({ nuevoCliente });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }

};

const actualizarCliente = async (req, res) => {
    const { idcliente } = req.params;

    try {
        const cliente = await tblclientes.findByPk(idcliente);

        if (!cliente) {
            return res.status(400).send({ mensaje: 'Cliente no encontrado.' })
        }
        const existeCliente = await tblclientes.findOne({
            where: {
                nit: req.body.nit,
                correo: req.body.correo,
                idcliente: { [Op.ne]: idcliente }
            }
        })

        if (existeCliente) {
            return res.status(400).send({ mensaje: 'Ya has registrado a este cliente' });
        }

        await cliente.update(req.body);

        res.status(200).send({ mensaje: 'Cliente actualizado con éxito' });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error interno del servidor.', error: error.message });
    }
};

const eliminarCliente = async (req, res) => {
    const { idcliente } = req.params;

    try {
        await tblclientes.destroy({
            where: { idcliente: idcliente }
        });

        res.status(200).send({ mensaje: 'Cliente eliminado definitivamente con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

const cambiarEstadoCliente = async (req, res) => {
    try {
        const { idcliente } = req.params;
        const cliente = await tblclientes.findOne({ where: { idcliente: idcliente } });
        cliente.estado = !cliente.estado;
        await cliente.save();

        res.send({ mensaje: 'Estado del cliente actualizado con éxito.', cliente });
    } catch (error) {
        res.status(500).send({ mensaje: error.message });
    }
};

module.exports = {
    mostrarClientes, crearClientes, actualizarCliente, eliminarCliente, cambiarEstadoCliente
};
