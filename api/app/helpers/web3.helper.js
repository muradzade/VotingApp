const Web3 = require('web3');
const User = require("../models/User");
const artifacts = require('../../../build/Voting.json');

if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}


const networkId = Object.keys(artifacts["networks"])[ Object.keys(artifacts["networks"]).length-1 ]
const address = artifacts["networks"][networkId]["address"];
const voting = new web3.eth.Contract(artifacts.abi, address);

setAdmin = async () => {
  let defaultAdmin = await getAdmin();
  let defaultUsername = "Default Admin"

  await User.findOne({ address: defaultAdmin }, (err, user) => {//console.log(address)
    if (err) {
      console.log(err);
    }
    if (!err && user !== null) {
      console.log("Bu kullanıcı adı zaten kayıtlı");
    }
    else {
      //save to database
      const user = new User({
        username: defaultUsername,
        address: defaultAdmin,
        role: "Admin"
      });
      user.save((err) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log("basarili")
        }

      })
      //save on contract
      voting.methods.createUser("Admin").send({
        from: defaultAdmin,
        gas: 1000000
      }).then(res => {
        console.log("kaydediliyor")
        console.log(res)
        console.log("kaydedildi")
      })
    }
  })
}

getAdmin = async () => {
  let accounts = await web3.eth.getAccounts();
  return accounts[0];
}

//let voting = Voting.deployed();
module.exports = { web3, voting, getAdmin, setAdmin }