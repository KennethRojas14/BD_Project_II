//Importación del módulo 'mssql' para gestionar la conexión con la base de datos SQL Server
import sql from 'mssql'

export const dbSettings = {
    user : 'Ejemplo',
    password : 'Ejemplo123',
    server : 'Ejemplo',
    database : 'Ejemplo',
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