// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { 
    listOfEmployees
    , addEmployees
    , confirmDeleteEmployee
    , deleteEmployee
    , updateEmployee
    , commitUpdateEmployee
    , consultEmployee
} = require('../controllers/employee.controller');

const employeeRouter = Router();

employeeRouter.get('/listEmployees', listOfEmployees)

employeeRouter.get('/insertEmployee', addEmployees)

employeeRouter.post('/confirmDeleteEmployee', confirmDeleteEmployee)

employeeRouter.post('/deleteEmployee', deleteEmployee)

employeeRouter.get('/updateEmployee/:Id', updateEmployee)

employeeRouter.post('/commitUpdateEmployee', commitUpdateEmployee)

employeeRouter.get('/consultEmployee/:Id', consultEmployee)

module.exports = { employeeRouter };