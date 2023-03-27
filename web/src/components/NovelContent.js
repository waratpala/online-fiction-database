import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Header from './Header';
import './style/NovelContent.css';

function Novelcontent() {

  return (
    <>
        <Header/>
        <Container>
            <div className='controlitemcontent m-3'>
            <Form.Label className='textcontent' >นิยาย</Form.Label>
                <Row >
                    <Col sm={4}>
                        <div className="card m-3">
                            <div>
                                <img src="https://th.bing.com/th/id/R.3fde1cc4966dd166bfb2de60ddd307cc?rik=D70I%2bQ3r0fO0Jw&pid=ImgRaw&r=0" alt="" style={{ width:'200px',height:'200px'}} />
                            </div>
                        </div>
                    
                    </Col>
                    <Col sm={8}>
                        <h2 className='m-2'>โฉมสะคราญ พ่ายรัก</h2>
                        <div className='img-starCouse '>
                                <h4 >โดย...</h4>
                        </div> 
                        <div className='CourseDetails m-3'>
                        <img src="./images/d-1.png" style={{ width:'100%',height:'200px'}}/>
                        </div>
                        
                    </Col>
                </Row>
            <Form.Group className='textepisode'>
                <Form.Label  >สารบัญตอน</Form.Label>
                <Button className='btnsort'>  ↿ ⇂ ตอนล่าสุด</Button>

            </Form.Group>
            <Table  className='listname'>
                <thead>
                    <tr>
                    <th>#</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>ตอนที่ 1</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>ตอนที่ 2</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td>ตอนที่ 3</td>
                    </tr>
                </tbody>
                </Table>
            </div>
        </Container>
    </>
  );
}

export default Novelcontent;