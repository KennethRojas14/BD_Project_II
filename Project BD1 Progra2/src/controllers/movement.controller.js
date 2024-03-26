const { getConnection } = require("../database/connection"); 

//Cargar la vista "listMovements"
const listMovements = (req, res) => {
    const Id = req.params.Id;
    console.log("listando movimientos del empleado:", Id);
    res.render("listMovements");
};

//Cargar la vista "insertMovement"
const addMovements = (req, res) => {
    const Id = req.params.Id;
    console.log("Agregando movimiento al empleado:", Id);
    res.render("insertMovement");
};

module.exports = { listMovements, addMovements }