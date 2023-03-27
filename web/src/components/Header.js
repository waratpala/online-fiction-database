import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import './style/Header.css'

function Headerpage() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='headerpage'>
      <Container>
        <Navbar.Brand as={Link} to="/">หน้าหลัก</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/createnovel">เขียนนิยาย</Nav.Link>
          </Nav>
          <Form className="d-flex">
                  <Form.Control
                    type="input"
                    placeholder="Username"
                    className="me-2"

                  />
           </Form>
           <Form className="d-flex">
                  <Form.Control
                    type="input"
                    placeholder="Password"
                    className="me-2"

                  />
           </Form>
            <Button variant="outline-info" as={Link} to="/">ล็อกอิน</Button>
            <Button variant="outline-info" as={Link} to="/Register">สมัครสมาชิก</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Headerpage;