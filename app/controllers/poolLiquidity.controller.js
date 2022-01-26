const db = require("../models");
const pool = db.pool;

exports.createPool = async (data) => {
    const foundItem = await pool.findOne({ where: { pid: data.pid } });
    if (!foundItem) {
        await pool.create(data);
    }
};

exports.findAll = (req, res) => {
    pool.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error."
            });
        });
};

