import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useParams, Link } from "react-router-dom";
import Header from './Header';
import './style/NovelDetail.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencilSquare, BsFillTrashFill } from "react-icons/bs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LineChart from './LineChart';

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
    const [editAbstract, setEditAbstract] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [errors, setErrors] = useState({});
    const [chart, setChart] = useState(false);


    const [loading, setLoading] = useState(false);

    const chartToggle = () => setChart(!chart);
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
    const editAbstractToggle = () => setEditAbstract(!editAbstract);

    const [fictionInfo, setFictionInfo] = useState("");
    const [fictionName, setfictionName] = useState("");
    const [abstract, setAbstract] = useState("");
    const [newFictionName, setNewFictionName] = useState("");
    const [newAbstract, setNewAbstract] = useState("");
    const [sort, setSort] = useState("ASC");

    const [images, setImages] = useState([]);
    const [imagesShow, setImagesShow] = useState("");
    const [imageURL, setImageURL] = useState([]);

    const [modalChapterID, SetModalChapterID] = useState(0)
    const [modalChapterName, SetModalChapterName] = useState(0)

    const [chapterTitle, setChapterTitle] = useState('')
    const [chapterContent, setChapterContent] = useState('')
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0])

    const options = {
        color: '#FFFF',
        font: 20,
        plugins: {
            title: {
                display: true,
                text: 'ภาพรวมของนิยาย',
                color: '#FFFF',
                font: {
                    size: 20,
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
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
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
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
            });
    }

    const newChapter = () => {

        let err = { ...errors, NewChapterTitleErr: null, NewChapterContentErr: null }

        if (chapterTitle.trim() === "") {
            err.NewChapterTitleErr = "chapter name is a required field."
        } else {
            err.NewChapterTitleErr = null
        }
        if (chapterContent.trim() === "") {
            err.NewChapterContentErr = "chapter content is a required field."
        } else {
            err.NewChapterContentErr = null
        }

        if (err.NewChapterTitleErr === null && err.NewChapterContentErr === null) {
            let formData = new FormData();
            formData.append('title', chapterTitle);
            formData.append('content', chapterContent);

            const AuthStr = 'Bearer ' + token;
            setLoading(true);
            axios.post("http://127.0.0.1:5000/writer/" + fictionid, formData, { headers: { Authorization: AuthStr } })
                .then(response => {
                    setRefreshKey(oldKey => oldKey + 1)
                    setChapterTitle('')
                    setChapterContent('')
                    newClose()
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        window.location.replace('http://localhost:3000/');
                    }
                    if (error.response.status === 403) {
                        window.location.replace('http://localhost:3000/403');
                    }
                    if (error.response.status === 500) {
                        window.location.replace('http://localhost:3000/500');
                    }
                    setLoading(false);
                });
        }

        setErrors(err)
    };

    const editChapter = () => {

        let err = { ...errors, EditChapterTitleErr: null, EditChapterContentErr: null }

        if (chapterTitle.trim() === "") {
            err.EditChapterTitleErr = "chapter name is a required field."
        } else {
            err.EditChapterTitleErr = null
        }
        if (chapterContent.trim() === "") {
            err.EditChapterContentErr = "chapter content is a required field."
        } else {
            err.EditChapterContentErr = null
        }

        if (err.EditChapterTitleErr === null && err.EditChapterContentErr === null) {
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
                    if (error.response.status === 500) {
                        window.location.replace('http://localhost:3000/500');
                    }
                });
        }
        setErrors(err)
    };

    function deleteChapter() {
        const url = 'http://127.0.0.1:5000/writer/' + fictionid + '/' + modalChapterID
        const AuthStr = 'Bearer ' + token;
        axios.delete(url, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                deleteCClose()
                if (response.status === 200) {
                    fictionInfo.chapterlist = fictionInfo.chapterlist.filter((val) => {
                        return val.chapterID !== modalChapterID
                    })
                }
            })
            .catch(function (error) {
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
            });
    }

    useEffect(() => {
        // let url = "http://127.0.0.1:5000/" + fictionid + "?sort=" + sort
        let url = "http://127.0.0.1:5000/writer/" + fictionid + "?sort=" + sort
        const AuthStr = 'Bearer ' + token;
        axios.get(url, { headers: { Authorization: AuthStr } })
            .then(response => {
                setFictionInfo(response.data)
                setfictionName(response.data.fictionName)
                setAbstract(response.data.abstract)
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
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
            });

    }, [refreshKey])

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

    function handleEditName() {

        let err = { ...errors, editFictionNameErr: null }

        if (newFictionName.trim() === "") {
            err.editFictionNameErr = "fiction name is a required field."
        } else {
            err.editFictionNameErr = null
        }

        console.log(err)
        if (err.editFictionNameErr === null) {
            let data = new FormData();
            data.append('title', newFictionName);

            const AuthStr = 'Bearer ' + token;
            const url = 'http://127.0.0.1:5000/fiction/name/' + fictionid

            axios.put(url, data, { headers: { Authorization: AuthStr } })
                .then(function (response) {
                    setfictionName(newFictionName)
                    editNameToggle()
                })
                .catch(function (error) {
                    if (error.response.status === 401) {
                        window.location.replace('http://localhost:3000/');
                    }
                    if (error.response.status === 403) {
                        window.location.replace('http://localhost:3000/403');
                    }
                    if (error.response.status === 500) {
                        window.location.replace('http://localhost:3000/500');
                    }
                });
        }
        setErrors(err)
    }

    function handleEditAbstract() {

        let data = new FormData();
        data.append('abstract', newAbstract);

        const AuthStr = 'Bearer ' + token;
        const url = 'http://127.0.0.1:5000/fiction/abstract/' + fictionid

        axios.put(url, data, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                setAbstract(newAbstract)
                editAbstractToggle()
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    window.location.replace('http://localhost:3000/');
                }
                if (error.response.status === 403) {
                    window.location.replace('http://localhost:3000/403');
                }
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
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
                if (error.response.status === 500) {
                    window.location.replace('http://localhost:3000/500');
                }
            });
    }

    return (
        <>
            <Header />
            <Container>
                <div className='controlitem-detail'>
                    <div style={{ backgroundColor: '#222831', paddingBottom: '5px' }}>
                        <Form.Label className='text-title' style={{ backgroundColor: '#00ADB5', display: 'block', color: 'white' }}>
                            {editName ?
                                <>
                                    <Row>
                                        <div className="col-md-4">
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={fictionName}
                                                    onChange={event => setNewFictionName(event.target.value)}
                                                    isInvalid={!!errors.editFictionNameErr}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.editFictionNameErr}</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Button onClick={() => {
                                                setfictionName(newFictionName)
                                                handleEditName()
                                            }}>
                                                บันทึก
                                            </Button>
                                            <Button variant="secondary" onClick={editNameToggle}>
                                                ยกเลิก
                                            </Button>
                                        </div>
                                        <div className="col-md-4">
                                            <i variant="secondary" style={{ float: 'right', color: 'red', marginRight: "0.5%", marginTop: "0.5%", fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                                deleteFShow()
                                            }}>
                                                <BsFillTrashFill />
                                            </i>
                                        </div>
                                    </Row>
                                </>
                                :
                                <>
                                    {fictionName}
                                    <BsPencilSquare style={{ cursor: 'pointer' }} onClick={editNameToggle} />
                                    <i variant="secondary" style={{ float: 'right', color: 'white', marginRight: "0.5%", marginTop: "0.5%", fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                        deleteFShow()
                                    }}>
                                        <BsFillTrashFill />
                                    </i>
                                </>
                            }
                        </Form.Label>

                        <Row className='row-type'>
                            <Col sm={3}>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ color: 'black', marginLeft: '175px' }}>
                                        <BsPencilSquare style={{ cursor: 'pointer', color: 'white' }} onClick={() => editImageShow()} />
                                    </h3>
                                    <div>
                                        <img src={imagesShow} alt="" width={200} height={300} style={{ alignSelf: 'center', resizeMode: 'stretch', }} />
                                    </div>
                                </div>

                            </Col>
                            <Col sm={9}>
                                {editAbstract ?
                                    <>
                                        <div className='CourseDetails m-3'>
                                            <div className='CourseDetails m-3'>
                                                <Form.Group className='mt-2'>
                                                    <Form.Label >เรื่องย่อ</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={8}
                                                        defaultValue={abstract}
                                                        onChange={event => setNewAbstract(event.target.value)}
                                                    />
                                                </Form.Group>
                                                <Button onClick={() => {
                                                    setAbstract(newAbstract)
                                                    handleEditAbstract()
                                                }}>
                                                    บันทึก
                                                </Button>
                                                <Button variant="secondary" onClick={editAbstractToggle}>
                                                    ยกเลิก
                                                </Button>
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className='CourseDetails m-3'>
                                            <Form.Group className='mt-2'>
                                                <Row className='mb-2 justify-content-between'>
                                                    <Col sm={2}>
                                                        <Form.Label>เรื่องย่อ</Form.Label>
                                                        <BsPencilSquare style={{ cursor: 'pointer', color: 'white' }} onClick={() => editAbstractToggle()} />
                                                    </Col>
                                                    <Col sm={3}>
                                                        <Button onClick={chartToggle} style={{ width: '100%', backgroundColor: '#00ADB5' }}>แสดงกราฟ</Button>
                                                    </Col>
                                                </Row>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={8}
                                                    defaultValue={abstract}
                                                    disabled
                                                    readOnly
                                                />
                                            </Form.Group>
                                        </div>
                                    </>
                                }
                            </Col>
                        </Row>
                    </div>

                    <Form.Group className='text-episode-detail'>
                        <h4>สารบัญตอน</h4>
                        <h3 className='btn-add' onClick={() => {
                            setChapterTitle("")
                            setChapterContent("")
                            newShow()
                        }}><AiOutlinePlusCircle /></h3>
                    </Form.Group>

                    <div style={{ backgroundColor: '#222831', marginBottom: '5%', paddingBottom: '5px', paddingLeft: '5px', paddingInlineStart: '5px' }}>
                        <Table className='listnamedetail'>
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>#</th>
                                    <th style={{ width: '50%' }}>ชื่อตอน</th>
                                    <th style={{ width: '15%' }}>ประเถทหลัก</th>
                                    <th style={{ width: '15%' }}>ประเถทรอง</th>
                                    <th style={{ width: '8%' }}></th>
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
                                        <td>
                                            <div className='button1'>
                                                <i variant="secondary" style={{ color: 'white', marginRight: '5px', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                                    SetModalChapterID(item.chapterID)
                                                    SetModalChapterName(item.title)
                                                    getChapterInfo(item.chapterID)
                                                }}>
                                                    <BsPencilSquare />
                                                </i>
                                                <i variant="danger" style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                                    SetModalChapterID(item.chapterID)
                                                    SetModalChapterName(item.title)
                                                    deleteCShow()
                                                }}>
                                                    <BsFillTrashFill />
                                                </i>

                                            </div>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </Table>
                    </div>
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
                    <Form.Group>
                        <Form.Label>ชื่อตอน</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={chapterTitle}
                            style={{ fontSize: 20 }}
                            onChange={event => setChapterTitle(event.target.value)}
                            isInvalid={!!errors.EditChapterTitleErr}
                        />
                        <Form.Control.Feedback type="invalid">{errors.EditChapterTitleErr}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mt-2'>
                        <Form.Label>เนื่อหา</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={20}
                            defaultValue={chapterContent}
                            style={{ fontSize: 20 }}
                            onChange={event => setChapterContent(event.target.value)}
                            isInvalid={!!errors.EditChapterContentErr}
                        />
                        <Form.Control.Feedback type="invalid">{errors.EditChapterContentErr}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={() => {
                        editClose()
                        setErrors({ ...errors, EditChapterTitleErr: null, EditChapterContentErr: null })
                    }}>
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
                    <Form.Group>
                        <Form.Label>ชื่อตอน</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={chapterTitle}
                            style={{ fontSize: 20 }}
                            onChange={event => setChapterTitle(event.target.value)}
                            isInvalid={!!errors.NewChapterTitleErr}
                        />
                        <Form.Control.Feedback type="invalid">{errors.NewChapterTitleErr}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mt-2'>
                        <Form.Label>เนื่อหา</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={20}
                            defaultValue={chapterContent}
                            style={{ fontSize: 20 }}
                            onChange={event => setChapterContent(event.target.value)}
                            isInvalid={!!errors.NewChapterContentErr}
                        />
                        <Form.Control.Feedback type="invalid">{errors.NewChapterContentErr}</Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={() => {
                        newClose()
                        setErrors({ ...errors, NewChapterTitleErr: null, NewChapterContentErr: null })
                    }}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => { newChapter() }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={editImage} onHide={editImageClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Update Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <img src={imageURL} width={200} height={300} style={{ alignSelf: 'center', resizeMode: 'cover', }} />
                    <div >
                        <label className="input-choose-image" htmlFor="inputGroupFile">choose image</label>
                        <input type="file" accept="image/*" id="inputGroupFile" onChange={onImageChage} style={{ display: 'none' }}></input>
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


            <Modal show={loading}>
                <Modal.Body className='modalBody'>
                    <h1 style={{ textAlign: 'center' }}>Loading</h1>
                </Modal.Body>
            </Modal>

            <Modal show={chart} size='xl' onHide={chartToggle}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>ประเภทนิยาย</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <Row>
                        <Col sm={4}>
                            <div className='CourseDetails m-3' >
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

export default Noveldetail;