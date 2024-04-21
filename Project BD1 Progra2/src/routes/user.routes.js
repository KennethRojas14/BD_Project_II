// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { root, CheckloginUser, loginUser, logoutCapture } = require('../controllers/user.controller');

const userRouter = Router();

userRouter.get('/', root)

userRouter.get('/login', loginUser)

userRouter.post('/login', CheckloginUser)

userRouter.post('/logout', logoutCapture)

module.exports = { userRouter };