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
        await stakingInfo.update(data, { where: { id: foundItem.id } }).catch(e => {
           console.log(e)
       });
    }
};


exports.findAll = async (req, res) => {
    const { page, size, name } = req.query;
    const { limit, offset } = this.getPagination(page, size);
    let condition = {
        include: [{ model: pool, attributes: ['name', 'lp_token'] }],
        order: [['score', 'DESC']]
    };
    if (!!name) {
       let plqIds = await pool.findAll({
            attributes: ['pid'],
            where: {
                name: { [Op.like]: `${name}%` }
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
    stakingInfo.findAndCountAll({...condition, limit, offset })
        .then(data => {
            data.rows = data.rows.map((value => {
                let { pool_liquidity, ...newValue } = value.dataValues;
                return {
                    ...newValue,
                    name: pool_liquidity ? pool_liquidity.name : null,
                    pool_address: pool_liquidity ? pool_liquidity.lp_token : null
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
