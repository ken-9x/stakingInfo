const Web3 = require('xdc3');
const ABI = require('../abi/contract.json');
const { create } = require("../controllers/stakingInfo.controller");
const { RPC, CONTRACT_ADDRESS } = require("../constants/constant");
const web3 = new Web3(RPC);
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
const stakeEvent = ['Deposit'];
const numberBlock = 100000000;

function sleep(ms) {
    setTimeout(() => {}, ms);
}

async function processBlocks(fromBlockNumber) {
    console.log(`processBlocks BEGIN_PROCESS_BLOCKS: ${fromBlockNumber} `);
    const eventLogs = await contract.getPastEvents(
        "allEvents",
        {
            fromBlock: fromBlockNumber,
            toBlock: (fromBlockNumber + numberBlock),
        },
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
    console.log(eventLogs.map((v) => v.event));
    return eventLogs.filter((log) => stakeEvent.includes(log.event));
}


const getData = async (formBlock = 0) => {
    await sleep(2000);
    const latestBlock = await web3.eth.getBlockNumber();
    
    if (!formBlock) {
        formBlock = +process.env.DEPLOY_BLOCK || 29018820
    }
    if (formBlock >= (latestBlock - 18)) {
        setTimeout(getData, 600000);
        return;
    }
    const listEvent = await processBlocks(formBlock);
    // saveData(listEvent).then(() => {
    //     process.env.DEPLOY_BLOCK = formBlock + numberBlock;
    //     getData(+process.env.DEPLOY_BLOCK);
    // }).catch(() => {
    //     getData();
    // })

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
setTimeout(getData, 2000);
