import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ManageNovelitem from './ManageNovelItem';
import './style/ManageNovel.css'
import Headerpage from './Header';

function ManageNovel() {
  return (
    <>
    <Headerpage/>

    <Container>
        <div className='controlitem m-3'  style={{ backgroundColor:'#222831'}}>
            <Form.Label className='textmanage' >จัดการนิยาย</Form.Label>
            <Form.Group  className="m-3">
                <Form className="d-flex" >
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        style={{ width: '20%',height:'50px',marginTop:'0px'}}
                    />
                    <Button variant="outline-info" style={{ width: '10%',height:'50px'}}>ค้นหา</Button>
                </Form> 
            </Form.Group>
            <hr style={{ color:'white' }}/>

            <ManageNovelitem/>

        </div>
        
    </Container>
    </>

  );
}

export default ManageNovel;