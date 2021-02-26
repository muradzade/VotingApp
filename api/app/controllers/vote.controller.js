const web3Helper = require("../helpers/web3.helper");
const moment = require("moment")

exports.create = async (req , res) => {
    let topic = req.body.topic;
    let description = req.body.description;
    let votingState = req.body.votingState;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let address = req.body.address;
    await web3Helper.voting.methods.createVotingTopic(topic, 
                                                    description, 
                                                    votingState, 
                                                    startDate, 
                                                    endDate
    ).send({
        from : address,
        gas: 1000000
    }).then(result=>{
        if(result.status)
            res.json({"result":"ok","message":"Ekleme işlemi başarıyla gerçekleştirildi"});
        else
            res.json({"result":"failed","message":"Ekleme işlemi başarısız"});
    })
}

exports.update = async (req , res) => {
    let newState = req.body.newState;
    let voteId = req.body.voteId;
    let address = req.body.address;
    let data = await web3Helper.voting.methods.getVotingTopic(voteId).call();

    //end date = data[7]  start date = date[6]
    if( moment(data[7]).isSameOrAfter(data[6],"day") )
    {
        await web3Helper.voting.methods.updateVotingState(data[1] , newState).send({
            from:address,
            gas:1000000 
        }).then(result=>{
            if(result.status)
                res.json({"result":"ok","message":"Güncelleme işlemi başarıyla gerçekleştirildi"});
            else
                res.json({"result":"failed","message":"Güncelleme işlemi başarısız"});
        });
    }
}

exports.getAllVotes = async (req , res) => {
    let address = req.params.address;
    let votingTopics = [];
    const count = await web3Helper.voting.methods.getVotingTopicsCount().call();
    //get each topic and push to array
    for(let i=0; i<count; i++)
    {
        let data = await web3Helper.voting.methods.getVotingTopic(i).call();
        let alreadyVoted = await web3Helper.voting.methods.isVoted(address,data[1]).call()
        //if voting reach to end time change its state by using default admin
        //end date = data[7]  start date = date[6]
        if(moment(data[7]).isBefore(moment().format("YYYY-MM-DD"),"day") && data[3] != 2)
        {
            await web3Helper.voting.methods.updateVotingState(data[1] , 2).send({
                from:await web3Helper.getAdmin(),
                gas:1000000
            });
            data = await web3Helper.voting.methods.getVotingTopic(i).call(); 
        }
        
        votingTopics.push({
            "topic":data[0],
            "id":data[1],
            "description":data[2],
            "votingState":data[3],
            "voteCount_yes":data[4],
            "voteCount_no":data[5],
            "startDate":data[6],
            "endDate": data[7],
            "alreadyVoted":alreadyVoted
        })
    }
    res.send(votingTopics);
}

exports.getVotingTopicById = async (req , res) => {
    let voteId = req.params.id;
    let data = await web3Helper.voting.methods.getVotingTopic(voteId).call();
    console.log(JSON.stringify(data))
    if(data)
    {
        res.send({
            "topic":data[0],
            "id":data[1],
            "description":data[2],
            "votingState":data[3],
            "startDate":data[6],
            "endDate": data[7]
        })
    }
}

exports.getCount = async (req ,res) => {
    const count = await web3Helper.voting.methods.getVotingTopicsCount().call();
    res.send(count)
}

exports.vote = async (req, res) => {
    let _address = req.body.address;
    let _voteId = req.body.voteId;
    let _vote = req.body.vote

    let data = await web3Helper.voting.methods.getVotingTopic(_voteId).call();
    if(data[3] == 0)
    {
        if (_address && _voteId) {
            console.log("1 =="+_address)
            web3Helper.voting.methods.vote(_voteId,_vote).send({
                from:_address,
                gas:1000000
            }).then(result => {
                console.log(result)
                res.send(result)
            })
        }        
    }
    else{
        res.json({"result":"failed","message":"Oylama durumu oy vermeye uygun değil"})
    }


}
