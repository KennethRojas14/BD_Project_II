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
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (employees_.output.OutResulTCode == 0) {
      // Renderizar la vista "listEmployees" con los datos obtenidos de la consulta 
      res.render("listEmployees", { employees: employees_.recordset, alertVisibility: false });
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

//Se despliega la alerta para confirmar eliminacion de empleado
const confirmDeleteEmployee = async (req, res) => {
  const IdEmployee = req.body.IdEmpleado;
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado consultEmployees
    const employees_ = await pool
      .request()
      .output("OutResulTCode", 0)
      .execute("consultEmployees");
    // Llamar al procedimiento almacenado consultEmployee
    const employee_ = await pool
      .request()
      .input("InIdEmployee", IdEmployee)
      .output("OutResulTCode", 0)
      .execute("consultEmployee");
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (employees_.output.OutResulTCode == 0 && employee_.output.OutResulTCode == 0) {
      // Renderizar la vista "listEmployees" con los datos obtenidos de las consultas 
      res.render("listEmployees", {
        employees: employees_.recordset
        , alertVisibility: true
        , employee: employee_.recordset[0]
      });
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

//Se elimina un empleado de forma lógica en la base de datos
const deleteEmployee = async (req, res) => {
  const IdEmployee = req.body.IdEmpleado;
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado logicalDeleteEmployee
    const employee_ = await pool
      .request()
      .input("InIdEmployee", IdEmployee)
      .output("OutResulTCode", 0)
      .execute("logicalDeleteEmployee");
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (employee_.output.OutResulTCode == 0) {
      // Redireccion a la vista "listEmployees" 
      res.redirect("listEmployees");
    } else {
      // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
      console.log("Variable salida:", employee_.output);
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500);
    res.send(error.message);
  }
}

//Cargar la vista "updateEmployee"
const updateEmployee = async (req, res) => {
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
    // Llamar al procedimiento almacenado consultEmployee
    const positions_ = await pool
      .request()
      .output("OutResulTCode", 0)
      .execute("consultPositions");
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (employee_.output.OutResulTCode == 0) {
      // Renderizar la vista "updateEmployee" con los datos obtenidos de la consulta 
      res.render("updateEmployee", {
        employee: employee_.recordset[0]
        , positions: positions_.recordset
        , errorMessage: ''
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

//Se realiza la acrualización del empleado
const commitUpdateEmployee = async (req, res) => {
  const IdEmployee = req.body.IdEmpleado;
  const nameEmployee = req.body.newName;
  const docValueId = req.body.newIdentification;
  const namePosition = req.body.newPosition;

  console.log('Id:', IdEmployee, 'Datos:', nameEmployee, '- Identificación', docValueId, '- Puesto', namePosition)
  
  // Expresión regular que busca números o caracteres que no son letras
  var patron = /[^a-zA-Z-áéíóúÁÉÍÓÚüÜñÑ\s]/;
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();

    // Retorna true si se encuentra al menos un carácter que no es una letra y un espacio
    if (patron.test(nameEmployee)) {
      // Llamar al procedimiento almacenado consultEmployee
      const employee_ = await pool
        .request()
        .input("InIdEmployee", IdEmployee)
        .output("OutResulTCode", 0)
        .execute("consultEmployee");
      // Llamar al procedimiento almacenado consultEmployee
      const positions_ = await pool
        .request()
        .output("OutResulTCode", 0)
        .execute("consultPositions");
      // Verificar si el procedimiento almacenado se ejecutó correctamente
      if (employee_.output.OutResulTCode == 0 && positions_.output.OutResulTCode == 0) {
        // Renderizar la vista "updateEmployee" con los datos obtenidos de la consulta 
        res.render("updateEmployee", {
          employee: employee_.recordset[0]
          , positions: positions_.recordset
          , errorMessage: "Error: El nombre del empleado no debe contener caracteres especiales ni numeros."
        });
      } else {
        // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
        console.log("Variable salida:", employee_.output.outResulTCode);
      } 
    } else {
      // Llamar al procedimiento almacenado consultEmployee
      const update = await pool
        .request()
        .input("InIdEmployee", IdEmployee)
        .input("InNewPositionName", namePosition)
        .input("InNewDocValueId", docValueId)
        .input("InNewName", nameEmployee)
        .output("OutResulTCode", 0)
        .execute("updateEmployee");
      // Verificar si el procedimiento almacenado se ejecutó correctamente
      if (update.output.OutResulTCode == 0) {
        // Redireccion a la vista "listEmployees"
        res.redirect("listEmployees");
      } else {
        // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
        console.log("Variable salida:", update.output.outResulTCode);
      }
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500);
    res.send(error.message);
  }
}

//Cargar la vista "consultEmployee"
const consultEmployee = async (req, res) => {
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
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (employee_.output.OutResulTCode == 0) {
      // Renderizar la vista "consultEmployee" con los datos obtenidos de la consulta 
      res.render("consultEmployee", {
        employee: employee_.recordset[0]
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

module.exports = {
  listOfEmployees
  , addEmployees
  , confirmDeleteEmployee
  , deleteEmployee
  , updateEmployee
  , commitUpdateEmployee
  , consultEmployee
};
