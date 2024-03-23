//Importación del módulo 'mssql' para gestionar la conexión con la base de datos SQL Server
import sql from 'mssql'

import {config} from 'dotenv'
config();

export const dbSettings = {
    user : process.env.USER,
    password : process.env.PASSWORD,
    server : process.env.SERVER,
    database : process.env.DATABASE,
    options : {
        encrypt : true,
        trustServerCertificate : true
    }
}

export async function getConnection () {

    try{
        // Conectar al servidor de base de datos utilizando la configuración para Kenneth ó Jorge
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch(error) {
        console.error(error);
    }
}

export { sql };