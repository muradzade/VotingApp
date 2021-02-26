
function routes(app){
    //users
    const users = require("./app/controllers/user.controller");
    app.post("/register", users.register);
    app.post("/login", users.login);
    

    //votes
    const votes = require("./app/controllers/vote.controller");
    app.post("/votes/create", votes.create);
    app.put("/votes/update", votes.update);
    app.get("/votes/getAll/:address" , votes.getAllVotes);
    app.get("/votes/getVotingTopic/:id" , votes.getVotingTopicById);
    app.get("/getCount", votes.getCount);
    app.post("/votes/vote" ,votes.vote);
}

module.exports = routes;