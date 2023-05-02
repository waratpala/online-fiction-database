import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { BsFillHouseDoorFill,BsFillPencilFill,BsFillPersonFill } from "react-icons/bs";
import { BiLogOut,BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
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
        <Navbar.Brand as={Link} to="/"><BsFillHouseDoorFill/>หน้าหลัก</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {token ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/createnovel"><BsFillPencilFill/>เขียนนิยาย</Nav.Link>
              </Nav>
              <Button variant="outline-info" type="button" onClick={handleLogount}><BiLogOut/>ล็อกเอ้า</Button>
            </>
          ) : (
            <>
              <Nav className="me-auto">
              </Nav>
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
              </Form>
              <Button variant="outline-info" type="button" style={{marginRight:'5px'}} onClick={handleSubmit}><BiLogIn/>ล็อกอิน</Button>
              <Button variant="outline-info" as={Link} to="/Register"><BsFillPersonFill/>สมัครสมาชิก</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container >
    </Navbar >
  );
}

export default Headerpage;