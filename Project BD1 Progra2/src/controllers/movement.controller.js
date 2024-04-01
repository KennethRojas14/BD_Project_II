const { getConnection } = require("../database/connection");  
const ip = require('ip');


//Cargar la vista "listMovements"
const listMovements = async (req, res) => {
    const InIdEmployee = req.params.Id; 
    try {
        // Obtener una conexión desde el pool de conexiones
        const pool = await getConnection();
        // Llamar al procedimiento almacenado consultEmployee
        const employee_ = await pool
          .request()
          .input("InIdEmployee", InIdEmployee)
          .output("OutResulTCode", 0)
          .execute("consultEmployee"); 
        // Llamar al procedimiento almacenado consultMovements
        const movements_= await pool
          .request()
          .input("InIdEmployee", InIdEmployee)
          .output("OutResulTCode", 0)
          .execute("consultMovements"); 
        // Verificar si el procedimiento almacenado se ejecutó correctamente
        if (employee_.output.OutResulTCode == 0 && movements_.output.OutResulTCode == 0) {
          // Renderizar la vista "listEmployees" con los datos obtenidos de la consulta 
          res.render("listMovements", { 
            employee: employee_.recordset[0]
            , movements: movements_.recordset 
          });
        } else {
          // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
          console.log("Variable salida:", employee_.output.outResulTCode);
        }
        // Cerrar la conexión al pool
        pool.close();
      } catch (error) {
        // Manejar errores internos del servidor
        res.status(500);
        res.send(error.message);
      } 
};

//Cargar la vista "insertMovement"
const addMovement = async (req, res) => { 
  const IdEmployee = req.params.Id; 
  try {
      // Obtener una conexión desde el pool de conexiones
      const pool = await getConnection();
      // Llamar al procedimiento almacenado consultEmployee
      const employee_ = await pool
        .request()
        .input("InIdEmployee", IdEmployee)
        .output("OutResulTCode", 0)
        .execute("consultEmployee");
      // Llamar al procedimiento almacenado consultTypeMovements
      const movements_ = await pool
        .request() 
        .output("OutResulTCode", 0)
        .execute("consultTypeMovements");
      // Verificar si el procedimiento almacenado se ejecutó correctamente
      if (employee_.output.OutResulTCode == 0 && movements_.output.OutResulTCode == 0) {
        // Renderizar la vista "listEmployees" con los datos obtenidos de la consulta  
        res.render("insertMovement", { 
          employee: employee_.recordset[0] 
          , movements : movements_.recordset
        });
      } else {
        // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
        console.log("Variable salida:", employee_.output.outResulTCode);
      }
      // Cerrar la conexión al pool
      pool.close();
    } catch (error) {
      // Manejar errores internos del servidor
      res.status(500);
      res.send(error.message);
    } 
};

const commitAddMovement = async (req, res) => {
  const IdEmployee = req.body.IdEmpleado;
  const Monto = req.body.Monto
  const TypeName = req.body.TypeMovement
  const TemporalUserName = 'UsuarioScripts'
  // Se obtiene la dirección IP del cliente
  const clientIP = ip.address(); 
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado insertMovement
    const insertMovement= await pool
      .request()
      .input("InIdEmployee", IdEmployee)
      .input("InMovementTypeName", TypeName)
      .input("InUserName", TemporalUserName)
      .input("InIP", clientIP)
      .input("InAmount", Monto)
      .output("OutResulTCode", 0)
      .execute("insertMovement"); 
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (insertMovement.output.OutResulTCode == 0) {
      // Redoreción a la vista "listMovements" con los datos obtenidos de la consulta  
      res.redirect('/listMovements/'+IdEmployee);
    } else {
      // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
      console.log("Variable salida:", insertMovement);
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500);
    res.send(error.message);
  } 
} 

module.exports = { listMovements, addMovement, commitAddMovement }