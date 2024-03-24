const { getConnection } = require("../database/connection");

const loging = async (req, res) => {
    res.render('login')
}

module.exports = {loging}