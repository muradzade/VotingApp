import React, { Component } from "react";
import { Button, Form, Row, Col } from 'react-bootstrap'
import { VotingStates } from '../utils/Enums'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"
import { Redirect } from 'react-router-dom'

export default class Update extends Component {

    state = {
        username: "",
        address: "",
        role: "",
        auth: false
    }
    componentWillMount = () => {
        let user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            this.setState({
                username: user.username,
                address: user.address,
                role: user.role,
            })
        }

    }

    render() {
        return (
            <>
                <div className="container" style={{ padding: 35 }}>
                    <Form>
                        <Form.Group as={Row} controlId="username">
                            <Form.Label column sm="2">Kullanici adi</Form.Label>
                            <Col sm="10">
                                <Form.Control disabled={true} value={this.state.username} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="role">
                            <Form.Label column sm="2">Rolu</Form.Label>
                            <Col sm="10">
                                <Form.Control disabled={true} value={this.state.role} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="address">
                            <Form.Label column sm="2">Adresi</Form.Label>
                            <Col sm="10">
                                <Form.Control disabled={true} value={this.state.address} />
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </>
        );
    }
}


