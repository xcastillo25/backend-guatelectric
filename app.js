require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err && err.status === 413) {
        res.status(413).send({ error: 'PayloadTooLargeError', message: 'El tamaño de la carga útil de la solicitud es demasiado grande.' });
    } else {
        next();
    }
});

// Cabeceras CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

//ESPACIO PARA LAS SOLICITUDES
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Bienvenido a Geoproyectos' });
});
//

require('./server/routes/empresas')(app);
require('./server/routes/empleados')(app);
require('./server/routes/photos')(app);
require('./server/routes/usuarios')(app);
require('./server/routes/roles')(app);
require('./server/routes/login')(app);
require('./server/routes/tipocliente')(app);
require('./server/routes/telefonos')(app);
require('./server/routes/cliente')(app);
require('./server/routes/tipomedidor')(app);
require('./server/routes/medidor')(app);
require('./server/routes/viewmapeo')(app);
require('./server/routes/consumos')(app);
require('./server/routes/viewfacturas')(app);

app.get('*', (req, res) => {
    res.status(200).send({ message: 'Bienvenido' });
});

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.send();
});

module.exports = app;
