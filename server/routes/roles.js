const rolesController = require('../controllers').roles;

module.exports = (app) => {
    app.get('/api/roles', rolesController.mostrarRoles);
    app.get('/api/roles-activos', rolesController.mostrarRolesActivos);
    app.post('/api/roles', rolesController.crearRol);
    app.put('/api/roles/:idrol', rolesController.actualizarRol);
    app.delete('/api/roles/:idrol', rolesController.eliminarRol);
    app.put('/api/estado-roles/:idrol', rolesController.cambiarEstadoRol);
}