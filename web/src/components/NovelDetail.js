import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useParams } from "react-router-dom";
import Header from './Header';
import './style/NovelDetail.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

ChartJS.register(ArcElement, Tooltip, Legend);

function Noveldetail() {

    const token = sessionStorage.getItem("token");
    const { fictionid } = useParams();
    const [delF, setDelF] = useState(false);
    const [delC, setDelC] = useState(false);
    const [newC, setNewC] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [editName, setEditName] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const deleteFClose = () => setDelF(false);
    const deleteFShow = () => setDelF(true);

    const deleteCClose = () => setDelC(false);
    const deleteCShow = () => setDelC(true);

    const newClose = () => setNewC(false);
    const newShow = () => setNewC(true);

    const editClose = () => setEdit(false);
    const editShow = () => setEdit(true);

    const editImageClose = () => setEditImage(false);
    const editImageShow = () => setEditImage(true);
    const [selectedFile, setSelectedFile] = useState(null);

    const editNameToggle = () => setEditName(!editName);

    const [fictionInfo, setFictionInfo] = useState("");
    const [fictionName, setfictionName] = useState("");
    const [newFictionName, setNewFictionName] = useState("");
    const [sort, setSort] = useState("DESC");

    const [images, setImages] = useState([]);
    const [imagesShow, setImagesShow] = useState("");
    const [imageURL, setImageURL] = useState([]);

    const [modalChapterID, SetModalChapterID] = useState(0)
    const [modalChapterName, SetModalChapterName] = useState(0)

    const [chapterTitle, setChapterTitle] = useState('')
    const [chapterContent, setChapterContent] = useState('')
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0])

    // const options = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //     },
    //     scales: {
    //         y: {
    //             min: 1,
    //             max: 7,
    //             stepSize: 1,
    //             ticks: {
    //                 beginAtZero: false,
    //                 callback: function (value, index, ticks) {
    //                     return category(value);
    //                 }
    //             }
    //         }
    //     },
    // };

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

    const getChapterInfo = (chapterID) => {
        let url = "http://127.0.0.1:5000/content/" + chapterID
        axios.get(url)
            .then(response => {
                setChapterTitle(response.data.title);
                setChapterContent(response.data.content);
                editShow()
            })
            .catch(error => {
                window.location.replace('http://localhost:3000/500');
            });
    }

    function deleteFiction() {
        const url = 'http://127.0.0.1:5000/writer/' + fictionid
        const AuthStr = 'Bearer ' + token;
        axios.delete(url, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                window.location.replace('http://localhost:3000/createnovel');
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                window.location.replace('http://localhost:3000/500');
            });
    }

    const newChapter = () => {

        let formData = new FormData();
        formData.append('title', chapterTitle);
        formData.append('content', chapterContent);

        const AuthStr = 'Bearer ' + token;
        axios.post("http://127.0.0.1:5000/writer/" + fictionid, formData, { headers: { Authorization: AuthStr } })
            .then(response => {
                setRefreshKey(oldKey => oldKey + 1)
                newClose()
            })
            .catch(error => {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                window.location.replace('http://localhost:3000/500');
            });
    };

    const editChapter = () => {

        let formData = new FormData();
        formData.append('title', chapterTitle);
        formData.append('content', chapterContent);

        const AuthStr = 'Bearer ' + token;
        axios.put("http://127.0.0.1:5000/writer/" + fictionid + "/" + modalChapterID, formData, { headers: { Authorization: AuthStr } })
            .then(response => {
                editClose()
            })
            .catch(error => {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                window.location.replace('http://localhost:3000/500');
            });
    };

    function deleteChapter() {
        const url = 'http://127.0.0.1:5000/writer/' + fictionid + '/' + modalChapterID
        const AuthStr = 'Bearer ' + token;
        axios.delete(url, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                deleteCClose()
                if (response.status === 200) {
                    fictionInfo.chapterlist = fictionInfo.chapterlist.filter((val) => {
                        return val.chapterID != modalChapterID
                    })
                }
            })
            .catch(function (error) {
        if (error.response.status === 403) {
            window.location.replace('http://localhost:3000/403');
        }
        window.location.replace('http://localhost:3000/500');
            });
    }

    useEffect(() => {
        let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        const AuthStr = 'Bearer ' + token;
        axios.get(url, { headers: { Authorization: AuthStr } })
            .then(response => {
                setFictionInfo(response.data)
                setfictionName(response.data.fictionName)
                setImageURL(response.data.picture)
                setImagesShow(response.data.picture)
            }).catch(error => {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                console.log(error)
                window.location.replace('http://localhost:3000/500');
            });

    }, [refreshKey])

    // var data = {
    //     labels: fictionInfo?.chapterlist?.map((item, index) => (item.chapter)),
    //     datasets: [
    //         {
    //             label: 'Chapter',
    //             data: fictionInfo?.chapterlist?.map((item, index) => (item.category)),
    //             borderColor: 'rgb(255, 99, 132)',
    //             backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //         },
    //     ],
    // };

    useEffect(() => {
        if (images.length < 1) return;
        const newImageURL = [];
        images.forEach((image) => newImageURL.push(URL.createObjectURL(image)));
        setImageURL(newImageURL);
    }, [images]);

    function onImageChage(e) {
        setImages([...e.target.files]);
        setSelectedFile(e.target.files[0])
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

    function handleWditName() {

        let data = new FormData();
        data.append('title', newFictionName);

        const AuthStr = 'Bearer ' + token;
        const url = 'http://127.0.0.1:5000/fiction/name/' + fictionid

        axios.put(url, data, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                setfictionName(newFictionName)
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                window.location.replace('http://localhost:3000/500');
            });
    }

    function handleWditImage() {

        let data = new FormData();
        data.append("fiction_image", selectedFile);


        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:5000/fiction/image/' + fictionid,
            headers: {
                'Authorization': 'Bearer ' + token,
                "Content-Type": "multipart/form-data"
            },
            data: data
        };

        axios.request(config)
            .then(function (response) {
                setImagesShow(imageURL)
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                window.location.replace('http://localhost:3000/500');
            });
    }

    return (
        <>
            <Header />
            <Container>
                <div className='controlitemdetail m-3'>
                    <Form.Label className='texttitle' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white' }}>
                        {editName ?
                            <>
                                <input type='text' onChange={event => setNewFictionName(event.target.value)} defaultValue={fictionName}></input>
                                <Button onClick={() => {
                                    setfictionName(newFictionName)
                                    editNameToggle()
                                    handleWditName()
                                }}>
                                    บันทึก
                                </Button>
                                <Button onClick={editNameToggle}>
                                    ยกเลิก
                                </Button>
                            </>
                            :
                            <>
                                {fictionName}
                                <BsPencilSquare onClick={editNameToggle} />
                            </>
                        }
                        <Button variant="secondary" onClick={() => {
                            deleteFShow()
                        }}>
                            ลบ
                        </Button>
                    </Form.Label>

                    <Row >
                        <Col sm={4}>
                            <div className="card m-3">
                                <div>
                                    <h3 style={{ color: 'black', marginLeft: '175px' }}>
                                        <BsPencilSquare onClick={() => editImageShow()} />
                                    </h3>
                                    <img src={imagesShow} alt="" style={{ height: '200px' }} />
                                </div>
                            </div>

                        </Col>
                        <Col sm={8}>
                            <div className='CourseDetails'>
                                <div style={{ width: '100%', height: '300px' }}>
                                    {/* <Line options={options} data={data} /> */}
                                    <Pie options={options} data={piedata} />
                                </div>
                            </div>

                        </Col>
                    </Row>
                    <Form.Group className='textepisodedetail'>
                        <Form.Label >สารบัญตอน</Form.Label>
                        <h3 className='btnadd' onClick={() => {
                            setChapterTitle("")
                            setChapterContent("")
                            newShow()
                        }}><AiOutlinePlusCircle /></h3>
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
                            {fictionInfo?.chapterlist?.map((item, index) => (

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
                                                deleteCShow()
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

            <Modal show={delF} onHide={deleteFClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Delete Fiction</Modal.Title>
                </Modal.Header>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={deleteFClose}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { deleteFiction() }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={delC} onHide={deleteCClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Delete Chapter</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <label>ทำการลบเนื้อหาจากตอน {modalChapterName}</label>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={deleteCClose}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { deleteChapter() }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={edit} fullscreen={true} onHide={editClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Edit Chapter</Modal.Title>
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
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={newC} fullscreen={true} onHide={newClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>New Chapter</Modal.Title>
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
                    <Button variant="secondary" onClick={newClose}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { newChapter() }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={editImage} onHide={editImageClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Udate Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <img src={imageURL} height={200} />
                    <div>
                        <input type="file" accept="image/*" onChange={onImageChage}></input>
                    </div>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={() => {
                        setImageURL(fictionInfo.picture)
                        editImageClose()
                    }}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => {
                        handleWditImage()
                        editImageClose()
                    }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Noveldetail;