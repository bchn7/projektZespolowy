import './App.css';
import {Home} from './pages/Home';
import React, {useState, useMemo, useContext} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import {Container} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Login} from './pages/Login';
import {Logout} from './pages/Logout';
import {Photo} from './pages/Photo';
import {Gallery} from './pages/Gallery';
import {Album} from './pages/Album';
import {AddPhoto} from './pages/AddPhoto';
import {Register} from './pages/Register';
import {SearchBy} from './pages/SearchBy';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import OnlyAnonymousRoute from './utils/OnlyAnonymousRoute';
// import api from '../services/api';


function App() {

  const [userInfo, setUserInfo] = useState('');

  return (
    <BrowserRouter>
    <div className='App'>
    <Helmet>
    <title>Home</title>
    <link href="https://fonts.googleapis.com/css?family=B612+Mono&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
    </Helmet>
    <AuthProvider>
      <NavBar />
        <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path ='/' element={<PrivateRoute/>}>
          <Route path='/wyloguj' element={<Logout/>} />
        </Route>
        <Route exact path ='/' element={<OnlyAnonymousRoute/>}>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/rejestracja" element={<Register />}></Route>
        </Route>
        <Route path='/galeria/:user_id' element={<Gallery/>} />
        <Route path="/photo/:id" element={<Photo />}></Route>
        <Route path="/album/:album_id" element={<Album />}></Route>
        <Route path="/searchBy/:criterium/:value" element={<SearchBy />}></Route>
        </Routes>
      </AuthProvider>
      
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofN4zfuZxLkoj1gXtW8ANNCe9d5Y3eG5eD" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js" integrity="sha384-GNFwBvfVxBkLMJpYMOABq3c+d3KnQxudP/mGPkzpZSTYykLBNsZEnG2D9G/X/+7D" crossorigin="anonymous" async></script>
    </BrowserRouter>
  );
}

export default App;
