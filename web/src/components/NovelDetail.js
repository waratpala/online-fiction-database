import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Link, useParams } from "react-router-dom";
import Header from './Header';
import './style/NovelDetail.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";

function Noveldetail() {
    const { fictionid } = useParams();
    const [del, setDel] = useState(false);
    const [edit, setEdit] = useState(false);

    const deleteClose = () => setDel(false);
    const deleteShow = () => setDel(true);

    const editClose = () => setEdit(false);
    const editShow = () => setEdit(true);

    const [ficrionInfo, setFicrionInfo] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("DESC");
    const [endpoint, setEndpoint] = useState(null);

    const [modalChapterID, SetModalChapterID] = useState(0)
    const [modalChapterName, SetModalChapterName] = useState(0)

    const [chapterTitle, setChapterTitle] = useState(0)
    const [chapterContent, setChapterContent] = useState(0)

    const getChapterInfo = (chapterID) => {
        let url = "http://127.0.0.1:5000/content/" + chapterID
        axios.get(url)
            .then(response => {
                setChapterTitle(response.data.title);
                setChapterContent(response.data.content);
                editShow()
            })
            .catch(error => {
                console.log(error);
            });
    }

    const editChapter = () => {

        let formData = new FormData();
        formData.append('title', chapterTitle);
        formData.append('content', chapterContent);

        const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
        axios.put("http://127.0.0.1:5000/writer/" + fictionid + "/" + modalChapterID, formData, { headers: { Authorization: AuthStr } })
            .then(response => {
                editClose()
            })
            .catch(error => {
                console.log(error);
            });
    };


    useEffect(() => {
        let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
        const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';
        axios.get(url, { headers: { Authorization: AuthStr } })
            .then(response => {
                if (response.status == 200) {
                    setFicrionInfo(response.data)
                }
                if (response.status == 400) {

                }
                if (response.status == 404) {

                }
            })
            .catch(error => {
                console.log(error);
            });

    }, [sort])

    function deleteChaptet() {
        console.log(4554)
        // setShow(false)
        // const url = 'http://127.0.0.1:5000/writer/' + fictionid + '/' + categoryID
        // // const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
        // const AuthStr = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODE0NjU2MDMsImlhdCI6MTY4MTM3OTE0Mywic3ViIjp7InVzZXIiOjF9fQ.iSxROETQ_-GhIhWy3EeeSAJquFkgetWfa46aQMYDbYo';
        // axios.delete(url, { headers: { Authorization: AuthStr } })
        //     .then(function (response) {
        //         console.log(response.data)
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    }

    function category(categoryID) {
        switch (categoryID) {
            case 2:
                return 'นิยายระทึกขวัญ';
            case 3:
                return 'นิยายสืบสวน';
            case 4:
                return 'นิยายแฟนตาซี';
            case 5:
                return 'นิยายวิทยาศาสตร์';
            case 6:
                return 'นิยายแอ๊คชั่น';
            case 7:
                return 'นิยายรักดราม่า';
            default:
                return 'ไม่พบข้อมูล';;
        }
    }

    return (
        <>
            <Header />
            <Container>
                <div className='controlitemdetail m-3'>
                    <Form.Label className='texttitle' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white' }}>{ficrionInfo.fictionName}</Form.Label>
                    <Row >
                        <Col sm={4}>
                            <div className="card m-3">
                                <div>
                                    <h3 style={{ color: 'black', marginLeft: '175px' }}><BsPencilSquare /></h3>
                                    <img src={ficrionInfo.picture} alt="" style={{ height: '200px' }} />
                                </div>
                            </div>

                        </Col>
                        <Col sm={8}>
                            <div className='CourseDetails m-3'>
                                <img src='./images/d-1.png' style={{ width: '100%', height: '200px' }} />
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
                                <th style={{ width: '130px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ficrionInfo?.chapterlist?.map((item, index) => (

                                <tr key={item.chapterID}>
                                    <td>#{item.chapter}</td>
                                    <td>{item.title}</td>
                                    <td>{category(item.category)}</td>
                                    <td>
                                        <div className='button1'>
                                            <Button variant="secondary" onClick={() => {
                                                SetModalChapterID(item.chapterID)
                                                SetModalChapterName(item.title)
                                                getChapterInfo(item.chapterID)
                                            }}>
                                                แก้ไข
                                            </Button>
                                            <Button variant="danger" onClick={() => {
                                                SetModalChapterID(item.chapterID)
                                                SetModalChapterName(item.title)
                                                deleteShow()
                                            }}>
                                                ลบ
                                            </Button>

                                        </div>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>

            <Modal show={del} onHide={deleteClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Delete heading</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <label>ทำการลบเนื้อหาจากตอน {modalChapterName}</label>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={deleteClose}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { console.log('test') }}>
                        {/* <Button variant="danger"> */}
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={edit} fullscreen={true} onHide={editClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Edit heading</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <div className="form-group">
                        <label className='form-label'>ชื่อตอน</label>
                        <input type="text" className="form-control" defaultValue={chapterTitle} onChange={event => setChapterTitle(event.target.value)} />
                    </div>
                    <div className="form-group mt-2">
                        <label className='form-label'>เนื่อหา</label>
                        <textarea className="form-control" rows="20" defaultValue={chapterContent} onChange={event => setChapterContent(event.target.value)}></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={editClose}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { editChapter() }}>
                        {/* <Button variant="danger"> */}
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Noveldetail;