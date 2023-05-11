import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { BsFillHouseDoorFill, BsFillPencilFill, BsFillPersonFill } from "react-icons/bs";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import './style/Header.css'
import { useState, useEffect } from 'react';

function Headerpage() {
  let token = sessionStorage.getItem("token");
  const [userName, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({});

  function handleSubmit() {
    let err = { ...errors, usernameErr: null, passwordErr: null }

    if (userName.trim() === "") {
      err.usernameErr = "username is a required field."
    } else {
      err.usernameErr = null
    }

    if (password.trim().length === 0) {
      err.passwordErr = "password is a required field."
    } else {
      err.passwordErr = null
    }
    if (err.passwordErr === null && err.usernameErr === null) {
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
          if (error.response.status === 403) {
            err.usernameErr = "username ro password was wrong."
            setUser("")
            setPassword("")
          }
          if (error.response.status === 500) {
            window.location.replace('http://localhost:3000/500');
          }
        });
    }
    setErrors(err)
  };

  let handleLogount = async (e) => {
    sessionStorage.removeItem("token")
    window.location.reload(false);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='headerpage'>
      <Container>
        <Navbar.Brand as={Link} to="/"><BsFillHouseDoorFill />หน้าหลัก</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {token ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/createnovel"><BsFillPencilFill />เขียนนิยาย</Nav.Link>
              </Nav>
              <Button variant="outline-info" type="button" onClick={handleLogount}><BiLogOut />ล็อกเอ้า</Button>
            </>
          ) : (
            <>
              <Nav className="me-auto">
              </Nav>
              <Form className="d-flex">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    className="me-2"
                    value={userName}
                    onChange={e => setUser(e.target.value)}
                    isInvalid={!!errors.usernameErr}
                  />
                  <Form.Control.Feedback type="invalid">{errors.usernameErr}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    className="me-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    isInvalid={!!errors.passwordErr}
                  />
                  <Form.Control.Feedback type="invalid">{errors.passwordErr}</Form.Control.Feedback>
                </Form.Group>
              </Form>
              <Button variant="outline-info" type="submit" onClick={handleSubmit} style={{ marginRight: '5px' }}><BiLogIn />ล็อกอิน</Button>
              <Button variant="outline-info" as={Link} to="/Register"><BsFillPersonFill />สมัครสมาชิก</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container >
    </Navbar >
  );
}

export default Headerpage;