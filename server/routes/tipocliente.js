const tclientesController = require('../controllers').tipocliente;

module.exports = (app) => {
    app.get('/api/tipoclientes', tclientesController.mostrarTipoClientes);
    app.get('/api/tipoclientes-activos', tclientesController.mostrarTipoClientesActivos);
    app.post('/api/tipoclientes', tclientesController.crearTipoClientes);
    app.put('/api/tipoclientes/:idtipocliente', tclientesController.actualizarTipoClientes);
    app.delete('/api/tipoclientes/:idtipocliente', tclientesController.eliminarTipoClientes);
    app.put('/api/estado-tipoclientes/:idtipocliente', tclientesController.cambiarEstadoTipoClientes);
}