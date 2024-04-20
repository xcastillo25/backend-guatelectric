const usuariosController = require('../controllers').usuarios;

module.exports = (app) => {
    app.get('/api/usuarios/:idempleado', usuariosController.mostrarUsuarios);
    app.get('/api/usuarios-activos', usuariosController.mostrarUsuariosActivos);
    app.post('/api/usuarios', usuariosController.crearUsuario);
    app.put('/api/usuarios/:idusuario', usuariosController.actualizarUsuario);
    app.delete('/api/usuarios/:idusuario', usuariosController.eliminarUsuario);
    app.put('/api/estado-usuarios/:idusuario', usuariosController.cambiarEstadoUsuario);
};
