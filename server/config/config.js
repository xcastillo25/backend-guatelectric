const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mssql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
                trustServerCertificate: true,
            },
            options: {
              trustedConnection: true  // Utiliza autenticación de Windows
          }
        }
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mssql',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
            trustServerCertificate: true,
          },
        },
      },
token_secret: process.env.TOKEN_SECRET,
}