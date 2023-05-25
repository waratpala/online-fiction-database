import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import HeaderpageRegist from './RegistHeader';
import './style/Regist.css'

function Registpage() {
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    let handleSubmit = async (e) => {
        e.preventDefault();
        let err = { ...errors, usernameErr: null, passwordErr: null }

        if (username.trim() === "") {
            err.usernameErr = "username is a required field."
        } else {
            err.usernameErr = null
        }

        if (password.trim().length === 0) {
            err.passwordErr = "password is a required field."
        } else {
            err.passwordErr = null
        }

        if (err.passwordErr === null && err.usernameErr === null) {
            let formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }

            axios.post("http://127.0.0.1:5000/register", formData, config)
                .then(response => {
                    sessionStorage.setItem("token", response.data.token);
                    window.location.replace('http://localhost:3000');
                })
                .catch(error => {
                    if (error.response.status === 400) {
                        if (error.response.data['status'] = "Duplicate Name") {
                            err.usernameErr = "Username already in use."
                            setUser("")
                            setPassword("")
                        }
                    }
                    if (error.response.status === 500) {
                        window.location.replace('http://localhost:3000/500');
                    }
                });
        }

        setErrors(err)
    };

    return (
        <>
            <HeaderpageRegist />
            <Form className="Regist" onSubmit={handleSubmit}>
                <p className="title">สร้างบัญชีผู้ใช้งาน</p>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="text"
                        placeholder="username"
                        className="me-2"
                        value={username}
                        onChange={e => setUser(e.target.value)}
                        isInvalid={!!errors.usernameErr}
                    />
                    <Form.Control.Feedback type="invalid">{errors.usernameErr}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        placeholder="password"
                        className="me-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        isInvalid={!!errors.passwordErr}
                    />
                    <Form.Control.Feedback type="invalid">{errors.passwordErr}</Form.Control.Feedback>
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