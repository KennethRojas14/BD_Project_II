//En este archivo se hacen las configuraciones de express
import express from 'express'; 
import config from './config';
 
const app = express();

// settings
app.set('port', config.port);

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

export default app;