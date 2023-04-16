import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/NovelContent.css';

function Novelcontent() {
    const { fictionid } = useParams();
    const [ficrionInfo, setFicrionInfo] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("DESC");


    useEffect(() => {
        let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        axios.get(url)
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

    const handleClick = event => {
    };

    return (
        <>
            <Header />
            <Container>
                <div className='controlitemcontent m-3'>
                    <Form.Label className='textcontent' >นิยาย</Form.Label>
                    <Row >
                        <Col sm={4}>
                            <div className="card m-3">
                                <div>
                                    <img src={ficrionInfo.picture} alt="" style={{ width: '200px', height: '200px' }} />
                                </div>
                            </div>

                        </Col>
                        <Col sm={8}>
                            <h2 className='m-2'>{ficrionInfo.fictionName}</h2>
                            <div className='img-starCouse '>
                                <h4 >โดย {ficrionInfo.user_name}</h4>
                            </div>
                            <div className='CourseDetails m-3'>
                                <img src="./images/d-1.png" style={{ width: '100%', height: '200px' }} />
                            </div>

                        </Col>
                    </Row>
                    <Form.Group className='textepisode'>
                        <Form.Label  >สารบัญตอน</Form.Label>
                        <Button onClick={handleClick} className='btnsort'>  ↿ ⇂ ตอนล่าสุด</Button>

                    </Form.Group>


                    <Table className='listname'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อตอน</th>
                                <th style={{ width: '130px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ficrionInfo?.chapterlist?.map((item, index) => (
                                <tr key={item.chapterID}>
                                    <td>#{item.chapter}</td>
                                    <td>{item.title}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default Novelcontent;