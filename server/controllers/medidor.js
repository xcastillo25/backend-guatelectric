const { sequelize } = require('../models'); 
const {tblmedidores} = require('../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const mostrarMedidores = async (req, res) => {
    try {
        const medidores = await tblmedidores.findAll({
            attributes: {
                include: [
                    // Convierte la columna de ubicación de tipo geométrico a texto
                    [Sequelize.literal("ubicacion.STAsText()"), 'ubicacion']
                ]
            }
        });
        const medidoresTransformados = medidores.map(medidor => {
            const plainMedidor = medidor.get({ plain: true });
            plainMedidor.ubicacion = plainMedidor.ubicacion || "No definido"; // Asegurar que haya un valor por defecto si es null
            return plainMedidor;
        });
        res.status(200).send({ Medidores: medidoresTransformados });
    } catch (error) {
        console.error('Error al obtener medidores:', error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};


const crearMedidores = async (req, res) => {
    try {
        
        const { serie, codigo, ubicacion, estado, idtipomedidor, idcliente, direccion } = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!serie || !codigo || !ubicacion || !estado || !idtipomedidor || !idcliente || !direccion) {
            return res.status(400).send({ message: 'Todos los campos son necesarios' });
        }

        // Buscar si ya existe un medidor con la misma serie
        const existeMedidor = await tblmedidores.findOne({ where: { codigo } });
        if (existeMedidor) {
            return res.status(400).send({ message: 'Este medidor ya está registrado' });
        }

        // Debug: Imprime el WKT que será insertado
        console.log("Inserting with WKT:", ubicacion);

        // Crear el nuevo medidor
        const nuevoMedidor = await tblmedidores.create({
            serie,
            codigo,
            ubicacion: sequelize.fn('geometry::STGeomFromText', sequelize.literal(`'${ubicacion}'`), 4326),
            estado,
            idtipomedidor,
            idcliente,
            direccion
        });

        res.status(201).send({ message: 'Medidor creado con éxito', data: nuevoMedidor });
    } catch (error) {
        console.error('Error al crear medidor:', error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

const actualizarMedidor = async (req, res) => {
    const { idmedidor } = req.params;

    try {
        const medidor = await tblmedidores.findByPk(idmedidor);

        if (!medidor) {
            return res.status(404).send({ message: 'Medidor no encontrado.' });
        }

        const { serie, codigo, ubicacion, estado, idtipomedidor, idcliente, direccion } = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!serie || !codigo || !ubicacion || !estado || !idtipomedidor || !idcliente || !direccion) {
            return res.status(400).send({ message: 'Todos los campos son necesarios para la actualización.' });
        }

        // Comprobar si hay un nuevo código y si ya está en uso por otro medidor diferente
        if (codigo !== medidor.codigo) {
            const existeMedidor = await tblmedidores.findOne({
                where: {
                    codigo,
                    idmedidor: { [Op.ne]: idmedidor }  // Excluir el propio medidor en la búsqueda
                }
            });

            if (existeMedidor) {
                return res.status(400).send({ message: 'Otro medidor con el mismo código ya está registrado.' });
            }
        }

        // Preparar datos para la actualización
        const datosActualizados = {
            serie,
            codigo,
            estado,
            idtipomedidor,
            idcliente,
            direccion
        };

        // Actualizar la ubicación si se proporciona nueva, utilizando el formato WKT correcto
        if (ubicacion) {
            datosActualizados.ubicacion = sequelize.fn('geometry::STGeomFromText', sequelize.literal(`'${ubicacion}'`), 4326);
        }

        // Ejecutar la actualización
        await medidor.update(datosActualizados);

        res.status(200).send({ message: 'Medidor actualizado con éxito', data: medidor });
    } catch (error) {
        console.error('Error al actualizar medidor:', error);
        res.status(500).send({ message: 'Error interno del servidor.', error: error.message });
    }
};


const cambiarEstadoMedidor = async (req, res) => {
    try {
        const { idmedidor} = req.params;
        const medidor = await tblmedidores.findOne({ where: {idmedidor: idmedidor}});

        medidor.estado = !medidor.estado;

        await medidor.save();

        res.send({ message: 'Estado del medidor actualizado con éxito.', medidor});
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
}

const eliminarMedidor = async (req, res) => {
    const { idmedidor } = req.params;

    try{
        await tblmedidores.destroy({
            where: { idmedidor: idmedidor }
        });

        res.status(200).send({ message: 'Medidor eliminado definitivamente con éxito'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

module.exports = {
    mostrarMedidores, crearMedidores, actualizarMedidor, cambiarEstadoMedidor, eliminarMedidor
}