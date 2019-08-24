const routes = require('express').Router();
const users = require ('./registration/user_routes');
var testRouter = require('./test');

var verifyRouter = require('./Verification/verify');

routes.use('/users', users);
routes.use('/test', testRouter );
routes.use('/verify', verifyRouter);

module.exports = routes;
