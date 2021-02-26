import React, { Component } from "react";
import { Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { VotingStates } from '../utils/Enums'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"

export default class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: "",
            id: 0,
            description: "",
            votingState: 0,
            start: "",
            end: "",
            newState: -1,
            message: "",
            variant: "",
            show: false
        }
    }

    componentDidMount = async () => {
        let votingTopic = JSON.parse(this.props.match.params.votingTopic)

        this.setState({
            topic: votingTopic.topic,
            id: votingTopic.id,
            description: votingTopic.description,
            votingState: votingTopic.votingState,
            start: votingTopic.startDate,
            end: votingTopic.endDate,
            newState: votingTopic.votingState
        })
    }
    edit = async (event) => {
        event.preventDefault()

        if (this.state.votingState == this.state.newState ||
            VotingStates[this.state.votingState] === "Closed")
            return;

        let user = JSON.parse(localStorage.getItem("user"));
        await axios.put("http://localhost:3001/votes/update", {
            newState: this.state.newState,
            voteId: this.state.id,
            address: user.address
        }).then(res => {
            alert(JSON.stringify(res))
            if (res.data.result === "ok") {
                this.setState({
                    message: res.data.message,
                    variant: "success",
                    show: true
                });
            }
            else if (res.data.result === "failed") {
                this.setState({
                    message: res.data.message,
                    variant: "danger",
                    show: true
                });
            }
        })
    }

    changeState = (event) => {
        this.setState({
            newState: event.target.options.selectedIndex
        });
    }

    render() {

        return (

            <div className="container" style={{ padding: 35 }}>
                <div style={{ fontSize: 50 }}>
                    Güncelle - {this.state.topic}
                </div>
                <Alert show={this.state.show}
                    variant={this.state.variant}
                    dismissible
                    onClose={() => { this.setState({ show: false }) }}
                >
                    {this.state.message}
                </Alert>
                <Form>
                    <Form.Group as={Row} controlId="state">
                        <Form.Label column sm="2">Oylama durumu</Form.Label>
                        <Col sm="10">
                            <Form.Control as="select"
                                value={VotingStates[this.state.newState]}
                                onChange={this.changeState}
                            >
                                {
                                    VotingStates.map((item, index) => (
                                        <option key={index}>{item}</option>
                                    ))
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="topic">
                        <Form.Label column sm="2">Oylama Konusu</Form.Label>
                        <Col sm="10">
                            <Form.Control disabled={true} value={this.state.topic} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="Id">
                        <Form.Label column sm="2">Oylama ID'si</Form.Label>
                        <Col sm="10">
                            <Form.Control disabled={true} value={this.state.id} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="description">
                        <Form.Label column sm="2">Aciklama</Form.Label>
                        <Col sm="10">
                            <Form.Control disabled={true} value={this.state.description} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="start">
                        <Form.Label column sm="2">Baslangic</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="date"
                                value={this.state.start}
                                disabled={true}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="end">
                        <Form.Label column sm="2">Bitis</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="date"
                                value={this.state.end}
                                disabled={true}
                            />
                        </Col>
                    </Form.Group>
                    <Button variant="primary"
                        type="submit"
                        onClick={this.edit} disabled={this.state.newState == this.state.votingState}>
                        Duzenle
                </Button>
                </Form>
            </div>

        );
    }
}


