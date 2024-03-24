const { getConnection } = require("../database/connection");
const path = require("path");

/*
    Ademas de cargar la vista "login" obtiene la direccion completa del archivo.xml
    y se la envia a un SP para que con esta obtenga los datos del archivo y los procese
*/
const loging = async (req, res) => {
  try {
    // Ruta relativa del archivo que quieres obtener
    const rutaRelativa = "../datos.xml";
    // Unir la ruta relativa con la carpeta actual (__dirname)
    const rutaCompleta = path.join(__dirname, rutaRelativa);

    console.log("Esta es la ruta:", rutaCompleta);

    // Obtener una conexión desde el pool de conexiones
    const pool = await getConnection();

    // Llamada al procedimiento almacenado loadXMLData
    const result = await pool
      .request()
      .input("xmlFilePath", rutaCompleta)
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
  //Carga la vista login
  res.render("login");
};

module.exports = { loging };
