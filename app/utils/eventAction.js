const { createStakingInfo } = require("../controllers/stakingInfo.controller");
const { createPool } = require("../controllers/poolLiquidity.controller");
const { EVENT } = require("../constants/constant");
const { connectContract, getTokenInPair, getTokenSymbol } = require("./connectContract");
const erc20Abi = require("../abi/erc20.json");
const pairAbi = require("../abi/pair.json");

async function eventAction(type, data) {

    function isStaking() {
        const stakingInfoData = {
            user_address: data.returnValues.user,
            plq_id: data.returnValues.pid,
        };
        createStakingInfo(stakingInfoData).catch((e) => {
            throw e;
        });
    }

    async function isAddFool() {
        const contract = await connectContract(pairAbi, data.returnValues.lpToken);
        const [token0Address, token1Address] = await getTokenInPair(contract);
        
        const [contractToken0, contractToken1] = await Promise.all([
            connectContract(erc20Abi, token0Address),
            connectContract(erc20Abi, token1Address),
        ]);
        
        const [symbolToken0, symbolToken1] = await Promise.all([
            getTokenSymbol(contractToken0),
            getTokenSymbol(contractToken1),
        ]);

        const poolData = {
            pid: data.returnValues.pid,
            lp_token: data.returnValues.lpToken,
            name: `${symbolToken0}-${symbolToken1}`
        };
        createPool(poolData).catch((e) => {
            throw e;
        });
    }

    const listEvent = {
        [EVENT.DEPOSIT]: isStaking,
        [EVENT.ADD_POOL]: isAddFool,
    };

    return listEvent[type]();
}

module.exports.eventAction = eventAction;
