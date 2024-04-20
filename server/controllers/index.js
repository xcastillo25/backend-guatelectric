const empresas = require('./empresas');
const empleados = require('./empleados');
const photos = require('./photos');
const usuarios = require('./usuarios');
const roles = require('./roles');
const login = require('./login');
const tipocliente = require('./tipocliente');
const telefono = require('./telefonos');
const clientes = require('./cliente');
const tipomedidor = require('./tipomedidor');
const medidor = require('./medidor');
const mapeo = require('./viewmapeo');
const consumos = require('./consumos');
const viewfacturas = require('./viewfacturas');

module.exports = {
    empresas, empleados, photos, usuarios, roles, login,
    tipocliente, telefono, clientes, tipomedidor, medidor,
    mapeo, consumos, viewfacturas
}