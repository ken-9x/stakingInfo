const { UpdateStakingInfo } = require("../controllers/stakingInfo.controller");
const db = require("../models");
const stakingInfo = db.stakingInfo;
const time = 900000;

function cron(ms, fn) {
    function cb() {
        clearTimeout(timeout)
        timeout = setTimeout(cb, ms)
        fn()
    }

    let timeout = setTimeout(cb, ms)
    return {};
}

const updateRankStaking = async () => {
    console.log('cron updateRankStaking start');
    let data = await stakingInfo.findAll({ order: [['score', 'DESC']] });
    let dataLength = data.length;
    if (!dataLength) {
        return;
    }
    for (let i = 0; i < dataLength; i += 1) {
        let { plq_id, user_address } = data[i];
        let rank = (i + 1);
        await UpdateStakingInfo({ rank, plq_id, user_address });
    }
    console.log('The process will run again in 10 minutes');
}

cron(time, updateRankStaking);
updateRankStaking();
