import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/Edit.css'


function Editnovel() {
  let token = sessionStorage.getItem("token");
  const { chapterid } = useParams();
  const { fictionid } = useParams();
  const [contentInfo, setFictionInfo] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");

  useEffect(() => {

    let url = "http://127.0.0.1:5000/content/" + chapterid
    // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';
    axios.get(url, { headers: { Authorization: AuthStr } })
      .then(response => {
        if (response.status == 200) {
          setFictionInfo(response.data)
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
    formData.append('title', title);
    formData.append('content', content);

    // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';


    axios.put("http://127.0.0.1:5000/writer/" + fictionid + "/" + chapterid, formData, { headers: { Authorization: AuthStr } })
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
            <Form.Label className='texttitleedit' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white', width: '100%', height: '50px' }}>{contentInfo.fiction_name}</Form.Label>
            <Form.Control type="text" name="inputChapter" defaultValue={contentInfo.chapter} onChange={e => setChapter(e.target.value)} />
            <Form.Control type="text" name="inputTitle" defaultValue={contentInfo.title} onChange={e => setTitle(e.target.value)} />
            <Form.Control className='editcontent m-5' type="text" name="inputContent" defaultValue={contentInfo.content} onChange={e => setContent(e.target.value)} />
            <Button type='submit' variant="info">บันทึก</Button>
            <Button variant="danger" as={Link} to={`/naveldetail/${contentInfo.fictionID}`}>ยกเลิก</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default Editnovel;