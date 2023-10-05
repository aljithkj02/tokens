const {Web3} = require('web3');
const BridgeSepolia = require('../build/contracts/BridgeSepolia.json');
const BridgeGoerli = require('../build/contracts/BridgeGoerli.json');

const web3Seplolia = new Web3('wss://eth-sepolia.g.alchemy.com/v2/OZWC6B6UaAPwjqeg81xt2hanVqTufwFw');
const web3Goerli = new Web3('wss://eth-goerli.g.alchemy.com/v2/PJoves3V6kRHFiggpiz3nicXeOz1k9H0');

const adminPrivKey = '45964ad013feda649b6bd74ae253b35a1055476e4a2677c61c207d54b74c22b5';

const { address: admin } = web3Goerli.eth.accounts.wallet.add(adminPrivKey);

const bridgeSepolia = new web3Seplolia.eth.Contract(
    BridgeSepolia.abi,
    BridgeSepolia.networks['11155111'].address
);

const bridgeGoerli = new web3Goerli.eth.Contract(
    BridgeGoerli.abi,
    BridgeGoerli.networks['5'].address
);

bridgeSepolia.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridgeGoerli.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Goerli.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeGoerli.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Goerli.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});