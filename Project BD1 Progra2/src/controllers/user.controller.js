const { getConnection } = require("../database/connection");
const path = require("path");

//Se la envia la direccion completa del archivo XML a un SP para que con 
//esta obtenga los datos del archivo y los procese
const root = async (req, res) => {
  try {
    // Ruta relativa del archivo que quieres obtener
    const relativeRoute = "../datos.xml";
    // Unir la ruta relativa con la carpeta actual (__dirname)
    const completeRoute = path.join(__dirname, relativeRoute);
  
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();
  
    // Llamada al procedimiento almacenado loadXMLData
    const result = await pool
      .request()
      .input("xmlFilePath", completeRoute)
      .output("OutResulTCode", 0)
      .execute("loadXMLData");
  
    if (result.output.OutResulTCode == 0) {
      console.log("Se cargaron los datos :D"); 
    } else {
      console.log("Algo salio mal con la carga de datos :O"); 
    }
    // Cerrar la conexión al pool
    pool.close();
  } catch (error) {
    // Manejar errores internos del servidor
    console.log(error.message);
  }
  res.redirect("login");
}

const loginUser = async (req, res) => {
  res.render('login')
}

const CheckloginUser = async (req, res) => {
  try {
    // Validar los datos de entrada
    const username = req.body.username;
    const password = req.body.password;
   
    if (!username || !password) {
      res.status(400).send('El nombre de usuario y la contraseña son obligatorios.');
      return;
    }
    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();

    try {
      // Llamar al procedimiento almacenado
      const result = await pool.request()
        .input("User", username)
        .input("Password", password)
        .output("OutResulTCode", 0)
        .execute("ValidateUser");

      // Verificar si el procedimiento almacenado se ejecutó correctamente
      if (result.output.OutResulTCode == 0) {
        // Renderizar la vista "listEmployees" con los datos obtenidos de la consulta 
        res.redirect("listEmployees");
      } else {
        // Manejar el caso en el que el procedimiento almacenado no se ejecutó correctamente
        res.render("Login", { // 
          errorMessage: "Error: Error en el inicio de sesion. Intentelo de nuevo",
          successMessage : ""
        });
        return;
      }
    } catch (error) {
      // Manejar errores al ejecutar el procedimiento almacenado
      console.error("Error al ejecutar el procedimiento almacenado:", error);
      res.status(500).send('Error interno del servidor.');
    } finally {
      // Cerrar la conexión al pool
      pool.close();
    }
  } catch (error) {
    // Manejar errores internos del servidor
    console.error("Error interno del servidor:", error);
    res.status(500).send('Error interno del servidor.');
  }
};

module.exports = { root, CheckloginUser, loginUser };
