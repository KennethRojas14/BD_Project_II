// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { listMovements, addMovement, commitAddMovement } = require('../controllers/movement.controller')

const movementRouter = Router();

movementRouter.get('/listMovements/:Id', listMovements) 

movementRouter.get('/insertMovement/:Id', addMovement) 

movementRouter.post('/insertMovement', commitAddMovement) 


module.exports = { movementRouter };