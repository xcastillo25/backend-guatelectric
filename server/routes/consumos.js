const consumosController = require('../controllers').consumos;

module.exports = (app) => {
    app.post('/api/consumos', consumosController.crearConsumos);
    app.get('/api/ultimo-consumo/:idmedidor', consumosController.obtenerUltimoConsumo);
}