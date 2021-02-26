import React, { Component } from 'react'
import { Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { Roles } from '../utils/Enums'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { setUser } from '../utils/User'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            address: "",
            role: Roles[0],
            message:"",
            variant:"",
            show:false
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

    login = async (event) => {
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
        await axios.post("http://localhost:3001/login",{
                username: this.state.username,
                address: this.state.address,
                role: this.state.role
            }).then(res => {
                console.log(res)
                if (res.data.result === "ok") {
                    this.setState({
                        message: res.data.message,
                        variant:"success",
                        show:true
                    });
                    
                    setTimeout(()=>{
                        setUser(res.data.user);
                        window.location.href = "/"
                    },1500)
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
            <div className="container" style={{ padding: 35,width:600 }}>
                <div style={{ fontSize: 50 }}>
                    Giriş Yap
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
                    <Button variant="primary" type="submit" onClick={this.login}>
                        Giriş Yap
                </Button>
                </Form>
            </div>
        )
    }
}
