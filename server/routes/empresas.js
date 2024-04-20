const empresasController = require('../controllers').empresas;

module.exports = (app) => {
    app.get('/api/empresas', empresasController.mostrarEmpresas);
}