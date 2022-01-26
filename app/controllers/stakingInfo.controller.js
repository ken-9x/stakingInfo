const db = require("../models");
const {Op} = require("sequelize");
const stakingInfo = db.stakingInfo;
const pool = db.pool;

exports.createStakingInfo = async (data) => {
    const foundItem = await stakingInfo.findOne({ where: { user_address: data.user_address , plq_id: data.plq_id } });
    if (!foundItem) {
        await stakingInfo.create(data);
    }
};

exports.UpdateStakingInfo = async (data) => {
    const foundItem = await stakingInfo.findOne({ where: { user_address: data.user_address , plq_id: data.plq_id } });
    if (foundItem) {
        await stakingInfo.update(data, { where: { user_address: data.user_address , plq_id: data.plq_id } }).catch(e => {
           console.log(e)
       });
    }
};


exports.findAll = async (req, res) => {
    const { page, size, plq_name } = req.query;
    const { limit, offset } = this.getPagination(page, size);
    let condition = { order: [['score', 'DESC']] };
    let dataPool = await pool.findAll();
    let dataName = {};
    dataPool.map((value) => {
        dataName[value.pid] = value.name
    });
    if (!!plq_name) {
       let plqIds = await pool.findAll({
            attributes: ['pid'],
            where: {
                name: { [Op.like]: `${plq_name}%` }
            },
        });

        if (plqIds.length) {
            plqIds = plqIds.map((data) => data.pid);
            condition = {
                ...condition,
                where: { plq_id: plqIds }
            };
        }
    }
    
    stakingInfo.findAndCountAll({...condition, limit, offset, })
        .then(data => {
            data.rows = data.rows.map((value => {
                return {
                    ...value.dataValues,
                    name: dataName[value.plq_id]
                }
            }))
            const response = this.getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error ."
            });
        });
};

exports.getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: stakingInfos} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {totalItems, stakingInfos, totalPages, currentPage};
};

exports.getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;

    return {limit, offset};
};
