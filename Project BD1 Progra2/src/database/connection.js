//Importación del módulo 'mssql' para gestionar la conexión con la base de datos SQL Server
const sql = require('mssql')
require('dotenv').config();

const dbSettings = {
    user : process.env.USER,
    password : process.env.PASSWORD,
    server : process.env.SERVER,
    database : process.env.DATABASE,
    options : {
        encrypt : true,
        trustServerCertificate : true
    }
}

async function getConnection () {
    try{
        // Conectar al servidor de base de datos utilizando la configuración para Kenneth ó Jorge
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch(error) {
        console.error(error);
    }
}

module.exports = {getConnection}