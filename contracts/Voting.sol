// SPDX-License-Identifier: MIT
pragma solidity ^0.4.21;

contract Voting {
    enum VoteState {Open, Freeze, Closed}

    // enum Role {Admin, User}
    struct User {
        string role;
        mapping(uint256 => bool) votes;
    }

    struct VotingTopic {
        string topic;
        uint256 id;
        string description;
        string startDate;
        string endDate;
        VoteState voteState;
        uint256 voteCount_yes;
        uint256 voteCount_no;
    }

    mapping(address => User) private Users;

    //index => votingtopic ---> id => topic
    mapping(uint256 => VotingTopic) private VotingTopics;
    uint256 votingTopicsCount = 0;//it's both index and id

    modifier onlyAdmin() {
        require(keccak256(Users[msg.sender].role) == keccak256("Admin"));
        _;
    }

    modifier onlyUser() {
        require(keccak256(Users[msg.sender].role) == keccak256("User"));
        _;
    }

    function createVotingTopic(
        string _topic,
        string _description,
        VoteState _voteState,
        string _startDate,
        string _endDate
    ) onlyAdmin public {
        VotingTopic memory newVotingTopic =
            VotingTopic({
                topic: _topic,
                id: votingTopicsCount,
                description: _description,
                startDate: _startDate,
                endDate: _endDate,
                voteState: _voteState,
                voteCount_yes: 0,
                voteCount_no: 0
            });
        VotingTopics[votingTopicsCount] = newVotingTopic;
        votingTopicsCount++;
    }

    function updateVotingState(uint256 _votingId,VoteState _newState) onlyAdmin public {
        require(VotingTopics[_votingId].voteState != VoteState.Closed);
        VotingTopics[_votingId].voteState = _newState;
    }

    function createUser(
        string _role
    ) public {
        User memory newUser = User({ role: _role});
        Users[msg.sender] = newUser;
    }

    function vote(uint256 _voteId, bool _vote) onlyUser public {
        require(Users[msg.sender].votes[_voteId] == false);
        
            if (_vote) {
                VotingTopics[_voteId].voteCount_yes += 1;
            } else {
                VotingTopics[_voteId].voteCount_no += 1;
            }

            Users[msg.sender].votes[_voteId] = true;            
        

    }

    function isVoted(address _address, uint256 _voteId)
        public
        view
        returns (bool)
    {
        
        bool result = Users[_address].votes[_voteId];
        return result;
    }

    function getVotingTopic(uint256 _voteId)
        public
        view
        returns (
            string,
            uint256,
            string,
            VoteState,
            uint256,
            uint256,
            string,
            string
        )
    {
        VotingTopic storage vt = VotingTopics[_voteId];
        return (
            vt.topic,
            vt.id,
            vt.description,
            vt.voteState,
            vt.voteCount_yes,
            vt.voteCount_no,
            vt.startDate,
            vt.endDate
        );
    }

    function getVotingTopicsCount() public view returns (uint256) {
        return votingTopicsCount;
    }
    
}
