import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import HeaderpageRegist from './RegistHeader';
import './style/Regist.css'

function Login() {
  return (
    <>
        <HeaderpageRegist/>
        <Form className="Regist">
            <p className="title">เข้าสู่ระบบ</p>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button  type="submit"className='btnsubmit' >
                เข้าสู่ระบบ
            </Button>
        </Form>
        
    </>

  );
}

export default Login;