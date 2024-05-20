#!/usr/bin/env node

const http = require('http');
const app = require('../app'); // Ajusta el camino si tu archivo principal no se llama 'app.js'
const fs = require('fs');

const port = normalizePort(process.env.PORT || '8020');
app.set('port', port);

const httpServer = http.createServer(app);
httpServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTP Server running on http://0.0.0.0:${port}/`);
});

httpServer.on('error', onError);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
