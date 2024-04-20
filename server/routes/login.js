const loginController = require('../controllers').login;
//const md_auth=require('../authenticated/authenticated');

module.exports = (app) => {
    app.post('/api/login', loginController.login);
};