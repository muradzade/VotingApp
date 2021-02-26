const User = require("../models/User");
const web3Helper = require('../helpers/web3.helper');

exports.register = async (req, res) => {
    let _username = req.body.username;
    let _address = req.body.address;
    let _role = req.body.role;
    console.log(_username + " " + _role + " " + _address)
    if (_username !== "" && _address !== "" && _role !== "") {

        await User.findOne({ address: _address }, (err, user) => {
            if (err) {
                console.log(err);
            }
            if (!err && user !== null) {
               res.json({ "result": "failed", "message": "Bu kullanıcı adı zaten kayıtlı" });
            } 
            else {
                //save to database
                const user = new User({
                    username: _username,
                    address: _address,
                    role: _role
                });
                user.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.json({ "result": "ok", "message": "Kayıt başarıyla gerçekleştirildi" });
                    }

                })
                //save on contract
                web3Helper.voting.methods.createUser( _role ).send({
                    from: _address,
                    gas: 1000000
                }).then(res=>{
                    console.log("kaydediliyor")
                    console.log(res)
                    console.log("kaydedildi")
                })
            }
        })
    }
    else {
        res.json({ "result": "failed", "message": "Eksik bilgi girildi" })
    }
}

exports.login = (req, res) => {
    let _username = req.body.username;
    let _address = req.body.address;
    let _role = req.body.role;
    
    if (_username !== "" && _address !== "" && _role !== "") {
        User.findOne({ address: _address }).then(user => {
            if (user.username === _username && user.role === _role) {
                res.json({ "result": "ok", "user": user ,"message": "Giriş işlemi başarılı"}); 
                console.log(_username + " " + _address+" "+_role)
            }
            else {
                res.json({ "result": "failed", "message": "Kullanıcı adı veya rolü hatalı" })
            }
        }).catch(err => {
            res.json({ "result": "failed", "message": "Adres veritabanında bulunamadı" });
        })
    }
    else {
        res.json({ "result": "failed", "message": "Eksik bilgi girildi" })
    }
}

