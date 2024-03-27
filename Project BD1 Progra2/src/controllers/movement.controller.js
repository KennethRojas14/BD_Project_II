const { getConnection } = require("../database/connection"); 

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
const addMovements = (req, res) => {
    const Id = req.params.Id;
    console.log("Agregando movimiento al empleado:", Id);
    res.render("insertMovement");
};

module.exports = { listMovements, addMovements }