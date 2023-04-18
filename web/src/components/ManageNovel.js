import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import ManageNovelitem from './ManageNovelItem';
import './style/ManageNovel.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import Headerpage from './Header';

function ManageNovel() {
    const token = sessionStorage.getItem("token");
    const [novelList, setNovelList] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setfilter] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("DESC");
    const [refreshKey, setRefreshKey] = useState(0);


    const editImageClose = () => setEditImage(false);
    const editImageShow = () => setEditImage(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [FictionName, setFictionName] = useState("");
    const [images, setImages] = useState([]);
    const [imageURL, setImageURL] = useState('http://127.0.0.1:5000/image/default.jpg');

    function handleWditImage() {

        let data = new FormData();
        data.append('fiction_name', FictionName);
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
                setRefreshKey(oldKey => oldKey + 1)
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
                window.location.replace('http://localhost:3000/500');
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
                <div className='controlitem m-3' style={{ backgroundColor: '#222831' }}>
                    <Form.Label className='textmanage' >จัดการนิยาย</Form.Label>
                    <Form.Group className="m-3">
                        <Form className="d-flex" >
                            <Form.Control ref={searchRef}
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                style={{ width: '20%', height: '50px', marginTop: '0px' }}
                            />
                            <Button onClick={handleClick} variant="outline-info" style={{ width: '10%', height: '50px' }}>ค้นหา</Button>
                            <AiOutlinePlusCircle style={{ width: '20%', height: '50px' }} onClick={() => editImageShow()} />
                        </Form>
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
                    <div><input type='text' onChange={event => setFictionName(event.target.value)}></input></div>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button variant="secondary" onClick={() => {
                        editImageClose()
                        setImageURL('http://127.0.0.1:5000/image/default.jpg')
                        setFictionName('')
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

export default ManageNovel;