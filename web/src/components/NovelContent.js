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
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';
import { Pie } from 'react-chartjs-2';



function Novelcontent() {
    const { fictionid } = useParams();
    const [fictionInfo, setFictionInfo] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("ASC");
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0,]);


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
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

    useEffect(() => {
        console.log(fictionInfo);
        setData([fictionInfo?.chapter_cat?.c2,
        fictionInfo?.chapter_cat?.c3,
        fictionInfo?.chapter_cat?.c4,
        fictionInfo?.chapter_cat?.c5,
        fictionInfo?.chapter_cat?.c6,
        fictionInfo?.chapter_cat?.c7,
        fictionInfo?.chapter_cat?.c1,])
    }, [fictionInfo])

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

    var piedata = {
        labels: ['นิยายระทึกขวัญ', 'นิยายสืบสวน', 'นิยายแฟนตาซี', 'นิยายวิทยาศาสตร์', 'นิยายแอ๊คชั่น', 'นิยายรักดราม่า', 'ไม่พบข้อมูล'],
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
                    'rgba(255, 255, 255, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 1,
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
                    <h3 className='text-novelname'>{fictionInfo.fictionName} โดย {fictionInfo.user_name}</h3>

                    <Row className='row-type'>
                        <Col sm={3} >
                            <div style={{ textAlign: 'center' }}>
                                <img src={fictionInfo.picture} alt="" width={200} height={300} style={{ alignSelf: 'center', resizeMode: 'stretch', }} />
                            </div>

                        </Col>
                        <Col sm={3}>
                            <div className='CourseDetails m-3'>
                                <div style={{ width: '100%', height: '300px' }}>
                                    <Pie options={options} data={piedata} />
                                </div>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className='CourseDetails m-3'>
                                <Form.Group className='mt-2'>
                                    <Form.Label>เรื่องย่อ</Form.Label>
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
                    </Row>
                    <Form.Group className='text-episode'>
                        <Form.Label className='m-text-episode'>สารบัญตอน</Form.Label>
                        <Button onClick={handleClick} className='btnsort'> ↿⇂</Button>

                    </Form.Group>


                    <Table className='listname'>
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>#</th>
                                <th style={{ width: '50%' }}>ชื่อตอน</th>
                                <th style={{ width: '10%' }}>ประเถทหลัก</th>
                                <th style={{ width: '10%' }}>ประเถทรอง</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fictionInfo?.chapterlist?.map((item, index) => (
                                <tr key={item.chapterID}>
                                    <td>#{item.chapter}</td>
                                    <td>
                                        <Link to={"/novelread/" + fictionid + "/" + item.chapterID} >{item.title}</Link>
                                    </td>
                                    <td>{category(item.category)}</td>
                                    <td>{category(item.sub_category)}</td>
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