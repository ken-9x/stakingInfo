const { RPC } = require("../constants/constant");
const Web3 = require('xdc3');
const web3 = new Web3(RPC);

async function connectContract(abi, address) {
    return new web3.eth.Contract(abi, address);
}

async function getTokenInPair(contract) {

    const [token0, token1] = await Promise.all([
        contract.methods.token0().call(),
        contract.methods.token1().call(),
    ])

    return [token0, token1];
}

async function getTokenSymbol(contract) {
    return await contract.methods.symbol().call();
}

module.exports = { connectContract, getTokenInPair, getTokenSymbol };
