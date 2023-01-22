import React, {useState, useEffect, useContext} from 'react';
import api from '../services/api';
import UserContext from '../UserContext';
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
import { Link, Redirect, Navigate } from 'react-router-dom';

const AddPhoto = () => {
    
    const {userInfo, setUserInfo} = useContext(UserContext);

   

    useEffect(() => {
        
    }, [])

    return(
        <Container>
            <Row>
            
            </Row>
        </Container>
    )
}
export {AddPhoto};