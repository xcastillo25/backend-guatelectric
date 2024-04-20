const { tbltipoclientes }  = require('../models');
const { Op } = require('sequelize');

const mostrarTipoClientes = async (req, res) => {
    try {
        const tipoclientes = await tbltipoclientes.findAll();
        res.status(200).send({ TipoClientes: tipoclientes });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const mostrarTipoClientesActivos = async (req, res) => {
    try {
        const tipoclientes = await tbltipoclientes.findAll({
            where: {
                estado: true
            }
        });
        res.status(200).send({ TipoClientes: tipoclientes });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearTipoClientes = async (req, res) => {
    try {
        const existeTCliente = await tbltipoclientes.findOne({
            where: { tipocliente: req.body.tipocliente },
        });

        if (existeTCliente) {
            return res.status(400).send({ message: 'Ya has registrado este tipo de cliente'})
        }

        const nuevoTCliente = await tbltipoclientes.create(req.body, { 
            fields: ['tipocliente', 'estado'], 
            individualHooks: true 
        });
        
        res.status(201).send({ nuevoTCliente });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor',  error: error.message });
    }
};

const actualizarTipoClientes = async (req, res) => {
    const { idtipocliente } = req.params;

    try {
        const tipocliente = await tbltipoclientes.findByPk(idtipocliente);

        if (!tipocliente) {
            return res.status(404).send({ message: 'Tipo de cliente no encontrado.' });
        }

        // Verifica si ya existe otro empleado con el mismo CUI y correo
        const existeTCliente = await tbltipoclientes.findOne({
            where: {
                tipocliente: req.body.tipocliente
            }
        });

        if (existeTCliente) {
            return res.status(400).send({ message: 'Ya has registrado este tipo de cliente' });
        }

        // Actualiza el empleado con los datos proporcionados en el cuerpo de la solicitud
        await tipocliente.update(req.body);

        res.status(200).send({ message: 'Tipo de cliente actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};


const eliminarTipoClientes = async (req, res) => {
    const { idtipocliente } = req.params;

    try{
        await tbltipoclientes.destroy({
            where: { idtipocliente: idtipocliente}
        });

        res.status(200).send({ message: 'Tipo de cliente eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoTipoClientes = async (req, res) => { 
    try{
        const { idtipocliente } = req.params;
        const tcliente = await tbltipoclientes.findOne({ where: {idtipocliente: idtipocliente}});

        tcliente.estado = !tcliente.estado;

        await tcliente.save();

        res.send({ message: 'Tipo de cliente actualizado con éxito.', tcliente});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};

module.exports = {
    mostrarTipoClientes, mostrarTipoClientesActivos,
    crearTipoClientes, actualizarTipoClientes, eliminarTipoClientes,
    cambiarEstadoTipoClientes
};
