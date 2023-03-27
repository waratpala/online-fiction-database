import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import Header from './Header';
import './style/NovelDetail.css'
import { AiOutlinePlusCircle} from "react-icons/ai";
import { BsPencilSquare} from "react-icons/bs";
function Noveldetail() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <Header/>
        <Container>
            <div className='controlitemdetail m-3'>
                <Form.Label className='texttitle' style={{ backgroundColor:'#00ADB5',display:'block',color:'white' }}>ชื่อนิยาย</Form.Label>
                    <Row >
                        <Col sm={4}>
                            <div className="card m-3">
                                <div> 
                                    <h3 style={{color:'black',marginLeft:'175px'}}><BsPencilSquare/></h3>
                                    <img src="https://th.bing.com/th/id/R.3fde1cc4966dd166bfb2de60ddd307cc?rik=D70I%2bQ3r0fO0Jw&pid=ImgRaw&r=0" alt="" style={{ height:'200px'}} />
                                </div>
                            </div>
                        
                        </Col>
                        <Col sm={8}>
                            <div className='CourseDetails m-3'>
                                    <img src='./images/d-1.png' style={{ width:'100%',height:'200px'}}/>
                            </div>
                            
                        </Col>
                    </Row>
                <Form.Group className='textepisodedetail'>
                    <Form.Label >สารบัญตอน</Form.Label>
                    <h3 className='btnadd' >  <AiOutlinePlusCircle /></h3>
                </Form.Group>
                <Table className='listnamedetail'>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>ชื่อตอน</th>
                        <th>ลักษณะตอน</th>
                        <th style={{width:'130px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>ตอนที่ 1</td>
                        <td>ตอนที่ 1</td>
                        <td>
                            <div className='button1'>
                            {/* <i style={{color:'white'}} as={Link} to="/naveledit"><BsPencilSquare/></i> */}
                            <Button variant="secondary" as={Link} to="/naveledit">
                                แก้ไข
                            </Button>
                                    <Button variant="danger" onClick={handleShow}>
                                    ลบ
                                        </Button>

                                        <Modal show={show} onHide={handleClose} className="modal1">
                                            <Modal.Body >ยืนยันการลบ</Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant="danger" onClick={handleClose}>
                                                ตกลง
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
                            </div>
                        </td>
                        </tr>
                        <tr>
                        <td>2</td>
                        <td>ตอนที่ 2</td>
                        <td>ตอนที่ 2</td>
                        <td>
                        <div className='button1'>
                        <i style={{color:'white',fontSize:'30px'}}><BsPencilSquare/></i>
                                    <Button variant="danger" onClick={handleShow}>
                                    ลบ
                                        </Button>

                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                            {/* <Modal.Title>Modal heading</Modal.Title> */}
                                            </Modal.Header>
                                            <Modal.Body>ยืนยันการลบ</Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant="danger" onClick={handleClose}>
                                                ตกลง
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
                            </div>
                        </td>
                        </tr>
                        <tr>
                        <td>3</td>
                        <td>ตอนที่ 3</td>
                        <td>ตอนที่ 3</td>
                        <td>
                        <div className='button1'>
                            <Button variant="secondary" onClick={handleClose}>
                                แก้ไข
                            </Button>
                                    <Button variant="danger" onClick={handleShow}>
                                    ลบ
                                        </Button>

                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                            {/* <Modal.Title>Modal heading</Modal.Title> */}
                                            </Modal.Header>
                                            <Modal.Body>ยืนยันการลบ</Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                ยกเลิก
                                            </Button>
                                            <Button variant="danger" onClick={handleClose}>
                                                ตกลง
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Container>
    </>
  );
}

export default Noveldetail;