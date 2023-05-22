import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import ManageNovelitem from './ManageNovelItem';
import './style/ManageNovel.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import Headerpage from './Header';

function ManageNovel() {
    const token = sessionStorage.getItem("token");
    const [novelList, setNovelList] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setfilter] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("DESC");
    const [refreshKey, setRefreshKey] = useState(0);
    const [errors, setErrors] = useState({});


    const editImageClose = () => setEditImage(false);
    const editImageShow = () => setEditImage(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [fictionName, setFictionName] = useState("");
    const [images, setImages] = useState([]);
    const [imageURL, setImageURL] = useState('http://127.0.0.1:5000/image/default.jpg');

    function handleNewFiction() {

        let err = { ...errors, fictionNaemErr: null }

        if (fictionName.trim() === "") {
            err.fictionNaemErr = "fiction name is a required field."
        } else {
            err.fictionNaemErr = null
        }

        if (err.fictionNaemErr === null) {
            let data = new FormData();
            data.append('fiction_name', fictionName);
            data.append("fiction_image", selectedFile);


            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:5000/writer',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": "multipart/form-data"
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    setFictionName('')
                    setImageURL('http://127.0.0.1:5000/image/default.jpg')
                    setSelectedFile(null)
                    editImageClose()
                    setRefreshKey(oldKey => oldKey + 1)
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


    useEffect(() => {

        let url = "http://127.0.0.1:5000/writer?limit=10&sort=" + sort + "&filter=" + filter + "&search=" + search + "&page=" + String(page)
        const AuthStr = 'Bearer ' + token;
        axios.get(url, { headers: { Authorization: AuthStr } })
            .then(response => {
                setNovelList(response.data)
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
    }, [filter, sort, search, refreshKey])

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

    const searchRef = useRef(null)

    const handleClick = event => {
        setSearch(searchRef.current.value)
    };

    return (
        <>
            <Headerpage />

            <Container>
                <div className='controlitem-manage ' style={{ backgroundColor: '#222831' }}>
                    <Form.Label className='text-manage' >จัดการนิยาย</Form.Label>
                    {/* <Form.Group className="m-3">
                        <Form className="d-flex" >
                            <Form.Control ref={searchRef}
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ width: '20%', height: '50px', marginTop: '0px' }}
                            />
                            <Button onClick={handleClick} variant="outline-info" style={{ width: '10%', height: '50px' }}>ค้นหา</Button>
                            <AiOutlinePlusCircle style={{ width: '20%', height: '50px', cursor: 'pointer', marginLeft: '700px' }} onClick={() => editImageShow()} />
                        </Form>
                    </Form.Group> */}

                    <Form.Group className="search-box-manage">
                        <Form className="box-search-manage" >
                            <i><BsSearch id='search-icon' color='black' /></i>
                                <input ref={searchRef}
                                type="search"
                                placeholder="Search"
                                className="input-search me-2"
                                aria-label="Search"
                                    
                                onSubmit={e => setSearch(e.target.value)}
                                    />
                        </Form>
                        <Button variant="outline-info" onClick={handleClick} >ค้นหา</Button>
                        <AiOutlinePlusCircle className="add-icon"  onClick={() => editImageShow()} />
                    </Form.Group>
                    <hr style={{ color: 'white' }} />

                    <ManageNovelitem novelList={novelList} />

                </div>

            </Container>

            <Modal show={editImage} onHide={editImageClose}>
                <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title>Udate Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                    <img src={imageURL} height={200} />
                    <div>
                        <input type="file" accept="image/*" onChange={onImageChage}></input>
                    </div>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="text"
                            placeholder="name"
                            className="me-2"
                            value={fictionName}
                            onChange={event => setFictionName(event.target.value)}
                            isInvalid={!!errors.fictionNaemErr}
                        />
                        <Form.Control.Feedback type="invalid">{errors.passwordErr}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={() => {
                        editImageClose()
                        setImageURL('http://127.0.0.1:5000/image/default.jpg')
                        setFictionName('')
                        setErrors({ ...errors, fictionNaemErr: null })
                    }}>
                        ยกเลิก
                    </Button>
                    <Button type='submit' variant="danger" onClick={() => {
                        handleNewFiction()
                    }}>
                        ตกลง
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default ManageNovel;