import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/Edit.css'


function Editnovel() {
  let token = sessionStorage.getItem("token");
  const [content, setContent] = useState("");

  useEffect(() => {

    let url = "http://127.0.0.1:5000/content/" + "1"
    // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';
    axios.get(url, { headers: { Authorization: AuthStr } })
      .then(response => {
        if (response.status == 200) {
          setContent(response.data)
        }
        if (response.status == 400) {

        }
        if (response.status == 404) {

        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  return (
    <>
      <Container>
        <div className='controlitem m-3' style={{ backgroundColor: '#393E46' }}>
          <Form.Label className='texttitleedit' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white', width: '100%', height: '50px' }}>{content.chapter}. {content.Title}</Form.Label>
          <div className='editcontent m-5'>
            {content.Content}
          </div>
        </div>

      </Container>
    </>
  );
}

export default Editnovel;