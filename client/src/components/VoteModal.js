import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"
import { Button, Modal } from "react-bootstrap"
import {VotingStates} from "../utils/Enums"

export default class VoteModal extends Component {

    componentDidMount = () => {

    }

    send = async (selection) => {
        if (VotingStates[this.props.votingTopic.votingState] === "Open") {
            await axios.post("http://localhost:3001/votes/vote", {
                address: this.props.address,
                voteId: this.props.votingTopic.id,
                vote: selection
            }).then(res => {
                console.log(res)
            })
            console.log("goner")

            this.props.close()
            window.parent.location.reload()
        }
    }

    render() {
        console.log(this.props.votingTopic)
        return (
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.props.show}
                onHide={this.props.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.votingTopic.topic}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{this.props.votingTopic.description}</h4>
                    <Button variant="primary"
                        style={{ marginLeft: 100, marginRight: 30, width: 100 }}
                        onClick={() => { this.send(true) }} >Evet</Button>

                    <Button variant="danger"
                        style={{ marginLeft: 30, marginRight: 100, width: 100 }}
                        onClick={() => { this.send(false) }} >Hayir</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close} >Iptal</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


