const { tbltelefonos }  = require('../models');
const { Op } = require('sequelize');

const mostrarTelefonos = async (req, res) => {
    try {
        const telefonos = await tbltelefonos.findAll();
        res.status(200).send({ Telefonos: telefonos });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const mostrarTelefonosActivos = async (req, res) => {
    try {
        const telefonos = await tbltelefonos.findAll({
            where: {
                activo: true
            }
        });
        res.status(200).send({ Telefonos: telefonos });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearTelefono = async (req, res) => {
    try {
        const existeTelefono = await tbltelefonos.findOne({
            where: { telefono: req.body.telefono }
        });

        if (existeTelefono) {
            return res.status(400).send({ message: 'Ya has registrado este teléfono'})
        }

        const nuevoTelefono = await tbltelefonos.create(req.body, { 
            fields: ['telefono', 'estado'], 
            individualHooks: true 
        });
        
        res.status(201).send({ nuevoTelefono });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor',  error: error.message });
    }
};

const actualizarTelefono = async (req, res) => {
    const { idtelefono } = req.params;

    try {
        const telefono = await tbltelefonos.findByPk(idtelefono);

        if (!telefono) {
            return res.status(404).send({ message: 'Teléfono no encontrado.' });
        }

        // Verifica si ya existe otro empleado con el mismo CUI y correo
        const existeTelefono = await tbltelefonos.findOne({
            where: {
                telefono: req.body.telefono
            }
        });

        if (existeTelefono) {
            return res.status(400).send({ message: 'Ya has registrado este teléfono' });
        }

        // Actualiza el empleado con los datos proporcionados en el cuerpo de la solicitud
        await telefono.update(req.body);

        res.status(200).send({ message: 'Teléfono actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Eror interno del servidor', error: error.message });
    }
};


const eliminarTelefono = async (req, res) => {
    const { idtelefono } = req.params;

    try{
        await tbltelefonos.destroy({
            where: { idtelefono: idtelefono}
        });

        res.status(200).send({ message: 'Teléfono eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoTelefono = async (req, res) => { 
    try{
        const { idtelefono } = req.params;
        const telefono = await tbltelefonos.findOne({ where: {idtelefono: idtelefono}});

        telefono.estado = !telefono.estado;

        await telefono.save();

        res.send({ message: 'Teléfono actualizado con éxito.', telefono});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};

module.exports = {
    mostrarTelefonos, mostrarTelefonosActivos,
    crearTelefono, actualizarTelefono, eliminarTelefono,
    cambiarEstadoTelefono
};
