import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/Read.css'


function ReadNovel() {
  let token = sessionStorage.getItem("token");
  const { chapterid } = useParams();
  const [contentInfo, setContentInfo] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {

    let url = "http://127.0.0.1:5000/content/" + chapterid
    axios.get(url)
      .then(response => {
        if (response.status === 200) {
          setContentInfo(response.data)
          console.log(response.data)
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          window.location.replace('http://localhost:3000/500');
        }
      });
  }, [])

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  useEffect(resizeTextArea, [contentInfo]);

  return (
    <>
      <Header />
      <Container>
        <div className='controlitem-read'>
          <Form.Label className='text-title' >
            {contentInfo.fiction_name}
          </Form.Label>
          <div className='editcontent m-5'>
            <div>#{contentInfo.chapter} {contentInfo.title}</div>
            <div className='CourseDetails m-3'>
              <Form.Group className='mt-2'>
                <Form.Label>เรื่องย่อ</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={textAreaRef}
                  defaultValue={contentInfo.content}
                  disabled
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        </div>

      </Container>
    </>
  );
}

export default ReadNovel;