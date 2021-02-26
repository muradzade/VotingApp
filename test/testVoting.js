const { isMainThread } = require("worker_threads");
const { contracts_build_directory } = require("../truffle-config");

const Voting = artifacts.require("../contracts/Voting.sol");

contract("Voting", accounts => {
    let voting;
    let admin = accounts[0];
    let user =accounts[1];

    beforeEach(async () => {
        voting = await Voting.new();
        await voting.createUser("Admin", { from: admin })
        await voting.createUser("User", { from: user })
    });

    describe("Voting Topics Count", () => {

        it("should have no voting topic by default", async () => {
            let count = await voting.getVotingTopicsCount();
            assert.equal(count, 0);
        })

        it("should increase count after creating new topic", async () => {
            await voting.createVotingTopic("Oylama 1",
                "Aciklama",
                0,
                "2021-01-30",
                "2021-02-02", { from: admin });


            let count = await voting.getVotingTopicsCount();
            assert.equal(count, 1);
        })
    })

    describe("Vote", () => {
        it("should increase vote count after vote", async () => {
            await voting.createVotingTopic("Oylama 1",
                "Aciklama",
                0,
                "2021-01-30",
                "2021-02-02", { from: admin });

            let id = await voting.getVotingTopicsCount() - 1;
            await voting.vote(id, true, { from: user })
            let votingTopic = await voting.getVotingTopic(id);

            assert.equal(votingTopic[4], 1);
        })

        it("should change \"already vote\" status as true after voting", async () => {
           
            await voting.createVotingTopic("Oylama 1",
                "Aciklama",
                0,
                "2021-01-30",
                "2021-02-02", { from: admin });

            let id = await voting.getVotingTopicsCount() - 1;
            await voting.vote(id, true, { from: user })
            let status = await voting.isVoted(user,id);

            assert.equal(status, true);
        })
    })
    describe("Voting Topic State",()=>{
        it("should change voting state", async () => {
            await voting.createVotingTopic("Oylama 1",
                "Aciklama",
                0,
                "2021-01-30",
                "2021-02-02", { from: admin });

            let id = await voting.getVotingTopicsCount() - 1;
            await voting.updateVotingState(id,1);
            let votingTopic = await voting.getVotingTopic(id);

            assert.equal(votingTopic[3], 1);
        })
    })
})