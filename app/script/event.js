const Web3 = require('xdc3');
const dotenv = require('dotenv')
dotenv.config({ override: true })
const ABI = require('../abi/contract.json');
const { RPC, CONTRACT_ADDRESS, EVENT } = require("../constants/constant");
const { eventAction } = require("../utils/eventAction");
const { connectContract } = require("../utils/connectContract");
const web3 = new Web3(RPC);
const filterEvent = [EVENT.DEPOSIT, EVENT.ADD_POOL];
const numberBlock = 2000;

function sleep(ms) {
    setTimeout(() => {}, ms);
}

async function processBlocks(fromBlockNumber) {
    const contract = await connectContract(ABI, CONTRACT_ADDRESS);
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
    return eventLogs.filter((log) => filterEvent.includes(log.event));
}


const getData = async (formBlock = 0) => {
    await sleep(2000);
    const latestBlock = await web3.eth.getBlockNumber();
    
    if (!formBlock) {
        formBlock = +process.env.DEPLOY_BLOCK - (numberBlock * 2);
    }
    if (formBlock >= (latestBlock - 18)) {
        setTimeout(getData, 600000);
        console.log('The process will run again in 10 minutes')
        return;
    }
    const listEvent = await processBlocks(formBlock);
    saveData(listEvent).then(() => {
        process.env.DEPLOY_BLOCK = formBlock + numberBlock;
        getData(+process.env.DEPLOY_BLOCK);
    }).catch(() => {
        getData();
    })

}

const saveData = async (listEvent) => {
    try {
        for (let event of listEvent) {
           await eventAction(event.event, event)
        }
    } catch (e) {
        throw e;
    }

}
setTimeout(getData, 2000);
