const { tblroles }  = require('../models');
const { Op } = require('sequelize');

const mostrarRoles = async (req, res) => {
    try {
        const roles = await tblroles.findAll();
        res.status(200).send({ Roles: roles });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const mostrarRolesActivos = async (req, res) => {
    try {
        const roles = await tblroles.findAll({
            where: {
                activo: true
            }
        });
        res.status(200).send({ Roles: roles });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearRol = async (req, res) => {
    try {
        const existeRol = await tblroles.findOne({
            where: { rol: req.body.rol }
        });

        if (existeRol) {
            return res.status(400).send({ message: 'Ya has registrado este rol'})
        }

        const nuevoRol = await tblroles.create(req.body, { 
            fields: ['rol', 'activo'], 
            individualHooks: true 
        });
        
        res.status(201).send({ nuevoRol });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor',  error: error.message });
    }
};

const actualizarRol = async (req, res) => {
    const { idrol } = req.params;

    try {
        const rol = await tblroles.findByPk(idrol);

        if (!rol) {
            return res.status(404).send({ message: 'Rol no encontrado.' });
        }

        // Verifica si ya existe otro empleado con el mismo CUI y correo
        const existeRol = await tblroles.findOne({
            where: {
                rol: req.body.rol
            }
        });

        if (existeRol) {
            return res.status(400).send({ message: 'Ya has registrado este rol' });
        }

        // Actualiza el empleado con los datos proporcionados en el cuerpo de la solicitud
        await rol.update(req.body);

        res.status(200).send({ message: 'Rol actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Rol interno del servidor', error: error.message });
    }
};


const eliminarRol = async (req, res) => {
    const { idrol } = req.params;

    try{
        await tblroles.destroy({
            where: { idrol: idrol}
        });

        res.status(200).send({ message: 'Rol eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoRol = async (req, res) => { 
    try{
        const { idrol } = req.params;
        const rol = await tblroles.findOne({ where: {idrol: idrol}});

        rol.activo = !rol.activo;

        await rol.save();

        res.send({ message: 'Rol del empleado actualizado con éxito.', rol});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};

module.exports = {
    mostrarRoles, mostrarRolesActivos,
    crearRol, actualizarRol, eliminarRol,
    cambiarEstadoRol
};
