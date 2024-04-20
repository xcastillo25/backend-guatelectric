const empleadosController = require('../controllers').empleados;

module.exports = (app) => {
    app.get('/api/empleados', empleadosController.mostrarEmpleados);
    app.get('/api/empleados-activos', empleadosController.mostrarEmpleadosActivos);
    app.post('/api/empleados', empleadosController.crearEmpleado);
    app.put('/api/empleados/:idempleado', empleadosController.actualizarEmpleado);
    app.delete('/api/empleados/:idempleado', empleadosController.eliminarEmpleado);
    app.put('/api/estado-empleados/:idempleado', empleadosController.cambiarEstadoEmpleado);
}