const { tblusuarios }  = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const mostrarUsuarios = async (req, res) => {
    const { idempleado } = req.params;
    try {
        const usuarios = await tblusuarios.findAll({
            where: {
                idempleado: idempleado
            }
        });
        res.status(200).send({ Usuarios: usuarios });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

const mostrarUsuariosActivos = async (req, res) => {
    try {
        const usuarios = await tblusuarios.findAll({
            where: {
                activo: true
            }
        });
        res.status(200).send({ Usuarios: usuarios });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}

const crearUsuario = async (req, res) => {
    try {
        const { idempleado, usuario, password, activo, idrol } = req.body;

        // Verificar si el empleado ya tiene un usuario
        const existeUsuarioEmpleado = await tblusuarios.findOne({
            where: { idempleado: idempleado }
        });

        if (existeUsuarioEmpleado) {
            return res.status(400).send({ message: 'Este empleado ya cuenta con un usuario.' });
        }

        // Verificar si el nombre de usuario ya está en uso
        const existeUsuario = await tblusuarios.findOne({
            where: { usuario: usuario }
        });

        if (existeUsuario) {
            return res.status(400).send({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar el password antes de guardarlo en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario asociado al empleado
        const nuevoUsuario = await tblusuarios.create({
            idempleado: idempleado,
            usuario: usuario,
            password: hashedPassword,
            activo: activo,
            idrol: idrol
        });

        res.status(201).send({ nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    const { idusuario } = req.params;

    try {
        const usuario = await tblusuarios.findByPk(idusuario);

        if (!usuario) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        // Verifica si ya existe otro usuario con el mismo correo
        const existeUsuario = await tblusuarios.findOne({
            where: {
                usuario: req.body.usuario,
                idusuario: { [Op.ne]: idusuario } // Excluye el usuario actual
            }
        });

        if (existeUsuario) {
            return res.status(400).send({ message: 'Ya has registrado a este usuario' });
        }

        // Actualiza el usuario con los datos proporcionados en el cuerpo de la solicitud
        await usuario.update(req.body);

        res.status(200).send({ message: 'Usuario actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
};


const eliminarUsuario = async (req, res) => {
    const { idusuario } = req.params;

    try{
        await tblusuarios.destroy({
            where: { idusuario: idusuario}
        });

        res.status(200).send({ message: 'Usuario eliminado definitivamente con éxito.'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error interno del servidor', error: error.message})
    }
}

const cambiarEstadoUsuario = async (req, res) => { 
    try{
        const { idusuario } = req.params;
        const usuario = await tblusuarios.findOne({ where: {idusuario: idusuario}});

        usuario.activo = !usuario.activo;

        await usuario.save();

        res.send({ message: 'Estado del usuario actualizado con éxito.', usuario});
    } catch(error){
        res.status(500).send({ message: error.message});
    }
};


module.exports = {
    mostrarUsuarios, mostrarUsuariosActivos,
    crearUsuario, actualizarUsuario, eliminarUsuario,
    cambiarEstadoUsuario
};
