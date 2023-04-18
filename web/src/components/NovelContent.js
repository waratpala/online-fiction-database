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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';


function Novelcontent() {
    const { fictionid } = useParams();
    const [fictionInfo, setFictionInfo] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("DESC");
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0,]);

    useEffect(() => {
        let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        axios.get(url)
            .then(response => {
                setFictionInfo(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [sort])

    const options = {
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

    useEffect(() => {
        setData([fictionInfo?.chapter_cat?.c2,
        fictionInfo?.chapter_cat?.c3,
        fictionInfo?.chapter_cat?.c4,
        fictionInfo?.chapter_cat?.c5,
        fictionInfo?.chapter_cat?.c6,
        fictionInfo?.chapter_cat?.c7,
        fictionInfo?.chapter_cat?.c1,])
    }, [fictionInfo])

    var piedata = {
        labels: ['นิยายระทึกขวัญ', 'นิยายสืบสวน', 'นิยายแฟนตาซี', 'นิยายวิทยาศาสตร์', 'นิยายแอ๊คชั่น', 'นิยายรักดราม่า', 'ไม่พบข้อมูล'],
        datasets: [
            {
                label: '% of categoty',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    function handleClick() {
        if (sort == "DESC") {
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
                <div className='controlitemcontent m-3'>
                    <Form.Label className='textcontent' >นิยาย</Form.Label>
                    <Row >
                        <Col sm={4}>
                            <div className="card m-3">
                                <div>
                                    <img src={fictionInfo.picture} alt="" style={{ width: '200px', height: '200px' }} />
                                </div>
                            </div>

                        </Col>
                        <Col sm={8}>
                            <h2 className='m-2'>{fictionInfo.fictionName}</h2>
                            <div className='img-starCouse '>
                                <h4 >โดย {fictionInfo.user_name}</h4>
                            </div>
                            <div className='CourseDetails m-3'>
                                <div style={{ width: '100%', height: '300px' }}>
                                    <Pie options={options} data={piedata} />
                                </div>
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
                            {fictionInfo?.chapterlist?.map((item, index) => (
                                <tr key={item.chapterID}>
                                    <td>#{item.chapter}</td>
                                    <td>
                                        <Link to={"/novelread/" + fictionid + "/" + item.chapterID} >{item.title}</Link>
                                    </td>
                                    <td></td>
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