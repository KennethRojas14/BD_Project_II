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

//Cargar la vista "login"
const loging = (req, res) => {
  //Carga la vista login
  res.render("login");
};

module.exports = { root, loging };
