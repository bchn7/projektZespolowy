import React, {useState, useEffect, useContext} from 'react';
import api from '../services/api';
import UserContext from '../UserContext';
import '../select.css';
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
// import blobStorage from '../services/azureBlobStorage';
import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, Redirect, Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const Home = () => {
    
    const[photos, setPhotos] = useState([]);
    const[favouritePhotos, setFavouritePhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    

    const getPhotos  = async() => {
        
        api.get(`/`)
        .then(res => {
            setIsLoading(true);
            setPhotos(res.data.photos);
            setFavouritePhotos(res.data.favouritePhotos);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const getUserPhotos = async () => {
        photos.map((photo) => {
            console.log(photo.author.username);
        });
    }

    const [photoLimit, setPhotoLimit] = useState();

    useEffect(() => {
        getPhotos();
        setPhotoLimit(3);
    }, [])

    const navigate = useNavigate();

    const searchBy = e =>{
        e.preventDefault();
        console.log(e.target.criterium.value, e.target.searchValue.value);
        navigate(`searchBy/${e.target.criterium.value}/${e.target.searchValue.value}`);

    }

    const colSizes = [5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3];

    const {userInfo, setUserInfo} = useContext(UserContext);
    
    const handleMore = () => {
        setPhotoLimit(photoLimit+3);
        getPhotos();
    }
    

    const loadPhotos = (
        <Box sx={{ minWidth: 100, minHeight: 100 }}>
        <Masonry columns={3} spacing={2}>
            {photos.slice(0, photoLimit).map((photo, index) => (
            <div key={index} className="photoBox">
                <Link to={{pathname: `photo/${photo.id}`}} >
                    <img className="photoThumbnail card-v" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                </Link>
                {photo.tag.length > 0 ? <div className='tagBadge'>#{photo.tag[0].name}</div> : ''}
            </div>
            ))}
        </Masonry>
        {
            photoLimit < photos.length ? (
                <button className="loginBtn noBorder" onClick={handleMore}>Ładuj więcej</button>
            ) : ('')
        }
        </Box>
    )


    return(
        <Container>
            <Row>
            <div className='searchOptionsBox'>
                <form onSubmit={searchBy}>
                <div className="input-group mb-3 center">
                <select className="minimal" name="criterium">
                    <option disabled selected>Wyszukaj po</option>
                    <option value="tag">Tag</option>
                    <option value="author">Użytkownik</option>
                    <option value="title">Tytuł</option>
                </select>
                <input type="text" name="searchValue" className="form-control searchInput" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="submit">Szukaj</button>
                </div>
                </div>
                </form>
            </div>
            <div className='box'>
                <center><h2 className="pageHeader">Najnowsze publikacje</h2></center>
                {isLoading ? <LoadingSpinner/> : loadPhotos}
            </div>
            </Row>
            <br/>
            {favouritePhotos == null ? '' : (
                    <Row>
                        <div className='box'>
                        <center><h2 className="pageHeader">Ulubione</h2></center>
                        <Box sx={{ minWidth: 100, minHeight: 100 }}>
                        <Masonry columns={3} spacing={2}>
                            {favouritePhotos.map((photo, index) => (
                            <div key={index} className="photoBox">
                                <Link to={{pathname: `photo/${photo.id}`}} >
                                    <img className="photoThumbnail card-v" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                                </Link>
                                {photo.tag.length > 0 ? <div className='tagBadge'>#{photo.tag[0].name}</div> : ''}
                            </div>
                            ))}
                        </Masonry>
                        </Box>
                        </div>
                    </Row>
                )}
        <script src="https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js" integrity="sha384-GNFwBvfVxBkLMJpYMOABq3c+d3KnQxudP/mGPkzpZSTYykLBNsZEnG2D9G/X/+7D" crossorigin="anonymous" async></script>

        </Container>
        
    )
}
export {Home};