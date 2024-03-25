// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { root, loging } = require('../controllers/user.controller');

const userRouter = Router();

userRouter.get('/', root)

userRouter.get('/login', loging)

module.exports = { userRouter };