const { getConnection } = require("../database/connection");

const ip = require("ip");
//Cargar la vista "listEmployees"
const listOfEmployees = async (req, res) => {
  var content = req.body.contentSearch;     // Variable que guarda el contenido de la entrada de busqueda.
  if (content == undefined) {content = ''} // En caso de no realizar ninguna busqueda.

  // Expresiones regulares utilizadas para evaluar el contenido de la entrada de busqueda.
  const onlyNumbers = /^[0-9]+$/;
  const onlyLetters = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;

  const username = req.session.username;
  const clientIP = ip.address(); 

  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    var employees_  = '';

    if (onlyNumbers.test(content)) { // Llamada al SP consultEmployeesIdentificationFilter
      employees_ = await pool 
      .request()
      .input('IdentificationToSearch', content)
      .input('InNameUser', username)
      .input('InIpAddress', clientIP)
      .output("OutResulTCode", 0)
      .execute("consultEmployeesIdentificationFilter");
    }
    if (onlyLetters.test(content)) { // Llamada al SP consultEmployeesNameFilter
      employees_ = await pool
      .request()
      .input('NameToSearch', content)
      .input('InNameUser', username)
      .input('InIpAddress', clientIP)
      .output("OutResulTCode", 0)
      .execute("consultEmployeesNameFilter");
    }  
    if (content != '' && !onlyLetters.test(content) && !onlyNumbers.test(content)) {// Llamada especial al SP consultEmployeesNameFilter
      employees_ = await pool
      .request()
      .input('NameToSearch', '##')
      .input('InNameUser', username)
      .input('InIpAddress', clientIP)
      .output("OutResulTCode", 0)
      .execute("consultEmployeesNameFilter");
    } 
    if (content == ''){ // Llamada al SP consultEmployees
      employees_ = await pool
        .request()
        .output("OutResulTCode", 0)
        .execute("consultEmployees");
    }
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

const addEmployees = async (req, res) => {
  try{
    // Se obtiene coneccion a la base de datos
    const pool = await getConnection(); 
    // Llamar al procedimiento almacenado consultEmployee
    const positions_ = await pool
      .request()
      .output("OutResulTCode", 0)
      .execute("consultPositions");
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (positions_.output.OutResulTCode == 0) {
      // Renderizar la vista "updateEmployee" con los datos obtenidos de la consulta 
      res.render("insertEmployee", { 
        positions: positions_.recordset
        , errorMessage: ''
      });
    } else {
      // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
      console.log("Variable salida:", employee_.output.outResulTCode);
    }
    // Se cierra la conexion
    pool.close()
  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500);
    res.send(error.message);
  } 
}

const CheckEmployees = async (req, res) => {
  const clientIP = ip.address(); 
  const nameEmployee = req.body.nameEmployee;
  const identity = req.body.identity;
  const position = req.body.position;
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado insertEmployee
    const employee_ = await pool
      .request()
      .input("InNameEmployee", nameEmployee)
      .input("InDocumentIdentity", identity)
      .input("InPosition", position)
      .input("InIpAddress",clientIP)
      .output("OutResultCode", 0)
      .execute("insertEmployee");
    if (employee_.output.OutResultCode == 0) {
      // Renderizar la vista "listEmployees" con los datos obtenidos de las consultas 
      res.redirect('listEmployees');
    } else if (employee_.output.OutResultCode == 1) {
      res.render("insertEmployee",{errorMessage:"Error: Empleado con ValorDocumentoIdentidad ya existe en inserción"})
    } else {
      res.render("insertEmployee",{errorMessage:"Error: Empleado con nombre ya existe en inserción"})
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    console.error("Error interno del servidor:", error.message);
    // Enviar una respuesta al cliente indicando que hubo un error
    res.status(500).send("Error interno del servidor.");
  }
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
  const username = req.session.username;
  const clientIP = ip.address(); 
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado logicalDeleteEmployee
    const employee_ = await pool
      .request()
      .input("InIdEmployee", IdEmployee)
      .input("InNameUser", username)
      .input("InIpAddress", clientIP)
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

//Se realiza la actualizacion del empleado
const commitUpdateEmployee = async (req, res) => {
  const IdEmployee = req.body.IdEmpleado
  const newnameEmployee = req.body.newName;
  const docValueId = req.body.newIdentification;
  const namePosition = req.body.newPosition;
  const username = req.session.username;
  const clientIP = ip.address(); 

  // Expresión regular que busca números o caracteres que no son letras
  var patron = /[^a-zA-Z-áéíóúÁÉÍÓÚüÜñÑ\s]/;
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();

    // Retorna true si se encuentra al menos un carácter que no es una letra y un espacio
    if (patron.test(newnameEmployee)) {
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
        console.log("Variable salida:", employee_.output.OutResulTCode);
      } 
    } else {
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
      // Llamar al procedimiento almacenado consultEmployee
      const update = await pool
        .request()
        .input("InIdEmployee", IdEmployee)
        .input("InNewPositionName", namePosition)
        .input("InNewDocValueId", docValueId)
        .input("InNewName", newnameEmployee)
        .input("InNameUser",username )
        .input("InIpAddress",clientIP )
        .output("OutResulTCode", 0)
        .execute("updateEmployee");
      // Verificar si el procedimiento almacenado se ejecutó correctamente
      if (update.output.OutResulTCode == 0) {
        res.redirect("listEmployees");
      } 
      if (update.output.OutResulTCode == 1) {
        res.render("updateEmployee", {
          employee: employee_.recordset[0]
          , positions: positions_.recordset
          , errorMessage: 'Error: DocumentoIdentidad ya existe'})
      }
      if (update.output.OutResulTCode == 2){
        res.render("updateEmployee", {
          employee: employee_.recordset[0]
          , positions: positions_.recordset
          , errorMessage: 'Error: nombre ya existe'})
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

//Realiza insercion de eventos al LogbookEvents
const insertEvents = async (req, res, IdTypeEvent) => {
  const username = req.session.username;
  const clientIP = ip.address(); 
  try {
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
    // Llamar al procedimiento almacenado logicalDeleteEmployee
    const result = await pool
      .request()
      .input("InTypeEvent", IdTypeEvent)
      .input("InNameUser", username)
      .input("InIpAddress", clientIP)
      .output("OutResultCode", 0)
      .execute("InsertEvent");
    // Verificar si el procedimiento almacenado se ejecutó correctamente
    if (result.output.OutResultCode == 0) {
      console.log("Insercion correcta. Logout");
    } else {
      // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
      console.log("Algo falló.");
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
  , CheckEmployees
  , confirmDeleteEmployee
  , deleteEmployee
  , updateEmployee
  , commitUpdateEmployee
  , consultEmployee
  , insertEvents
};
