//En este archivo se hacen las configuraciones de express
const express = require('express')  // Módulo para crear aplicaciones web con Node.js
const cors = require('cors');        // Módulo para habilitar el manejo de solicitudes CORS
const { userRouter } = require('./routes/user.routes')
const { employeeRouter } = require('./routes/employee.routes')
const { movementRouter } = require('./routes/movement.routes')

const port = require('./config');
 
const app = express();


// settings
app.set('port', port);

app.set('view engine', 'ejs');      // Configuración del motor de plantillas a EJS

// middlewares
app.use(express.urlencoded({extended: false})); 
app.use(express.json());

// Configuración de middleware para habilitar solicitudes CORS
app.use(cors());

app.use(userRouter)
app.use(employeeRouter)
app.use(movementRouter)

app.use(express.static('views'))

module.exports = app;