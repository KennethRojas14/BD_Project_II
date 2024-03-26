const { getConnection } = require("../database/connection"); 

//Cargar la vista "listEmployees"
const listOfEmployees = async (req, res) => {
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado consultEmployees
    const employees_ = await pool
      .request()
      .output("OutResulTCode", 0)
      .execute("consultEmployees");
    const resOut = employees_.output.OutResulTCode;
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (resOut == 0) {
      // Renderizar la vista "listEmployees" con los datos obtenidos de la consulta
      res.render("listEmployees", { employees: employees_.recordset });
    } else {
      // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
      console.log("Variable salida:", employees_.output.outResulTCode);
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500);
    res.send(error.message);
  }
};

//Cargar la vista "insertEmployee"
const addEmployees = (req, res) => {
  //Carga la vista "insertEmployee"
  res.render("insertEmployee");
};

//Cargar la vista "deleteEmployee"
const deleteEmployee = (req, res) => {
  const Id = req.params.Id;
  console.log("Eliminando empleado:", Id);
  res.render("deleteEmployee");
};

//Cargar la vista "updateEmployee"
const updateEmployee = (req, res) => {
  const Id = req.params.Id;
  console.log("Editando empleado:", Id);
  res.render("updateEmployee");
};

//Cargar la vista "consultEmployee"
const consultEmployee = (req, res) => {
  const Id = req.params.Id;
  console.log("consultando empleado:", Id);
  res.render("consultEmployee");
};

module.exports = {
  listOfEmployees,
  addEmployees,
  deleteEmployee,
  updateEmployee,
  consultEmployee,
};
