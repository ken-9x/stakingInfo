const Web3 = require('xdc3');
const ABI = require('../abi/contract.json');
const { update } = require("../controllers/stakingInfo.controller");
const { RPC, CONTRACT_ADDRESS } = require("../constants/constant");
const db = require("../models");
const web3 = new Web3(RPC);
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
const stakingInfo = db.stakingInfo;
const time = 1800000;

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
            await update({plq_id, user_address, score: data});
        })
        await Promise.all(requests).catch(e => console.log(`Error in  ${i} - ${e}`));
    }
}

cron(time, updateScore);
