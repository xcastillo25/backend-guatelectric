const {viewmapeo} = require('../models');
const Sequelize = require('sequelize');

const mostrarViewMapeo = async (req, res) => {
    try {
        const mapeos = await viewmapeo.findAll({
            attributes: {
                include: [
                    // Convierte la columna de ubicación de tipo geométrico a texto
                    [Sequelize.literal("ubicacion.STAsText()"), 'ubicacion']
                ]
            }
        });
        const viewmapeoTransformados = mapeos.map(mapeo => {
            const plainViewMapeo = mapeo.get({ plain: true });
            plainViewMapeo.ubicacion = plainViewMapeo.ubicacion || "No definido"; // Asegurar que haya un valor por defecto si es null
            return plainViewMapeo;
        });
        res.status(200).send({ Mapeo: viewmapeoTransformados });
    } catch (error) {
        console.error('Error al obtener el ampeo:', error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

const buscarMapeoPorCodigo = async (req, res) => {
    try {
        const codigo = req.params.codigo;  // Obtener el código de los parámetros de la URL

        if (!codigo) {
            return res.status(400).send({ message: 'El código es requerido para la búsqueda.' });
        }

        const resultado = await viewmapeo.findAll({
            where: {
                codigo: codigo  // Filtrar por el código proporcionado
            },
            attributes: ['idmedidor', 'nombre_completo', 'nombre', 'apellidos', 'direccion', 'serie', 'codigo', 
                        'ubicacion', 'idcliente', 'idtipomedidor', 'tipomedidor', 'tarifa', 'alumbradopublico',
                        'cargofijo']
        });

        if (resultado.length === 0) {
            return res.status(404).send({ message: 'No se encontraron registros con el código proporcionado.' });
        }

        res.status(200).send({ resultados: resultado });
    } catch (error) {
        console.error('Error en la búsqueda por código:', error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    mostrarViewMapeo, buscarMapeoPorCodigo
}
