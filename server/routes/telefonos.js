const telefonosController = require('../controllers').telefono;

module.exports = (app) => {
    app.get('/api/telefonos', telefonosController.mostrarTelefonos);
    app.get('/api/telefonos-activos', telefonosController.mostrarTelefonosActivos);
    app.post('/api/telefonos', telefonosController.crearTelefono);
    app.put('/api/telefonos/:idtelefono', telefonosController.actualizarTelefono);
    app.delete('/api/telefonos/:idtelefono', telefonosController.eliminarTelefono);
    app.put('/api/estado-telefonos/:idtelefono', telefonosController.cambiarEstadoTelefono);
}