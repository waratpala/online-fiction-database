import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './style/Header.css'
import { useState, useEffect } from 'react';

function Headerpage() {
  let token = sessionStorage.getItem("token");
  const [userName, setUser] = useState("")
  const [password, setPassword] = useState("")

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userName);
    console.log(password);
    let data = new FormData();
    data.append('username', userName);
    data.append('password', password);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://127.0.0.1:5000/login',
      data: data
    };

    axios.request(config)
      .then((response) => {
        sessionStorage.setItem("token", response.data.token);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let handleLogount = async (e) => {
    sessionStorage.removeItem("token")
    window.location.reload(false);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='headerpage'>
      <Container>
        <Navbar.Brand as={Link} to="/">หน้าหลัก</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/createnovel">เขียนนิยาย</Nav.Link>
          </Nav>
          {token ? (
            <>
              <Button type="button" onClick={handleLogount}>ล็อกเอ้า</Button>
            </>
          ) : (
            <>
              <Form className="d-flex">
                <Form.Control
                  type="input"
                  placeholder="Username"
                  className="me-2"
                  onChange={e => setUser(e.target.value)}
                />
                <Form.Control
                  type="input"
                  placeholder="Password"
                  className="me-2"
                  onChange={e => setPassword(e.target.value)}
                />
                <Button type="button" onClick={handleSubmit}>ล็อกอิน</Button>
              </Form>
              <Button variant="outline-info" as={Link} to="/Register">สมัครสมาชิก</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container >
    </Navbar >
  );
}

export default Headerpage;