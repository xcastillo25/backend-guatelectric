const tmedidoresController = require('../controllers').tipomedidor;

module.exports = (app) => {
    app.get('/api/tipomedidores', tmedidoresController.mostrarTipoMedidores);
    app.get('/api/tipomedidores-activos', tmedidoresController.mostrarTipoMedidoresActivos);
    app.post('/api/tipomedidores', tmedidoresController.crearTipoMedidores);
    app.put('/api/tipomedidores/:idtipomedidor', tmedidoresController.actualizarTipoMedidores);
    app.delete('/api/tipomedidores/:idtipomedidor', tmedidoresController.eliminarTipoMedidores);
    app.put('/api/estado-tipomedidores/:idtipomedidor', tmedidoresController.cambiarEstadoTipoMedidores);
}