const medidoresController = require('../controllers').medidor;

module.exports = (app) => {
    app.get('/api/medidores', medidoresController.mostrarMedidores);
    app.post('/api/medidores', medidoresController.crearMedidores); 
    app.put('/api/medidores/:idmedidor', medidoresController.actualizarMedidor); 
    app.put('/api/estado-medidores/:idmedidor', medidoresController.cambiarEstadoMedidor);
    app.delete('/api/medidores/:idmedidor', medidoresController.eliminarMedidor);
}