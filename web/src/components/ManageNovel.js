import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ManageNovelitem from './ManageNovelItem';
import './style/ManageNovel.css'
import Headerpage from './Header';

function ManageNovel() {
    const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
    const [novelList, setNovelList] = useState("");
    const [page, setPage] = useState(1);
    const [filter, setfilter] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("DESC");

    useEffect(() => {

        let url = "http://127.0.0.1:5000/writer?limit=10&sort=" + sort + "&filter=" + filter + "&search=" + search + "&page=" + String(page)
        const AuthStr = 'Bearer ' + sessionStorage.getItem("token");
        axios.get(url, { headers: { Authorization: AuthStr } })
            .then(response => {
                if (response.status == 200) {
                    setNovelList(response.data)
                }
                if (response.status == 400) {

                }
                if (response.status == 404) {

                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [filter, sort, search])

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
                        </Form>
                    </Form.Group>
                    <hr style={{ color: 'white' }} />

                    <ManageNovelitem novelList={novelList} />

                </div>

            </Container>
        </>

    );
}

export default ManageNovel;