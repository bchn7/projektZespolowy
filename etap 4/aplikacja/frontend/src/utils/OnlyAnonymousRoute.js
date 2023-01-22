import React, {useContext} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext);

    return (user ? <Navigate to="/" /> : <Outlet /> );

}

export default PrivateRoute;


