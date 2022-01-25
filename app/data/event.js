const Web3 = require('xdc3');
const ABI = require('../abi/contract.json');
const { create, update } = require("../controllers/stakingInfo.controller");
const db = require("../models");
const web3 = new Web3('https://rpc.apothem.network/');
const contract = new web3.eth.Contract(ABI, 'xdc814Df77De4723DdF06F42fF8557f450Dd702a1BE');
const stakingInfo = db.stakingInfo;
const stakeEvent = ['Deposit'];
const time = 1800000;
async function processBlocks(fromBlockNumber) {
    console.log(`processBlocks BEGIN_PROCESS_BLOCKS: ${fromBlockNumber} `);
    const eventLogs = await contract.getPastEvents(
        "allEvents",
        {
            fromBlock: fromBlockNumber,
            toBlock: (fromBlockNumber + 1000),
        },
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
    return eventLogs.filter((log) => stakeEvent.includes(log.event));
}


const getData = async (formBlock = 0) => {
    if (!formBlock) {
        formBlock = +process.env.DEPLOY_BLOCK || 29018820
    }
    const listEvent = await processBlocks(formBlock);
    saveData(listEvent).then(() => {
        process.env.DEPLOY_BLOCK = formBlock + 1000;
        getData(+process.env.DEPLOY_BLOCK);
    }).catch(() => {
        getData()
    })

}

const saveData = async (listEvent) => {
    try {
        listEvent.map(function (event) {
            const stakingInfoData = {
                user_address: event.returnValues.user,
                plq_id: event.returnValues.pid,
            };
            create(stakingInfoData)
        });
    } catch (e) {
        throw e;
    }

}

getData();

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

cron(time, () => {
    updateScore();
})
