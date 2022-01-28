const ABI = require('../abi/contract.json');
const { UpdateStakingInfo } = require("../controllers/stakingInfo.controller");
const { CONTRACT_ADDRESS } = require("../constants/constant");
const db = require("../models");
const { connectContract} = require("../utils/connectContract");
const stakingInfo = db.stakingInfo;
const time = 300000;

function cron(ms, fn) {
    function cb() {
        clearTimeout(timeout)
        timeout = setTimeout(cb, ms)
        fn()
    }

    let timeout = setTimeout(cb, ms)
    return {};
}

const updateScore = async () => {
    console.log('cron updateScore start');
    const contract = await connectContract(ABI, CONTRACT_ADDRESS);
    let data = await stakingInfo.findAll();
    let dataLength = data.length;
    if (!dataLength) {
        return;
    }
    for (let i = 0; i < dataLength; i += 100) {
        const requests = data.slice(i, i + 100).map(async (info) => {
            let { plq_id, user_address } = info;
            let data = await contract.methods.getUserScore(info.plq_id, info.user_address).call();
            data /= Math.pow(10, 18);
            await UpdateStakingInfo({plq_id, user_address, score: data});
        })
        await Promise.all(requests).catch(e => console.log(`Error in  ${i} - ${e}`));
    }
    console.log('The process will run again in 5 minutes');
}

cron(time, updateScore);
updateScore();
