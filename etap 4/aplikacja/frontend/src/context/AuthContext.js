/* eslint-disable react/react-in-jsx-scope */
import {createContext, useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import React from 'react';
import jwt_decode from "jwt-decode";
import api from '../services/api';
import qs from 'querystring';
import  { Redirect } from 'react-router-dom'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)


    const [details, setDetails] = useState({login:"", password:""});
    const navigate = useNavigate();

    let loginUser = async (e)=> {
        e.preventDefault()
  
            api.post('/login_user', qs.stringify({login: e.target.login.value, password:e.target.password.value}))
            .then(res => {
                setAuthTokens(res.data);
                setUser(res.data.jwt);
                localStorage.setItem('authTokens', JSON.stringify(res.data))
                navigate('/');
    
            }).catch(error => {
                console.log(error);
            })
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }


    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    return(
    <AuthContext.Provider value={contextData} >
        {children}
    </AuthContext.Provider>
    )
}