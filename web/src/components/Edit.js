import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect, formData } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/Edit.css'


function Editnovel() {
  let token = sessionStorage.getItem("token");
  const [contentInfo, setFictionInfo] = useState("");
  const [fiction, setFiction] = useState("");
  const [content, setContent] = useState("");
  const [chapter, setChapter] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {

    let url = "http://127.0.0.1:5000/content/" + "1"
    // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';
    axios.get(url, { headers: { Authorization: AuthStr } })
      .then(response => {
        if (response.status == 200) {
          setFiction(response.data.fiction_name)
          setChapter(response.data.chapter)
          setTitle(response.data.title)
          setContent(response.data.content)
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

  let handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('title', '11111111111111111111');
    formData.append('content', '1111111111111111111');

    // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';


    axios.put("http://127.0.0.1:5000/writer/1/1", formData, { headers: { Authorization: AuthStr } })
      .then(response => {
        if (response.status == 201) {
          sessionStorage.setItem("token", response.data.token);
        }
        if (response.status == 400) {
          if (response.data.status = "Duplicate Name") {

          }
        }
        if (response.status == 404) {

        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      <Container>
        <Form className="Regist" onSubmit={handleSubmit}>
          <div className='controlitem m-3' style={{ backgroundColor: '#393E46' }}>
            <Form.Label className='texttitleedit' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white', width: '100%', height: '50px' }}>{fiction}</Form.Label>
            <Form.Control type="text" name="inputChapter" defaultValue={chapter} onChange={e => setChapter(e.target.value)} />
            <Form.Control type="text" name="inputTitle" defaultValue={title} onChange={e => setTitle(e.target.value)} />
            <Form.Control className='editcontent m-5' type="text" name="inputContent" defaultValue={content} onChange={e => setContent(e.target.value)} />
            <Button type='submit' variant="info">บันทึก</Button>
            <Button variant="danger" >ยกเลิก</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default Editnovel;