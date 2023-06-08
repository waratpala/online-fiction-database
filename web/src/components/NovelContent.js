import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/NovelContent.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LineChart from './LineChart';



function Novelcontent() {
    const { fictionid } = useParams();
    const [fictionInfo, setFictionInfo] = useState("");
    const [sort, setSort] = useState("ASC");
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0,]);
    const [chart, setChart] = useState(false);

    const chartToggle = () => setChart(!chart);

    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        axios.get(url)
            .then(response => {
                setFictionInfo(response.data);
            })
            .catch(error => {
                window.location.replace('http://localhost:3000/500');
            });
    }, [sort])

    const options = {
        color: '#FFFF',
        plugins: {
            title: {
                display: true,
                text: 'ภาพรวมของนิยาย',
                color: '#FFFF',
                font: {
                    size: 20
                }
            },
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 20
                    }
                }
            }
        },
    };

    useEffect(() => {
        setData([fictionInfo?.chapter_cat?.c2,
        fictionInfo?.chapter_cat?.c3,
        fictionInfo?.chapter_cat?.c4,
        fictionInfo?.chapter_cat?.c5,
        fictionInfo?.chapter_cat?.c6,
        fictionInfo?.chapter_cat?.c7,])
    }, [fictionInfo])

    function category(categoryID) {
        switch (categoryID) {
            case 2:
                return 'ระทึกขวัญ';
            case 3:
                return 'สืบสวน';
            case 4:
                return 'แฟนตาซี';
            case 5:
                return 'วิทยาศาสตร์';
            case 6:
                return 'แอ๊คชั่น';
            case 7:
                return 'รักดราม่า';
            default:
                return 'ไม่พบข้อมูล';;
        }
    }

    var piedata = {
        labels: ['ระทึกขวัญ', 'สืบสวน', 'แฟนตาซี', 'วิทยาศาสตร์', 'แอ๊คชั่น', 'รักดราม่า'],
        datasets: [
            {
                label: '% of categoty',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
            },
        ],
    };

    function handleClick() {
        if (sort === "DESC") {
            setSort("ASC")
        }
        else {
            setSort("DESC")
        }
    };

    return (
        <>
            <Header />
            <Container>
                <div className='controlitem-content'>
                    <div style={{ backgroundColor: '#222831', paddingBottom: '5px' }}>
                        <h3 className='text-novelname'>{fictionInfo.fictionName} โดย {fictionInfo.user_name}</h3>
                        <div>
                            <Row className='row-type'>
                                <Col sm={3} >
                                    <div style={{ display: 'flex' }}>
                                        <img src={fictionInfo.picture} alt="" style={{ width: '100%', height: '300px', marginLeft: '10%', marginRight: '10%', resizeMode: 'cover' }} />
                                    </div>
                                </Col>
                                <Col sm={9}>
                                    <div className='CourseDetails m-3'>
                                        <Form.Group className='mt-2'>
                                            <Row className='mb-2 justify-content-between'>
                                                <Col sm={2}>
                                                    <Form.Label>เรื่องย่อ</Form.Label>
                                                </Col>
                                                <Col sm={3}>
                                                    <Button onClick={chartToggle} style={{ width: '100%', backgroundColor: '#00ADB5' }}>แสดงกราฟ</Button>
                                                </Col>
                                            </Row>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                defaultValue={fictionInfo.abstract}
                                                disabled
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                </Col>
                                <Col sm={2} >

                                </Col>
                            </Row>
                        </div>
                    </div>

                    <Form.Group className='text-episode'>
                        <Row className='justify-content-between'>
                            <Col sm={10}>
                                <Form.Label className='m-text-episode'>สารบัญตอน</Form.Label>
                            </Col>
                            <Col sm={2}>
                                <div style={{ paddingTop: 5 }}>
                                    <Button onClick={handleClick} style={{ paddingTop: '10' }} className='btnsort'> ↿⇂</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form.Group>

                    <div style={{ backgroundColor: '#222831', marginBottom: '5%', paddingBottom: '5px', paddingLeft: '5px', paddingInlineStart: '5px' }}>
                        <Table className='listname'>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}>#</th>
                                    <th style={{ width: '40%' }}>ชื่อตอน</th>
                                    <th style={{ width: '15%' }}>ประเถทหลัก</th>
                                    <th style={{ width: '15%' }}>ประเถทรอง</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fictionInfo?.chapterlist?.map((item, index) => (
                                    <tr key={item.chapterID}>
                                        <td>#{item.chapter}</td>
                                        <td>
                                            <Link className='text-reset' to={"/novelread/" + fictionid + "/" + item.chapterID} >{item.title}</Link>
                                        </td>
                                        <td>{category(item.category)}</td>
                                        <td>{category(item.sub_category1) + ', ' + category(item.sub_category2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            <Modal show={chart} size='xl' onHide={chartToggle}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>ประเภทนิยาย</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <Row>
                        <Col sm={4}>
                            <div className='CourseDetails m-3'>
                                <div>
                                    <Pie options={options} data={piedata} />
                                </div>
                            </div>
                        </Col>
                        <Col sm={8}>
                            <div className='CourseDetails m-3'>
                                <LineChart chapterList={fictionInfo?.chapterlist} />
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Novelcontent;