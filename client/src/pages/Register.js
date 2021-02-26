import React, { Component } from 'react'
import { FormGroup, FormControl, Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { Roles } from '../utils/Enums'
import axios from 'axios';


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: Roles[0],
            username: "",
            address: "",
            show:false,
            variant:"success",
            message:""
        }
    }

    componentDidMount = async () => {
        
        let ethereum = window.ethereum;
        if(ethereum)
        {
            await window.ethereum.enable()
            this.setState({address: ethereum.selectedAddress})
            
            ethereum.on("accountsChanged", (accounts) => {
                this.setState({address:accounts[0]})
            })
            this.setState({
                message: "Adres bilgisi MetaMask cüzdanından alındı",
                variant:"warning",
                show:true
            })
        }
    }

    register = async (event) => {
        event.preventDefault();
        if(this.state.username=="" || this.state.address=="")
        {
            this.setState({
                message:"Eksik bilgi girildi",
                variant:"danger",
                show:true
            })
            return;
        }
        await axios.post("http://localhost:3001/register", {
            username: this.state.username,
            address: this.state.address,
            role: this.state.role
        }).then(res => {
            if(res.data.result ==="ok"){
                this.setState({variant:"success"})
            }
            else{
                this.setState({variant:"danger"})
            }
            //alert(JSON.stringify(res))
            this.setState({
                show:true,
                message:res.data.message
            })
        })
    }

    render() {
        return (
            <div className="container" style={{ padding: 35, width:600 }}>
                <div style={{ fontSize: 50 }}>
                    Kayıt Ol
                </div>
                <Alert show={this.state.show} 
                    variant={this.state.variant} 
                    dismissible 
                    onClose={()=>{this.setState({show:false})}}
                >
                    {this.state.message}
                </Alert>
                <Form>
                    <Form.Group as={Row} controlId="role">
                        <Form.Label column sm="2">Kullanici rolu</Form.Label>
                        <Col sm="10">
                            <Form.Control as="select"
                                onChange={(event) => { this.setState({ role: event.target.value }) }}>
                                {
                                    Roles.map((item, index) => (
                                        <option key={index}>{item}</option>
                                    ))
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="username">
                        <Form.Label column sm="2">Kullanici ismi</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                value={this.state.username}
                                onChange={(event) => { this.setState({ username: event.target.value }) }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="address">
                        <Form.Label column sm="2">Address</Form.Label>
                        <Col sm="10">
                            <Form.Control
                                value={this.state.address}
                                onChange={(event) => { this.setState({ address: event.target.value }) }}
                            />
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.register}>
                        Kayıt ol
                    </Button>
                </Form>


            </div>
        )
    }
}
