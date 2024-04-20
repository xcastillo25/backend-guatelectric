const { tbltipomedidores }  = require('../models');
const { Op } = require('sequelize');

const mostrarTipoMedidores = async (req, res) => {
    try {
        const tipomedidores = await tbltipomedidores.findAll();
        res.status(200).send({ TipoMedidores: tipomedidores });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const mostrarTipoMedidoresActivos = async (req, res) => {
    try {
        const tipomedidores = await tbltipomedidores.findAll({
            where: {
                estado: true
            }
        });
        res.status(200).send({ TipoMedidores: tipomedidores });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearTipoMedidores = async (req, res) => {
    try {
        const existeTMedidor = await tbltipomedidores.findOne({
            where: { tipomedidor: req.body.tipomedidor },
        });

        if (existeTMedidor) {
            return res.status(400).send({ message: 'Ya has registrado este tipo de medidor'})
        }

        const nuevoTMedidor = await tbltipomedidores.create(req.body, { 
            fields: ['tipomedidor', 'tarifa', 'alumbradopublico', 'cargofijo', 'estado',], 
            individualHooks: true 
        });
        
        res.status(201).send({ nuevoTMedidor });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor',  error: error.message });
    }
};

const actualizarTipoMedidores = async (req, res) => {
    const { idtipomedidor } = req.params;

    try {
        const tipomedidor = await tbltipomedidores.findByPk(idtipomedidor);

        if (!tipomedidor) {
            return res.status(404).send({ message: 'Tipo de medidor no encontrado.' });
        }

        

        // Actualiza el empleado con los datos proporcionados en el cuerpo de la solicitud
        await tipomedidor.update(req.body);

        res.status(200).send({ message: 'Tipo de medidor actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};


const eliminarTipoMedidores = async (req, res) => {
    const { idtipomedidor } = req.params;

    try{
        await tbltipomedidores.destroy({
            where: { idtipomedidor: idtipomedidor}
        });

        res.status(200).send({ message: 'Tipo de medidor eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoTipoMedidores = async (req, res) => { 
    try{
        const { idtipomedidor } = req.params;
        const tmedidor = await tbltipomedidores.findOne({ where: {idtipomedidor: idtipomedidor}});

        tmedidor.estado = !tmedidor.estado;

        await tmedidor.save();

        res.send({ message: 'Tipo de medidor actualizado con éxito.', tmedidor});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};

module.exports = {
    mostrarTipoMedidores, mostrarTipoMedidoresActivos,
    crearTipoMedidores, actualizarTipoMedidores, eliminarTipoMedidores,
    cambiarEstadoTipoMedidores
};
