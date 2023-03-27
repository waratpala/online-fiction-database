import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './style/Home.css'
import Headerpage from './Header';
import Novel from './Novel';

function Homepage() {
  return (
    <>
        <Headerpage/>
        <Novel/>
    </>
  );
}

export default Homepage;