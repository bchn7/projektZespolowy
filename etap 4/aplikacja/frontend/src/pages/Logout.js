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


const Logout = () => {

    const navigate = useNavigate();  
    
    let {logoutUser} = useContext(AuthContext);

    const logout = async () =>{
        api.get('/logout')
        .then(res => {
            console.log("not error");
            console.log(res.data)
            logoutUser();
            navigate('/');

        }).catch(error => {
            console.log("error");
        })
    }

    
    logout();


    return(
        ''
        );

   
}

export {Logout};