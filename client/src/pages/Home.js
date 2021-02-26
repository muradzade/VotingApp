import React, { Component, useState, useEffect } from 'react';
import { VotingStates, Roles } from '../utils/Enums'
import { Table, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import VoteModal from "../components/VoteModal"
import { getUser } from '../utils/User'
import axios from "axios"
import moment from "moment"


export default function Home({ isLoggedIn }) {
    const [votingTopics, setVotingTopics] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [user, setUser] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [votingTopic, setVotingTopic] = useState({});
    useEffect(() => {

        let localUser = getUser();
        setUser(localUser)
        axios.get("http://localhost:3001/votes/getAll/" + localUser.address)
            .then((res) => {

                let _filtered = (res.data.sort((a,b)=> {
                    return moment(b.startDate).diff(moment(a.startDate))
                }));
                setVotingTopics(_filtered)
                setFiltered(_filtered);                    
            })
        
    }, [])

    const handleShowModal = (_votingTopic) => {
        if (VotingStates[_votingTopic.votingState] === "Open") {
            setVotingTopic(_votingTopic);

            setShowModal(true)
            console.log("vote calisti" + showModal)
        }

    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const edit = async (_votingTopic) => {
        window.location.href = "/update/" + JSON.stringify(_votingTopic)
    }

    const search = (event) => {
        let id = event.target.value;

        if (id !== "") {
            setFiltered(votingTopics.filter(vt => vt.id === id));
        }
        else {
            setFiltered(votingTopics);
        }
    }

    const canVote = (_votingTopic) => {
        if (VotingStates[_votingTopic.votingState] !== "Open" || _votingTopic.alreadyVoted)
            return false;
        else
            return true;
    }

    const disabledVoteOverlay = (_votingTopic) => {
        if (_votingTopic.alreadyVoted) {
            return <Tooltip id="tooltip-disabled">Oy verdiniz</Tooltip>
        }
        if (VotingStates[_votingTopic.votingState] !== "Open") {
            return <Tooltip id="tooltip-disabled">Oylama kapalı</Tooltip>
        }
        return <Tooltip id="tooltip-disabled"></Tooltip>
    }

    return (
        <>
            <div className="container">
                <input style={{ margin: 3, marginRight: 950 }} type="text" onChange={search} placeholder="Ara" />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Oylama Id</th>
                            <th>Oylama konusu</th>
                            <th>Tarih</th>
                            <th>Oylama durumu</th>
                            <th>Toplam oy</th>
                            <th>Oy dagilimi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filtered.map((item, index) =>
                            (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.topic}</td>
                                    <td>
                                        <span>Baslangic : {item.startDate}</span><br />
                                        <span>Bitis : {item.endDate}</span>
                                    </td>
                                    <td>{VotingStates[item.votingState]}</td>
                                    <td>{parseInt(item.voteCount_yes) + parseInt(item.voteCount_no)}</td>
                                    <td>
                                        <span>Evet : {item.voteCount_yes}</span><br />
                                        <span>Hayir : {item.voteCount_no}</span>
                                    </td>
                                    {user.role === Roles[0] && <td>
                                        <Button
                                            disabled={VotingStates[item.votingState] === "Closed"}
                                            onClick={(e) => { edit(item) }}>Duzenle</Button>
                                    </td>}

                                    {user.role === Roles[1] && <td>
                                        {canVote(item) ?
                                            <Button onClick={(e) => { handleShowModal(item) }}> Oy ver</Button> :
                                            <OverlayTrigger 
                                                overlay={disabledVoteOverlay(item)}>
                                                <span className="d-inline-block">
                                                    <Button style={{ pointerEvents: 'none' }}
                                                        disabled={true}>
                                                        Oy ver
                                                    </Button>
                                                </span>
                                            </OverlayTrigger>
                                        }

                                        {/* <Button
                                            disabled={VotingStates[item.votingState] !== "Open" || item.alreadyVoted}
                                            onClick={(e) => { handleShowModal(item) }}> Oy ver</Button> */}
                                    </td>}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>

            </div>
            <VoteModal
                address={user.address}
                show={showModal}
                votingTopic={votingTopic}
                close={handleCloseModal} />


        </>
    )

}
