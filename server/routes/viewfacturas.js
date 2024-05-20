const viewfacturaController = require('../controllers').viewfacturas;

module.exports = (app) => {
    app.get('/api/viewfacturas', viewfacturaController.mostrarFacturas);
    app.get('/api/viewfacturas/:idfactura', viewfacturaController.imprimirFactura);
    app.post('/api/viewfacturas/enviar/:idfactura', viewfacturaController.generarYEnviarFactura);
}