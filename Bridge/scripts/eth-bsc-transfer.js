const BridgeSepolia = artifacts.require('./BridgeSepolia.sol');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await BridgeSepolia.deployed();
  await bridgeEth.burn(recipient, 500);
  done();
}