import React, {useState, useEffect, useContext} from 'react';
import api from '../services/api';
import '../select.css';
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
// import blobStorage from '../services/azureBlobStorage';
import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, Redirect, Navigate, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';

const Gallery = () => {
    
    const[photos, setPhotos] = useState([]);
    const[albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [authorInfo, setAuthorInfo] = useState([]);

    const [showAddPhoto, setAddPhotoShow] = useState(false);
    const [showAddAlbum, setAddAlbumShow] = useState(false);
    const handleClosePhoto = () => setAddPhotoShow(false);
    const handleCloseAlbum = () => setAddAlbumShow(false);
    const handleOpenPhoto = () => setAddPhotoShow(true);
    const handleOpenAlbum = () => setAddAlbumShow(true);

    const [showInfo, setShowInfo] = useState(false);
    const handleCloseInfo = () => setShowInfo(false);
    const [messageInfo, setMessageInfo] = useState([]);

    let {user, logoutUser} = useContext(AuthContext);

    const user_id = useParams().user_id;

    const getUserPhotos = async() => {
        
        api.get(`/get_user_photos/${user_id}`)
        .then(res => {
            console.log(res.data.photos)
            setPhotos(res.data.photos);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const getUserInfo = async() => {
        
        api.get(`/get_user_info/${user_id}`) 
        .then(res => {
            setAuthorInfo(res.data.user);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const getUserAlbums = async() => {
        api.get(`/albums/${user_id}`)
        .then(res => {
            console.log("albums");
            console.log(res.data.albums);
            setAlbums(res.data.albums);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const loadPhotos = (
        <Box sx={{ minWidth: 100, minHeight: 100 }}>
        <Masonry columns={3} spacing={3}>
            {photos.map((photo, index) => (
            <div key={index} className="photoBox">
                <Link to={{pathname: `/photo/${photo.id}`}} >
                    <img className="photoThumbnail card-v" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                </Link>
                {photo.tag.length > 0 ? <div className='tagBadge'>#{photo.tag[0].name}</div> : ''}
            </div>
            ))}
        </Masonry>
        </Box>
    )

    const loadAlbums = (
        <Container>
                    <Row>
                    {   
                        
                        albums.length > 0 ? (
                            albums.map((album, index) => {
                                return(
                                    
                                <Col xs={{span: 4}}>
                                    <div className='albumBox'>
                                    <Link to={{pathname:`/album/${album.id}`}}>
                                        <h4 className='pageHeader center'><small>{album.name}</small></h4>
                                    </Link>
                                    {album.description != null ? (<small><i>{album.description}</i></small>) : ('')}
                                    
                                                
                                    </div>
                                </Col>
                                )
                            })
                        ) : (<i>Użytkownik nie posiada albumów.</i>)
                    }
                    </Row>
                    </Container>
    )
    
    const [file, setFile] = useState();
    
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

    const addPhoto = async(e) => {

        e.preventDefault();


        let photo = e.target.photoFile.value;
        let description = e.target.description.value;
        let photoName = e.target.photoName.value;
        let tags = e.target.tags.value;
        let selectedAlbum = e.target.album.value;
        let newAlbum = e.target.newAlbum.value;
        
        if (photo){
            setFile(e.target.photoFile.files[0]);
            const formData = new FormData();
            formData.append("name", photoName);
            formData.append("description", description);
            formData.append("tags", tags);
            formData.append("photo", file);
            formData.append("selectedAlbum", selectedAlbum);
            formData.append("newAlbum", newAlbum);
            formData.append("user_id", user.id);


            try {
                const response = await axios({
                  method: "post",
                  url: "http://localhost:8000/api/upload_photo",
                  data: formData,
                  headers: { "Content-Type": "multipart/form-data" },
                }).then(res => {
                    setMessageInfo(res.data.message);
                    setShowInfo(true);
                    getUserPhotos();
                    handleClosePhoto();

                }).catch(errorResponse => {
                    setMessageInfo(errorResponse.data.message);
                    setShowInfo(true);
                })

              } catch(error) {
                setMessageInfo(error);
                setShowInfo(true);
              }

        }
    }

    const addAlbum = async(e) => {
        e.preventDefault();
        api.post('/add_album', {
            name: e.target.albumName.value,
            description: e.target.albumDescription,
            user_id: user_id
        })
        .then(res => {
            setMessageInfo(res.data.message);
            setShowInfo(true);
            getUserAlbums();
            setIsLoading(false);

        }).catch(error => {
            setMessageInfo(error.message);
            setShowInfo(true);
            console.log(error)
        })
    }



    useEffect(() => {
        getUserPhotos();
        getUserAlbums();
        getUserInfo();
    }, [])

    console.log(user.id, user_id);

    return(
        <Container>
            <Row>
            <Modal show={showInfo} onHide={handleCloseInfo}>
                <Modal.Header closeButton>
                <Modal.Title>Informacja!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{messageInfo}</Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleCloseInfo}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
            <div className='modals'>
            <Modal show={showAddPhoto} onHide={handleClosePhoto} dialogClassName="addDialog" contentClassName='addDialogContent'>
            <Modal.Header closeButton>
                <h4 className='pageHeader'>Dodaj zdjecie</h4>
                </Modal.Header>
                <div className='dialogContainer'>
                <Container>
                <Form onSubmit={addPhoto}> 
                    <Row>
                        <Col xs={{span:12}}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <center>
                                <label className='custom-file-upload formButton'>
                                <small>Wybierz plik</small>
                                <input type="file" className='fileImport'
                                id="avatar" name="photoFile"
                                accept="image/png, image/jpeg" onChange={handleFileChange} required />     
                                </label>
                            </center>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Nazwa zdjecia</b></Form.Label>
                                <Form.Control as="textarea" name="photoName" rows={1} required />
                            </Form.Group>
                            <Form.Group></Form.Group>
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Opis</b></Form.Label>
                                <Form.Control as="textarea" name="description" rows={3} required />
                            </Form.Group>
                            <Form.Group>
                                <br/>
                            <Form.Label><b className='pageHeader'>Tagi</b></Form.Label>
                                <Form.Control as="textarea" name="tags" rows={1} />
                            </Form.Group> 
                        </Col>
                        <Col xs={{span:3}}>
                        <Form.Group>
                            <br/>
                        <Form.Label><b className='pageHeader'>Wybierz album</b></Form.Label>
                            <div className='albumsBox'>
                                {
                                    (albums.length > 0) ? (
                                        albums.map((album) => {
                                            return(
                                                <div class="form-check">
                                                <input class="form-check-input" type="radio" name="album" value={album.id} id="flexRadioDefault1" />
                                                <label class="form-check-label" for="flexRadioDefault1" style={{color: 'black'}}>
                                                    {album.name}
                                                </label>
                                            </div>
                                            )
                                            })
                                    ) : (<i>Nie posiadasz żadnych albumów.</i>)
                                }
                            </div>
                        </Form.Group>
                        </Col>
                        <br/>
                        <Col xs={{span:4}}>
                        <Form.Group>
                                <br/>
                            <Form.Label><b className='pageHeader'>Stworz nowy album</b></Form.Label>
                                <Form.Control as="textarea" name="newAlbum" rows={1} placeholder="Podaj nazwę albumu"/>
                            </Form.Group>
                        </Col>
                        <br/><br/><br/><br/>
                        {
                        <div className="formGroup">
                            <button type="submit" className='formButton right'>
                                Dodaj
                            </button>
                        </div>
                        }
                    </Row>
                    </Form>
                </Container>
                </div>
            </Modal>
            <Modal show={showAddAlbum} onHide={handleCloseAlbum} dialogClassName="addDialog">
                <Modal.Header closeButton>
                <h4 className='pageHeader'>Dodaj album</h4>
                </Modal.Header>
                <div className='dialogContainer'>
                <Form onSubmit={addAlbum}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label><b className='pageHeader'>Nazwa albumu</b></Form.Label>
                    <Form.Control as="textarea" name="albumName" rows={1} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label><b className='pageHeader'>Opis</b></Form.Label>
                    <Form.Control as="textarea" name="albumDescription" rows={2} required />
                </Form.Group>
                <input type="hidden" name="user_id" value={user_id} />
                <div className="formGroup">
                        <button type="submit" className='formButton left'>
                            Dodaj
                        </button>
                    </div>
                </Form>
                </div>
            </Modal>
            </div>
            <div className="box">
                <center><h2 className="pageHeader">Uzytkownik</h2></center>
                <div>
                <div className='left userIcon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-person-square" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                    </svg>
                </div>
                <div className="left userInfo">
                    <p>Login: {authorInfo.username} </p>
                    <p>Data dołączenia: { authorInfo.date_joined != null ? (new Date(authorInfo.date_joined).toLocaleDateString()) : ('')} </p>
                    <p>Liczba publikacji: {photos.length} </p>
                </div>
                </div>
            </div>
            </Row>
            <br/>
            <Row>
            <div className='box'>
                {(user) && (user.id == user_id) ? (
                <button onClick={handleOpenPhoto} className='formButton right'>
                    <small>Dodaj</small>
                </button>
                ) : ('')}
                <center><h2 className="pageHeader">Galeria</h2></center>
                
                {isLoading ? <LoadingSpinner/> : loadPhotos}
            </div>
            </Row>
            <br/>
            <Row>
            <div className='box'>
                {(user) && (user.id == user_id) ? (
                <button onClick={handleOpenAlbum} className='formButton right'>
                    <small>Dodaj</small>
                </button>
                ) : ('')}               
                <center><h2 className="pageHeader">Albumy</h2></center>
                {isLoading ? <LoadingSpinner/> : loadAlbums}
            </div>
            </Row>
        </Container>
    )
}
export {Gallery};