import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import './style/Header.css'

function HeaderpageRegist() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='headerpage'>
      <Container>
        <Navbar.Brand  as={Link} to="/">หน้าหลัก</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">เขียนนิยาย</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderpageRegist;