const viewmapeoController = require('../controllers').mapeo;

module.exports = (app) => {
    app.get('/api/viewmapeo', viewmapeoController.mostrarViewMapeo);
    app.get('/api/viewmapeo/:codigo', viewmapeoController.buscarMapeoPorCodigo);
};