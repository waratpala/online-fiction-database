import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/Edit.css'


function Editnovel() {
  
  return (
    <>
         <Container>
        <div className='controlitem m-3'  style={{ backgroundColor:'#393E46'}}>
            <Form.Label className='texttitleedit' style={{ backgroundColor:'#00ADB5',display:'block',color:'white',width:'100%',height:'50px'}}>ชื่อนิยาย</Form.Label>
            <div className='editcontent m-5'>

            </div>
            <Button variant="info" >
                บันทึก
            </Button>
            <Button variant="danger" >
                ยกเลิก
            </Button>
        </div>
        
    </Container>
    </>
  );
}

export default Editnovel;