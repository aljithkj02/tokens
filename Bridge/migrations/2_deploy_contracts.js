const TokenEth = artifacts.require('./TokenSepolia.sol');
const TokenBsc = artifacts.require('./TokenGoerli.sol');
const BridgeEth = artifacts.require('./BridgeSepolia.sol');
const BridgeBsc = artifacts.require('./BridgeGoerli.sol');

module.exports = async function (deployer, network, addresses) {
    
  if(network === 'sepolia') {
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    await tokenEth.mint(addresses[0], 1000);
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if(network === 'goerli') {
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    await deployer.deploy(BridgeBsc, tokenBsc.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await tokenBsc.updateAdmin(bridgeBsc.address);
  }
};