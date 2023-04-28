import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch } from "react-icons/bs";
import Novelitem from './์NoveItem';
import './style/Novel.css'


function Novel() {

  const [novelList, setNovelList] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setfilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DESC");

  useEffect(() => {

    let url = "http://127.0.0.1:5000/fiction?limit=10&sort=" + sort + "&filter=" + filter + "&search=" + search + "&page=" + String(page)

    axios.get(url)
      .then(response => {
        setNovelList(response.data);
      })
      .catch(error => {
        window.location.replace('http://localhost:3000/500');
      });
  }, [filter, sort, search])

  const searchRef = useRef(null)

  const handleClick = event => {
    setSearch(searchRef.current.value)
  };


  return (
    <Container>
      <div className='controlitem m-3' >
        <Form.Label className='textnovel' >นิยาย</Form.Label>
        <Form.Group className="m-3">
          <Form.Label style={{ color: 'white' }}>filter</Form.Label>
          <Form.Group style={{ width: '100%', display: 'flex', margin: '5px' }}>
            <Form.Select style={{ width: '15%', height: '50px' }} onChange={e => setfilter(e.target.value)}>
              <option value="">ทั้งหมด</option>
              <option value="2">นิยายระทึกขวัญ</option>
              <option value="3">นิยายสืบสวน</option>
              <option value="4">นิยายแฟนตาซี</option>
              <option value="5">นิยายวิทยาศาสตร์</option>
              <option value="6">นิยายแอ๊คชั่น</option>
              <option value="7">นิยายรักดราม่า</option>
            </Form.Select>
            <Form.Select style={{ width: '15%', height: '50px', marginLeft: '5px' }} onChange={e => setSort(e.target.value)}>
              <option value="DESC">อัพเดทล่าสุด</option>
              <option value="ASC">เก่าสุด</option>
            </Form.Select>
            <Form className="box-search d-flex" >
              <i><BsSearch id='search-icon' color='black'/></i>
              <input  ref={searchRef}
                type="search"
                placeholder="Search"
                className="input-search me-2"
                aria-label="Search"
                style={{ width: '80%', height: '50px', marginTop: '0px', marginLeft: '10px' }}
                onSubmit={e => setSearch(e.target.value)}
              />
            </Form>
            <Button variant="outline-info" onClick={handleClick} style={{ width: '100px', height: '50px' }}>ค้นหา</Button>
          </Form.Group>

        </Form.Group>
        <hr style={{ color: 'white' }} />
        <Novelitem novelList={novelList} />

      </div>

    </Container>

  );
}

export default Novel;