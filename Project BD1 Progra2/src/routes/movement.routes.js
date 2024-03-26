// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { listMovements, addMovements } = require('../controllers/movement.controller')

const movementRouter = Router();

movementRouter.get('/listMovements/:Id', listMovements) 

movementRouter.get('/insertMovement/:Id', addMovements) 

module.exports = { movementRouter };