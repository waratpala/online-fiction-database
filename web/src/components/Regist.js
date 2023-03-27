import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import HeaderpageRegist from './RegistHeader';
import './style/Regist.css'

function Registpage() {
  return (
    <>
        <HeaderpageRegist/>
        <Form className="Regist">
            <p className="title">สร้างบัญชีผู้ใช้งาน</p>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button  type="submit"className='btnsubmit' >
                สร้างบัญชี
            </Button>

            <div className="textcontral ">
                <p className="text1">ลงทะเบียนเรียบร้อยแล้ว?</p>
                <p className="textlogin" style={{marginLeft:'10px'}}>เข้าสู่ระบบ</p>
            </div>

        </Form>
        
    </>

  );
}

export default Registpage;