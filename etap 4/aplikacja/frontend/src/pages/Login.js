import React, {useState, useContext} from "react";
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'querystring';
import api from '../services/api';
import UserContext from '../UserContext';
import jwt_decode from "jwt-decode";
import '../css/login.css';
import AuthContext from '../context/AuthContext'


const Login = () => {

    const [details, setDetails] = useState({login:"", password:""});

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();  

    axios.defaults.withCredentials = true;

    const authenticate = async () =>{
        api.post('/login_user', qs.stringify(details))
        .then(res => {
            console.log("not error");
            console.log(res.data)
            //navigate('/');

        }).catch(error => {
            console.log("error");
            console.log(error);
            setShow(true);
        })
    }

    const submitHandler = e => {
        e.preventDefault();
        console.log(details);
        authenticate();
    };
    
let {loginUser} = useContext(AuthContext);

    return(

        <Container>
            <Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Logowanie nie powiodło się. Spróbuj ponownie.</Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
                <Col xs={{span: 6, offset: 3}}>
                    <div className="logoContainer">
                        <div className="logoBox">
                            <div className="logoBg"></div>
                            <span className="logo">
                                photoBook
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={{span: 6, offset: 3}}>
                    <div className="loginBox">
                        <Row>
                        <center>
                            <h2 className="loginHeader">Logowanie</h2>
                        </center>
                        <br/><br/><br/>
                        <Col xs={{span: 8, offset: 2}}>
                        <Form onSubmit={loginUser}>
                            <div className="formGroup">
                                <label className="formLabel">Login</label><br/>
                                <input type="text" className="formInput" name="login" onChange={e => setDetails({...details, login: e.target.value})} value={details.login} />
                            </div>
                            <div className="formGroup">
                                <label className="formLabel">Hasło</label><br/>
                                <input type="password" className="formInput" name="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} />
                            </div>
                            <div className="formGroup">
                                <button type="submit" className='formButton left'>
                                    Login
                                </button>
                                <Link className="formButton right" to="/rejestracja">Reset hasla</Link> 
                            </div>
                            </Form>
                        </Col>
                        </Row>
                        <hr/>
                        <br/>
                        <Row>
                        <div className="formGroup">
                                <Link className="formButton" to="/rejestracja">Rejestracja</Link> 
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
        );

   
}

export {Login};