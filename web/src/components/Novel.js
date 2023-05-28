import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
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
        if (error.response.status === 500) {
          window.location.replace('http://localhost:3000/500');
        }
      });
  }, [filter, sort, search])

  const searchRef = useRef(null)

  const handleClick = event => {
    setSearch(searchRef.current.value)
  };


  return (
    <Container>
      <div className='controlitem' >
        <Form.Label className='text-novel' >นิยาย</Form.Label>
        <Form.Group className="g-form">
          <Form.Label className='text-filter'>filter</Form.Label>
          <Form.Group className="form-option">
            <Form.Select className='op-fition' onChange={e => setfilter(e.target.value)}>
              <option value="">ทั้งหมด</option>
              <option value="2">นิยายระทึกขวัญ</option>
              <option value="3">นิยายสืบสวน</option>
              <option value="4">นิยายแฟนตาซี</option>
              <option value="5">นิยายวิทยาศาสตร์</option>
              <option value="6">นิยายแอ๊คชั่น</option>
              <option value="7">นิยายรักดราม่า</option>
            </Form.Select>
            <Form.Select className='op-update' onChange={e => setSort(e.target.value)}>
              <option value="DESC">อัพเดทล่าสุด</option>
              <option value="ASC">เก่าสุด</option>
            </Form.Select>
            <Form.Group className="search-box">
              <Form className="box-search" >
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
            </Form.Group>

          </Form.Group>

        </Form.Group>
        <hr style={{ color: 'white' }} />
        <Novelitem novelList={novelList} />

      </div>

    </Container>

  );
}

export default Novel;