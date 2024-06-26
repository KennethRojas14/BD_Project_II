// Importación del módulo 'express' para la creación de rutas (URLs)
const Router = require('express');
// Importación de funciones desde el controlador employe.controller
const { 
    listOfEmployees
    , addEmployees
    , CheckEmployees
    , confirmDeleteEmployee
    , deleteEmployee
    , updateEmployee
    , commitUpdateEmployee
    , consultEmployee
} = require('../controllers/employee.controller');

const employeeRouter = Router();

employeeRouter.get('/listEmployees', listOfEmployees)

employeeRouter.get('/insertEmployee', addEmployees)

employeeRouter.post('/insertEmployee', CheckEmployees)

employeeRouter.post('/confirmDeleteEmployee', confirmDeleteEmployee)

employeeRouter.post('/deleteEmployee', deleteEmployee)

employeeRouter.get('/updateEmployee/:Id', updateEmployee)

employeeRouter.get('/consultEmployee/:Id', consultEmployee)

employeeRouter.post('/commitUpdateEmployee', commitUpdateEmployee)

employeeRouter.post('/listEmployees', listOfEmployees)

module.exports = { employeeRouter };