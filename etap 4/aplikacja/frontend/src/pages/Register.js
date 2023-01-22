import React, {useState, useContext} from "react";
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import qs from 'querystring';
import api from '../services/api'
import UserContext from '../UserContext';

const Register = () => {

    const [details, setDetails] = useState({login: "", email: "", password: "", confirmed_password: ""});


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const navigate = useNavigate(); 

    const [modalMessage, setModalMessage] = useState('');

    const register = async () =>{
        if (details.password !== details.confirmed_password){
            setModalMessage("Hasła muszą być takie same.")
            setShow(true);
        } else {
            api.post('register', qs.stringify(details))
            .then(res => {
                if(res.data.status_code === 200){
                    navigate('/login');
                }else{
                setModalMessage(res.data.message);
                setShow(true);
                }
            }).catch(error => {
                setModalMessage(error.message);
                console.log("error");
                setShow(true);
            })
        }
        
    }

    const submitHandler = e => {
        e.preventDefault();
        console.log(details);
        register();
    };
    
    return(
        
        <Container>
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        <Row>
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
                    <Form onSubmit={submitHandler}>
                        <div className="formGroup">
                            <label className="formLabel">Login</label><br/>
                            <input type="text" className="formInput" onChange={e => setDetails({...details, login: e.target.value})} value={details.login} required/>
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Email</label><br/>
                            <input type="email" className="formInput" onChange={e => setDetails({...details, email: e.target.value})} value={details.email} required/>
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Hasło</label><br/>
                            <input type="password" className="formInput" onChange={e => setDetails({...details, password: e.target.value})} value={details.password} required/>
                        </div>
                        <div className="formGroup">
                            <label className="formLabel">Powtórz hasło</label><br/>
                            <input type="password" className="formInput" onChange={e => setDetails({...details, confirmed_password: e.target.value})} value={details.confirmed_password} required/>
                        </div>
                        <div className="formGroup">
                            <button type="submit" className='formButton'>
                                Rejestracja
                            </button>
                        </div>
                        </Form>
                    </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    </Container>
    );

   
}

export {Register};