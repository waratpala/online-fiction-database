import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HeaderpageRegist from './RegistHeader';
import './style/Regist.css'

function Registpage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        axios.post("http://127.0.0.1:5000/login", formData, config)
            .then(response => {
                console.log(response.status);
                console.log(response.data);

                if (response.status == 201) {
                    console.log(response.data.token);
                }
                if (response.status == 400) {
                    if (response.data.status = "Duplicate Name") {

                    }
                }
                if (response.status == 404) {

                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <HeaderpageRegist />
            <Form className="Regist" onSubmit={handleSubmit}>
                <p className="title">สร้างบัญชีผู้ใช้งาน</p>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" name='emailInput' value={email.emailInput} placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" name='passwordInput' value={password.passwordInput} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" className='btnsubmit' >
                    สร้างบัญชี
                </Button>

                <div className="textcontral ">
                    <p className="text1">ลงทะเบียนเรียบร้อยแล้ว?</p>
                    <p className="textlogin" style={{ marginLeft: '10px' }}>เข้าสู่ระบบ</p>
                </div>

            </Form>

        </>

    );
}

export default Registpage;