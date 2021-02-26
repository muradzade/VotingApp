import React, { Component } from "react";
import { Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { VotingStates } from '../utils/Enums'
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {getUser} from '../utils/User'

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: "",
            id: 0,
            description: "",
            votingState: 0,
            start: moment().format("YYYY-MM-DD"),
            end: moment().format("YYYY-MM-DD"),
            variant: "",
            show: false,
            message: ""
        }
    }

    componentDidMount = async () => {
        await axios.get("http://localhost:3001/getCount").then(res=>{
            this.setState({
                id:res.data
            })
        });
    }

    create = async (event) => {
        event.preventDefault()
        if(this.state.topic=="" || this.state.description=="")
        {
            this.setState({
                message:"Eksik bilgi girildi",
                variant:"danger",
                show:true
            })
            return;
        }
        let user = getUser();
        await axios.post("http://localhost:3001/votes/create", {
            topic: this.state.topic,
            id: this.state.id,
            description: this.state.description,
            votingState: this.state.votingState,
            startDate: this.state.start,
            endDate: this.state.end,
            address:user.address
        }).then(res => {
            if (res.data.result === "ok") {
                this.setState({
                    message: res.data.message,
                    variant:"success",
                    show:true
                });
            }
            else if (res.data.result === "failed") {
                this.setState({
                    message: res.data.message,
                    variant:"danger",
                    show:true
                });
            }
        })
    }

    render() {

        return (
            <div className="container" style={{ padding: 35 }}>
                <div style={{ fontSize: 50 }}>
                    Yeni Oylama Ekle
                </div>
                <Alert show={this.state.show} 
                    variant={this.state.variant} 
                    dismissible 
                    onClose={()=>{this.setState({show:false})}}
                >
                    {this.state.message}
                </Alert>                
                <Form>
                    <Form.Group as={Row} controlId="state">
                        <Form.Label column sm="2">Oylama durumu</Form.Label>
                        <Col sm="10">
                            <Form.Control as="select" disabled={true}>
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
                            <Form.Control
                                value={this.state.topic}
                                onChange={(event) => { this.setState({ topic: event.target.value }) }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="Id">
                        <Form.Label column sm="2">Oylama ID'si</Form.Label>
                        <Col sm="10">
                            <Form.Control disabled={true}
                                value={this.state.id}
                                onChange={(event) => { this.setState({ id: event.target.value }) }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="description">
                        <Form.Label column sm="2">Aciklama</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                value={this.state.description}
                                onChange={(event) => { this.setState({ description: event.target.value }) }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="Dates">
                        <Form.Label column sm="2">Baslangic</Form.Label>
                        <Col sm="4">
                            <Form.Control
                                type="date"
                                value={this.state.start}
                                disabled={true}
                            />
                        </Col>

                        <Form.Label column sm="2">Bitis</Form.Label>
                        <Col sm="4">
                            <Form.Control
                                type="date"
                                value={this.state.end}
                                onChange={(event) => {
                                    let selectedDate = moment(event.target.value).format("YYYY-MM-DD")
                                    if ( moment(selectedDate).isSameOrAfter(this.state.start)) {
                                        this.setState({ end: selectedDate })
                                    }
                                }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="end">

                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.create}>
                        Ekle
                </Button>
                </Form>
            </div>
        );
    }
}


