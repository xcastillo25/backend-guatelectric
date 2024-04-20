const { tblempresas }  = require('../models');

const mostrarEmpresas = async (req, res) => {
    try {
        const empresas = await tblempresas.findAll();
        if (empresas.length > 0) {
            const primerEmpresa = empresas[0];
            res.status(200).send({ Empresa: primerEmpresa });
        } else {
            res.status(404).send({ message: 'No se encontraron empresas.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error interno del servidor', error: error.message });
    }
}


module.exports = {
    mostrarEmpresas
};
