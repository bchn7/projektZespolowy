import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import {Navbar, Nav, Container} from 'react-bootstrap';
import AuthContext from '../context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';

//import UserContext from '../UserContext';

const NavBar = () => {

    //const {userInfo, setuserInfo} = React.useContext(UserContext);

    let {user, logoutUser} = useContext(AuthContext);
    
    return(
        <Navbar bg="light" expand="lg" style={{marginBottom: "80px"}}>
        <Container>
            <Navbar.Brand href="/">
                <div className="logoContainer">
                        <div className="logoBox sm">
                            <div className="logoBg"></div>
                            <span className="logo">
                                photoBook
                            </span>
                        </div>
                    </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                
            </Nav>
            <Nav className="justify-content-end">
            {user ? (
                <Dropdown>
                <Dropdown.Toggle className="loginBtn">
                  Witaj, {user.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Profil</Dropdown.Item>
                  <Dropdown.Item href={`/galeria/${user.id}`}>Galeria</Dropdown.Item>
                  <Dropdown.Item href="/wyloguj">Wyloguj</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
                <Link className="nav-link loginBtn" to="/login">
                    Login
                </Link>
            )}
            
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavBar;