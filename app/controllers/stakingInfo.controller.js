const db = require("../models");
const stakingInfo = db.stakingInfo;

exports.create = async (data) => {
    const foundItem = await stakingInfo.findOne({ where: { user_address: data.user_address , plq_id: data.plq_id }});
    if (!foundItem) {
        await stakingInfo.create(data);
    }
};

exports.update = async (data) => {
    const foundItem = await stakingInfo.findOne({ where: { user_address: data.user_address , plq_id: data.plq_id }});
    if (foundItem) {
        await stakingInfo.update(data, { where: { user_address: data.user_address , plq_id: data.plq_id } }).catch(e => {
           console.log(e)
       });
    }
};


exports.findAll = (req, res) => {
    const { page, size, plqId } = req.query;
    const {limit, offset} = this.getPagination(page, size);
    let condition = { order: [['score', 'DESC']] }
    if (!!plqId) {
        condition = {
            ...condition,
            where: { plq_id: plqId }
        }
    }
    stakingInfo.findAndCountAll({limit, offset, ...condition})
        .then(data => {
            const response = this.getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
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
