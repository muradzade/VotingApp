import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { Roles } from '../utils/Enums'
import {getUser , removeUser} from '../utils/User'

export default class Navigation extends Component {

  logout = () => {
    removeUser();
    window.location.href = "/user/login"
  }
  render() {
    let user = getUser();

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
        <Navbar.Brand href="#home">Voting App</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Nav className="ml-auto">
            {user && <>
              <Nav.Link href="/">Anasayfa</Nav.Link>
              {user.role === Roles[0] && <Nav.Link href="/create" className="navLink">Oylama Oluştur</Nav.Link>}
              <Nav.Link href="/user/details"  className="navLink">| {user.username}</Nav.Link>
              <Nav.Link onClick={this.logout}  className="navLink">Çıkış yap</Nav.Link>
            </>}
            {!user && <>
              <Nav.Link href="/user/register" className="navLink">Kayıt</Nav.Link>
              <Nav.Link href="/user/login" className="navLink">Giriş</Nav.Link>
            </>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

