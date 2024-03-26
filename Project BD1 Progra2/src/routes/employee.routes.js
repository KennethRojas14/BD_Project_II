// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { 
    listOfEmployees
    , addEmployees
    , deleteEmployee
    , updateEmployee
    , consultEmployee 
} = require('../controllers/employee.controller');

const employeeRouter = Router();

employeeRouter.get('/listEmployees', listOfEmployees)

employeeRouter.get('/insertEmployee', addEmployees)

employeeRouter.get('/deleteEmployee/:Id', deleteEmployee)

employeeRouter.get('/updateEmployee/:Id', updateEmployee)

employeeRouter.get('/consultEmployee/:Id', consultEmployee)


module.exports = { employeeRouter };