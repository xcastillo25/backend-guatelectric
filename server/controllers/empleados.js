const { tblempleados }  = require('../models');
const { Op } = require('sequelize');

const mostrarEmpleados = async (req, res) => {
    try {
        const empleados = await tblempleados.findAll();
        res.status(200).send({ Empleados: empleados });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const mostrarEmpleadosActivos = async (req, res) => {
    try {
        const empleados = await tblempleados.findAll({
            where: {
                activo: true
            }
        });
        res.status(200).send({ Empleados: empleados });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearEmpleado = async (req, res) => {
    try {
        const existeEmpleado = await tblempleados.findOne({
            where: { cui: req.body.cui, email: req.body.email }
        });

        if (existeEmpleado) {
            return res.status(400).send({ message: 'Ya has registrado a  este empleado'})
        }

        const nuevoEmpleado = await tblempleados.create(req.body, { 
            fields: ['nombre', 'apellidos', 'telefono', 'nit', 'cui', 'foto', 'email', 'idempresa', 'activo'], 
            individualHooks: true 
        });
        
        res.status(201).send({ nuevoEmpleado });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor',  error: error.message });
    }
};

const actualizarEmpleado = async (req, res) => {
    const { idempleado } = req.params;

    try {
        const empleado = await tblempleados.findByPk(idempleado);

        if (!empleado) {
            return res.status(404).send({ message: 'Empleado no encontrado.' });
        }

        // Verifica si ya existe otro empleado con el mismo CUI y correo
        const existeEmpleado = await tblempleados.findOne({
            where: {
                cui: req.body.cui,
                email: req.body.email,
                idempleado: { [Op.ne]: idempleado } // Excluye el empleado actual
            }
        });

        if (existeEmpleado) {
            return res.status(400).send({ message: 'Ya has registrado a este empleado' });
        }

        // Actualiza el empleado con los datos proporcionados en el cuerpo de la solicitud
        await empleado.update(req.body);

        res.status(200).send({ message: 'Empleado actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};


const eliminarEmpleado = async (req, res) => {
    const { idempleado } = req.params;

    try{
        await tblempleados.destroy({
            where: { idempleado: idempleado}
        });

        res.status(200).send({ message: 'Empleado eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoEmpleado = async (req, res) => { 
    try{
        const { idempleado } = req.params;
        const empleado = await tblempleados.findOne({ where: {idempleado: idempleado}});

        empleado.activo = !empleado.activo;

        await empleado.save();

        res.send({ message: 'Estado del empleado actualizado con éxito.', empleado});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};

module.exports = {
    mostrarEmpleados, mostrarEmpleadosActivos,
    crearEmpleado, actualizarEmpleado, eliminarEmpleado,
    cambiarEstadoEmpleado
};
