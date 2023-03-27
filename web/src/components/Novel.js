import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch } from "react-icons/bs";
import Novelitem from './์NoveItem';
import './style/Novel.css'


function Novel() {
  return (
    <Container>
        <div className='controlitem m-3' >
            <Form.Label className='textnovel' >นิยาย</Form.Label>
            <Form.Group  className="m-3">
                <Form.Label style={{ color:'white' }}>filter</Form.Label>
                    <Form.Group style={{ width: '100%',display:'flex',margin:'5px' }}>
                        <Form.Select  style={{ width: '15%',height:'50px' }}>
                                <option>ประเภทนิยาย</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                        </Form.Select>
                        <Form.Select  style={{ width: '15%',height:'50px',marginLeft:'5px'}}>
                                <option>อัพเดทล่าสุด</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                        </Form.Select>
                        <Form className="d-flex" >
                            <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            style={{ width: '80%',height:'50px',marginTop:'0px',marginLeft:'10px'}}
                            />
                            <BsSearch/>
                            <Button variant="outline-info" style={{ width: '35%',height:'50px'}}>ค้นหา</Button>
                        </Form>
                    </Form.Group>
                        
            </Form.Group>
            <hr style={{ color:'white' }}/>
       
          <Novelitem/>
        </div>
        
    </Container>

  );
}

export default Novel;