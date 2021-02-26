const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
//const mnemonic = "attend mind else desk brisk blanket easy area exclude prepare select ocean";
//metmask
const mnemonic = "write enemy artefact picture top planet toilet step high protect hover metal";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "build"),
  networks: {
    development: {
      network_id: "*",
      host: 'localhost',
      port: 8545,
      gas: 6721975,
      gasPrice: 20000000000
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/5a4abbfcb96a4b1bbc6a0c6ac621905d");
      },
      network_id: 4,
      gas: 5500000,   
      confirmations: 2,   
      timeoutBlocks: 200,  
      skipDryRun: true 
    },
    ropsten: {
      provider: function() { 
       return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/5a4abbfcb96a4b1bbc6a0c6ac621905d");
      },
      network_id: 3,
      gas: 8000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.21",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};


// const path = require("path");

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   contracts_build_directory: path.join(__dirname, "client/src/contracts"),
//   networks: {
//     develop: {
//       port: 8545
//     }
//   }
// };

// networks: {
//   development: {
//     network_id: "*",
//     host: 'localhost',
//     port: 8545,
//     gas: 6721975,
//     gasPrice: 20000000000
//   }
// },

//0x556F31e9328D8EbB920EDE2dEC70C96c2c46eca6